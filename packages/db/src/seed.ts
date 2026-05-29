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

const CEREBRAS_SEEDS = [
  { label: "cerebras-sermons", serviceClass: "sermons" },
  { label: "cerebras-chat", serviceClass: "chat" },
  { label: "cerebras-live", serviceClass: "live" },
  { label: "cerebras-phone", serviceClass: "phone" },
  { label: "cerebras-background", serviceClass: "background" },
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
  const environment =
    process.env.APP_ENV === "production" ||
    process.env.APP_ENV === "staging" ||
    process.env.APP_ENV === "preview"
      ? process.env.APP_ENV
      : "development";

  console.log("Seeding provider key labels ...");
  for (const seed of CEREBRAS_SEEDS) {
    await db
      .insert(providerKeys)
      .values({
        provider: "cerebras",
        keyLabel: seed.label,
        environment,
        serviceClass: seed.serviceClass,
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
        version: 1,
        status: "draft",
        title: slug
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" "),
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
