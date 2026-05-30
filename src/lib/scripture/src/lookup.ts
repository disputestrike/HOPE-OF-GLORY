/**
 * Scripture reference parser + lookup.
 *
 * Parses references like:
 *   "John 3:16"
 *   "1 Cor 13:1-13"
 *   "Hab 2:14"
 *   "Psalm 23"
 *
 * Then looks up the verse text from the scripture_passages table (WEB translation).
 */
import { sql } from "drizzle-orm";
import type { DB } from "@hog/db";
import { findBook, type Book } from "./books";

export type ParsedReference = {
  book: Book;
  chapter: number;
  verseStart: number | null;
  verseEnd: number | null;
};

const REF_REGEX = /^([1-3]?\s?[A-Za-z][A-Za-z\s']+?)\s+(\d+)(?:[:.](\d+)(?:[\-–](\d+))?)?$/;

export function parseReference(input: string): ParsedReference | null {
  const cleaned = input.trim().replace(/\s+/g, " ");
  const match = REF_REGEX.exec(cleaned);
  if (!match) return null;
  const [, bookStr, chapterStr, verseStartStr, verseEndStr] = match;
  if (!bookStr || !chapterStr) return null;

  const book = findBook(bookStr);
  if (!book) return null;

  return {
    book,
    chapter: Number.parseInt(chapterStr, 10),
    verseStart: verseStartStr ? Number.parseInt(verseStartStr, 10) : null,
    verseEnd: verseEndStr
      ? Number.parseInt(verseEndStr, 10)
      : verseStartStr
        ? Number.parseInt(verseStartStr, 10)
        : null,
  };
}

export type Verse = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
};

export async function getVerses(
  db: DB,
  ref: ParsedReference,
  translation = "WEB"
): Promise<Verse[]> {
  const rows = await db.execute<{
    book: string;
    chapter: number;
    verse: number;
    text: string;
    translation: string;
  }>(sql`
    SELECT book, chapter, verse, text, translation
    FROM scripture_passages
    WHERE book = ${ref.book.canonical}
      AND chapter = ${ref.chapter}
      ${ref.verseStart !== null ? sql`AND verse >= ${ref.verseStart}` : sql``}
      ${ref.verseEnd !== null ? sql`AND verse <= ${ref.verseEnd}` : sql``}
      AND translation = ${translation}
    ORDER BY verse ASC
  `);
  return rows;
}

export function formatReference(ref: ParsedReference): string {
  let s = `${ref.book.canonical} ${ref.chapter}`;
  if (ref.verseStart !== null) {
    s += `:${ref.verseStart}`;
    if (ref.verseEnd !== null && ref.verseEnd !== ref.verseStart) {
      s += `-${ref.verseEnd}`;
    }
  }
  return s;
}
