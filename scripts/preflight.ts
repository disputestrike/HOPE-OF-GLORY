/**
 * Preflight check — run before deploy to verify environment + connectivity.
 *
 *   pnpm preflight
 *
 * Exits with code 0 if everything is healthy, 1 if anything is broken.
 * Designed to be run in CI or right before `pnpm dev` the first time.
 */
import postgres from "postgres";

type CheckResult = { name: string; status: "ok" | "warn" | "fail"; detail: string };

const checks: CheckResult[] = [];

function pushOk(name: string, detail: string): void {
  checks.push({ name, status: "ok", detail });
}
function pushWarn(name: string, detail: string): void {
  checks.push({ name, status: "warn", detail });
}
function pushFail(name: string, detail: string): void {
  checks.push({ name, status: "fail", detail });
}

function requireEnv(name: string): string | undefined {
  const v = process.env[name];
  if (!v || v.trim().length === 0) {
    pushFail(name, "missing");
    return undefined;
  }
  pushOk(name, `set (${v.length} chars)`);
  return v;
}

function optionalEnv(name: string, fallback?: string): string | undefined {
  const v = process.env[name];
  if (!v || v.trim().length === 0) {
    pushWarn(name, fallback ? `unset (will use default: ${fallback})` : "unset (feature degrades)");
    return fallback;
  }
  pushOk(name, `set`);
  return v;
}

// ---- App ----
requireEnv("NEXT_PUBLIC_SITE_URL");
requireEnv("APP_ENV");

// ---- Database ----
const dbUrl = requireEnv("DATABASE_URL");

// ---- Redis (used by key pool cooldown + cron tracking) ----
optionalEnv("REDIS_URL");

// ---- Auth ----
requireEnv("AUTH_SECRET");
requireEnv("GOOGLE_CLIENT_ID");
requireEnv("GOOGLE_CLIENT_SECRET");
const adminEmails = requireEnv("ADMIN_EMAILS");
if (adminEmails && !adminEmails.includes("@")) {
  pushFail("ADMIN_EMAILS", "must contain at least one email address");
}

// ---- AI providers ----
const cerebrasKeys = [
  "CEREBRAS_KEY_SERMONS",
  "CEREBRAS_KEY_CHAT",
  "CEREBRAS_KEY_LIVE",
  "CEREBRAS_KEY_PHONE",
  "CEREBRAS_KEY_BACKGROUND",
];
let cerebrasSet = 0;
for (const key of cerebrasKeys) {
  if (process.env[key]) cerebrasSet += 1;
}
if (cerebrasSet === 0) {
  pushFail("CEREBRAS_KEY_*", "no Cerebras keys set — workhorse provider unavailable");
} else if (cerebrasSet < 5) {
  pushWarn("CEREBRAS_KEY_*", `only ${cerebrasSet}/5 service classes have keys`);
} else {
  pushOk("CEREBRAS_KEY_*", "all 5 service classes configured");
}
requireEnv("ANTHROPIC_API_KEY");
requireEnv("OPENAI_API_KEY");

// ---- Voice / Phone (Phase 9 — may be empty until launch) ----
optionalEnv("SIGNALWIRE_PROJECT_ID");
optionalEnv("SIGNALWIRE_TOKEN");
optionalEnv("SIGNALWIRE_SPACE_URL");
optionalEnv("SIGNALWIRE_PHONE_NUMBER");
optionalEnv("DEEPGRAM_API_KEY");
const pepper = process.env.PHONE_HASH_PEPPER;
if (!pepper || pepper === "change_me_to_a_64_char_random_string") {
  pushFail(
    "PHONE_HASH_PEPPER",
    "still set to the placeholder — generate a real 64-char random string before storing any caller hashes"
  );
} else if (pepper.length < 32) {
  pushWarn("PHONE_HASH_PEPPER", "shorter than 32 chars — recommend 64+ random chars");
} else {
  pushOk("PHONE_HASH_PEPPER", `set (${pepper.length} chars)`);
}

// ---- Distribution (Phase 4+) ----
optionalEnv("POSTIZ_URL");
optionalEnv("POSTIZ_API_KEY");
optionalEnv("YOUTUBE_OAUTH_CLIENT_ID");
optionalEnv("YOUTUBE_REFRESH_TOKEN");

// ---- Email ----
optionalEnv("RESEND_API_KEY");
optionalEnv("EMAIL_FROM");

// ---- Media generation ----
optionalEnv("FAL_API_KEY");
optionalEnv("RUNWAY_API_KEY");

// ---- Storage ----
optionalEnv("S3_BUCKET");
optionalEnv("S3_REGION");
optionalEnv("S3_ACCESS_KEY_ID");

// ---- Donations (Phase 10) ----
optionalEnv("PAYPAL_CLIENT_ID");
optionalEnv("PAYPAL_WEBHOOK_ID");

// ---- Monitoring ----
optionalEnv("SENTRY_DSN");

// ---- Cron secret ----
optionalEnv("CRON_SECRET");

// ---- DB connectivity ----
async function testDb(url: string): Promise<void> {
  try {
    const sql = postgres(url, {
      max: 1,
      connect_timeout: 5,
      ssl: process.env.DATABASE_SSL === "require" ? "require" : undefined,
    });
    const result = await sql`SELECT 1 as ok`;
    if (result[0]?.ok === 1) pushOk("Database connectivity", "SELECT 1 succeeded");
    else pushFail("Database connectivity", "unexpected result");
    // Check extensions
    const exts = await sql`SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp','pgcrypto','vector')`;
    const found = exts.map((e) => e.extname as string);
    const required = ["uuid-ossp", "pgcrypto", "vector"];
    for (const ext of required) {
      if (found.includes(ext)) pushOk(`pg extension: ${ext}`, "installed");
      else pushFail(`pg extension: ${ext}`, "missing — run pnpm db:migrate");
    }
    await sql.end();
  } catch (err) {
    pushFail("Database connectivity", err instanceof Error ? err.message : "Unknown");
  }
}

// ---- Render ----
async function main(): Promise<void> {
  if (dbUrl) await testDb(dbUrl);

  console.log("\n┌─ HOPE OF GLORY — PREFLIGHT REPORT ─────────────────────────────");
  for (const c of checks) {
    const icon = c.status === "ok" ? "✓" : c.status === "warn" ? "⚠" : "✗";
    const color =
      c.status === "ok"
        ? "\x1b[32m"
        : c.status === "warn"
          ? "\x1b[33m"
          : "\x1b[31m";
    console.log(`│ ${color}${icon}\x1b[0m  ${c.name.padEnd(38)} ${c.detail}`);
  }
  const failed = checks.filter((c) => c.status === "fail").length;
  const warned = checks.filter((c) => c.status === "warn").length;
  console.log(`└─ ${checks.length} checks · ${failed} failed · ${warned} warnings\n`);

  if (failed > 0) {
    console.error(`\n❌ Preflight failed. Fix the ${failed} ✗ items before continuing.\n`);
    process.exit(1);
  }
  if (warned > 0) {
    console.log(`\n⚠ Preflight passed with ${warned} warnings. Review before launch.\n`);
  } else {
    console.log(`\n✓ Preflight green. Cleared for takeoff.\n`);
  }
}

main().catch((err) => {
  console.error("Preflight crashed:", err);
  process.exit(2);
});
