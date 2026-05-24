/**
 * Hope of Glory worker — runs background jobs:
 *   - Daily sermon generation cron (6 AM CT)
 *   - Doctrine Agent gating
 *   - Posting Agent + Postiz publishing
 *   - Engagement Agent comment/DM ingestion
 *   - Translation Agent (Phase 12)
 *
 * Entry point. Wires schedules, queues, and graceful shutdown.
 */
import { closeDb } from "@hog/db";
import { runDoctrineGate } from "./agents/doctrine";

const VERSION = process.env.APP_VERSION ?? "0.1.0";

async function main(): Promise<void> {
  console.log(`[worker] starting Hope of Glory worker v${VERSION}`);
  console.log(`[worker] env=${process.env.APP_ENV ?? "development"}`);

  // Phase 1: smoke test — verify provider keys + DB reachable.
  // Phase 2+: register cron jobs for sermon engine, social, email.
  console.log("[worker] Phase 1 smoke check: doctrine gate on test input");
  try {
    const verdict = await runDoctrineGate({
      content: "Jesus Christ is the Son of God, fully divine and fully human, who died for our sins and rose again.",
      agentName: "smoke-test",
      taskType: "sermon_verify",
    });
    console.log("[worker] doctrine gate verdict:", verdict.verdict, "score:", verdict.score);
  } catch (err) {
    console.error("[worker] doctrine gate smoke failed:", err);
  }

  console.log("[worker] ready. Cron + queue registration arrives in Phase 2.");
}

async function shutdown(signal: string): Promise<void> {
  console.log(`[worker] received ${signal}, shutting down...`);
  await closeDb();
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

main().catch((err) => {
  console.error("[worker] fatal:", err);
  process.exit(1);
});
