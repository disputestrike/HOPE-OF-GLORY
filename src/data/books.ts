/**
 * Free ebook registry.
 *
 * Each book has a Markdown manuscript under `content/books/` (rendered by the
 * web reader at /books/[slug]) and a generated PDF under `public/ebooks/`
 * (regenerate with `pnpm ebook:build`). Books are free to read and download —
 * no email wall — consistent with the ministry's "the gospel is free" ethic.
 */
export type Book = {
  slug: string;
  title: string;
  subtitle: string;
  /** One-paragraph description for cards, metadata, and OG. */
  description: string;
  /** Markdown filename under content/books/ */
  file: string;
  /** Public path to the downloadable PDF. */
  pdf: string;
  pages: number;
  readingTimeMin: number;
  anchor: { ref: string; text: string };
  audiences: string[];
  chapters: string[];
};

export const BOOKS: Book[] = [
  {
    slug: "i-am-he",
    title: "I Am He",
    subtitle:
      "The Absolute Formula — How the God of Israel Reveals Himself in Jesus the Messiah",
    description:
      "A book of discipleship and apologetics tracing one thread — the divine self-identification “I am he” (Hebrew ani hu, Greek egō eimi) — from the Song of Moses through Isaiah to the lips of Jesus, answering every honest objection from the skeptic, the Jewish reader, the Muslim, and the Jehovah's Witness. Free to read and download.",
    file: "i-am-he.md",
    pdf: "/ebooks/i-am-he-hope-of-glory.pdf",
    pages: 35,
    readingTimeMin: 55,
    anchor: {
      ref: "John 8:24 · WEB",
      text: "Unless you believe that I am he, you will die in your sins.",
    },
    audiences: [
      "Christians (discipleship)",
      "Atheists & skeptics",
      "Jewish readers",
      "Muslim readers",
      "Jehovah's Witnesses",
    ],
    chapters: [
      "The Forgotten Word — “He”",
      "The Birth of the Formula — Yahweh Alone",
      "Isaiah's Courtroom — “That You May Believe That I Am He”",
      "The Formula on the Lips of Jesus",
      "The One Isaiah Saw — The Wider Witness",
      "Honest Objections — Every Angle, Answered",
      "Who Is the He? — The Call",
    ],
  },
];

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}
