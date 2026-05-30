/**
 * Prayer Agent — generates the closing prayer attached to every sermon,
 * and prays with users in chat and on the phone (Phase 9).
 *
 * Provider: Anthropic (always — pastoral tone is the brain's job).
 * Hard rules (from docs/doctrine/prayer-policy.md):
 *   - Never promise specific outcomes
 *   - Never bind God
 *   - Never replace the local church
 *   - Trinitarian shape: address Father, through Son, in Spirit
 */
import { anthropic, type AgentRequest } from "@hog/ai";
import { loadAgent } from "@hog/prompts";

export async function generateSermonPrayer(opts: {
  title: string;
  bigIdea: string;
  prayerFocus: string;
}): Promise<string> {
  const agent = await loadAgent("prayer");

  const req: AgentRequest = {
    taskType: "prayer",
    agentName: "prayer",
    serviceClass: "sermons",
    risk: "high",
    systemPrompt: `${agent.systemPrompt}

OUTPUT MODE: a written prayer to close a sermon. ~80-140 words.
Address the Father. Reference what the Son has done. Ask the Spirit's work.
Plain language. Reverent. No insider Christianese. No prosperity framing.
Do not promise outcomes. Do not name specific people. Do not bind God.`,
    userInput: `Sermon title: ${opts.title}
Big idea: ${opts.bigIdea}
Prayer focus: ${opts.prayerFocus}

Write the closing prayer for this sermon.`,
    temperature: 0.4,
    maxTokens: 500,
  };

  const response = await anthropic.call(req);
  return response.text.trim();
}
