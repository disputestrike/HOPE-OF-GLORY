/**
 * Ingest the World English Bible into scripture_passages.
 *
 * Source: WEB is public domain (ebible.org/engwebp/).
 * Download the JSON edition once and place at content/bible/web.json.
 *
 * Expected format (one of):
 *   [
 *     { "book": "Genesis", "chapter": 1, "verse": 1, "text": "In the beginning..." },
 *     ...
 *   ]
 *
 * After scripture_passages is populated, this script also:
 *   - Chunks each chapter into pericope windows (12 verses, 2-verse overlap)
 *   - Generates embeddings for each window
 *   - Stores in source_chunks + embeddings
 *
 * Runs in batches to respect OpenAI embeddings rate limits.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { db, schema, closeDb } from "@hog/db";
import { chunkVerseWindows } from "@hog/rag";
import { openai } from "@hog/ai";
import { sql } from "drizzle-orm";

const BIBLE_FILE = path.resolve(
  process.cwd(),
  "../content/bible/web.json"
);

const TRANSLATION = "WEB";
const EMBED_BATCH = 50;

type RawVerse = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

async function loadBible(): Promise<RawVerse[]> {
  try {
    const raw = await readFile(BIBLE_FILE, "utf8");
    return JSON.parse(raw) as RawVerse[];
  } catch {
    console.error(`[bible] No file at ${BIBLE_FILE}`);
    console.error("[bible] Download WEB JSON from ebible.org/engwebp/ and place at content/bible/web.json");
    console.error("[bible] Skeleton form: [{ \"book\": \"Genesis\", \"chapter\": 1, \"verse\": 1, \"text\": \"...\" }, ...]");
    process.exit(2);
  }
}

async function insertVerses(verses: readonly RawVerse[]): Promise<void> {
  const batchSize = 500;
  for (let i = 0; i < verses.length; i += batchSize) {
    const batch = verses.slice(i, i + batchSize);
    const values = batch.map(
      (v) => sql`(${v.book}, ${v.chapter}, ${v.verse}, ${v.verse}, ${TRANSLATION}, ${v.text})`
    );
    await db.execute(sql`
      INSERT INTO scripture_passages (book, chapter, verse_start, verse_end, translation, text)
      VALUES ${sql.join(values, sql`, `)}
      ON CONFLICT DO NOTHING
    `);
    if (i % 5000 === 0 && i > 0) {
      console.log(`[bible] inserted ${i + batch.length}/${verses.length} verses`);
    }
  }
}

async function embedPericopes(verses: readonly RawVerse[]): Promise<void> {
  // 1. Upsert WEB source row.
  const src = await db.execute<{ id: string }>(sql`
    INSERT INTO sources (source_type, title, license_type, canonical_ref, version, language, status)
    VALUES ('bible', 'World English Bible', 'public_domain', 'WEB', '2024.1', 'en', 'active')
    ON CONFLICT (canonical_ref) DO UPDATE SET version = EXCLUDED.version
    RETURNING id
  `);
  const sid = src[0]?.id;
  if (!sid) throw new Error("Failed to upsert WEB source");

  // 2. Group verses by book + chapter.
  const byChapter = new Map<string, RawVerse[]>();
  for (const v of verses) {
    const k = `${v.book}|${v.chapter}`;
    const arr = byChapter.get(k) ?? [];
    arr.push(v);
    byChapter.set(k, arr);
  }

  // 3. For each chapter, chunk into pericope windows.
  let chunkIndex = 0;
  let windowsBuffer: Array<{
    book: string;
    chapter: number;
    start: number;
    end: number;
    content: string;
  }> = [];

  for (const [key, chapterVerses] of byChapter) {
    const [book, chapStr] = key.split("|");
    if (!book || !chapStr) continue;
    const chapter = Number.parseInt(chapStr, 10);
    chapterVerses.sort((a, b) => a.verse - b.verse);

    const windows = chunkVerseWindows(chapterVerses, 12, 2);
    for (const w of windows) {
      const content = w.verses
        .map((v) => `${v.verse}. ${v.text}`)
        .join(" ");
      windowsBuffer.push({ book, chapter, start: w.start, end: w.end, content });
    }
  }

  console.log(`[bible] ${windowsBuffer.length} pericope windows to embed`);

  // 4. Embed in batches.
  for (let i = 0; i < windowsBuffer.length; i += EMBED_BATCH) {
    const batch = windowsBuffer.slice(i, i + EMBED_BATCH);
    const vectors = await openai.embedBatch(batch.map((b) => b.content));

    for (let j = 0; j < batch.length; j++) {
      const w = batch[j];
      const vec = vectors[j];
      if (!w || !vec) continue;

      const chunkRow = await db.execute<{ id: string }>(sql`
        INSERT INTO source_chunks (source_id, chunk_index, content, token_count, book, chapter, verse_start, verse_end, metadata_json)
        VALUES (${sid}, ${chunkIndex++}, ${w.content}, ${Math.ceil(w.content.length / 4)}, ${w.book}, ${w.chapter}, ${w.start}, ${w.end}, ${JSON.stringify({ translation: TRANSLATION })}::jsonb)
        RETURNING id
      `);
      const cid = chunkRow[0]?.id;
      if (!cid) continue;
      const vectorLit = `[${vec.join(",")}]`;
      await db.execute(sql`
        INSERT INTO embeddings (chunk_id, embedding_model, vector)
        VALUES (${cid}, 'text-embedding-3-small', ${vectorLit}::vector)
      `);
    }
    console.log(`[bible] embedded ${Math.min(i + EMBED_BATCH, windowsBuffer.length)}/${windowsBuffer.length}`);
  }
}

async function main(): Promise<void> {
  console.log("[bible] loading WEB ...");
  const verses = await loadBible();
  console.log(`[bible] loaded ${verses.length} verses`);

  console.log("[bible] inserting verses ...");
  await insertVerses(verses);

  console.log("[bible] embedding pericopes ...");
  await embedPericopes(verses);

  console.log("[bible] complete.");
  await closeDb();
}

main().catch(async (err) => {
  console.error("[bible] failed:", err);
  await closeDb();
  process.exit(1);
});
