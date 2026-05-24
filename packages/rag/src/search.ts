/**
 * pgvector similarity search.
 *
 * Strategy:
 *   - Cosine distance (`<=>` operator)
 *   - Optional metadata filters (source_type, doctrine_tags, etc.)
 *   - Caller passes the embedding vector (generated upstream)
 */
import { sql, type SQL } from "drizzle-orm";
import type { DB } from "@hog/db";

export type SearchResult = {
  chunkId: string;
  sourceId: string;
  content: string;
  distance: number;
  metadata: Record<string, unknown>;
};

export type SearchOptions = {
  limit?: number;
  sourceType?: string;
  doctrineTag?: string;
  book?: string;
  minSimilarity?: number;
};

/**
 * Vector similarity search across embeddings.
 * Returns chunks ordered by cosine distance (lower = more similar).
 *
 * NOTE: This is a raw SQL query because pgvector operators are not yet
 * first-class in Drizzle. Migration runs `CREATE INDEX ... USING hnsw`
 * or `ivfflat` on `embeddings.vector` for performance.
 */
export async function similaritySearch(
  db: DB,
  embedding: number[],
  opts: SearchOptions = {}
): Promise<SearchResult[]> {
  const limit = opts.limit ?? 8;
  const vectorLit = `[${embedding.join(",")}]`;

  const filters: SQL[] = [];
  if (opts.sourceType) {
    filters.push(sql`s.source_type = ${opts.sourceType}`);
  }
  if (opts.book) {
    filters.push(sql`c.book = ${opts.book}`);
  }
  if (opts.doctrineTag) {
    filters.push(sql`${opts.doctrineTag} = ANY(c.doctrine_tags)`);
  }
  const where = filters.length
    ? sql`WHERE ${sql.join(filters, sql` AND `)}`
    : sql``;

  const rows = await db.execute<{
    chunk_id: string;
    source_id: string;
    content: string;
    distance: number;
    metadata_json: Record<string, unknown> | null;
  }>(sql`
    SELECT
      c.id as chunk_id,
      c.source_id,
      c.content,
      e.vector <=> ${vectorLit}::vector as distance,
      c.metadata_json
    FROM embeddings e
    INNER JOIN source_chunks c ON c.id = e.chunk_id
    INNER JOIN sources s ON s.id = c.source_id
    ${where}
    ORDER BY distance ASC
    LIMIT ${limit}
  `);

  return rows.map((r) => ({
    chunkId: r.chunk_id,
    sourceId: r.source_id,
    content: r.content,
    distance: r.distance,
    metadata: r.metadata_json ?? {},
  }));
}
