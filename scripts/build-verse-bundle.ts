/**
 * Build src/data/web-verses.json — the verified WEB verse-text bundle that
 * powers the ScriptureRef hover/tap popover.
 *
 * Collects every scripture reference used across the site's data, then
 * assembles the REAL World English Bible text for each by fetching whole
 * CHAPTERS from getBible v2 (public domain, translation=web) and slicing the
 * requested verses locally. Chapter fetches are cached on disk
 * (.verse-cache/) so re-runs are instant and resumable.
 *
 *   pnpm verses:build
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { normalizeRef } from "@/lib/verses";
import { BOOKS, findBook } from "@hog/scripture";
import { SCROLL_TOPICS } from "@/data/scroll-topics";
import { HUBS } from "@/data/read-library";
import { FORTY_DAY_JOURNEY } from "@/data/forty-day-journey";
import { HURTING_HEART_JOURNEY } from "@/data/thirty-day-hurting-heart";
import { HELP_TOPICS } from "@/data/help-topics";
import { LAUNCH_SERMONS } from "@/data/launch-schedule";

const EXTRA = [
  "Habakkuk 2:14", "Psalm 72:19", "Colossians 1:27", "John 14:6", "2 Corinthians 9:7",
  "Revelation 7:9-10", "John 8:24", "John 8:58", "John 8:28", "John 13:19", "John 18:5-6",
  "Deuteronomy 32:39", "Isaiah 43:10", "Isaiah 43:11", "Isaiah 41:4", "Isaiah 44:6",
  "Isaiah 48:12", "Isaiah 46:4", "Isaiah 45:22-23", "Isaiah 52:6", "Exodus 3:14",
  "Matthew 5:17-18", "Luke 24:27", "Luke 24:44-47", "John 10:35", "Isaiah 40:8",
  "Matthew 24:35", "1 Peter 1:24-25", "Luke 1:1-4", "Acts 26:26", "1 Corinthians 15:3-8",
  "Psalm 119:160", "John 19:35", "2 Peter 1:16", "2 Timothy 3:16-17", "John 5:39",
  "Acts 4:12", "Romans 10:9", "John 3:16", "Ephesians 2:8-9", "Mark 12:29",
  "Deuteronomy 6:4", "Philippians 2:9-11", "Hebrews 1:10", "Revelation 1:17-18",
  "John 1:1", "John 1:3", "John 20:28", "Mark 14:62", "Romans 3:23", "Romans 6:23",
  "Psalm 34:18", "Jeremiah 29:13", "1 Corinthians 8:6",
];

function collect(): string[] {
  const set = new Set<string>();
  const add = (r?: string | null) => {
    if (r && r.trim()) set.add(r.trim());
  };
  SCROLL_TOPICS.forEach((t) => t.keyScriptures?.forEach(add));
  Object.values(HUBS).forEach((h) =>
    h.articles.forEach((a) => a.keyScriptures?.forEach((s) => add(s.ref))),
  );
  FORTY_DAY_JOURNEY.forEach((d) => add(d.scriptureRef));
  HURTING_HEART_JOURNEY.forEach((d) => add(d.scriptureRef));
  Object.values(HELP_TOPICS).forEach((t) => t.scriptures?.forEach((s) => add(s.ref)));
  LAUNCH_SERMONS.forEach((s) => add(s.primaryPassage));
  EXTRA.forEach(add);
  return [...set];
}

const OUT = join(process.cwd(), "src/data/web-verses.json");
const CACHE_DIR = join(process.cwd(), ".verse-cache");

const BOOK_NR = new Map<string, number>();
BOOKS.forEach((b, i) => BOOK_NR.set(b.canonical, i + 1));

type Verse = { verse: number; text: string };
const chapterMem = new Map<string, Verse[] | null>();

async function getChapter(bookNr: number, chapter: number): Promise<Verse[] | null> {
  const key = `${bookNr}-${chapter}`;
  if (chapterMem.has(key)) return chapterMem.get(key) ?? null;
  const cacheFile = join(CACHE_DIR, `${key}.json`);
  if (existsSync(cacheFile)) {
    const v = JSON.parse(readFileSync(cacheFile, "utf8")) as Verse[];
    chapterMem.set(key, v);
    return v;
  }
  const url = `https://api.getbible.net/v2/web/${bookNr}/${chapter}.json`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = (await res.json()) as { verses?: Array<{ verse: number; text: string }> };
        const verses = (data.verses ?? []).map((v) => ({
          verse: v.verse,
          text: v.text.replace(/\s+/g, " ").trim(),
        }));
        writeFileSync(cacheFile, JSON.stringify(verses));
        chapterMem.set(key, verses);
        await sleep(220);
        return verses;
      }
    } catch {
      /* retry */
    }
    await sleep(1200);
  }
  chapterMem.set(key, null);
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

type Span = { chapter: number; from: number; to: number };

function parseRef(ref: string): { bookNr: number; spans: Span[] } | null {
  const m = ref.match(/^(.+?)\s+(\d+)(?::(\d+))?(?:\s*[-–]\s*(\d+)(?::(\d+))?)?$/);
  if (!m) return null;
  const book = findBook(m[1]!);
  if (!book) return null;
  const bookNr = BOOK_NR.get(book.canonical);
  if (!bookNr) return null;

  const c1 = Number(m[2]);
  const v1 = m[3] ? Number(m[3]) : null;
  const d = m[4] ? Number(m[4]) : null;
  const dv = m[5] ? Number(m[5]) : null;
  const INF = 100000;
  const spans: Span[] = [];

  if (d === null) {
    if (v1 !== null) spans.push({ chapter: c1, from: v1, to: v1 });
    else spans.push({ chapter: c1, from: 1, to: INF });
  } else if (dv !== null) {
    // explicit end chapter:verse — cross-chapter range
    const endCh = d;
    spans.push({ chapter: c1, from: v1 ?? 1, to: INF });
    for (let c = c1 + 1; c < endCh; c++) spans.push({ chapter: c, from: 1, to: INF });
    spans.push({ chapter: endCh, from: 1, to: dv });
  } else if (v1 !== null) {
    spans.push({ chapter: c1, from: v1, to: d }); // same-chapter verse range
  } else {
    for (let c = c1; c <= d; c++) spans.push({ chapter: c, from: 1, to: INF }); // chapter range
  }
  return { bookNr, spans };
}

async function assemble(ref: string): Promise<string | null> {
  const parsed = parseRef(ref);
  if (!parsed) return null;
  const parts: string[] = [];
  for (const span of parsed.spans) {
    const verses = await getChapter(parsed.bookNr, span.chapter);
    if (!verses) return null;
    for (const v of verses) {
      if (v.verse >= span.from && v.verse <= span.to) parts.push(v.text);
    }
  }
  const text = parts.join(" ").replace(/\s+/g, " ").trim();
  return text || null;
}

type VerseRecord = { reference: string; text: string };

async function main(): Promise<void> {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  const refs = collect();
  const existing: Record<string, VerseRecord> = existsSync(OUT)
    ? (JSON.parse(readFileSync(OUT, "utf8")) as Record<string, VerseRecord>)
    : {};
  console.log(`Collected ${refs.length} references. Already bundled: ${Object.keys(existing).length}.`);

  let added = 0;
  const misses: string[] = [];
  for (const ref of refs) {
    const k = normalizeRef(ref);
    if (existing[k]) continue;
    const text = await assemble(ref);
    if (text) {
      existing[k] = { reference: ref, text };
      added++;
    } else {
      misses.push(ref);
    }
  }

  const sorted = Object.fromEntries(
    Object.entries(existing).sort(([a], [b]) => (a < b ? -1 : 1)),
  );
  writeFileSync(OUT, `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(`Done. added ${added}, total ${Object.keys(sorted).length}, missed ${misses.length}.`);
  if (misses.length) console.warn("Missed:", misses.join("; "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
