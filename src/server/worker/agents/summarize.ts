/**
 * Summarization Agent — turns a sermon into platform-specific content.
 *
 * For each sermon:
 *   - Email devotional (~300 words)
 *   - YouTube description
 *   - X thread (5-7 posts, 280-char limit each)
 *   - Instagram caption
 *   - TikTok caption + hook
 *   - LinkedIn post
 *   - BlueSky post
 *   - Threads post
 *   - Pinterest description
 *   - 3 Scripture-card pull-quotes
 *
 * Provider: Cerebras (mechanical re-purposing — high volume, low risk).
 * Output gets moderation pass before posting.
 */
import { route, type AgentRequest } from "@hog/ai";
import { loadAgent } from "@hog/prompts";
import { moderate } from "@hog/safety";

export type SocialPack = {
  email: { subject: string; body: string };
  youtubeDescription: string;
  xThread: string[];
  instagramCaption: string;
  tiktokHook: string;
  tiktokCaption: string;
  linkedinPost: string;
  blueskyPost: string;
  threadsPost: string;
  pinterestDescription: string;
  quoteCards: string[];
};

const SCHEMA_INSTRUCTION = `OUTPUT MODE: JSON only, matching this shape exactly:
{
  "email": { "subject": string, "body": string },
  "youtubeDescription": string,
  "xThread": string[],
  "instagramCaption": string,
  "tiktokHook": string,
  "tiktokCaption": string,
  "linkedinPost": string,
  "blueskyPost": string,
  "threadsPost": string,
  "pinterestDescription": string,
  "quoteCards": string[]
}

Constraints (LOCKED):
- xThread: 5-7 posts, each <= 270 characters
- instagramCaption: <= 2200 chars, include 5-10 hashtags at the end
- tiktokHook: <= 90 chars, the first line of a TikTok caption
- tiktokCaption: <= 2200 chars
- linkedinPost: <= 3000 chars, professional but warm
- blueskyPost: <= 300 chars
- threadsPost: <= 500 chars
- pinterestDescription: <= 500 chars
- quoteCards: 3 short pull-quotes, each <= 140 chars, designed to overlay on a scripture card
- Never mention provider names (AI model names, vendors)
- Never use clickbait phrasing
- Never promise outcomes
- Use the World English Bible if quoting scripture directly
- Charitable, reverent tone everywhere

Return ONLY the JSON. No prose, no markdown fences.`;

export async function summarizeSermon(opts: {
  title: string;
  primaryPassage: string;
  bigIdea: string;
  fullText: string;
}): Promise<SocialPack | null> {
  const agent = await loadAgent("summarization").catch(() => null);
  const baseSystem =
    agent?.systemPrompt ??
    "You are Hope of Glory Ministry's summarization agent. Repurpose sermon content faithfully into platform-specific posts. Never misrepresent the source. Never use clickbait.";

  const req: AgentRequest = {
    taskType: "summarize",
    agentName: "summarization",
    serviceClass: "background",
    risk: "low",
    systemPrompt: `${baseSystem}\n\n${SCHEMA_INSTRUCTION}`,
    userInput: `Sermon title: ${opts.title}
Primary passage: ${opts.primaryPassage}
Big idea: ${opts.bigIdea}

Full sermon text:
${opts.fullText}`,
    temperature: 0.5,
    maxTokens: 4000,
  };

  let response;
  try {
    response = await route(req);
  } catch (err) {
    console.error("[summarize] route failed:", err);
    return null;
  }

  const json = response.text.match(/(\{[\s\S]*\})/);
  if (!json?.[1]) return null;

  try {
    const parsed = JSON.parse(json[1]) as SocialPack;

    // Quick moderation pass on the entire pack.
    const concat =
      parsed.email.body +
      "\n" +
      parsed.xThread.join("\n") +
      "\n" +
      parsed.instagramCaption +
      "\n" +
      parsed.tiktokCaption +
      "\n" +
      parsed.linkedinPost +
      "\n" +
      parsed.quoteCards.join("\n");
    const mod = moderate(concat);
    if (!mod.pass) {
      console.warn("[summarize] moderation flagged pack:", mod.violations);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
