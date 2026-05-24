/**
 * Per-turn webhook from SignalWire. Receives the caller's transcribed speech,
 * runs it through the conversation loop, returns the agent's reply (TTS-ed by SignalWire).
 *
 * THIS FILE HANDLES HUMAN LIVES. EDIT WITH EXTREME CARE.
 */
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const callSessionId = body?.conversation_id ?? body?.session_id;
  const callerText = body?.caller_text ?? body?.text ?? "";
  const turnIndex = body?.turn_index ?? 0;
  const history = body?.history ?? [];

  if (!callSessionId || !callerText) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const { handleTurn } = await import("../../../../../../voice/src/conversation");
  const result = await handleTurn({
    callSessionId,
    callerText,
    turnIndex,
    history,
  });

  return NextResponse.json({
    reply: result.reply,
    action: result.action,
    surface_988: result.surface988,
    surface_911: result.surface911,
  });
}
