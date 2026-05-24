/**
 * Sermon Agent — two-stage sermon generation.
 *
 *   Stage 1: Outline (JSON, schema-validated)
 *   Stage 2: Full draft (markdown, structured)
 *
 * Provider routing:
 *   Outline → Cerebras (fast structured generation)
 *   Draft   → Cerebras (workhorse)
 *   Verify  → Claude (Doctrine Agent gates downstream)
 *
 * Output structure (locked):
 *   - Title
 *   - Primary Scripture
 *   - Opening declaration
 *   - Context
 *   - Main truth
 *   - Exposition
 *   - Christ-centered fulfillment
 *   - Original-language insight (filled by Greek/Hebrew Agent)
 *   - Revelation / glory connection (if applicable)
 *   - Application
 *   - Call to faith
 *   - Prayer (filled by Prayer Agent)
 *   - Next step
 */
import { route, type AgentRequest } from "@hog/ai";
import { loadAgent } from "@hog/prompts";
import { SermonOutlineSchema, type SermonOutline } from "@hog/shared";
import { validateCitations } from "@hog/scripture";
import { db } from "@hog/db";

export type SermonContext = {
  title: string;
  primaryPassage: string;
  supportingPassages: string[];
  theme: string;
  seriesTitle?: string;
  scriptureText?: string;
  doctrineNotes?: string;
};

export async function generateOutline(ctx: SermonContext): Promise<SermonOutline> {
  const agent = await loadAgent("sermon");

  const req: AgentRequest = {
    taskType: "sermon_draft",
    agentName: "sermon",
    serviceClass: "sermons",
    systemPrompt: `${agent.systemPrompt}

OUTPUT MODE: outline only. Return JSON matching this schema:
{
  "title": string,
  "primary_passage": string,
  "big_idea": string (one sentence),
  "outline_points": string[] (3-5 main points),
  "cross_references": string[] (3-7 references),
  "prayer_focus": string,
  "application_steps": string[] (2-4 concrete steps)
}
Return ONLY the JSON, no prose, no markdown fences.`,
    userInput: `Generate a sermon outline.

Title: ${ctx.title}
Primary passage: ${ctx.primaryPassage}
Supporting passages: ${ctx.supportingPassages.join(", ")}
Theme: ${ctx.theme}
Series: ${ctx.seriesTitle ?? "(standalone)"}`,
    context: ctx.scriptureText ? `Scripture text (WEB):\n${ctx.scriptureText}` : undefined,
    temperature: 0.7,
    maxTokens: 1500,
  };

  const response = await route(req);
  const jsonMatch = response.text.match(/(\{[\s\S]*\})/);
  if (!jsonMatch?.[1]) throw new Error("Sermon Agent returned no JSON");
  const parsed = JSON.parse(jsonMatch[1]);
  return SermonOutlineSchema.parse(parsed);
}

export type SermonDraft = {
  fullText: string;
  citationsValid: boolean;
  citationIssues: string[];
};

export async function generateDraft(
  ctx: SermonContext,
  outline: SermonOutline
): Promise<SermonDraft> {
  const agent = await loadAgent("sermon");

  const req: AgentRequest = {
    taskType: "sermon_draft",
    agentName: "sermon",
    serviceClass: "sermons",
    systemPrompt: `${agent.systemPrompt}

OUTPUT MODE: full sermon draft in markdown. Use this structure:

# {Title}

> {Primary Scripture in full, WEB translation}
> — {reference} · WEB

## Opening declaration
(2-3 sentences — set the scene, name what God is doing)

## Context
(historical/literary context, 3-5 paragraphs)

## Main truth
(the big idea, stated plainly)

## Exposition
(verse-by-verse, 4-6 paragraphs)

## Christ-centered fulfillment
(how this passage finds its yes in Christ)

## [GREEK_HEBREW_PLACEHOLDER]
(Leave this section header in. The Greek/Hebrew Agent fills it.)

## Application
(2-4 concrete steps)

## Call to faith
(direct, gentle, no manipulation)

## [PRAYER_PLACEHOLDER]
(Leave this. The Prayer Agent fills it.)

## Next step
(one specific action — read a chapter, share with one person, etc.)

Tone: reverent, clear, charitable, urgent without manipulation. Never claim prophecy, certainty about private persons, or fresh revelation. Use only WEB Bible. Never invent verses.`,
    userInput: `Draft the sermon.

Title: ${ctx.title}
Primary passage: ${ctx.primaryPassage}
Big idea: ${outline.big_idea}
Outline points: ${outline.outline_points.join(" | ")}
Cross references: ${outline.cross_references.join(", ")}
Application: ${outline.application_steps.join(" | ")}`,
    context: ctx.scriptureText,
    temperature: 0.5,
    maxTokens: 4000,
  };

  const response = await route(req);
  const validation = await validateCitations(db, response.text);

  return {
    fullText: response.text,
    citationsValid: validation.valid,
    citationIssues: validation.checks.filter((c) => !c.valid).map((c) => c.reference),
  };
}
