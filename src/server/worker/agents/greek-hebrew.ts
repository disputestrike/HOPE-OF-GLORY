/**
 * Greek/Hebrew Agent — original-language insight with calibrated confidence.
 *
 * Provider: Anthropic (always — original-language work is high-precision).
 *
 * Hard rules (from docs/doctrine/original-language-policy.md):
 *   - Confidence required on every claim (high | medium | low)
 *   - No etymological fallacy
 *   - No hidden-meaning rhetoric ("the original Greek REALLY means...")
 *   - No numerology
 *   - No fabricated lemma/parsing
 *   - If confidence < medium, AGENT MUST SAY SO
 */
import { anthropic, type AgentRequest } from "@hog/ai";
import { loadAgent } from "@hog/prompts";

export type GreekHebrewNote = {
  passageReference: string;
  language: "Greek" | "Hebrew" | "Aramaic";
  lemmaOrPhrase: string;
  transliteration: string;
  pastoralSummary: string;
  basis: string;
  dissent: string;
  confidence: "high" | "medium" | "low";
};

export async function generateNote(
  passageReference: string,
  pericope: string
): Promise<GreekHebrewNote | null> {
  const agent = await loadAgent("greek-hebrew");

  const req: AgentRequest = {
    taskType: "greek_hebrew",
    agentName: "greek-hebrew",
    serviceClass: "background",
    risk: "medium",
    systemPrompt: `${agent.systemPrompt}

OUTPUT MODE: JSON only, matching:
{
  "passage_reference": string,
  "language": "Greek" | "Hebrew" | "Aramaic",
  "lemma_or_phrase": string,
  "transliteration": string,
  "pastoral_summary": string,
  "basis": string,
  "dissent": string,
  "confidence": "high" | "medium" | "low"
}

If you are not confident in an original-language insight for this passage, return:
{ "skip": true, "reason": "..." }

NEVER fabricate a lemma. Better to skip than to overstate.`,
    userInput: `Passage: ${passageReference}

Pericope text:
${pericope}

If a useful original-language insight exists for this passage and you are at medium+ confidence, return the JSON. Otherwise return {"skip": true, "reason": "..."}.`,
    temperature: 0.3,
    maxTokens: 1500,
  };

  const response = await anthropic.call(req);
  const jsonMatch = response.text.match(/(\{[\s\S]*\})/);
  if (!jsonMatch?.[1]) return null;

  try {
    const parsed = JSON.parse(jsonMatch[1]);
    if (parsed.skip) return null;
    return {
      passageReference: parsed.passage_reference,
      language: parsed.language,
      lemmaOrPhrase: parsed.lemma_or_phrase,
      transliteration: parsed.transliteration,
      pastoralSummary: parsed.pastoral_summary,
      basis: parsed.basis,
      dissent: parsed.dissent,
      confidence: parsed.confidence,
    };
  } catch {
    return null;
  }
}

export function renderNote(note: GreekHebrewNote): string {
  return `## A note on the original language

In **${note.passageReference}**, the ${note.language} ${note.lemmaOrPhrase} (*${note.transliteration}*) ${note.pastoralSummary}

**What this is based on:** ${note.basis}

${note.dissent ? `**Where faithful scholars differ:** ${note.dissent}` : ""}

*(Confidence: ${note.confidence}.)*`;
}
