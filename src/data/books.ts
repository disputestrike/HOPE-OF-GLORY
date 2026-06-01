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
    slug: "hear-o-israel",
    title: "Hear, O Israel",
    subtitle: "The One God, His Name, and the Mystery of His Fullness",
    description:
      "Who is God? A book of discipleship and apologetics on the Shema (“Yahweh is one”), the divine name “I AM” at the burning bush, the plurality the Hebrew Scriptures themselves reveal within the one God, and the triune God made known in Jesus — for the believer, the atheist, the Jewish reader, and the Muslim. Free to read and download.",
    file: "hear-o-israel.md",
    pdf: "/ebooks/hear-o-israel-hope-of-glory.pdf",
    pages: 15,
    readingTimeMin: 35,
    anchor: {
      ref: "Deuteronomy 6:4 · WEB",
      text: "Hear, Israel: Yahweh is our God. Yahweh is one.",
    },
    audiences: [
      "Christians (discipleship)",
      "Atheists & seekers",
      "Jewish readers",
      "Muslim readers",
    ],
    chapters: [
      "The Most Important Sentence",
      "The Name",
      "Is God a Man?",
      "The Fullness Within the One",
      "Father, Son, and Holy Spirit",
      "Besides Me There Is No Savior",
      "Knowing God",
    ],
  },
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
  {
    slug: "christ-hidden-in-plain-sight",
    title: "Christ Hidden in Plain Sight",
    subtitle: "How the Whole Old Testament Was Pointing to Jesus All Along",
    description:
      "Read the Old Testament the way Jesus read it. From the seed of the woman and the offspring of Abraham to Joseph, the Passover lamb, the tabernacle, the Son of David, Melchizedek, the scapegoat, Isaiah 53, and the pierced One of Zechariah — one portrait, drawn over centuries, of a single Person. For the believer, the doubter, and the Jewish reader. Free to read and download.",
    file: "christ-hidden-in-plain-sight.md",
    pdf: "/ebooks/christ-hidden-in-plain-sight-hope-of-glory.pdf",
    pages: 18,
    readingTimeMin: 35,
    anchor: {
      ref: "Luke 24:27 · WEB",
      text: "Beginning from Moses and from all the prophets, he explained to them in all the Scriptures the things concerning himself.",
    },
    audiences: [
      "Christians (discipleship)",
      "Doubters & skeptics",
      "Jewish readers",
    ],
    chapters: [
      "The Reading Lesson on the Road",
      "The Seed of the Woman",
      "Joseph, the Rejected Brother Who Saves",
      "The Lamb and the Exodus",
      "Moses, the Tabernacle, and the Pattern of Heaven",
      "The King: David, Goliath, and the Son of David",
      "The Priest, the Scapegoat, and the Pierced One",
    ],
  },
  {
    slug: "the-highest-price",
    title: "The Highest Price and the Greatest Love",
    subtitle: "What Really Happened on the Cross — and Why It Is the Best News in the World",
    description:
      "The cross is the receipt, the blood is the price, and the empty tomb is the proof the payment was accepted. A book on the meaning of the cross — the debt of sin, why blood, the Passover and the cup, the cry of dereliction, Barabbas and the great exchange, “It is finished” (tetelestai, “paid in full”), and the resurrection. Deeply evangelistic, for the believer and the seeker. Free to read and download.",
    file: "the-highest-price.md",
    pdf: "/ebooks/the-highest-price-hope-of-glory.pdf",
    pages: 17,
    readingTimeMin: 35,
    anchor: {
      ref: "Romans 5:8 · WEB",
      text: "God commends his own love toward us, in that while we were yet sinners, Christ died for us.",
    },
    audiences: [
      "Christians (discipleship)",
      "Seekers",
      "Skeptics",
    ],
    chapters: [
      "The Debt We Cannot Pay",
      "Why Blood?",
      "The Lamb, the Bread, and the Cup",
      "Forsaken",
      "Barabbas and the Great Exchange",
      "It Is Finished",
      "The Receipt, the Proof, and the Invitation",
    ],
  },
  {
    slug: "read-it-in-context",
    title: "Read It in Context",
    subtitle:
      "A Christian's Honest Reply to the Hardest Questions About Jesus, the Bible, and Islam",
    description:
      "A rigorous, charitable reply to the hardest Christian–Muslim questions — tawhid and the Trinity, the charge that the Bible was corrupted (tahrif), whether the Old Testament predicts Muhammad, the identity and crucifixion of Jesus, and how a person is saved. Read in context, with humility and never hostility. For the Muslim reader, the Christian, and the seeker. Free to read and download.",
    file: "read-it-in-context.md",
    pdf: "/ebooks/read-it-in-context-hope-of-glory.pdf",
    pages: 18,
    readingTimeMin: 40,
    anchor: {
      ref: "1 Peter 3:15 · WEB",
      text: "Always be ready to give an answer to everyone who asks you a reason concerning the hope that is in you, with humility and fear.",
    },
    audiences: [
      "Muslim readers",
      "Christians (apologetics)",
      "Seekers",
    ],
    chapters: [
      "The Rule of Context",
      "One God: Tawhid and the Trinity",
      "Has the Bible Been Corrupted?",
      "Does the Old Testament Predict Muhammad?",
      "Who Is Jesus: Prophet or More?",
      "Heaven, Hell, and How a Person Is Saved",
      "Reading It Together: An Invitation",
    ],
  },
  {
    slug: "deeper-reading",
    title: "Deeper Reading",
    subtitle:
      "Seeing What You Have Been Reading Past — Context, Patterns, and the Hidden Architecture of the Bible",
    description:
      "Learn to read the Bible the way its first readers did. The four questions that unlock any passage, the language of numbers (why 40 keeps returning), the sacred calendar that rehearses the gospel, the thread from Eden to the temple to Christ, the prophets' enacted signs, and Genesis read against the ancient world — all to meet the Author. For the believer who senses there is more beneath the surface. Free to read and download.",
    file: "deeper-reading.md",
    pdf: "/ebooks/deeper-reading-hope-of-glory.pdf",
    pages: 18,
    readingTimeMin: 40,
    anchor: {
      ref: "Psalm 119:18 · WEB",
      text: "Open my eyes, that I may see wondrous things out of your law.",
    },
    audiences: [
      "Christians (discipleship)",
      "Bible students",
      "Seekers",
    ],
    chapters: [
      "The Lost Art of Reading in Context",
      "The Language of Numbers",
      "Sacred Time: Days, Sabbaths, and Feasts",
      "Sacred Space: Land, Temple, and Direction",
      "Signs Acted Out",
      "Reading Genesis in Its Ancient World",
      "Reading to Meet the Author",
    ],
  },
];

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}
