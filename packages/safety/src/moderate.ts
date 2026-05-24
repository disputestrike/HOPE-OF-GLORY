/**
 * Output moderation — last-mile check before publishing AI output.
 *
 * Enforces:
 *   - No people-group degrading language
 *   - No prosperity-gospel manipulation
 *   - No fresh-revelation claims
 *   - No tech-stack mentions in public output
 *   - No claims about specific people's salvation/damnation
 */

export type ModerationViolation = {
  category:
    | "people_group_attack"
    | "prosperity_manipulation"
    | "fresh_revelation"
    | "tech_stack_leak"
    | "personal_salvation_claim"
    | "invented_scripture"
    | "date_setting";
  severity: "warn" | "block";
  match: string;
};

const PEOPLE_GROUP_ATTACK: readonly RegExp[] = [
  /\b(muslims?|mohammedans?) are (evil|stupid|terrorists?)\b/i,
  /\b(jews?|hebrews?) are (cursed|christ[\s-]?killers?)\b/i,
  /\bcatholics? are (not|aren'?t) christians?\b/i,
  /\bgays? (deserve|are going to)\b/i,
  /\b(atheists?|unbelievers?) are (fools?|stupid|evil)\b/i,
];

const PROSPERITY: readonly RegExp[] = [
  /\bif you (truly|really) (trust|believe in) god,?\s+(give|donate|send|sow)\b/i,
  /\bsow a seed of \$/i,
  /\bgod will (multiply|bless) your (gift|seed) (10|100|1000)/i,
  /\bplant a seed for your (healing|breakthrough|miracle)\b/i,
];

const FRESH_REVELATION: readonly RegExp[] = [
  /\bgod (told|showed|revealed to) me (that|to)\b/i,
  /\bthe (lord|spirit) is saying (right now|today) (that|to)\b/i,
  /\bi prophesy (over|to) you\b/i,
  /\bthus saith the lord\b/i,
];

const TECH_STACK: readonly RegExp[] = [
  /\b(cerebras|anthropic|openai|gpt-?4|claude|llama)\b/i,
  /\b(postiz|signalwire|deepgram|railway|drizzle|pgvector|next\.?js)\b/i,
  /\bthis (system|model|llm|api)\b/i,
];

const PERSONAL_SALVATION: readonly RegExp[] = [
  /\byou are (going to|definitely going to) hell\b/i,
  /\byou are (saved|damned) (because|for)\b/i,
  /\bi know (you are|you'?re) (saved|not saved)\b/i,
];

const DATE_SETTING: readonly RegExp[] = [
  /\b(jesus|christ|the lord) (is coming back|will return) (in|by|on)\s+\d{4}\b/i,
  /\bthe rapture (will happen|is coming) (in|on|by)\s+\d{4}\b/i,
  /\bthe (end|tribulation) (will begin|starts) (in|on|by)\s+\d{4}\b/i,
];

function scan(
  patterns: readonly RegExp[],
  text: string,
  category: ModerationViolation["category"],
  severity: ModerationViolation["severity"]
): ModerationViolation[] {
  const out: ModerationViolation[] = [];
  for (const re of patterns) {
    const m = re.exec(text);
    if (m) out.push({ category, severity, match: m[0] });
  }
  return out;
}

export function moderate(text: string): {
  pass: boolean;
  violations: ModerationViolation[];
} {
  const violations: ModerationViolation[] = [
    ...scan(PEOPLE_GROUP_ATTACK, text, "people_group_attack", "block"),
    ...scan(PROSPERITY, text, "prosperity_manipulation", "block"),
    ...scan(FRESH_REVELATION, text, "fresh_revelation", "block"),
    ...scan(TECH_STACK, text, "tech_stack_leak", "warn"),
    ...scan(PERSONAL_SALVATION, text, "personal_salvation_claim", "block"),
    ...scan(DATE_SETTING, text, "date_setting", "block"),
  ];
  const pass = violations.every((v) => v.severity !== "block");
  return { pass, violations };
}
