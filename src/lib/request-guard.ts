import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  key: string;
  retryAfterSeconds: number;
};

export function requestId(request: Request): string {
  return request.headers.get("x-request-id") ?? randomUUID();
}

export function clientIp(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? null;
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("fly-client-ip") ??
    null
  );
}

export function stableHash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function ipHash(ip: string | null): string | null {
  if (!ip) return null;
  const pepper = process.env.IP_HASH_PEPPER ?? process.env.PHONE_HASH_PEPPER;
  if (!pepper) return null;
  return stableHash(`${pepper}:${ip}`);
}

function pruneExpired(now: number): void {
  if (buckets.size < 2000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, key, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  return {
    ok: existing.count <= opts.limit,
    key,
    retryAfterSeconds,
  };
}

export function publicRateLimit(
  request: Request,
  action: string,
  opts: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const ip = clientIp(request);
  const hashedIp = ipHash(ip) ?? "no-ip";
  return rateLimit(`public:${action}:${hashedIp}`, {
    limit: opts.limit ?? 60,
    windowMs: opts.windowMs ?? 10 * 60 * 1000,
  });
}

export async function parseJsonBody<T>(
  request: Request,
  parser: (value: unknown) => T,
  maxBytes = 16_384,
): Promise<T | null> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > maxBytes) return null;
  try {
    return parser(await request.json());
  } catch {
    return null;
  }
}

export function rateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please wait a moment and try again." },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.retryAfterSeconds),
        "Cache-Control": "no-store",
      },
    },
  );
}

