/**
 * Model router — routes requests based on task type + risk level.
 *
 * Routing policy (from MASTER-PLAN.md):
 *   low      → Cerebras only
 *   medium   → Cerebras primary, OpenAI fallback
 *   high     → Cerebras draft + Anthropic verify (fallback Anthropic)
 *   critical → Anthropic only (crisis, doctrine gate)
 */
import { call as callCerebras } from "./providers/cerebras";
import { call as callAnthropic } from "./providers/anthropic";
import { call as callOpenAI } from "./providers/openai";
import type {
  AgentRequest,
  AgentResponse,
  Provider,
  RiskLevel,
  TaskType,
} from "./types";
import { RateLimited } from "./types";

const RISK_BY_TASK: Record<TaskType, RiskLevel> = {
  sermon_draft: "high",
  sermon_verify: "high",
  qa_draft: "medium",
  qa_verify: "high",
  doctrine_gate: "critical",
  apologetics_draft: "high",
  apologetics_verify: "critical",
  prayer: "high",
  crisis: "critical",
  summarize: "low",
  caption: "low",
  schedule: "low",
  engagement_draft: "medium",
  engagement_classify: "low",
  greek_hebrew: "medium",
  image_prompt: "low",
  video_script: "low",
};

export function riskFor(task: TaskType, override?: RiskLevel): RiskLevel {
  return override ?? RISK_BY_TASK[task];
}

export type RouteDecision = {
  primary: Provider;
  fallback?: Provider;
  verifier?: Provider;
  reason: string;
};

export function decide(_task: TaskType, risk: RiskLevel): RouteDecision {
  if (risk === "critical") {
    return {
      primary: "anthropic",
      reason: "Critical risk requires premium brain — never Cerebras",
    };
  }
  if (risk === "high") {
    return {
      primary: "cerebras",
      verifier: "anthropic",
      fallback: "anthropic",
      reason: "High risk: Cerebras draft + Anthropic verify",
    };
  }
  if (risk === "medium") {
    return {
      primary: "cerebras",
      fallback: "openai",
      reason: "Medium risk: Cerebras primary, OpenAI fallback",
    };
  }
  return {
    primary: "cerebras",
    reason: "Low risk: Cerebras workhorse",
  };
}

async function callProvider(
  provider: Provider,
  req: AgentRequest
): Promise<AgentResponse> {
  if (provider === "cerebras") return callCerebras(req);
  if (provider === "anthropic") return callAnthropic(req);
  return callOpenAI(req);
}

export async function route(req: AgentRequest): Promise<AgentResponse> {
  const risk = riskFor(req.taskType, req.risk);
  const plan = decide(req.taskType, risk);

  // Budget gate + spend metering now live at the provider boundary
  // (see withBudget in ./budget), so EVERY call — routed or a direct
  // provider.call() from an agent — is capped and metered exactly once.
  // A BudgetExhausted thrown by the primary is NOT a RateLimited, so it
  // correctly propagates without attempting the fallback.
  try {
    return await callProvider(plan.primary, req);
  } catch (err) {
    if (err instanceof RateLimited && plan.fallback) {
      console.warn(`[router] ${plan.primary} → ${plan.fallback}`);
      return await callProvider(plan.fallback, req);
    }
    throw err;
  }
}

export async function routeWithVerify(req: AgentRequest): Promise<{
  draft: AgentResponse;
  verified?: AgentResponse;
}> {
  const risk = riskFor(req.taskType, req.risk);
  const plan = decide(req.taskType, risk);
  const draft = await callProvider(plan.primary, req);

  if (!plan.verifier) return { draft };

  const verifyReq: AgentRequest = {
    ...req,
    taskType: req.taskType,
    systemPrompt: `${req.systemPrompt}

---
VERIFIER MODE. Review the draft below for:
1. Scriptural accuracy (no invented verses, citations correct)
2. Doctrinal soundness (Nicene; honest about secondary disputes)
3. Tone (charitable, never degrading)
4. Policy compliance (no fresh-revelation claims, no prophetic certainty, no people-group attacks)
5. Crisis indicators (if present, escalate immediately)

Return JSON:
{
  "verdict": "approve" | "revise" | "block",
  "issues": [<string>],
  "corrected_text": <string or null>,
  "risk_level": "low" | "medium" | "high" | "critical",
  "notes": <string>
}`,
    userInput: `Original request:\n${req.userInput}\n\nDraft to verify:\n${draft.text}`,
  };
  const verified = await callProvider(plan.verifier, verifyReq);
  return { draft, verified };
}
