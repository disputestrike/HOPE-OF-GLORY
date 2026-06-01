import { HUBS } from "@/data/read-library";
import { SCROLL_TOPICS } from "@/data/scroll-topics";

type LocalAnswer = {
  answer: string;
  citations: string[];
};

/**
 * Offline / no-key answerer for Ask Hope.
 *
 * Two layers:
 *  1. CURATED — substantive, Christ-centered, Nicene answers for the
 *     highest-traffic questions (who is Jesus, who is God, is the Bible
 *     reliable, the gospel, salvation, the Trinity, the Spirit). These are
 *     written to be deep, not shallow, and to never hallucinate: doctrine is
 *     asserted plainly and every claim is tied to a real Scripture citation
 *     (the verse text itself is shown by the ScriptureRef popover / citations,
 *     drawn from the verified WEB bundle).
 *  2. FALLBACK — for anything else, surface the best-matching study from the
 *     Read library and The Scroll by name (never a raw URL), with citations.
 *
 * When a real provider key is configured, the router + doctrine gate + citation
 * validator take over; this module is the safety net so the site is never
 * shallow or empty.
 */

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function scoreText(queryTerms: string[], text: string): number {
  const normalized = normalize(text);
  return queryTerms.reduce((score, term) => score + (normalized.includes(term) ? 1 : 0), 0);
}

type Curated = { test: RegExp; answer: string; citations: string[] };

const CURATED: Curated[] = [
  {
    test: /who\s+(is|was)\s+jesus|jesus\s+(is\s+)?god|is\s+jesus\s+god|deity of (christ|jesus)/,
    answer:
      "Jesus of Nazareth is the eternal Son of God — fully God and fully man. He did not begin to exist at Bethlehem; the Son is the eternal Word who \"was with God\" and \"was God,\" and through whom all things were made (John 1:1-3). In time, that Word became flesh and lived among us (John 1:14): conceived by the Holy Spirit, born of the virgin Mary, He lived a sinless life, taught with divine authority, and revealed the Father.\n\nHe is the Christ, the promised Messiah — and He claimed God's own identity. Using the words by which the God of Israel reveals Himself, He said, \"Before Abraham came into existence, I AM\" (John 8:58), and \"unless you believe that I am he, you will die in your sins\" (John 8:24). When Thomas saw the risen Jesus he worshipped Him: \"My Lord and my God!\" (John 20:28), and Jesus received it.\n\nHe was crucified for our sins under Pontius Pilate, was buried, and rose bodily on the third day. He reigns now at the Father's right hand and will return to judge the living and the dead. He is not one teacher among many — He is the one Savior: \"There is salvation in no one else\" (Acts 4:12).",
    citations: ["John 1:1", "John 1:14", "John 8:58", "John 20:28", "Acts 4:12"],
  },
  {
    test: /who\s+is\s+(god|yahweh)|what\s+is\s+god|nature of god|name of god/,
    answer:
      "God is not a vague force or a generic \"higher power.\" He has a name and a character. He revealed His covenant name to Israel as Yahweh (often written \"the LORD\"), and the central confession of the faith is \"Yahweh is one\" (Deuteronomy 6:4). He alone is God: \"Before me there was no God formed, neither will there be after me\" (Isaiah 43:10).\n\nHe is the eternal, self-existent Creator of all things, holy and sovereign, and at the same time \"merciful and gracious, slow to anger, and abundant in loving kindness and truth\" (Exodus 34:6). The same one God exists eternally as Father, Son, and Holy Spirit — not three gods, and not one God wearing three masks, but one Being in three persons.\n\nMost wonderfully, this God is not far off. The Word who was God became flesh in Jesus Christ, so that to see Jesus is to see the Father (John 14:9). If you want to know who God is, look at Jesus — the exact image of the invisible God.",
    citations: ["Deuteronomy 6:4", "Isaiah 43:10", "Exodus 34:6-7", "John 1:1", "Colossians 1:15-20"],
  },
  {
    test: /bible\s+(reliable|trustworthy|corrupted|true)|trust the bible|tahrif|manuscript|was the bible/,
    answer:
      "Yes — and the question deserves an honest answer, not fear. Christians trust the Bible because God has spoken in it, because Jesus Himself received the Scriptures as the Word of God (Matthew 5:17-18; Luke 24:27), and because the manuscript evidence can be examined in the open.\n\nThe New Testament is preserved in thousands of Greek manuscripts and many early translations — so many that scholars can compare them and see where copyists made ordinary mistakes. Variants exist; Christians should say so plainly. But the better question is not \"are there variants?\" It is \"do the variants overturn the gospel, the deity of Christ, the cross, or the resurrection?\" They do not. The central message is not hidden or lost. \"The grass withers, the flower fades; but the word of our God stands forever\" (Isaiah 40:8).\n\nThe earliest record we can reach already proclaims a crucified and risen Lord (1 Corinthians 15:3-8). The claim that the divine Jesus was invented centuries later leaves no fingerprints in that manuscript tradition.",
    citations: ["2 Timothy 3:16-17", "Isaiah 40:8", "Matthew 5:17-18", "Luke 24:27", "1 Corinthians 15:3-8"],
  },
  {
    test: /what\s+is\s+the\s+gospel|good news|^gospel\b/,
    answer:
      "The gospel — the \"good news\" — is the announcement of what God has done in Jesus Christ to rescue sinners. Paul states it as the message of first importance: \"Christ died for our sins according to the Scriptures, that he was buried, that he was raised on the third day according to the Scriptures\" (1 Corinthians 15:3-4).\n\nIt begins with hard truth: all have sinned and fall short of the glory of God (Romans 3:23), and the wages of sin is death. But \"God commends his own love toward us, in that while we were yet sinners, Christ died for us\" (Romans 5:8). On the cross Jesus bore the judgment we deserved; in His resurrection He defeated death and opened the way to God.\n\nThe gospel is not advice to try harder. It is news to be received. Salvation is \"by grace... through faith... not of works\" (Ephesians 2:8-9) — a free gift, taken hold of by turning from sin and trusting Christ. \"For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life\" (John 3:16).",
    citations: ["1 Corinthians 15:3-4", "Romans 3:23", "Romans 5:8", "Ephesians 2:8-9", "John 3:16"],
  },
  {
    test: /how\s+(can|do)\s+i\s+(be\s+saved|get\s+saved|become a christian|follow|know god)|how to be saved|am i saved|be born again|salvation/,
    answer:
      "You do not save yourself, and you do not have to clean yourself up first. Salvation is God's gift, received by repentance and faith in Jesus Christ. \"If you will confess with your mouth that Jesus is Lord, and believe in your heart that God raised him from the dead, you will be saved\" (Romans 10:9).\n\nThree simple movements of the heart: (1) Admit you have sinned and cannot save yourself (Romans 3:23). (2) Believe that Jesus died for your sins and rose again, and that He alone is Lord and Savior (Acts 4:12). (3) Turn from sin and entrust your whole life to Him — call on Him.\n\nYou could pray right now, in your own words, something like: \"Lord Jesus, I have sinned and I cannot save myself. I believe you died for me and rose again. I turn from my sin and trust you alone. Be my Lord and my Savior. Make me yours.\" If you mean it, He receives you — not because of magic words, but because of His promise. Then tell a Christian, start reading the Gospel of John, pray daily, and find a faithful local church.",
    citations: ["Romans 10:9", "Romans 3:23", "Acts 4:12", "John 3:16", "Ephesians 2:8-9"],
  },
  {
    test: /trinity|triune|three\s+persons|father\s+son\s+(and\s+)?(holy\s+)?spirit/,
    answer:
      "The Trinity is the Christian confession that there is one God who exists eternally as three distinct persons: the Father, the Son, and the Holy Spirit. This is not three gods (that would be tritheism), and it is not one person wearing three masks (that would be modalism). It is one Being, three persons.\n\nThe Bible holds two truths together. First, God is one: \"Yahweh is one\" (Deuteronomy 6:4). Second, the Father is God, the Son is God (John 1:1), and the Spirit is God — and they are distinct: at Jesus' baptism the Son stands in the water, the Spirit descends, and the Father speaks from heaven. Jesus sends His disciples to baptize \"in the name of the Father and of the Son and of the Holy Spirit\" (Matthew 28:19), and Paul blesses the church with the grace of the Son, the love of the Father, and the fellowship of the Spirit (2 Corinthians 13:14).\n\nThe word \"Trinity\" is not in the Bible, but the reality is — it is the church's faithful summary of how the one God has revealed Himself.",
    citations: ["Deuteronomy 6:4", "John 1:1", "Matthew 28:19", "2 Corinthians 13:14", "John 14:16-17"],
  },
  {
    test: /holy\s+spirit|holy\s+ghost|who\s+is\s+the\s+spirit/,
    answer:
      "The Holy Spirit is not a force or an \"it\" — He is fully God, the third person of the Trinity, sent by the Father and the Son. He was active in creation, spoke through the prophets, and now does the deep work of salvation in people.\n\nThe Spirit convicts the world of sin, gives new birth to the dead heart (John 3:5-8), and indwells every believer as a seal and a guarantee (Romans 8:9-11). He illumines the Scriptures, leads into truth, and prays within us when we have no words. Jesus called Him \"the Counselor\" who would teach His people and remind them of His words (John 14:26).\n\nHe also forms the character of Christ in those He inhabits — \"the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control\" (Galatians 5:22-23) — and He gives gifts for the building up of the church. To walk by the Spirit is to live in step with Him, day by day.",
    citations: ["John 14:26", "Romans 8:9-11", "Acts 1:8", "Galatians 5:22-23", "John 16:13"],
  },
];

function bestStudySuggestion(terms: string[]): string {
  const scroll = SCROLL_TOPICS.map((topic) => ({
    topic,
    score: scoreText(
      terms,
      `${topic.title} ${topic.summary} ${topic.coreClaim} ${topic.subtopics.join(" ")}`,
    ),
  }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)[0];

  if (scroll) return ` To go deeper, open the study “${scroll.topic.title}” in The Scroll.`;
  return " To go deeper, open The Scroll or browse the Read library.";
}

export function localAskHopeAnswer(question: string): LocalAnswer {
  const lower = question.toLowerCase();
  const terms = normalize(question)
    .split(/\s+/)
    .filter((term) => term.length > 2);

  // 1) Curated, substantive answers for the big questions.
  for (const c of CURATED) {
    if (c.test.test(lower)) {
      return { answer: c.answer + bestStudySuggestion(terms), citations: c.citations };
    }
  }

  // 2) Keyword fallback — surface the best matching study by name.
  const scrollMatches = SCROLL_TOPICS.map((topic) => ({
    topic,
    score: scoreText(
      terms,
      `${topic.title} ${topic.summary} ${topic.coreClaim} ${topic.subtopics.join(" ")} ${topic.keyScriptures.join(" ")}`,
    ),
  }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const articleMatches = Object.values(HUBS)
    .flatMap((hub) =>
      hub.articles.map((article) => ({
        hub,
        article,
        score: scoreText(
          terms,
          `${hub.title} ${hub.description} ${article.title} ${article.subtitle} ${article.shortAnswer} ${article.keyScriptures.map((s) => s.ref).join(" ")}`,
        ),
      })),
    )
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const primaryScroll = scrollMatches[0]?.topic;
  const primaryArticle = articleMatches[0]?.article;

  if (!primaryScroll && !primaryArticle) {
    return {
      answer:
        "Here is the most faithful place to begin: bring the question back to Jesus Christ and the Scriptures. The Bible is God's own self-revelation, and its center is Christ — the eternal Word made flesh, crucified and risen for sinners. Don't build a belief from one isolated line; compare Scripture with Scripture, look for the gospel at the center, and test every claim by the whole counsel of God. If you can ask a narrower question about a specific passage, I can point you to the right study and the key verses.",
      citations: ["2 Timothy 3:16-17", "John 5:39", "Luke 24:27"],
    };
  }

  const citations = [
    ...(primaryScroll?.keyScriptures ?? []),
    ...(primaryArticle?.keyScriptures.map((s) => s.ref) ?? []),
  ].slice(0, 5);

  const articleSentence = primaryArticle ? primaryArticle.shortAnswer : "";
  const scrollSentence = primaryScroll
    ? `The Scroll study that goes deeper on this is “${primaryScroll.title}.” ${primaryScroll.coreClaim}`
    : "";
  const closing =
    "Test what you read against the whole of Scripture, and bring a narrower follow-up about the exact passage you want to study.";

  return {
    answer: [articleSentence, scrollSentence, closing].filter(Boolean).join("\n\n"),
    citations: citations.length > 0 ? citations : ["2 Timothy 3:16-17", "John 5:39"],
  };
}
