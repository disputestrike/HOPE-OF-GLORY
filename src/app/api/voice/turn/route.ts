/**
 * Per-turn webhook from SignalWire. Receives the caller's transcribed speech,
 * runs it through the conversation loop, returns the agent's reply (TTS-ed by SignalWire).
 *
 * THIS FILE HANDLES HUMAN LIVES. EDIT WITH EXTREME CARE.
 */
import { NextResponse } from "next/server";
import { assess as assessCrisis } from "@hog/safety";
import { alertOnImminentCrisis } from "@/lib/crisis-alert";
import { requestId } from "@/lib/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const callSessionId = body?.conversation_id ?? body?.session_id;
  const callerText = body?.caller_text ?? body?.text ?? "";
  const turnIndex = body?.turn_index ?? 0;
  const history = body?.history ?? [];
  const callerHash = body?.caller_hash ?? body?.from_hash ?? undefined;

  if (!callSessionId || !callerText) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const { handleTurn } = await import("@/server/voice/conversation");
  const result = await handleTurn({
    callSessionId,
    callerText,
    turnIndex,
    history,
  });

  // If the conversation loop decided to dual-transfer, severity is imminent.
  // Page the founder. Fire-and-forget — must NEVER block the voice response.
  if (result.action === "dual_transfer") {
    const triggers = assessCrisis(callerText).triggers;
    void alertOnImminentCrisis({
      severity: "imminent",
      source: "voice",
      sourceId: callSessionId,
      triggerPhrases: triggers,
      actionTaken: "988_and_911",
      callerHash,
      correlationId: requestId(request),
    }).catch((err) => console.warn("[voice/turn] crisis alert dispatch failed:", err));
  }

  return NextResponse.json({
    reply: result.reply,
    action: result.action,
    surface_988: result.surface988,
    surface_911: result.surface911,
  });
}
