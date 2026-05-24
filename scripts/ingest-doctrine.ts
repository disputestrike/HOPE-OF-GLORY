/**
 * Ingest doctrinal constitution into source_chunks + embeddings.
 *
 * Reads docs/doctrine/*.md, chunks by section, embeds via OpenAI
 * text-embedding-3-small (1536 dims), inserts into Postgres + pgvector.
 *
 * Idempotent: re-running updates checksums and re-embeds changed docs only.
 */
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { db, schema, closeDb } from "@hog/db";
import { chunkBySection } from "@hog/rag";
import { openai } from "@hog/ai";
import { sql } from "drizzle-orm";

const DOCTRINE_DIR = path.resolve(process.cwd(), "../docs/doctrine");

function checksum(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

async function ingestOne(slug: string): Promise<{ inserted: number; skipped: boolean }> {
  const file = path.join(DOCTRINE_DIR, `${slug}.md`);
  const raw = await readFile(file, "utf8");
  const hash = checksum(raw);

  // 1. Upsert doctrine_documents (no-op if checksum unchanged).
  const existing = await db.execute<{ checksum: string }>(
    sql`SELECT checksum FROM doctrine_documents WHERE slug = ${slug} LIMIT 1`
  );
  if (existing[0]?.checksum === hash) {
    console.log(`[doctrine] ${slug} unchanged, skipping`);
    return { inserted: 0, skipped: true };
  }

  await db.execute(sql`
    INSERT INTO doctrine_documents (slug, version, status, body, checksum)
    VALUES (${slug}, '0.1.0', 'published', ${raw}, ${hash})
    ON CONFLICT (slug) DO UPDATE SET
      body = EXCLUDED.body,
      checksum = EXCLUDED.checksum,
      status = 'published',
      updated_at = now()
  `);

  // 2. Upsert source row.
  const sourceId = await db.execute<{ id: string }>(sql`
    INSERT INTO sources (source_type, title, license_type, canonical_ref, version, language, status)
    VALUES ('doctrine', ${`Doctrine: ${slug}`}, 'in_house', ${slug}, '0.1.0', 'en', 'active')
    ON CONFLICT (canonical_ref) DO UPDATE SET version = EXCLUDED.version
    RETURNING id
  `);
  const sid = sourceId[0]?.id;
  if (!sid) throw new Error("Failed to upsert source");

  // 3. Delete old chunks for this source.
  await db.execute(sql`DELETE FROM source_chunks WHERE source_id = ${sid}`);

  // 4. Chunk + embed + insert.
  const chunks = chunkBySection(raw, 600, 800, 0.12);
  console.log(`[doctrine] ${slug}: ${chunks.length} chunks`);

  for (const chunk of chunks) {
    const vector = await openai.embed(chunk.content);
    const chunkRow = await db.execute<{ id: string }>(sql`
      INSERT INTO source_chunks (source_id, chunk_index, content, token_count, doctrine_tags, metadata_json)
      VALUES (${sid}, ${chunk.index}, ${chunk.content}, ${chunk.tokenEstimate}, ARRAY[${slug}]::text[], ${JSON.stringify({ slug })}::jsonb)
      RETURNING id
    `);
    const cid = chunkRow[0]?.id;
    if (!cid) continue;
    const vectorLit = `[${vector.join(",")}]`;
    await db.execute(sql`
      INSERT INTO embeddings (chunk_id, embedding_model, vector)
      VALUES (${cid}, 'text-embedding-3-small', ${vectorLit}::vector)
    `);
  }
  return { inserted: chunks.length, skipped: false };
}

async function main(): Promise<void> {
  const entries = await readdir(DOCTRINE_DIR);
  const slugs = entries.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));

  let total = 0;
  for (const slug of slugs) {
    const result = await ingestOne(slug);
    total += result.inserted;
  }
  console.log(`[doctrine] complete. ${total} chunks embedded across ${slugs.length} documents.`);
  await closeDb();
}

main().catch(async (err) => {
  console.error("[doctrine] failed:", err);
  await closeDb();
  process.exit(1);
});
