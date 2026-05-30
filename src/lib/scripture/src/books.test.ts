/**
 * Scripture book lookup tests. Used by reference parser and citation validator.
 */
import { describe, it, expect } from "vitest";
import { findBook, BOOKS } from "./books";

describe("findBook() — canonical names", () => {
  it("finds Genesis", () => {
    expect(findBook("Genesis")?.canonical).toBe("Genesis");
  });

  it("finds Habakkuk", () => {
    expect(findBook("Habakkuk")?.canonical).toBe("Habakkuk");
  });

  it("finds Revelation", () => {
    expect(findBook("Revelation")?.canonical).toBe("Revelation");
  });
});

describe("findBook() — common aliases", () => {
  it("finds Gen for Genesis", () => {
    expect(findBook("Gen")?.canonical).toBe("Genesis");
  });

  it("finds Hab for Habakkuk", () => {
    expect(findBook("Hab")?.canonical).toBe("Habakkuk");
  });

  it("finds Ps for Psalms", () => {
    expect(findBook("Ps")?.canonical).toBe("Psalms");
  });

  it("finds 1 Cor for 1 Corinthians", () => {
    expect(findBook("1 Cor")?.canonical).toBe("1 Corinthians");
  });

  it("finds Song of Songs for Song of Solomon", () => {
    expect(findBook("Song of Songs")?.canonical).toBe("Song of Solomon");
  });

  it("finds Rev for Revelation", () => {
    expect(findBook("Rev")?.canonical).toBe("Revelation");
  });
});

describe("findBook() — case insensitive", () => {
  it("finds 'john' lowercase", () => {
    expect(findBook("john")?.canonical).toBe("John");
  });

  it("finds 'JOHN' uppercase", () => {
    expect(findBook("JOHN")?.canonical).toBe("John");
  });

  it("finds mixed case '1 chronicles'", () => {
    expect(findBook("1 chronicles")?.canonical).toBe("1 Chronicles");
  });
});

describe("findBook() — invalid inputs", () => {
  it("returns null for gibberish", () => {
    expect(findBook("Asdfg")).toBeNull();
  });

  it("returns null for empty", () => {
    expect(findBook("")).toBeNull();
  });

  it("returns null for half-match", () => {
    expect(findBook("Genny")).toBeNull();
  });
});

describe("BOOKS list integrity", () => {
  it("contains all 66 Protestant canon books", () => {
    expect(BOOKS).toHaveLength(66);
  });

  it("has 39 OT books", () => {
    expect(BOOKS.filter((b) => b.testament === "old")).toHaveLength(39);
  });

  it("has 27 NT books", () => {
    expect(BOOKS.filter((b) => b.testament === "new")).toHaveLength(27);
  });

  it("every book has at least one alias", () => {
    for (const book of BOOKS) {
      expect(book.aliases.length).toBeGreaterThan(0);
    }
  });

  it("no duplicate canonical names", () => {
    const names = BOOKS.map((b) => b.canonical);
    expect(new Set(names).size).toBe(names.length);
  });
});
