/**
 * Scripture verse lookup for the hover/tap popover.
 *
 * The verse text comes from src/data/web-verses.json, which is built by
 * `pnpm verses:build` (scripts/build-verse-bundle.ts) by fetching the REAL
 * World English Bible (WEB) text from a public-domain source. We never type
 * verse text by hand — that would risk the exact hallucination problem the
 * popover exists to prevent. Only references with verified WEB text get a
 * popover; anything uncached degrades to a "read full passage" link.
 */
import versesData from "@/data/web-verses.json";

export type VerseEntry = { reference: string; text: string };

const VERSES = versesData as Record<string, VerseEntry>;

/** Canonical lookup key — lowercased, single-spaced, dashes normalized. */
export function normalizeRef(reference: string): string {
  return reference
    .toLowerCase()
    .replace(/[‒–—―]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/** The verified WEB text for a reference, or null if not in the bundle. */
export function getVerseText(reference: string): VerseEntry | null {
  return VERSES[normalizeRef(reference)] ?? null;
}

/** A public WEB reader for "read full passage" / uncached fallback. */
export function webReaderUrl(reference: string): string {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(
    reference,
  )}&version=WEB`;
}
