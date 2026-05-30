/**
 * Cerebras key pool — service-class isolation, NOT rate-limit evasion.
 *
 * Each Cerebras key is dedicated to a single service class to provide
 * isolation, telemetry separation, and graceful failover. Rate limits
 * are respected: 429s trigger compliant cooldown + queueing.
 *
 * See: docs/doctrine/ai-boundaries.md and MASTER-PLAN.md for the policy.
 */
import { createClient, type RedisClientType } from "redis";
import type { ServiceClass } from "./types";

export type KeyHealth = {
  label: string;
  apiKey: string;
  serviceClass: ServiceClass;
  cooldownUntil: number;
  errors: number;
};

const ENV: Record<ServiceClass, string> = {
  sermons: "CEREBRAS_KEY_SERMONS",
  chat: "CEREBRAS_KEY_CHAT",
  live: "CEREBRAS_KEY_LIVE",
  phone: "CEREBRAS_KEY_PHONE",
  background: "CEREBRAS_KEY_BACKGROUND",
};

let _redis: RedisClientType | null = null;
function redis(): RedisClientType | null {
  if (!process.env.REDIS_URL) return null;
  if (!_redis) {
    _redis = createClient({ url: process.env.REDIS_URL });
    _redis.on("error", (err) => console.error("[key-pool] redis error", err));
    _redis.connect().catch((err) => console.error("[key-pool] redis connect", err));
  }
  return _redis;
}

function load(sc: ServiceClass): KeyHealth {
  return {
    label: `cerebras-${sc}`,
    apiKey: process.env[ENV[sc]] ?? "",
    serviceClass: sc,
    cooldownUntil: 0,
    errors: 0,
  };
}

const pool: Record<ServiceClass, KeyHealth> = {
  sermons: load("sermons"),
  chat: load("chat"),
  live: load("live"),
  phone: load("phone"),
  background: load("background"),
};

/**
 * Returns the healthy key for the requested service class.
 * Falls back to other healthy keys if the primary is in cooldown.
 * Throws if all keys are unhealthy — caller should queue.
 */
export async function nextHealthyKey(
  serviceClass: ServiceClass = "background"
): Promise<KeyHealth> {
  const now = Date.now();
  const primary = pool[serviceClass];
  if (primary.apiKey && primary.cooldownUntil <= now) return primary;

  for (const key of Object.values(pool)) {
    if (key.apiKey && key.cooldownUntil <= now) return key;
  }

  throw new Error("No healthy Cerebras keys available — queue or escalate to premium");
}

export async function cooldown(key: KeyHealth, seconds: number): Promise<void> {
  key.cooldownUntil = Date.now() + seconds * 1000;
  key.errors += 1;

  const r = redis();
  if (r?.isReady) {
    await r.set(`hog:cerebras:cooldown:${key.label}`, String(key.cooldownUntil), {
      EX: seconds,
    });
  }
}

export async function trackUsage(
  key: KeyHealth,
  tokens: number,
  latencyMs: number
): Promise<void> {
  const r = redis();
  if (!r?.isReady) return;
  const minute = Math.floor(Date.now() / 60_000);
  await r.incrBy(`hog:cerebras:tokens:${key.label}:${minute}`, tokens);
  await r.expire(`hog:cerebras:tokens:${key.label}:${minute}`, 120);
  await r.incr(`hog:cerebras:requests:${key.label}:${minute}`);
  await r.expire(`hog:cerebras:requests:${key.label}:${minute}`, 120);
  await r.lPush(`hog:cerebras:latency:${key.label}`, String(latencyMs));
  await r.lTrim(`hog:cerebras:latency:${key.label}`, 0, 199);
}

export function inspectPool(): KeyHealth[] {
  return Object.values(pool).map((k) => ({ ...k, apiKey: k.apiKey ? "***" : "" }));
}
