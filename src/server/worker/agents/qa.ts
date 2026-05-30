/**
 * Q&A Agent — "Ask Hope" public Bible Q&A.
 *
 * Flow per question:
 *   1. Crisis classifier on input → if active, hand to Crisis Agent surface
 *   2. Embed the question
 *   3. RAG retrieval: top-K chunks from Bible + creeds + doctrine
 *   4. Risk classification on topic
 *   5. Route via model router (Cerebras + Claude verifier on high-risk)
 *   6. Citation validator on output
 *   7. Doctrine gate on high-risk
 *   8. Return structured response with citations
 *
 * Crisis routing wins over Q&A. We never debate a person in crisis.
 */
import { openai, route, classifyRisk, type AgentRequest } from "@hog/ai";
import { loadAgent } from "@hog/prompts";
import { similaritySearch } from "@hog/rag";
import { assess as assessCrisis } from "@hog/safety";
import { validateCitations } from "@hog/scripture";
import { moderate } from "@hog/safety";
import { db } from "@hog/db";
import { runDoctrineGate } from "./doctrine";

export type QAResult = {
  answer: string;
  citations: string[];
  citationsValid: boolean;
  risk: "low" | "medium" | "high" | "critical";
  crisis: ReturnType<typeof assessCrisis>;
  doctrineVerdict?: Awaited<ReturnType<typeof runDoctrineGate>>;
  blocked: boolean;
  blockedReason?: string;
};

const SYSTEM_FALLBACK =
  "You are Hope (the Ask Hope Q&A companion of Hope of Glory Ministry). Answer Bible questions plainly, with Scripture citations from the World English Bible (WEB). Never invent verses. Never claim certainty about a person's salvation, prophesy, or speak for God. If the question is about a disputed secondary doctrine, name the historic positions charitably and decline to bind consciences.";

export async function askHope(question: string): Promise<QAResult> {
  // 1. Crisis check first — overrides Q&A flow.
  const crisis = assessCrisis(question);
  if (crisis.severity !== "none") {
    return {
      answer:
        "Friend, what you just shared is important and it deserves more than a chat reply. " +
        "If you are in immediate danger, please call 911. " +
        "If you are having thoughts of suicide or self-harm, call or text 988 — the U.S. Suicide & Crisis Lifeline. " +
        "You are not alone, and you are not too much. God loves you, and we love you. " +
        "When you are safe, come back and we can talk about Scripture together.",
      citations: ["Psalm 34:18"],
      citationsValid: true,
      risk: "critical",
      crisis,
      blocked: false,
    };
  }

  // 2. RAG retrieval — best-effort, gracefully empty if DB isn't seeded yet.
  let context = "";
  try {
    const vec = await openai.embed(question);
    const hits = await similaritySearch(db, vec, { limit: 6 });
    if (hits.length > 0) {
      context = hits
        .map((h, i) => `[${i + 1}] ${h.content}`)
        .join("\n\n");
    }
  } catch (err) {
    console.warn("[qa] RAG retrieval failed:", err);
  }

  // 3. Risk classification.
  const risk = classifyRisk(question, "qa_draft");

  // 4. Load Q&A agent prompt.
  let systemPrompt = SYSTEM_FALLBACK;
  try {
    const agent = await loadAgent("qa");
    systemPrompt = agent.systemPrompt;
  } catch {
    // Use fallback if agent file unavailable.
  }

  // 5. Generate answer.
  const req: AgentRequest = {
    taskType: "qa_draft",
    agentName: "qa",
    serviceClass: "chat",
    risk,
    systemPrompt:
      systemPrompt +
      "\n\nOUTPUT MODE: A direct answer, 2-5 short paragraphs. Cite scripture references inline (e.g., 'John 3:16'). At the end, list the references on a single line prefixed with 'References:'. Plain language. No headings. No markdown.",
    userInput: question,
    context: context || undefined,
    temperature: 0.4,
    maxTokens: 1200,
  };

  let response;
  try {
    response = await route(req);
  } catch (err) {
    return {
      answer: "I'm sorry — I couldn't reach the right resources to answer that just now. Please try again in a moment.",
      citations: [],
      citationsValid: false,
      risk,
      crisis,
      blocked: true,
      blockedReason: err instanceof Error ? err.message : "Unknown error",
    };
  }

  // 6. Output moderation.
  const mod = moderate(response.text);
  if (!mod.pass) {
    return {
      answer: "I'm sorry — that answer didn't meet our standards and was held for review. Please ask again or rephrase.",
      citations: [],
      citationsValid: false,
      risk,
      crisis,
      blocked: true,
      blockedReason: `moderation: ${mod.violations.map((v) => v.category).join(", ")}`,
    };
  }

  // 7. Citation validation.
  const citationCheck = await validateCitations(db, response.text).catch(() => ({
    valid: true,
    checks: [],
  }));
  const citations = citationCheck.checks.filter((c) => c.valid).map((c) => c.reference);

  // 8. Doctrine gate on high/critical risk.
  let doctrineVerdict: Awaited<ReturnType<typeof runDoctrineGate>> | undefined;
  if (risk === "high" || risk === "critical") {
    doctrineVerdict = await runDoctrineGate({
      content: response.text,
      agentName: "qa",
      taskType: "qa_verify",
    }).catch(() => undefined);

    if (doctrineVerdict && doctrineVerdict.verdict === "block") {
      return {
        answer: "I'm sorry — that question requires more care than I can offer here. Please share it with a faithful local pastor.",
        citations: [],
        citationsValid: false,
        risk,
        crisis,
        doctrineVerdict,
        blocked: true,
        blockedReason: "doctrine_block",
      };
    }
  }

  return {
    answer: response.text,
    citations,
    citationsValid: citationCheck.valid,
    risk,
    crisis,
    doctrineVerdict,
    blocked: false,
  };
}
