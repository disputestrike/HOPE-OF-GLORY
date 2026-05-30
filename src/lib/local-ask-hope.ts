import { HUBS } from "@/data/read-library";
import { SCROLL_TOPICS } from "@/data/scroll-topics";

type LocalAnswer = {
  answer: string;
  citations: string[];
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function scoreText(queryTerms: string[], text: string): number {
  const normalized = normalize(text);
  return queryTerms.reduce((score, term) => score + (normalized.includes(term) ? 1 : 0), 0);
}

export function localAskHopeAnswer(question: string): LocalAnswer {
  const terms = normalize(question)
    .split(/\s+/)
    .filter((term) => term.length > 2);

  const scrollMatches = SCROLL_TOPICS.map((topic) => ({
    type: "scroll" as const,
    score: scoreText(
      terms,
      `${topic.title} ${topic.summary} ${topic.coreClaim} ${topic.subtopics.join(" ")} ${topic.keyScriptures.join(" ")}`,
    ),
    topic,
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
        "Here is the safest way to begin: bring the question back to Jesus Christ and the Scriptures. The Bible is God's self-revelation, and its center is Christ: the eternal Word made flesh, crucified and risen for sinners. Ask Hope can help you trace the question through Scripture, but do not build doctrine from one isolated line. Compare Scripture with Scripture, look for the gospel center, and test every claim by the whole counsel of God.",
      citations: ["2 Timothy 3:16-17", "John 5:39", "Luke 24:27"],
    };
  }

  const citations = [
    ...(primaryScroll?.keyScriptures ?? []),
    ...(primaryArticle?.keyScriptures.map((s) => s.ref) ?? []),
  ].slice(0, 5);

  const scrollSentence = primaryScroll
    ? `${primaryScroll.coreClaim} The Scroll study to open next is "${primaryScroll.title}".`
    : "";
  const articleSentence = primaryArticle ? primaryArticle.shortAnswer : "";
  const nextLink = primaryScroll
    ? `/scroll/${primaryScroll.slug}`
    : articleMatches[0]
      ? `/read/${articleMatches[0].hub.slug}/${articleMatches[0].article.slug}`
      : "/read";

  return {
    answer: [
      "I hear the question. A biblical answer should not be shallow or argumentative; it should tell the truth, point to Christ, and stay anchored in Scripture.",
      articleSentence,
      scrollSentence,
      `A good next step is to read ${nextLink} and then ask a narrower follow-up question from the exact passage you want to study.`,
    ]
      .filter(Boolean)
      .join("\n\n"),
    citations: citations.length > 0 ? citations : ["2 Timothy 3:16-17", "John 5:39"],
  };
}

