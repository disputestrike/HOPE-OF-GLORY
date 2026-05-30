/**
 * Reference parser tests.
 */
import { describe, it, expect } from "vitest";
import { parseReference, formatReference } from "./lookup";

describe("parseReference() — chapter:verse", () => {
  it("parses 'John 3:16'", () => {
    const r = parseReference("John 3:16");
    expect(r?.book.canonical).toBe("John");
    expect(r?.chapter).toBe(3);
    expect(r?.verseStart).toBe(16);
    expect(r?.verseEnd).toBe(16);
  });

  it("parses 'Hab 2:14'", () => {
    const r = parseReference("Hab 2:14");
    expect(r?.book.canonical).toBe("Habakkuk");
    expect(r?.chapter).toBe(2);
    expect(r?.verseStart).toBe(14);
  });

  it("parses 'Col 1:27'", () => {
    const r = parseReference("Col 1:27");
    expect(r?.book.canonical).toBe("Colossians");
    expect(r?.chapter).toBe(1);
    expect(r?.verseStart).toBe(27);
  });
});

describe("parseReference() — verse range", () => {
  it("parses 'Rev 7:9-10'", () => {
    const r = parseReference("Rev 7:9-10");
    expect(r?.book.canonical).toBe("Revelation");
    expect(r?.chapter).toBe(7);
    expect(r?.verseStart).toBe(9);
    expect(r?.verseEnd).toBe(10);
  });

  it("parses '1 Cor 13:1-13'", () => {
    const r = parseReference("1 Cor 13:1-13");
    expect(r?.book.canonical).toBe("1 Corinthians");
    expect(r?.chapter).toBe(13);
    expect(r?.verseStart).toBe(1);
    expect(r?.verseEnd).toBe(13);
  });
});

describe("parseReference() — chapter only", () => {
  it("parses 'Psalm 23'", () => {
    const r = parseReference("Psalm 23");
    expect(r?.book.canonical).toBe("Psalms");
    expect(r?.chapter).toBe(23);
    expect(r?.verseStart).toBeNull();
    expect(r?.verseEnd).toBeNull();
  });
});

describe("parseReference() — invalid", () => {
  it("returns null for gibberish", () => {
    expect(parseReference("ZZZZZ 99:99")).toBeNull();
  });

  it("returns null for empty", () => {
    expect(parseReference("")).toBeNull();
  });

  it("returns null for non-reference text", () => {
    expect(parseReference("the page number is 12")).toBeNull();
  });
});

describe("formatReference()", () => {
  it("formats verse-only reference", () => {
    const r = parseReference("John 3:16");
    expect(r && formatReference(r)).toBe("John 3:16");
  });

  it("formats verse-range reference", () => {
    const r = parseReference("Rev 7:9-10");
    expect(r && formatReference(r)).toBe("Revelation 7:9-10");
  });

  it("formats chapter-only reference", () => {
    const r = parseReference("Psalm 23");
    expect(r && formatReference(r)).toBe("Psalms 23");
  });

  it("normalizes alias to canonical", () => {
    const r = parseReference("hab 2:14");
    expect(r && formatReference(r)).toBe("Habakkuk 2:14");
  });
});
