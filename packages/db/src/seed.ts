/**
 * Idempotent seed:
 *   - Provider key labels (5 Cerebras service classes)
 *   - Doctrine document slug placeholders (backfilled from docs/doctrine/*)
 *   - Baseline agent_runs prompt_version sentinel
 *
 * Safe to run multiple times.
 */
import { db, closeDb } from "./client";
import { providerKeys, doctrineDocuments } from "../schema";

const CEREBRAS_LABELS = [
  "cerebras-sermons",
  "cerebras-chat",
  "cerebras-live",
  "cerebras-phone",
  "cerebras-background",
] as const;

const DOCTRINE_SLUGS = [
  "statement-of-faith",
  "ministry-mission",
  "ai-boundaries",
  "original-language-policy",
  "revelation-policy",
  "apologetics-policy",
  "prayer-policy",
  "crisis-policy",
  "donation-ethics",
  "correction-policy",
  "disputed-doctrines",
] as const;

async function main(): Promise<void> {
  console.log("Seeding provider key labels ...");
  for (const label of CEREBRAS_LABELS) {
    await db
      .insert(providerKeys)
      .values({
        provider: "cerebras",
        keyLabel: label,
        environment: process.env.APP_ENV ?? "development",
        serviceClass: label.replace("cerebras-", ""),
        status: "active",
      })
      .onConflictDoNothing();
  }

  console.log("Seeding doctrine document slugs ...");
  for (const slug of DOCTRINE_SLUGS) {
    await db
      .insert(doctrineDocuments)
      .values({
        slug,
        version: "0.1.0",
        status: "draft",
        body: "",
        checksum: "",
      })
      .onConflictDoNothing();
  }

  console.log("Seed complete.");
  await closeDb();
}

main().catch(async (err: unknown) => {
  console.error("[seed] Failed:", err);
  await closeDb();
  process.exit(1);
});
