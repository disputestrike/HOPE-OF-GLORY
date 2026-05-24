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
import { db, schema } from "@hog/db";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { features } from "@hog/shared";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RequestSchema = z.object({
  question: z.string().min(2).max(2000),
  sessionId: z.string().uuid().optional(),
});

async function getOrCreateSession(sessionId?: string): Promise<string> {
  if (sessionId) return sessionId;
  const id = randomUUID();
  try {
    await db.execute(sql`
      INSERT INTO chat_sessions (id, channel, anon_key, started_at, risk_state)
      VALUES (${id}, 'ask-hope', ${randomUUID()}, now(), 'normal')
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
  try {
    await db.execute(sql`
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

export async function POST(request: Request) {
  if (!features().askHope) {
    return NextResponse.json({ error: "Ask Hope is currently disabled" }, { status: 503 });
  }

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

  // Run the Q&A agent (lazy-loaded).
  const { askHope } = await import("../../../../../worker/src/agents/qa");
  const start = Date.now();
  const result = await askHope(body.question);
  const latencyMs = Date.now() - start;

  // Log the assistant message.
  await logMessage(sessionId, "assistant", result.answer, {
    citations: result.citations,
    latencyMs,
  });

  // If crisis was detected, log a crisis_event for human review.
  if (result.crisis.severity !== "none") {
    try {
      await db.execute(sql`
        INSERT INTO crisis_events (
          chat_session_id, trigger_phrase, severity, action_taken, escalated_to
        )
        VALUES (
          ${sessionId},
          ${result.crisis.triggers.join("|")},
          ${result.crisis.severity},
          ${result.crisis.recommendedAction},
          ${result.crisis.surface_988 && result.crisis.surface_911 ? "988_and_911" : result.crisis.surface_988 ? "988" : result.crisis.surface_911 ? "911" : null}
        )
      `);
    } catch (err) {
      console.warn("[ask] failed to log crisis event:", err);
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
