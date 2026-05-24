/**
 * PII redaction — strips emails, phone numbers, addresses, SSN-like
 * numbers before sending prayer transcripts or chat logs to external
 * verifier providers.
 *
 * From docs/doctrine/ai-boundaries.md: prayer content is sacred trust.
 */

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE =
  /(?:\+?1[\s.-]?)?\(?([2-9][0-9]{2})\)?[\s.-]?([2-9][0-9]{2})[\s.-]?([0-9]{4})\b/g;
const SSN_RE = /\b\d{3}-\d{2}-\d{4}\b/g;
const URL_RE = /https?:\/\/[^\s)]+/g;
const ADDRESS_HINT_RE =
  /\b\d{1,5}\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct)\b/g;

export function redactPii(text: string): string {
  return text
    .replace(EMAIL_RE, "[email redacted]")
    .replace(PHONE_RE, "[phone redacted]")
    .replace(SSN_RE, "[ssn redacted]")
    .replace(ADDRESS_HINT_RE, "[address redacted]")
    .replace(URL_RE, "[url redacted]");
}

/**
 * Hash a phone number for caller_hash storage.
 * Pure function — actual SHA-256 happens server-side using
 * subtle.digest or node:crypto. This function normalizes only.
 */
export function normalizePhoneForHash(raw: string): string {
  return raw.replace(/[^\d]/g, "").replace(/^1(\d{10})$/, "$1");
}
