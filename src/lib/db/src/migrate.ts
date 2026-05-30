/**
 * Runs Drizzle migrations against DATABASE_URL.
 * Invoked by `pnpm db:migrate` from repo root.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");

  const sql = postgres(url, {
    max: 1,
    ssl: process.env.DATABASE_SSL === "require" ? "require" : undefined,
  });
  const db = drizzle(sql);

  // Enable required extensions before migrations apply.
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;

  console.log("Running migrations from ./drizzle ...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");

  await sql.end();
}

main().catch((err: unknown) => {
  console.error("[migrate] Failed:", err);
  process.exit(1);
});
