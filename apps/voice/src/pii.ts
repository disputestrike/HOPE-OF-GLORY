/**
 * PII handling for the Hope Line. RAW PHONE NUMBERS ARE NEVER PERSISTED.
 * Only the SHA-256 caller hash is stored. Pepper rotates per docs/db/ARCHITECTURE.md.
 */
import { createHash } from "node:crypto";
import { normalizePhoneForHash } from "@hog/safety";

export function hashCaller(phoneE164: string): string {
  const pepper = process.env.PHONE_HASH_PEPPER ?? "";
  if (!pepper) {
    throw new Error("PHONE_HASH_PEPPER is required to hash caller numbers");
  }
  const normalized = normalizePhoneForHash(phoneE164);
  return createHash("sha256").update(`${normalized}:${pepper}`).digest("hex");
}
