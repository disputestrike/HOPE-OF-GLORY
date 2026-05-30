/**
 * Release preflight.
 *
 * Local/dev mode reports warnings without blocking. Production/strict mode
 * blocks on launch-critical failures:
 *
 *   pnpm preflight
 *   PREFLIGHT_STRICT=true pnpm preflight
 */
import postgres from "postgres";
import type { ReleaseReadinessCheck } from "@hog/shared";

type CheckResult = ReleaseReadinessCheck & { source?: "env" | "db" };

const checks: CheckResult[] = [];

function pushDb(status: CheckResult["status"], label: string, detail: string): void {
  checks.push({
    id: `db-${label.toLowerCase().replace(/\W+/g, "-")}`,
    label,
    status,
    detail,
    category: "foundation",
    requiredForLaunch: true,
    source: "db",
  });
}

async function testDb(url: string): Promise<void> {
  try {
    const client = postgres(url, {
      max: 1,
      connect_timeout: 5,
      ssl: process.env.DATABASE_SSL === "require" ? "require" : undefined,
    });
    const result = await client`SELECT 1 as ok`;
    if (result[0]?.ok === 1) pushDb("ok", "Database connectivity", "SELECT 1 succeeded.");
    else pushDb("fail", "Database connectivity", "Unexpected SELECT 1 result.");

    const extensions = await client`
      SELECT extname
      FROM pg_extension
      WHERE extname IN ('uuid-ossp', 'pgcrypto', 'vector')
    `;
    const installed = new Set(extensions.map((row) => row.extname as string));
    for (const ext of ["uuid-ossp", "pgcrypto", "vector"]) {
      pushDb(
        installed.has(ext) ? "ok" : "fail",
        `Postgres extension: ${ext}`,
        installed.has(ext) ? "Installed." : "Missing. Run pnpm db:migrate before launch.",
      );
    }
    await client.end();
  } catch (err) {
    pushDb("fail", "Database connectivity", err instanceof Error ? err.message : "Unknown database error.");
  }
}

function icon(status: CheckResult["status"]): string {
  if (status === "ok") return "OK";
  if (status === "warn") return "WARN";
  return "FAIL";
}

async function main(): Promise<void> {
  if (process.argv.includes("--strict")) process.env.PREFLIGHT_STRICT = "true";
  const { getReleaseReadiness } = await import("@hog/shared/index");
  checks.push(
    ...getReleaseReadiness().map((check) => ({
      ...check,
      source: "env" as const,
    })),
  );

  const dbUrl = process.env.DATABASE_URL;
  const realDbUrl =
    dbUrl &&
    !(
      dbUrl.includes("user:pass") ||
      dbUrl.includes("username:password") ||
      dbUrl.includes("@host") ||
      dbUrl.includes("host:5432") ||
      dbUrl.includes("database_name") ||
      dbUrl.includes("your_") ||
      dbUrl.includes("<")
    );
  if (realDbUrl) await testDb(dbUrl);

  console.log("\nHOPE OF GLORY - PREFLIGHT REPORT");
  console.log("=".repeat(72));
  for (const check of checks) {
    console.log(`${icon(check.status).padEnd(5)} ${check.label.padEnd(34)} ${check.detail}`);
  }
  console.log("=".repeat(72));

  const strict =
    process.env.APP_ENV === "production" ||
    process.env.PREFLIGHT_STRICT === "true" ||
    process.argv.includes("--strict");
  const failed = checks.filter((check) => check.status === "fail" && (strict || check.requiredForLaunch)).length;
  const warned = checks.filter((check) => check.status === "warn").length;
  console.log(`${checks.length} checks, ${failed} blocking, ${warned} warnings`);

  if (failed > 0) {
    console.error("\nPreflight failed. Fix the blocking release gates before launch.");
    process.exit(1);
  }

  console.log("\nPreflight completed.");
}

main().catch((err) => {
  console.error("Preflight crashed:", err);
  process.exit(2);
});
