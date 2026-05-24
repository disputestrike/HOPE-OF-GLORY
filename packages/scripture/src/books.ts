/**
 * Canonical book list (Protestant 66) with WEB-style normalized names and aliases.
 * Used for parsing user references like "1 cor 13" or "song of solomon 2".
 */

export type Book = {
  canonical: string;
  testament: "old" | "new";
  aliases: readonly string[];
};

export const BOOKS: readonly Book[] = [
  // Old Testament
  { canonical: "Genesis", testament: "old", aliases: ["gen", "ge", "gn"] },
  { canonical: "Exodus", testament: "old", aliases: ["exo", "ex", "exod"] },
  { canonical: "Leviticus", testament: "old", aliases: ["lev", "lv"] },
  { canonical: "Numbers", testament: "old", aliases: ["num", "nu", "nm"] },
  { canonical: "Deuteronomy", testament: "old", aliases: ["deut", "dt", "de"] },
  { canonical: "Joshua", testament: "old", aliases: ["josh", "jos", "jsh"] },
  { canonical: "Judges", testament: "old", aliases: ["judg", "jdg", "jg"] },
  { canonical: "Ruth", testament: "old", aliases: ["ru"] },
  { canonical: "1 Samuel", testament: "old", aliases: ["1 sam", "1sa", "1samuel", "1 sm"] },
  { canonical: "2 Samuel", testament: "old", aliases: ["2 sam", "2sa", "2samuel", "2 sm"] },
  { canonical: "1 Kings", testament: "old", aliases: ["1 ki", "1kgs", "1kings"] },
  { canonical: "2 Kings", testament: "old", aliases: ["2 ki", "2kgs", "2kings"] },
  { canonical: "1 Chronicles", testament: "old", aliases: ["1 chr", "1ch", "1chron"] },
  { canonical: "2 Chronicles", testament: "old", aliases: ["2 chr", "2ch", "2chron"] },
  { canonical: "Ezra", testament: "old", aliases: ["ezr"] },
  { canonical: "Nehemiah", testament: "old", aliases: ["neh", "ne"] },
  { canonical: "Esther", testament: "old", aliases: ["est", "esth"] },
  { canonical: "Job", testament: "old", aliases: ["jb"] },
  { canonical: "Psalms", testament: "old", aliases: ["psalm", "ps", "psa"] },
  { canonical: "Proverbs", testament: "old", aliases: ["prov", "pr", "prv"] },
  { canonical: "Ecclesiastes", testament: "old", aliases: ["eccl", "ec", "ecc", "qoh"] },
  { canonical: "Song of Solomon", testament: "old", aliases: ["song", "sos", "canticles", "song of songs"] },
  { canonical: "Isaiah", testament: "old", aliases: ["isa", "is"] },
  { canonical: "Jeremiah", testament: "old", aliases: ["jer", "jr"] },
  { canonical: "Lamentations", testament: "old", aliases: ["lam", "la"] },
  { canonical: "Ezekiel", testament: "old", aliases: ["ezek", "ez", "ezk"] },
  { canonical: "Daniel", testament: "old", aliases: ["dan", "dn"] },
  { canonical: "Hosea", testament: "old", aliases: ["hos", "ho"] },
  { canonical: "Joel", testament: "old", aliases: ["jl"] },
  { canonical: "Amos", testament: "old", aliases: ["am"] },
  { canonical: "Obadiah", testament: "old", aliases: ["obad", "ob"] },
  { canonical: "Jonah", testament: "old", aliases: ["jon"] },
  { canonical: "Micah", testament: "old", aliases: ["mic", "mc"] },
  { canonical: "Nahum", testament: "old", aliases: ["nah", "na"] },
  { canonical: "Habakkuk", testament: "old", aliases: ["hab", "hb"] },
  { canonical: "Zephaniah", testament: "old", aliases: ["zeph", "zep"] },
  { canonical: "Haggai", testament: "old", aliases: ["hag"] },
  { canonical: "Zechariah", testament: "old", aliases: ["zech", "zec"] },
  { canonical: "Malachi", testament: "old", aliases: ["mal"] },
  // New Testament
  { canonical: "Matthew", testament: "new", aliases: ["matt", "mt"] },
  { canonical: "Mark", testament: "new", aliases: ["mk", "mrk"] },
  { canonical: "Luke", testament: "new", aliases: ["lk", "luk"] },
  { canonical: "John", testament: "new", aliases: ["jn", "jhn"] },
  { canonical: "Acts", testament: "new", aliases: ["ac", "act"] },
  { canonical: "Romans", testament: "new", aliases: ["rom", "ro"] },
  { canonical: "1 Corinthians", testament: "new", aliases: ["1 cor", "1co", "1corinthians"] },
  { canonical: "2 Corinthians", testament: "new", aliases: ["2 cor", "2co", "2corinthians"] },
  { canonical: "Galatians", testament: "new", aliases: ["gal", "ga"] },
  { canonical: "Ephesians", testament: "new", aliases: ["eph"] },
  { canonical: "Philippians", testament: "new", aliases: ["phil", "php"] },
  { canonical: "Colossians", testament: "new", aliases: ["col", "cl"] },
  { canonical: "1 Thessalonians", testament: "new", aliases: ["1 thes", "1th", "1thess"] },
  { canonical: "2 Thessalonians", testament: "new", aliases: ["2 thes", "2th", "2thess"] },
  { canonical: "1 Timothy", testament: "new", aliases: ["1 tim", "1ti", "1timothy"] },
  { canonical: "2 Timothy", testament: "new", aliases: ["2 tim", "2ti", "2timothy"] },
  { canonical: "Titus", testament: "new", aliases: ["ti", "tit"] },
  { canonical: "Philemon", testament: "new", aliases: ["phlm", "phm"] },
  { canonical: "Hebrews", testament: "new", aliases: ["heb"] },
  { canonical: "James", testament: "new", aliases: ["jas", "jm"] },
  { canonical: "1 Peter", testament: "new", aliases: ["1 pet", "1pe", "1peter"] },
  { canonical: "2 Peter", testament: "new", aliases: ["2 pet", "2pe", "2peter"] },
  { canonical: "1 John", testament: "new", aliases: ["1 jn", "1jn", "1john"] },
  { canonical: "2 John", testament: "new", aliases: ["2 jn", "2jn", "2john"] },
  { canonical: "3 John", testament: "new", aliases: ["3 jn", "3jn", "3john"] },
  { canonical: "Jude", testament: "new", aliases: ["jud"] },
  { canonical: "Revelation", testament: "new", aliases: ["rev", "re", "apocalypse"] },
];

const LOOKUP_INDEX: Map<string, Book> = (() => {
  const m = new Map<string, Book>();
  for (const book of BOOKS) {
    m.set(book.canonical.toLowerCase(), book);
    for (const alias of book.aliases) {
      m.set(alias.toLowerCase(), book);
    }
  }
  return m;
})();

export function findBook(input: string): Book | null {
  const normalized = input.toLowerCase().trim().replace(/\s+/g, " ").replace(/\.$/, "");
  return LOOKUP_INDEX.get(normalized) ?? null;
}
