/**
 * Hope Line conversational loop.
 *
 * THIS FILE HANDLES HUMAN LIVES. EDIT WITH EXTREME CARE.
 *
 * Per-turn ordering is LOCKED:
 *   1. Classify crisis FIRST
 *   2. Decide route SECOND
 *   3. Call Claude THIRD (never Cerebras for Crisis Agent)
 *
 * On imminent risk we DO NOT call the model — we initiate a dual transfer
 * immediately and stay on the line.
 */
import { anthropic, type AgentRequest } from "@hog/ai";
import { loadAgent } from "@hog/prompts";
import { assess as assessCrisis, moderate, redactPii } from "@hog/safety";
import { db } from "@hog/db";
import { sql } from "drizzle-orm";

const COMFORT_VERSES = `
Psalm 34:18 (WEB): "The Lord is near to the brokenhearted, and saves those who have a crushed spirit."
Psalm 23 (WEB): "The Lord is my shepherd; I shall not want."
Isaiah 41:10 (WEB): "Don't you be afraid, for I am with you. Don't be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness."
Matthew 11:28-30 (WEB): "Come to me, all you who labor and are heavily burdened, and I will give you rest."
John 11:35 (WEB): "Jesus wept."
`;

const NEVER_SAY = `
NEVER say:
- "Everything happens for a reason"
- "God won't give you more than you can handle"
- "Suicide is a sin" (in crisis)
- Any minimizing language
- Scripture-dump in the first three turns — listen first
- Promises of specific outcomes
- Theological debate during distress
`;

export type TurnResult = {
  reply: string;
  action: "continue" | "warm_transfer_988" | "warm_transfer_911" | "dual_transfer" | "end_call";
  surface988: boolean;
  surface911: boolean;
  callId: string;
  turnIndex: number;
};

export async function handleTurn(opts: {
  callSessionId: string;
  callerText: string;
  turnIndex: number;
  history: Array<{ speaker: "caller" | "agent"; text: string }>;
}): Promise<TurnResult> {
  // 1. Crisis classification (NEVER skip)
  const crisis = assessCrisis(opts.callerText);

  // Log caller turn first (so we have it even if model call fails)
  await db.execute(sql`
    INSERT INTO call_turns (call_session_id, turn_index, speaker, text)
    VALUES (${opts.callSessionId}, ${opts.turnIndex}, 'caller', ${redactPii(opts.callerText)})
  `).catch(() => undefined);

  // 2. Imminent risk → dual transfer, NO model call.
  if (crisis.severity === "imminent") {
    const reply =
      "Friend, I hear you. What you're describing is urgent and I want to make sure you're safe right now. I'm going to stay on the line with you and connect you to people who can help immediately. Please don't hang up. I'm dialing 988 and 911 now.";
    await persistAgentTurn(opts.callSessionId, opts.turnIndex + 1, reply, "imminent");
    await logCrisisEvent(opts.callSessionId, crisis, "dual_transfer");
    return {
      reply,
      action: "dual_transfer",
      surface988: true,
      surface911: true,
      callId: opts.callSessionId,
      turnIndex: opts.turnIndex + 1,
    };
  }

  // 3. Active risk → warm 988 transfer.
  if (crisis.severity === "active") {
    const reply =
      "Thank you for telling me. I want you to know I'm here, and I'm not going anywhere. I'd also like to bring in a trained counselor from the Suicide and Crisis Lifeline — they're better equipped for this moment than I am. I'll stay on with you. Is that okay?";
    await persistAgentTurn(opts.callSessionId, opts.turnIndex + 1, reply, "active");
    await logCrisisEvent(opts.callSessionId, crisis, "warm_transfer_988");
    return {
      reply,
      action: "warm_transfer_988",
      surface988: true,
      surface911: false,
      callId: opts.callSessionId,
      turnIndex: opts.turnIndex + 1,
    };
  }

  // 4. Watch tier → soft pastoral mode + offer 988.
  // 5. Or normal pastoral conversation → Claude with Crisis Agent prompt.
  const agent = await loadAgent("crisis").catch(() => null);
  const baseSystem =
    agent?.systemPrompt ??
    "You are the Hope of Glory Hope Line companion. Listen first. Be reverent and gentle. Never scripture-dump. Never minimize. If the caller shows distress, offer 988.";

  const systemPrompt = `${baseSystem}

${NEVER_SAY}

Comfort verses (use only if the caller invites them):
${COMFORT_VERSES}

Crisis severity right now: ${crisis.severity}
Turn index: ${opts.turnIndex}

If the turn index is <= 3, prioritize listening. Ask one open question. Don't quote scripture yet.
If turn index >= 4 and the caller invites scripture or comfort, you may share one of the comfort verses.

OUTPUT: spoken reply, 1-3 short sentences. No markdown. No headings. No emojis. Plain spoken English.`;

  const historyContext = opts.history
    .slice(-6)
    .map((h) => `${h.speaker === "caller" ? "Caller" : "Hope"}: ${h.text}`)
    .join("\n");

  const req: AgentRequest = {
    taskType: "crisis",
    agentName: "crisis",
    serviceClass: "phone",
    risk: "critical",
    systemPrompt,
    context: historyContext || undefined,
    userInput: opts.callerText,
    temperature: 0.4,
    maxTokens: 400,
  };

  let response;
  try {
    response = await anthropic.call(req);
  } catch (err) {
    const fallback =
      "I'm sorry — I lost you for a moment. Can you tell me again what's on your heart?";
    await persistAgentTurn(opts.callSessionId, opts.turnIndex + 1, fallback, crisis.severity);
    return {
      reply: fallback,
      action: "continue",
      surface988: crisis.severity !== "none",
      surface911: false,
      callId: opts.callSessionId,
      turnIndex: opts.turnIndex + 1,
    };
  }

  const reply = response.text.trim();

  // Moderation pass on every spoken reply
  const mod = moderate(reply);
  const finalReply = mod.pass
    ? reply
    : "I want to honor what you said. Can you tell me a little more about how you're feeling right now?";

  await persistAgentTurn(opts.callSessionId, opts.turnIndex + 1, finalReply, crisis.severity);

  return {
    reply: finalReply,
    action: "continue",
    surface988: crisis.severity !== "none",
    surface911: false,
    callId: opts.callSessionId,
    turnIndex: opts.turnIndex + 1,
  };
}

async function persistAgentTurn(
  callSessionId: string,
  turnIndex: number,
  text: string,
  riskState: string
): Promise<void> {
  await db
    .execute(sql`
      INSERT INTO call_turns (call_session_id, turn_index, speaker, text)
      VALUES (${callSessionId}, ${turnIndex}, 'agent', ${text})
    `)
    .catch(() => undefined);
  await db
    .execute(sql`
      UPDATE call_sessions SET risk_level = ${riskState} WHERE id = ${callSessionId}
    `)
    .catch(() => undefined);
}

async function logCrisisEvent(
  callSessionId: string,
  crisis: ReturnType<typeof assessCrisis>,
  action: string
): Promise<void> {
  await db
    .execute(sql`
      INSERT INTO crisis_events (call_session_id, trigger_phrase, severity, action_taken, escalated_to)
      VALUES (
        ${callSessionId},
        ${crisis.triggers.join("|")},
        ${crisis.severity},
        ${action},
        ${action === "dual_transfer" ? "988_and_911" : action === "warm_transfer_988" ? "988" : null}
      )
    `)
    .catch(() => undefined);
}
