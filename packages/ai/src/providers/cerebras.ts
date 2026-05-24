/**
 * Cerebras provider — OpenAI-compatible chat completions surface.
 * Used as the workhorse: high-volume mechanical drafting work.
 */
import OpenAI from "openai";
import { nextHealthyKey, cooldown, trackUsage } from "../key-pool";
import type { AgentRequest, AgentResponse } from "../types";
import { RateLimited, ProviderUnavailable } from "../types";

const BASE_URL = process.env.CEREBRAS_BASE_URL ?? "https://api.cerebras.ai/v1";
const DEFAULT_MODEL = "llama-3.3-70b";

export async function call(
  req: AgentRequest,
  model: string = DEFAULT_MODEL
): Promise<AgentResponse> {
  const key = await nextHealthyKey(req.serviceClass ?? "background");
  const client = new OpenAI({ apiKey: key.apiKey, baseURL: BASE_URL });
  const start = Date.now();

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: req.temperature ?? 0.4,
      max_tokens: req.maxTokens ?? 2048,
      messages: [
        { role: "system", content: req.systemPrompt },
        ...(req.context
          ? [{ role: "user" as const, content: `Context:\n${req.context}` }]
          : []),
        { role: "user", content: req.userInput },
      ],
    });

    const latencyMs = Date.now() - start;
    const text = completion.choices[0]?.message?.content ?? "";
    const tokensIn = completion.usage?.prompt_tokens ?? 0;
    const tokensOut = completion.usage?.completion_tokens ?? 0;

    await trackUsage(key, tokensIn + tokensOut, latencyMs);

    return {
      text,
      provider: "cerebras",
      model,
      tokensIn,
      tokensOut,
      latencyMs,
      raw: completion,
    };
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    if (e.status === 429) {
      const seconds = 30 + Math.floor(Math.random() * 30);
      await cooldown(key, seconds);
      throw new RateLimited("cerebras", key.label);
    }
    throw new ProviderUnavailable("cerebras", e.message ?? "Unknown error");
  }
}
