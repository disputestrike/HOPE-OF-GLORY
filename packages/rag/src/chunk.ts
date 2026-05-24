/**
 * Text chunking strategies.
 *
 * From packages/db/ARCHITECTURE.md:
 *   - Bible:     verse + pericope windows (5-25 verses, ~1-3 verse overlap)
 *   - Doctrine:  section-based, 400-800 tokens, 10-15% overlap
 *   - Sermons:   outline section, 300-700 tokens, 10% overlap
 *   - Lexicons:  entry-based, one lemma per chunk
 *   - Policies:  policy-section, 300-600 tokens
 */

export type Chunk = {
  index: number;
  content: string;
  tokenEstimate: number;
};

const APPROX_CHARS_PER_TOKEN = 4;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / APPROX_CHARS_PER_TOKEN);
}

/**
 * Section-based chunking — splits on markdown headers (## and ###),
 * then groups sections to stay within target token range.
 */
export function chunkBySection(
  text: string,
  targetTokens = 600,
  maxTokens = 800,
  overlapPct = 0.12
): Chunk[] {
  const sections = text.split(/(?=^#{1,3}\s)/m).filter((s) => s.trim().length > 0);
  const chunks: Chunk[] = [];
  let buffer = "";
  let bufferTokens = 0;
  let index = 0;

  for (const section of sections) {
    const sectionTokens = estimateTokens(section);
    if (bufferTokens + sectionTokens > maxTokens && buffer) {
      chunks.push({ index: index++, content: buffer.trim(), tokenEstimate: bufferTokens });
      // overlap tail
      const overlapChars = Math.floor(buffer.length * overlapPct);
      buffer = buffer.slice(-overlapChars);
      bufferTokens = estimateTokens(buffer);
    }
    buffer += "\n\n" + section;
    bufferTokens += sectionTokens;
    if (bufferTokens >= targetTokens) {
      chunks.push({ index: index++, content: buffer.trim(), tokenEstimate: bufferTokens });
      const overlapChars = Math.floor(buffer.length * overlapPct);
      buffer = buffer.slice(-overlapChars);
      bufferTokens = estimateTokens(buffer);
    }
  }
  if (buffer.trim()) {
    chunks.push({ index: index++, content: buffer.trim(), tokenEstimate: bufferTokens });
  }
  return chunks;
}

/**
 * Verse-window chunking for Bible passages.
 * Yields overlapping windows of `windowSize` verses with `overlap` shared verses.
 */
export function chunkVerseWindows<T extends { verse: number; text: string }>(
  verses: readonly T[],
  windowSize = 12,
  overlap = 2
): Array<{ start: number; end: number; verses: T[] }> {
  const out: Array<{ start: number; end: number; verses: T[] }> = [];
  const step = Math.max(1, windowSize - overlap);
  for (let i = 0; i < verses.length; i += step) {
    const slice = verses.slice(i, i + windowSize);
    if (slice.length === 0) break;
    const first = slice[0];
    const last = slice[slice.length - 1];
    if (!first || !last) continue;
    out.push({ start: first.verse, end: last.verse, verses: slice });
    if (i + windowSize >= verses.length) break;
  }
  return out;
}
