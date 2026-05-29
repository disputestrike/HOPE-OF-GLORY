/**
 * Apologetics Agent — defends the faith firmly and charitably.
 *
 * Apologetics ≠ debate. Reframe every interaction as:
 *   "Explain the Christian view, engage objections honestly, refuse to mock."
 *
 * Hard rules (from docs/doctrine/apologetics-policy.md):
 *   - Steel-man the objection FIRST
 *   - Compare doctrines, NEVER insult persons
 *   - NEVER target people-groups with degrading language
 *   - Crisis indicators → STOP debate, route to crisis flow
 *
 * Always Claude (critical risk). Always through Doctrine Agent + moderation.
 */
import { randomUUID } from "node:crypto";
import { anthropic, type AgentRequest } from "@hog/ai";
import { loadAgent } from "@hog/prompts";
import { assess as assessCrisis, moderate } from "@hog/safety";
import { runDoctrineGate } from "./doctrine";
import { renderAudio } from "../pipelines/audio";

export type ApologeticsResponse = {
  steelman: string;
  christianView: string;
  objectionHandling: string;
  citations: string[];
  inviteToContinue: string;
  doctrineVerdict?: Awaited<ReturnType<typeof runDoctrineGate>>;
  blocked: boolean;
  blockedReason?: string;
  /**
   * Public URL to an MP3 narration of christianView + objectionHandling.
   * Present only when:
   *   - opts.withAudio === true on the call, AND
   *   - the response was not blocked, AND
   *   - Deepgram + S3 are configured, AND
   *   - the concatenated narration is long enough to be worth rendering.
   * The audio contains the source text verbatim — no paraphrase.
   */
  audioUrl?: string;
};

export async function answerObjection(opts: {
  question: string;
  audience?: "seeker" | "believer" | "skeptic";
  /**
   * When true, render TTS audio of the structured answer and upload to S3.
   * Off by default to avoid spend on the typical chat-only call site.
   * The API route opts in for users who explicitly request audio output.
   */
  withAudio?: boolean;
}): Promise<ApologeticsResponse> {
  // 1. Crisis check — never debate someone in crisis.
  const crisis = assessCrisis(opts.question);
  if (crisis.severity !== "none") {
    return {
      steelman: "",
      christianView:
        "Friend, what you're sharing matters more than a debate. If you are in immediate danger, please call 911. For the U.S. Suicide & Crisis Lifeline, call or text 988. You are not alone, and God loves you.",
      objectionHandling: "",
      citations: ["Psalm 34:18"],
      inviteToContinue: "",
      blocked: true,
      blockedReason: "crisis_override",
    };
  }

  const agent = await loadAgent("apologetics").catch(() => null);
  const baseSystem =
    agent?.systemPrompt ??
    "You are Hope of Glory Ministry's apologetics agent. Compare doctrines, never insult persons. Steel-man objections before responding.";

  const req: AgentRequest = {
    taskType: "apologetics_draft",
    agentName: "apologetics",
    serviceClass: "chat",
    risk: "critical",
    systemPrompt: `${baseSystem}

OUTPUT MODE: JSON only:
{
  "steelman": string (the strongest charitable version of the question or objection — at least as charitable as the questioner would phrase it),
  "christianView": string (the historic Christian answer, plain English, 2-4 short paragraphs),
  "objectionHandling": string (anticipate the strongest pushback to the Christian view and respond),
  "citations": string[] (WEB Bible references like "John 1:14", "Hebrews 1:3"),
  "inviteToContinue": string (one warm sentence inviting further conversation — never pressure)
}

Rules:
- Steel-man must precede every response
- Never use degrading language about Muslims, atheists, Jews, Catholics, Orthodox, LGBTQ+, JWs, LDS, or any group
- Never claim certainty about a person's salvation
- Cite WEB Bible only — never invent verses
- If the question is best handled by a faithful pastor, say so and point to the local church
- Audience: ${opts.audience ?? "seeker"}`,
    userInput: opts.question,
    temperature: 0.4,
    maxTokens: 2000,
  };

  let response;
  try {
    response = await anthropic.call(req);
  } catch (err) {
    return {
      steelman: "",
      christianView: "I'm sorry — I couldn't reach the resources needed to answer that just now. Please try again in a moment.",
      objectionHandling: "",
      citations: [],
      inviteToContinue: "",
      blocked: true,
      blockedReason: err instanceof Error ? err.message : "Unknown",
    };
  }

  const m = response.text.match(/(\{[\s\S]*\})/);
  if (!m?.[1]) {
    return {
      steelman: "",
      christianView: "I had trouble structuring that answer. Please ask again.",
      objectionHandling: "",
      citations: [],
      inviteToContinue: "",
      blocked: true,
      blockedReason: "unparseable",
    };
  }
  let parsed: Omit<ApologeticsResponse, "blocked" | "doctrineVerdict">;
  try {
    parsed = JSON.parse(m[1]);
  } catch {
    return {
      steelman: "",
      christianView: "I had trouble structuring that answer. Please ask again.",
      objectionHandling: "",
      citations: [],
      inviteToContinue: "",
      blocked: true,
      blockedReason: "invalid_json",
    };
  }

  // Moderation check on the entire response
  const concat = `${parsed.steelman}\n${parsed.christianView}\n${parsed.objectionHandling}\n${parsed.inviteToContinue}`;
  const mod = moderate(concat);
  if (!mod.pass) {
    return {
      ...parsed,
      blocked: true,
      blockedReason: `moderation: ${mod.violations.map((v) => v.category).join(",")}`,
    };
  }

  // Doctrine gate
  const verdict = await runDoctrineGate({
    content: concat,
    agentName: "apologetics",
    taskType: "apologetics_verify",
  }).catch(() => undefined);

  if (verdict && verdict.verdict === "block") {
    return { ...parsed, doctrineVerdict: verdict, blocked: true, blockedReason: "doctrine_block" };
  }

  // Optional TTS rendering. We only narrate the substantive teaching fields —
  // not the steel-man (which restates the questioner) and not the invite
  // (which is a CTA, not teaching). The order mirrors how a pastor would
  // answer aloud: state the Christian view, then handle the objection.
  let audioUrl: string | undefined;
  if (opts.withAudio) {
    const narration = [parsed.christianView, parsed.objectionHandling]
      .map((s) => s?.trim())
      .filter(Boolean)
      .join("\n\n");
    const rendered = await renderAudio({
      text: narration,
      key: `apologetics/${randomUUID()}.mp3`,
    });
    if (rendered) audioUrl = rendered.url;
  }

  return { ...parsed, doctrineVerdict: verdict, blocked: false, audioUrl };
}
