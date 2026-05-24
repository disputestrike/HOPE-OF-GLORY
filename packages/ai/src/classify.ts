/**
 * Pre-LLM classifiers — cheap regex pass before any provider call.
 *
 * Crisis detection runs first on EVERY user input. If positive,
 * route immediately to the Crisis Agent (Claude only) regardless
 * of the original task type.
 *
 * High-risk topic detection elevates the risk tier to "high" so
 * the Anthropic verifier runs.
 */
import type { RiskLevel, TaskType } from "./types";

const CRISIS_PATTERNS: readonly RegExp[] = [
  /\bsuicide\b/i,
  /\bkill (myself|me)\b/i,
  /\bend (my|this) life\b/i,
  /\bself[\s-]?harm\b/i,
  /\bcut(ting)? (myself|my arm|my wrist)\b/i,
  /\bwant to die\b/i,
  /\b(no|nothing) (to|left to) live for\b/i,
  /\b(being|getting) (abused|raped|beaten|hurt)\b/i,
  /\bdomestic violence\b/i,
  /\bsexual abuse\b/i,
  /\bchild (abuse|in danger|is being hurt)\b/i,
  /\boverdose\b/i,
  /\bplan(ning)? to (hurt|kill|end)\b/i,
  /\bgun to my\b/i,
  /\bpills (to|enough)\b/i,
];

const HIGH_RISK_TOPICS: readonly RegExp[] = [
  /\b(trinity|trinitarian|nicene|hypostatic union)\b/i,
  /\b(salvation|saved|hell|damnation|justification)\b/i,
  /\b(islam|muslim|qur'?an|allah|muhammad|sharia)\b/i,
  /\b(catholic|orthodox|pope|magisterium|purgatory|mary worship)\b/i,
  /\bjehovah'?s? witnesses?\b/i,
  /\b(lds|mormon|joseph smith|book of mormon)\b/i,
  /\b(end[\s-]?times|antichrist|rapture|tribulation|millennium)\b/i,
  /\b(homosexual|gay marriage|transgender|lgbt[a-z]*)\b/i,
  /\babortion\b/i,
  /\bdeity of christ\b/i,
];

export function detectCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some((re) => re.test(text));
}

export function detectHighRiskTopic(text: string): boolean {
  return HIGH_RISK_TOPICS.some((re) => re.test(text));
}

export function classifyRisk(text: string, task: TaskType): RiskLevel {
  if (detectCrisis(text)) return "critical";
  if (task === "doctrine_gate" || task === "apologetics_verify" || task === "crisis") {
    return "critical";
  }
  if (detectHighRiskTopic(text)) return "high";
  if (task === "summarize" || task === "caption" || task === "schedule" || task === "image_prompt") {
    return "low";
  }
  return "medium";
}
