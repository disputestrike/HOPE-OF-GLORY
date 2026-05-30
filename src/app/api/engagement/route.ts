/**
 * POST /api/engagement
 *
 * Records a public reaction (Amen / Helpful / Save / Share / Download) to
 * a piece of ministry content. Anonymous or authenticated.
 *
 * Valid requests return `{ ok: true }`. Persistence failures degrade
 * gracefully: a missing DB or Redis still yields ok=true, with a server
 * log entry for ops, so public reactions never break content pages.
 *
 * Privacy:
 *   - `anon_key` is an opaque uuid bound to the `hog_session` cookie.
 *   - `ip_hash` is salted SHA-256 (IP + IP_HASH_PEPPER), never raw IP.
 *   - We never write Authorization tokens or user-agents into this row.
 */
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { randomUUID, createHash } from "node:crypto";
import { auth } from "../../../../auth";
import { optionalDb } from "@/lib/server-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TARGET_TYPES = ["sermon", "article", "journey_day", "message"] as const;
const ACTIONS = ["amen", "helpful", "save", "share", "download"] as const;
const TARGET_ID_PATTERN = /^[a-z0-9][a-z0-9/_-]{0,199}$/i;
const MAX_BODY_BYTES = 2048;

const RequestSchema = z
  .object({
    targetType: z.enum(TARGET_TYPES),
    targetId: z.string().trim().min(1).max(200).regex(TARGET_ID_PATTERN),
    action: z.enum(ACTIONS),
  })
  .strict();

const RATE_LIMIT_WINDOW_SECONDS = 600; // 10 minutes
const RATE_LIMIT_MAX = 30;

type EngagementDb = typeof import("@hog/db").db;

let dbClientPromise: Promise<EngagementDb | null> | null = null;

async function getDb(): Promise<EngagementDb | null> {
  try {
    dbClientPromise ??= optionalDb("engagement");
    return await dbClientPromise;
  } catch (err) {
    dbClientPromise = null;
    console.warn("[engagement] db unavailable:", err);
    return null;
  }
}

/**
 * Salted SHA-256 of the client IP. Uses IP_HASH_PEPPER when configured,
 * falling back to PHONE_HASH_PEPPER to match the secret-set documented
 * in migrations-plan.md section 5 (both peppers are seeded together in prod).
 */
function ipHash(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const pepper =
    process.env.IP_HASH_PEPPER ?? process.env.PHONE_HASH_PEPPER ?? "";
  if (!pepper) return null;
  return createHash("sha256").update(`${pepper}:${ip}`).digest("hex");
}

function stableHash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function isUuid(value: string | undefined): value is string {
  return !!value && z.string().uuid().safeParse(value).success;
}

/**
 * Best-effort client IP extraction. Trusts x-forwarded-for in deployment
 * environments behind a reverse proxy (Vercel / Railway / Cloudflare).
 */
function getClientIp(h: Pick<Headers, "get">): string | null {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? null;
  return (
    h.get("x-real-ip") ??
    h.get("cf-connecting-ip") ??
    h.get("fly-client-ip") ??
    null
  );
}

/**
 * Redis-backed sliding-window-ish counter. Mirrors the lazy connection
 * pattern in packages/ai/src/key-pool.ts. Returns true if allowed.
 * Graceful degradation: if Redis isn't configured or is unreachable,
 * we allow the request through (no rate-limit).
 */
type MinimalRedis = {
  isReady: boolean;
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<unknown>;
};

let _rl: MinimalRedis | null = null;
let _rlConnecting: Promise<void> | null = null;

async function rlClient(): Promise<MinimalRedis | null> {
  if (!process.env.REDIS_URL) return null;
  if (_rl?.isReady) return _rl;
  if (_rlConnecting) {
    await _rlConnecting;
    return _rl;
  }
  try {
    const { createClient } = await import("redis");
    const client = createClient({ url: process.env.REDIS_URL });
    client.on("error", (err: unknown) =>
      console.warn("[engagement] redis error:", err),
    );
    _rlConnecting = client.connect().then(() => {
      _rl = client as unknown as MinimalRedis;
    });
    await _rlConnecting;
    _rlConnecting = null;
    return _rl;
  } catch (err) {
    console.warn("[engagement] redis unavailable:", err);
    _rlConnecting = null;
    return null;
  }
}

async function withinRateLimit(key: string): Promise<boolean> {
  try {
    const r = await rlClient();
    if (!r?.isReady) return true; // graceful: allow when no rate-limiter
    const bucketKey = `hog:engagement:rl:${key}`;
    const count = await r.incr(bucketKey);
    if (count === 1) {
      await r.expire(bucketKey, RATE_LIMIT_WINDOW_SECONDS);
    }
    return count <= RATE_LIMIT_MAX;
  } catch (err) {
    console.warn("[engagement] rate-limit check failed:", err);
    return true;
  }
}

async function withinRateLimits(keys: string[]): Promise<boolean> {
  const results = await Promise.all(keys.map((key) => withinRateLimit(key)));
  return results.every(Boolean);
}

async function parseBody(
  request: Request,
): Promise<z.infer<typeof RequestSchema> | null> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return null;
  }

  try {
    const parsed = RequestSchema.safeParse(await request.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

async function ensureAnonKey(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get("hog_session")?.value;
  if (isUuid(existing)) return existing;
  const fresh = randomUUID();
  jar.set("hog_session", fresh, {
    httpOnly: true,
    secure: process.env.APP_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return fresh;
}

export async function POST(request: Request) {
  // 1) Parse + validate
  const body = await parseBody(request);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // 2) Identity
  const hasAuthSecret = Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
  const session = hasAuthSecret ? await auth().catch(() => null) : null;
  const userEmail = session?.user?.email ?? null;
  const anonKey = await ensureAnonKey();

  // 3) IP hash
  const h = await headers();
  const ip = getClientIp(h);
  const ipH = ipHash(ip);

  // 4) Rate-limit
  const rlKeys = [
    userEmail
      ? `user:${stableHash(userEmail.toLowerCase())}`
      : `anon:${anonKey}`,
    ipH ? `ip:${ipH}` : null,
  ].filter((key): key is string => Boolean(key));
  const allowed = await withinRateLimits(rlKeys);
  if (!allowed) {
    return NextResponse.json({ ok: true });
  }

  const database = await getDb();
  if (!database) {
    return NextResponse.json({ ok: true });
  }

  // 5) Resolve authenticated user_id (best-effort lookup by email).
  let userId: string | null = null;
  if (userEmail) {
    try {
      const rows = await database.execute<{ id: string }>(sql`
        SELECT id FROM users WHERE email = ${userEmail} LIMIT 1
      `);
      userId = rows[0]?.id ?? null;
    } catch (err) {
      console.warn("[engagement] user lookup failed:", err);
    }
  }

  // 6) Insert. Idempotent for authenticated and anonymous actors via
  //    partial unique indexes; if migration is absent, this still fails soft.
  try {
    await database.execute(sql`
      INSERT INTO engagements (
        target_type, target_id, action, user_id, anon_key, ip_hash
      )
      VALUES (
        ${body.targetType}::engagement_target_type,
        ${body.targetId},
        ${body.action}::engagement_action,
        ${userId},
        ${userId ? null : anonKey},
        ${ipH}
      )
      ON CONFLICT DO NOTHING
    `);
  } catch (err) {
    console.warn("[engagement] insert failed:", err);
  }

  return NextResponse.json({ ok: true });
}
