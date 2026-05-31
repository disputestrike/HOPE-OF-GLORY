/**
 * OpenAI provider — used for:
 *   - Structured verification (medium-risk fallback)
 *   - Embeddings (text-embedding-3-small at 1536 dims)
 *
 * Privacy: all completion calls use store-equivalent (no training; we do not
 * persist user content with OpenAI). For sensitive content (prayer, crisis,
 * counsel), prefer Anthropic (zero-data-retention path).
 */
import OpenAI from "openai";
import type { AgentRequest, AgentResponse } from "../types";
import { ProviderUnavailable } from "../types";
import { withBudget } from "../budget";

const DEFAULT_MODEL = "gpt-4.1-mini";
const EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";

let _client: OpenAI | null = null;
function client(): OpenAI {
  if (_client) return _client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new ProviderUnavailable("openai", "OPENAI_API_KEY not set");
  _client = new OpenAI({ apiKey: key });
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
    const response = await client().chat.completions.create({
      model,
      temperature: req.temperature ?? 0.3,
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
    const text = response.choices[0]?.message?.content ?? "";

    return {
      text,
      provider: "openai",
      model: response.model,
      tokensIn: response.usage?.prompt_tokens ?? 0,
      tokensOut: response.usage?.completion_tokens ?? 0,
      latencyMs,
      raw: response,
    };
  } catch (err: unknown) {
    const e = err as { message?: string };
    throw new ProviderUnavailable("openai", e.message ?? "Unknown error");
  }
}

export async function embed(text: string): Promise<number[]> {
  const r = await client().embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return r.data[0]?.embedding ?? [];
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const r = await client().embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return r.data.map((d) => d.embedding);
}
