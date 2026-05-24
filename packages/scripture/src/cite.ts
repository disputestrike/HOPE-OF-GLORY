/**
 * Citation validator — prevents invented Bible verses.
 *
 * Used by:
 *   - Sermon Agent (before publish)
 *   - Q&A Agent (before send)
 *   - Apologetics Agent (before reply)
 *
 * Strategy:
 *   1. Extract all references from generated text.
 *   2. For each, verify the verse exists in scripture_passages.
 *   3. If any reference is hallucinated, flag for review.
 */
import { parseReference, getVerses } from "./lookup";
import type { DB } from "@hog/db";

const REFERENCE_PATTERN =
  /([1-3]?\s?[A-Za-z][A-Za-z\s']+?\s+\d+(?::\d+(?:[\-–]\d+)?)?)/g;

export type CitationCheck = {
  reference: string;
  valid: boolean;
  reason?: string;
};

export async function validateCitations(
  db: DB,
  text: string
): Promise<{ valid: boolean; checks: CitationCheck[] }> {
  const matches = text.match(REFERENCE_PATTERN) ?? [];
  // Filter out false positives (e.g. "page 12", "1 of 3", common phrasings)
  const candidates = matches.filter((m) => {
    const parsed = parseReference(m.trim());
    return parsed !== null;
  });

  const checks: CitationCheck[] = [];
  for (const candidate of candidates) {
    const parsed = parseReference(candidate.trim());
    if (!parsed) {
      checks.push({ reference: candidate, valid: false, reason: "Unparseable" });
      continue;
    }
    const verses = await getVerses(db, parsed);
    if (verses.length === 0) {
      checks.push({
        reference: candidate,
        valid: false,
        reason: "Reference not found in WEB translation",
      });
    } else {
      checks.push({ reference: candidate, valid: true });
    }
  }
  return { valid: checks.every((c) => c.valid), checks };
}
