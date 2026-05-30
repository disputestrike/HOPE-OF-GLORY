/**
 * Chunking tests for RAG ingestion.
 */
import { describe, it, expect } from "vitest";
import { chunkBySection, chunkVerseWindows } from "./chunk";

describe("chunkBySection()", () => {
  it("returns one chunk for short input", () => {
    const out = chunkBySection("# Title\n\nShort body text.", 600, 800, 0.12);
    expect(out.length).toBe(1);
    expect(out[0]?.content).toContain("# Title");
  });

  it("splits multi-section markdown into multiple chunks", () => {
    // Generate a long doc with multiple sections, each ~ 300 tokens of content
    const sections = Array.from({ length: 6 }, (_, i) => {
      const body = "lorem ipsum ".repeat(200); // ~400 chars ≈ 100 tokens
      return `## Section ${i}\n\n${body}`;
    }).join("\n\n");
    const out = chunkBySection(sections, 400, 600, 0.12);
    expect(out.length).toBeGreaterThan(1);
  });

  it("each chunk respects target token bounds approximately", () => {
    const text = "## Header\n\n" + "word ".repeat(2000);
    const out = chunkBySection(text, 400, 600, 0.12);
    for (const chunk of out) {
      // Token estimate is rough; allow some slack
      expect(chunk.tokenEstimate).toBeLessThan(1000);
    }
  });

  it("each chunk has a unique index", () => {
    const text = Array.from({ length: 5 }, (_, i) => `## Section ${i}\n\n${"x ".repeat(500)}`).join("\n\n");
    const out = chunkBySection(text, 200, 400, 0.1);
    const indexes = out.map((c) => c.index);
    expect(new Set(indexes).size).toBe(indexes.length);
  });
});

describe("chunkVerseWindows()", () => {
  const sampleVerses = Array.from({ length: 30 }, (_, i) => ({
    verse: i + 1,
    text: `Verse text ${i + 1}.`,
  }));

  it("returns one window for input shorter than windowSize", () => {
    const short = sampleVerses.slice(0, 5);
    const out = chunkVerseWindows(short, 12, 2);
    expect(out.length).toBe(1);
    expect(out[0]?.verses).toHaveLength(5);
  });

  it("produces overlapping windows", () => {
    const out = chunkVerseWindows(sampleVerses, 12, 2);
    expect(out.length).toBeGreaterThan(1);
    // Windows should overlap by 2 verses
    if (out.length >= 2 && out[0] && out[1]) {
      expect(out[0].end).toBeGreaterThanOrEqual(out[1].start);
    }
  });

  it("window.start and window.end match the verse range", () => {
    const out = chunkVerseWindows(sampleVerses, 5, 1);
    for (const w of out) {
      expect(w.start).toBe(w.verses[0]?.verse);
      expect(w.end).toBe(w.verses[w.verses.length - 1]?.verse);
    }
  });

  it("returns empty array for empty input", () => {
    const out = chunkVerseWindows([], 12, 2);
    expect(out).toEqual([]);
  });
});
