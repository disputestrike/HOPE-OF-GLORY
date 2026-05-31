/**
 * Anthropic provider — used for the brain:
 *   - Doctrine gate (Doctrine Agent)
 *   - Crisis Agent (Claude only, never Cerebras)
 *   - Apologetics verifier
 *   - High-risk theology verification
 *
 * Uses Messages API (zero-data-retention eligible), not Managed Agents.
 */
import Anthropic from "@anthropic-ai/sdk";
import type { AgentRequest, AgentResponse } from "../types";
import { ProviderUnavailable } from "../types";
import { withBudget } from "../budget";

const DEFAULT_MODEL = process.env.ANTHROPIC_DEFAULT_MODEL ?? "claude-sonnet-4-5";

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (_client) return _client;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new ProviderUnavailable("anthropic", "ANTHROPIC_API_KEY not set");
  _client = new Anthropic({ apiKey: key });
  return _client;
}

export async function call(
  req: AgentRequest,
  model: string = DEFAULT_MODEL
): Promise<AgentResponse> {
  return withBudget(req.agentName, () => rawCall(req, model));
}

async function rawCall(
  req: AgentRequest,
  model: string
): Promise<AgentResponse> {
  const start = Date.now();
  try {
    const message = await client().messages.create({
      model,
      max_tokens: req.maxTokens ?? 2048,
      temperature: req.temperature ?? 0.4,
      system: req.systemPrompt,
      messages: [
        ...(req.context
          ? [{ role: "user" as const, content: `Context:\n${req.context}` }]
          : []),
        { role: "user", content: req.userInput },
      ],
    });

    const latencyMs = Date.now() - start;
    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return {
      text,
      provider: "anthropic",
      model: message.model,
      tokensIn: message.usage.input_tokens,
      tokensOut: message.usage.output_tokens,
      latencyMs,
      raw: message,
    };
  } catch (err: unknown) {
    const e = err as { message?: string };
    throw new ProviderUnavailable("anthropic", e.message ?? "Unknown error");
  }
}
