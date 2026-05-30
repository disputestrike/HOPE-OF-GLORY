/**
 * Translation Agent — translates sermons into target languages while
 * preserving theological precision and using public-domain Bible text.
 *
 * Provider: Always Anthropic — translation nuance is brain work.
 */
import { anthropic, type AgentRequest } from "@hog/ai";
import { runDoctrineGate } from "./doctrine";
import { moderate } from "@hog/safety";
import {
  glossaryFor,
  LANGUAGE_NAMES,
  PUBLIC_DOMAIN_BIBLE,
  type LanguageCode,
} from "./translation-glossary";

export type TranslatedSermon = {
  title: string;
  summary: string;
  fullText: string;
  prayer: string;
  callToAction: string;
  language: LanguageCode;
  bibleVersion: string;
  blocked: boolean;
  blockedReason?: string;
};

export async function translateSermon(opts: {
  title: string;
  summary: string;
  fullText: string;
  prayer: string;
  callToAction: string;
  targetLanguage: LanguageCode;
}): Promise<TranslatedSermon> {
  const langName = LANGUAGE_NAMES[opts.targetLanguage];
  const bible = PUBLIC_DOMAIN_BIBLE[opts.targetLanguage];
  const glossary = glossaryFor(opts.targetLanguage);

  const systemPrompt = `You are translating a Christian sermon into ${langName} for Hope of Glory Ministry.

LOCKED rules:
1. Preserve theological precision. Use the following glossary EXACTLY for these terms:
${glossary}

2. Scripture quotations: when the source quotes the World English Bible, translate the reference (book chapter:verse) but use the ${bible.name} (${bible.abbreviation}) for the verse text. If the target-language verse text is unavailable to you, leave the reference and a brief paraphrase clearly marked as paraphrase.

3. Tone: reverent, clear, plain ${langName}. Idiomatic but never paraphrased so far that doctrinal precision is lost.

4. Direction of reading: preserve correctly for the target language (LTR or RTL).

5. NEVER omit theological content. NEVER add commentary. NEVER paraphrase a key term away from its glossary form.

OUTPUT MODE: JSON only:
{
  "title": string,
  "summary": string,
  "fullText": string (markdown, same structure as source),
  "prayer": string,
  "callToAction": string
}

Return ONLY JSON.`;

  const req: AgentRequest = {
    taskType: "summarize",
    agentName: "translation",
    serviceClass: "background",
    risk: "high",
    systemPrompt,
    userInput: `Source sermon (English):

Title: ${opts.title}

Summary: ${opts.summary}

Full text:
${opts.fullText}

Prayer:
${opts.prayer}

Call to action: ${opts.callToAction}`,
    temperature: 0.3,
    maxTokens: 6000,
  };

  let response;
  try {
    response = await anthropic.call(req);
  } catch (err) {
    return {
      title: opts.title,
      summary: opts.summary,
      fullText: opts.fullText,
      prayer: opts.prayer,
      callToAction: opts.callToAction,
      language: opts.targetLanguage,
      bibleVersion: bible.abbreviation,
      blocked: true,
      blockedReason: err instanceof Error ? err.message : "Unknown",
    };
  }

  const m = response.text.match(/(\{[\s\S]*\})/);
  if (!m?.[1]) {
    return {
      title: opts.title,
      summary: opts.summary,
      fullText: opts.fullText,
      prayer: opts.prayer,
      callToAction: opts.callToAction,
      language: opts.targetLanguage,
      bibleVersion: bible.abbreviation,
      blocked: true,
      blockedReason: "unparseable",
    };
  }

  let parsed: Pick<TranslatedSermon, "title" | "summary" | "fullText" | "prayer" | "callToAction">;
  try {
    parsed = JSON.parse(m[1]);
  } catch {
    return {
      title: opts.title,
      summary: opts.summary,
      fullText: opts.fullText,
      prayer: opts.prayer,
      callToAction: opts.callToAction,
      language: opts.targetLanguage,
      bibleVersion: bible.abbreviation,
      blocked: true,
      blockedReason: "invalid_json",
    };
  }

  // Moderation pass on translated content
  const mod = moderate(parsed.fullText + "\n" + parsed.prayer);
  if (!mod.pass) {
    return {
      ...parsed,
      language: opts.targetLanguage,
      bibleVersion: bible.abbreviation,
      blocked: true,
      blockedReason: `moderation: ${mod.violations.map((v) => v.category).join(",")}`,
    };
  }

  // Doctrine gate on the translated content (Claude understands the major target languages)
  const verdict = await runDoctrineGate({
    content: parsed.fullText,
    agentName: "translation",
    taskType: "sermon_verify",
  }).catch(() => undefined);

  if (verdict && verdict.verdict === "block") {
    return {
      ...parsed,
      language: opts.targetLanguage,
      bibleVersion: bible.abbreviation,
      blocked: true,
      blockedReason: "doctrine_block",
    };
  }

  return {
    ...parsed,
    language: opts.targetLanguage,
    bibleVersion: bible.abbreviation,
    blocked: false,
  };
}
