/**
 * Ask Hope endpoint — public Bible Q&A.
 *
 * POST /api/ask
 *   body: { question: string, sessionId?: string }
 *
 * Returns: { answer, citations, risk, crisis, sessionId, blocked? }
 *
 * Crisis indicators always win — we surface 988/911 above the answer.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { features } from "@hog/shared";
import { assess as assessCrisis } from "@hog/safety";
import { randomUUID } from "node:crypto";
import { optionalDb } from "@/lib/server-db";
import { localAskHopeAnswer } from "@/lib/local-ask-hope";
import { crisisDbSeverity } from "@/lib/ops";
import { alertOnImminentCrisis } from "@/lib/crisis-alert";
import { publicRateLimit, rateLimitResponse, requestId } from "@/lib/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RequestSchema = z.object({
  question: z.string().min(2).max(2000),
  sessionId: z.string().uuid().optional(),
});

type Db = typeof import("@hog/db").db;
type AskResponseResult = {
  answer: string;
  citations: string[];
  risk: "low" | "medium" | "high" | "critical";
  crisis: ReturnType<typeof assessCrisis>;
  blocked: boolean;
  blockedReason?: string;
};

let dbPromise: Promise<Db | null> | null = null;

async function getDb(): Promise<Db | null> {
  dbPromise ??= optionalDb("ask");
  return dbPromise;
}

async function getOrCreateSession(sessionId?: string): Promise<string> {
  if (sessionId) return sessionId;
  const id = randomUUID();
  const database = await getDb();
  if (!database) return id;
  try {
    await database.execute(sql`
      INSERT INTO chat_sessions (id, channel, anon_key, started_at, risk_state)
      VALUES (${id}, 'ask-hope', ${randomUUID()}, now(), 'none')
      ON CONFLICT DO NOTHING
    `);
  } catch {
    // DB unavailable — return ephemeral id.
  }
  return id;
}

async function logMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string,
  meta: Record<string, unknown> = {}
): Promise<void> {
  const database = await getDb();
  if (!database) return;
  try {
    await database.execute(sql`
      INSERT INTO chat_messages (session_id, role, content, citations_json, agent_name, provider, model, latency_ms)
      VALUES (
        ${sessionId},
        ${role},
        ${content},
        ${JSON.stringify(meta.citations ?? [])}::jsonb,
        ${(meta.agentName as string) ?? "qa"},
        ${(meta.provider as string) ?? null},
        ${(meta.model as string) ?? null},
        ${(meta.latencyMs as number) ?? null}
      )
    `);
  } catch (err) {
    console.warn("[ask] failed to log message:", err);
  }
}

function fallbackAskHope(question: string): AskResponseResult {
  const crisis = assessCrisis(question);
  if (crisis.severity !== "none") {
    return {
      answer:
        "I'm really sorry you are carrying this. If you might hurt yourself or are in immediate danger, call 911 now. If you are in the U.S. or Canada, call or text 988 for the Suicide & Crisis Lifeline. Please also tell one trusted person nearby that you need help staying safe. When you are safe, we can keep talking.",
      citations: ["Psalm 34:18"],
      risk: "critical",
      crisis,
      blocked: false,
    };
  }

  const local = localAskHopeAnswer(question);
  return {
    answer: local.answer,
    citations: local.citations,
    risk: "low",
    crisis,
    blocked: false,
  };
}

function hasLiveAskHopeProvider(): boolean {
  return Boolean(
    process.env.CEREBRAS_KEY_CHAT ||
      process.env.CEREBRAS_KEY_BACKGROUND ||
      process.env.OPENAI_API_KEY ||
      process.env.ANTHROPIC_API_KEY
  );
}

export async function POST(request: Request) {
  if (!features().askHope) {
    return NextResponse.json({ error: "Ask Hope is currently disabled" }, { status: 503 });
  }

  const rl = publicRateLimit(request, "ask-hope", { limit: 24, windowMs: 10 * 60 * 1000 });
  if (!rl.ok) return rateLimitResponse(rl);

  let body: z.infer<typeof RequestSchema>;
  try {
    const json = await request.json();
    body = RequestSchema.parse(json);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const sessionId = await getOrCreateSession(body.sessionId);

  // Log the user message.
  await logMessage(sessionId, "user", body.question);

  const start = Date.now();
  const correlationId = requestId(request);
  let result: AskResponseResult;
  if (!hasLiveAskHopeProvider()) {
    result = fallbackAskHope(body.question);
  } else {
    try {
      const { askHope } = await import("../../../../../worker/src/agents/qa");
      result = await askHope(body.question);
      if (result.blocked) {
        result = fallbackAskHope(body.question);
      }
    } catch (err) {
      console.warn("[ask] live agent unavailable; using fallback:", err);
      result = fallbackAskHope(body.question);
    }
  }
  const latencyMs = Date.now() - start;

  // Log the assistant message.
  await logMessage(sessionId, "assistant", result.answer, {
    citations: result.citations,
    latencyMs,
  });

  // If crisis was detected, log a crisis_event for human review.
  if (result.crisis.severity !== "none") {
    const database = await getDb();
    try {
      if (database) {
        await database.execute(sql`
          INSERT INTO crisis_events (
            chat_session_id, trigger_phrase, severity, action_taken, escalated_to, metadata
          )
          VALUES (
            ${sessionId},
            ${result.crisis.triggers.join("|")},
            ${crisisDbSeverity(result.crisis.severity)},
            ${result.crisis.recommendedAction},
            ${null},
            ${JSON.stringify({
              surfaces: {
                lifeline988: result.crisis.surface_988,
                emergency911: result.crisis.surface_911,
              },
              correlationId,
            })}::jsonb
          )
        `);
      }
    } catch (err) {
      console.warn("[ask] failed to log crisis event:", err);
    }

    // Page the founder on imminent severity. Fire-and-forget so the user's
    // response is never blocked on email delivery.
    if (result.crisis.severity === "imminent") {
      void alertOnImminentCrisis({
        severity: result.crisis.severity,
        source: "ask",
        sourceId: sessionId,
        triggerPhrases: result.crisis.triggers,
        actionTaken: result.crisis.recommendedAction,
        correlationId,
      }).catch((err) => console.warn("[ask] crisis alert dispatch failed:", err));
    }
  }

  // Persist session cookie so the user keeps the same conversation.
  const cookieStore = await cookies();
  cookieStore.set("hog_session", sessionId, {
    httpOnly: true,
    secure: process.env.APP_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return NextResponse.json({
    sessionId,
    answer: result.answer,
    citations: result.citations,
    risk: result.risk,
    crisis: {
      severity: result.crisis.severity,
      surface_988: result.crisis.surface_988,
      surface_911: result.crisis.surface_911,
    },
    blocked: result.blocked,
    blockedReason: result.blockedReason,
  });
}
