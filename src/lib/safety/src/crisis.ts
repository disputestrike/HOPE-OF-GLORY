/**
 * Crisis classification — runs on EVERY user input before LLM call.
 *
 * Output drives:
 *   - Route to Crisis Agent (Claude only) instead of normal flow
 *   - Suppress donation prompts
 *   - Suppress apologetics debate posture
 *   - Trigger 988/911 escalation surface
 *   - Insert row into crisis_events for human review
 */
import { detectCrisis } from "@hog/ai";

export type CrisisSeverity = "none" | "watch" | "active" | "imminent";

export type CrisisAssessment = {
  severity: CrisisSeverity;
  triggers: string[];
  recommendedAction:
    | "continue_normally"
    | "switch_to_crisis_agent"
    | "warm_transfer_988"
    | "call_911"
    | "warm_transfer_988_and_911";
  surface_988: boolean;
  surface_911: boolean;
  log_to_crisis_events: boolean;
};

const IMMINENT_INDICATORS: readonly RegExp[] = [
  /\b(tonight|right now|today)\b.*?\b(end|kill|hurt)\b/i,
  /\b(want|going|plan|planning|about)\b.{0,60}\b(hurt|harm|kill|end)\b.{0,40}\b(myself|my life|it)\b.{0,60}\b(tonight|right now|today)\b/i,
  /\bhave (a |the )?(gun|pills|rope|knife)\b/i,
  /\bplan to (kill|end|hurt)\b/i,
  /\b(am|i'm) going to (die|end it|do it)\b/i,
  /\boverdosed?\b/i,
];

const ACTIVE_INDICATORS: readonly RegExp[] = [
  /\b(want|wish) (to|i could) die\b/i,
  /\bsuicid(e|al)\b/i,
  /\bkill myself\b/i,
  /\bend(ing)? my life\b/i,
  /\b(want|wish|going|planning|plan|thinking about|about)\b.{0,40}\b(hurt|harm) myself\b/i,
  /\b(do not|don't|dont|cannot|can't|cant|no longer) want to live( anymore)?\b/i,
  /\bself[\s-]?harm\b/i,
  /\bcut(ting)? my(self)?\b/i,
];

const ABUSE_INDICATORS: readonly RegExp[] = [
  /\b(being|getting) (abused|raped|beaten|hurt|hit)\b/i,
  /\bsomeone (is hurting|is abusing|raped) me\b/i,
  /\b(husband|wife|partner|boyfriend|girlfriend|spouse|parent|father|mother|caregiver)\s+is\s+(abusing|beating|hitting|hurting)\b/i,
  /\bchild (abuse|being hurt|in danger)\b/i,
  /\bdomestic violence\b/i,
];

export function assess(text: string): CrisisAssessment {
  const triggers: string[] = [];

  const imminent = IMMINENT_INDICATORS.some((re) => {
    if (re.test(text)) {
      triggers.push(re.source);
      return true;
    }
    return false;
  });

  if (imminent) {
    return {
      severity: "imminent",
      triggers,
      recommendedAction: "warm_transfer_988_and_911",
      surface_988: true,
      surface_911: true,
      log_to_crisis_events: true,
    };
  }

  const active = ACTIVE_INDICATORS.some((re) => {
    if (re.test(text)) {
      triggers.push(re.source);
      return true;
    }
    return false;
  });

  if (active) {
    return {
      severity: "active",
      triggers,
      recommendedAction: "warm_transfer_988",
      surface_988: true,
      surface_911: false,
      log_to_crisis_events: true,
    };
  }

  const abuse = ABUSE_INDICATORS.some((re) => {
    if (re.test(text)) {
      triggers.push(re.source);
      return true;
    }
    return false;
  });

  if (abuse) {
    return {
      severity: "active",
      triggers,
      recommendedAction: "switch_to_crisis_agent",
      surface_988: false,
      surface_911: true,
      log_to_crisis_events: true,
    };
  }

  if (detectCrisis(text)) {
    return {
      severity: "watch",
      triggers: ["pattern-broad"],
      recommendedAction: "switch_to_crisis_agent",
      surface_988: true,
      surface_911: false,
      log_to_crisis_events: true,
    };
  }

  return {
    severity: "none",
    triggers: [],
    recommendedAction: "continue_normally",
    surface_988: false,
    surface_911: false,
    log_to_crisis_events: false,
  };
}
