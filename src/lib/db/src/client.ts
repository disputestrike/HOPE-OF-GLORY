import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("[@hog/db] DATABASE_URL is required");
}

// Postgres connection pool — keep tight, idle releases fast.
const queryClient = postgres(url, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: process.env.DATABASE_SSL === "require" ? "require" : undefined,
  prepare: false,
});

export const db = drizzle(queryClient, { schema, logger: false });
export type DB = typeof db;

/**
 * Gracefully close the pool. Call from worker shutdown hooks.
 */
export async function closeDb(): Promise<void> {
  await queryClient.end({ timeout: 5 });
}
