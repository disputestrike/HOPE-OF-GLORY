/**
 * Engagement Agent — reads platform comments/DMs, drafts replies,
 * queues for human approval (first 30 days), then auto-replies from
 * approved templates.
 *
 * Pipeline per inbound interaction:
 *   1. assess() crisis classifier — if positive, route to crisis flow
 *   2. classify sentiment (positive / neutral / question / hostile)
 *   3. classify intent (compliment / question / debate / spam)
 *   4. If question → Q&A Agent draft
 *      If debate → Apologetics Agent draft (when Phase 8 is wired)
 *      If hostile → soft-decline template
 *      If compliment → brief thanks template
 *      If spam → mark, no reply
 *   5. Doctrine gate on substantive replies
 *   6. Moderation pass
 *   7. Queue to admin approval (first 30 days)
 */
import { db } from "@hog/db";
import { sql } from "drizzle-orm";
import { route, type AgentRequest } from "@hog/ai";
import { assess as assessCrisis, moderate } from "@hog/safety";
import { loadAgent } from "@hog/prompts";

export type EngagementClassification = {
  sentiment: "positive" | "neutral" | "question" | "hostile" | "spam";
  intent: "compliment" | "question" | "debate" | "request_human" | "spam" | "other";
  crisis: ReturnType<typeof assessCrisis>;
};

const CLASSIFIER_SYSTEM = `You classify social media comments and DMs to a Christian ministry account.
Return JSON only:
{
  "sentiment": "positive" | "neutral" | "question" | "hostile" | "spam",
  "intent": "compliment" | "question" | "debate" | "request_human" | "spam" | "other"
}
Be precise. "Question" = an honest question about Scripture or faith. "Debate" = a challenge to Christian belief. "Compliment" = praise or gratitude. "Spam" = unrelated promo, scam, or bot content. "Request_human" = explicit ask to talk to someone.`;

export async function classifyEngagement(content: string): Promise<EngagementClassification> {
  const crisis = assessCrisis(content);

  const req: AgentRequest = {
    taskType: "engagement_classify",
    agentName: "engagement",
    serviceClass: "background",
    risk: "low",
    systemPrompt: CLASSIFIER_SYSTEM,
    userInput: content,
    temperature: 0.1,
    maxTokens: 200,
  };

  const response = await route(req);
  const m = response.text.match(/(\{[\s\S]*\})/);
  const parsed = m?.[1] ? JSON.parse(m[1]) : { sentiment: "neutral", intent: "other" };
  return { ...parsed, crisis };
}

const TEMPLATES = {
  compliment_brief: "Thank you. Glory to God. — Hope of Glory",
  hostile_soft_decline:
    "We hear you. We'd rather not trade barbs here. If you have a question, we'd love to answer it. Otherwise, we wish you well.",
  spam_no_reply: "",
  crisis_redirect:
    "Friend, what you're sharing matters more than a reply. If you're in immediate danger, please call 911. For the U.S. Suicide & Crisis Lifeline, call or text 988. You are not alone.",
  request_human_ack:
    "Thank you for reaching out. We'd like to talk. Please send a note through hopeofglory.ministry/contact and a member of the ministry will follow up.",
} as const;

export async function draftReply(opts: {
  content: string;
  authorHandle: string;
  platform: string;
}): Promise<{
  suggestedReply: string;
  classification: EngagementClassification;
  requiresHumanReview: boolean;
  doctrineGated: boolean;
}> {
  const classification = await classifyEngagement(opts.content);

  // Crisis always overrides
  if (classification.crisis.severity !== "none") {
    return {
      suggestedReply: TEMPLATES.crisis_redirect,
      classification,
      requiresHumanReview: true,
      doctrineGated: false,
    };
  }

  if (classification.intent === "spam") {
    return {
      suggestedReply: "",
      classification,
      requiresHumanReview: false,
      doctrineGated: false,
    };
  }

  if (classification.intent === "compliment") {
    return {
      suggestedReply: TEMPLATES.compliment_brief,
      classification,
      requiresHumanReview: false,
      doctrineGated: false,
    };
  }

  if (classification.intent === "request_human") {
    return {
      suggestedReply: TEMPLATES.request_human_ack,
      classification,
      requiresHumanReview: false,
      doctrineGated: false,
    };
  }

  if (classification.sentiment === "hostile") {
    return {
      suggestedReply: TEMPLATES.hostile_soft_decline,
      classification,
      requiresHumanReview: true,
      doctrineGated: false,
    };
  }

  // Substantive question or debate — draft via the brain.
  const agent = await loadAgent("engagement").catch(() => null);
  const baseSystem =
    agent?.systemPrompt ??
    "You draft short, charitable replies to social media comments for Hope of Glory Ministry. Maximum 280 characters. Point users to the website or Ask Hope for deeper conversation. Never debate. Never insult.";

  const req: AgentRequest = {
    taskType: "engagement_draft",
    agentName: "engagement",
    serviceClass: "background",
    risk: "medium",
    systemPrompt:
      baseSystem +
      "\n\nKeep replies under 280 characters. Be charitable and brief. Where appropriate, point to Ask Hope at hopeofglory.ministry/ask for fuller engagement.",
    userInput: `Platform: ${opts.platform}
From: ${opts.authorHandle}

Comment: ${opts.content}`,
    temperature: 0.5,
    maxTokens: 400,
  };
  const draft = await route(req);

  const mod = moderate(draft.text);
  if (!mod.pass) {
    return {
      suggestedReply: "",
      classification,
      requiresHumanReview: true,
      doctrineGated: true,
    };
  }

  return {
    suggestedReply: draft.text.slice(0, 280),
    classification,
    requiresHumanReview: true, // first 30 days
    doctrineGated: classification.sentiment === "question" || classification.intent === "debate",
  };
}

export async function persistEngagement(opts: {
  platform: string;
  postId: string;
  authorHandle: string;
  content: string;
  suggestedReply: string;
  sentiment: string;
}): Promise<void> {
  await db.execute(sql`
    INSERT INTO social_engagements (platform, post_id, author_handle, content, sentiment, suggested_reply, status)
    VALUES (${opts.platform}, ${opts.postId}, ${opts.authorHandle}, ${opts.content}, ${opts.sentiment}, ${opts.suggestedReply}, 'pending_approval')
    ON CONFLICT DO NOTHING
  `);
}
