import { NextResponse } from "next/server";
import { z } from "zod";
import { features } from "@hog/shared";
import { sql } from "drizzle-orm";
import { assess as assessCrisis } from "@hog/safety";
import { optionalDb } from "@/lib/server-db";
import { crisisDbSeverity } from "@/lib/ops";
import { alertOnImminentCrisis } from "@/lib/crisis-alert";
import { requestId } from "@/lib/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 90;

const Body = z.object({
  question: z.string().min(2).max(2000),
  audience: z.enum(["seeker", "believer", "skeptic"]).optional(),
  sessionId: z.string().uuid().optional(),
  /**
   * Render the response as narrated MP3 audio uploaded to S3 and return the URL.
   * Body-level override; the ?withAudio=true query string is also accepted.
   */
  withAudio: z.boolean().optional(),
});

/**
 * Default for whether to render audio. Production with Deepgram + S3 wired
 * opts in by default; dev/local opts out so we don't accidentally bill on
 * every Ask Hope question while iterating.
 */
function defaultWithAudio(): boolean {
  const envSaysProd = (process.env.APP_ENV ?? process.env.NODE_ENV) === "production";
  const ttsReady = Boolean(process.env.DEEPGRAM_API_KEY && process.env.S3_BUCKET);
  return envSaysProd && ttsReady;
}

export async function POST(request: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Allow ?withAudio=true on the URL as an alternative to the body field
  // (useful for quick checks from the admin console).
  const url = new URL(request.url);
  const queryFlag = url.searchParams.get("withAudio");
  const queryWithAudio =
    queryFlag === null ? undefined : queryFlag === "true" || queryFlag === "1";
  const withAudio = body.withAudio ?? queryWithAudio ?? defaultWithAudio();

  const correlationId = requestId(request);

  // Even apologetics gets a crisis sweep — debate posture must not override
  // a person who is actually in danger.
  const crisis = assessCrisis(body.question);

  const { answerObjection } = await import("../../../../../worker/src/agents/apologetics");
  const result = await answerObjection({
    question: body.question,
    audience: body.audience,
    withAudio,
  });

  // Log
  try {
    const database = await optionalDb("apologetics");
    await database?.execute(sql`
      INSERT INTO chat_messages (session_id, role, content, agent_name)
      VALUES (
        COALESCE(${body.sessionId}, gen_random_uuid()),
        'assistant',
        ${JSON.stringify(result)},
        'apologetics'
      )
    `);

    if (crisis.severity !== "none" && database) {
      try {
        await database.execute(sql`
          INSERT INTO crisis_events (
            chat_session_id, trigger_phrase, severity, action_taken, escalated_to, metadata
          )
          VALUES (
            ${body.sessionId ?? null},
            ${crisis.triggers.join("|")},
            ${crisisDbSeverity(crisis.severity)},
            ${crisis.recommendedAction},
            ${null},
            ${JSON.stringify({
              source: "apologetics",
              surfaces: {
                lifeline988: crisis.surface_988,
                emergency911: crisis.surface_911,
              },
              correlationId,
            })}::jsonb
          )
        `);
      } catch (err) {
        console.warn("[apologetics] crisis event log failed:", err);
      }
    }
  } catch {}

  // Page the founder on imminent severity. Fire-and-forget.
  if (crisis.severity === "imminent") {
    void alertOnImminentCrisis({
      severity: crisis.severity,
      source: "apologetics",
      sourceId: body.sessionId ?? correlationId ?? "unknown",
      triggerPhrases: crisis.triggers,
      actionTaken: crisis.recommendedAction,
      correlationId,
    }).catch((err) => console.warn("[apologetics] crisis alert dispatch failed:", err));
  }

  return NextResponse.json(result);
}
