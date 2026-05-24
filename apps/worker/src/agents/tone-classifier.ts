/**
 * Tone classifier. Fast, Cerebras-driven. Runs on every apologetics draft
 * before it can be displayed in a live broadcast. Increments a redis-tracked
 * rejection counter — the live debate room cannot open until ≥ 200 attack-mode
 * drafts have been rejected (proves the classifier is doing real work).
 */
import { route, type AgentRequest } from "@hog/ai";
import { createClient, type RedisClientType } from "redis";

let _redis: RedisClientType | null = null;
function redis(): RedisClientType | null {
  if (!process.env.REDIS_URL) return null;
  if (!_redis) {
    _redis = createClient({ url: process.env.REDIS_URL });
    _redis.on("error", () => undefined);
    _redis.connect().catch(() => undefined);
  }
  return _redis;
}

export type ToneResult = {
  tone: "charitable" | "firm" | "mocking" | "dismissive" | "aggressive" | "defensive";
  confidence: number;
  suggestion?: string;
};

const SYSTEM = `You classify the tone of an apologetics response.
Return JSON only:
{
  "tone": "charitable" | "firm" | "mocking" | "dismissive" | "aggressive" | "defensive",
  "confidence": number between 0 and 1,
  "suggestion": optional string with how to rewrite
}

- "charitable" = warm, respectful, steel-mans the other view
- "firm" = clear and direct without insult
- "mocking" = ridicules the other side
- "dismissive" = waves off the question
- "aggressive" = attacks the questioner
- "defensive" = sounds threatened or anxious

Only "charitable" and "firm" pass for public publishing.`;

export async function classifyTone(text: string): Promise<ToneResult> {
  const req: AgentRequest = {
    taskType: "engagement_classify",
    agentName: "tone-classifier",
    serviceClass: "background",
    risk: "low",
    systemPrompt: SYSTEM,
    userInput: text,
    temperature: 0.1,
    maxTokens: 200,
  };
  const response = await route(req);
  const m = response.text.match(/(\{[\s\S]*\})/);
  if (!m?.[1]) return { tone: "defensive", confidence: 0 };
  try {
    return JSON.parse(m[1]) as ToneResult;
  } catch {
    return { tone: "defensive", confidence: 0 };
  }
}

export async function recordRejection(reason: string): Promise<void> {
  const r = redis();
  if (!r?.isReady) return;
  await r.incr("hog:tone:rejected:count");
  await r.lPush("hog:tone:rejected:reasons", reason);
  await r.lTrim("hog:tone:rejected:reasons", 0, 999);
}

export async function getRejectionCount(): Promise<number> {
  const r = redis();
  if (!r?.isReady) return 0;
  const val = await r.get("hog:tone:rejected:count");
  return Number(val ?? "0");
}
