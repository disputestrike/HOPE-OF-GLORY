/**
 * SignalWire inbound webhook. Creates a call_session row keyed by caller_hash
 * (never raw phone). Returns SWML greeting.
 *
 * THIS FILE HANDLES HUMAN LIVES. EDIT WITH EXTREME CARE.
 */
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { optionalDb } from "@/lib/server-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GREETING =
  "Thank you for calling Hope of Glory Ministry. You're speaking with an AI Scripture and prayer companion. I'm not a pastor, counselor, doctor, lawyer, prophet, or emergency responder. If this is an emergency, please hang up and call 911. For the Suicide and Crisis Lifeline, you can call or text 988. How can I serve you today?";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const fromRaw = form?.get("From")?.toString() ?? "";
  const callSid = form?.get("CallSid")?.toString() ?? "";

  let callerHash = "(unhashed)";
  try {
    const { hashCaller } = await import("@/server/voice/pii");
    callerHash = fromRaw ? hashCaller(fromRaw) : "(no-from)";
  } catch (err) {
    console.warn("[voice] caller hash failed:", err);
  }

  let sessionId: string | null = null;
  const database = await optionalDb("voice-inbound");
  try {
    const rows = database
      ? await database.execute<{ id: string }>(sql`
          INSERT INTO call_sessions (signalwire_call_id, caller_hash, started_at, risk_level)
          VALUES (${callSid}, ${callerHash}, now(), 'none')
          RETURNING id
        `)
      : [];
    sessionId = rows[0]?.id ?? null;
  } catch (err) {
    console.warn("[voice] session insert failed:", err);
  }

  // Return SWML-style response. SignalWire supports SWML JSON.
  const swml = {
    version: "1.0.0",
    sections: {
      main: [
        {
          ai: {
            voice: "rime.aurora",
            params: { conversation_id: sessionId ?? callSid },
            prompt: {
              text: GREETING,
            },
            post_prompt_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/voice/turn`,
          },
        },
      ],
    },
  };

  return NextResponse.json(swml);
}
