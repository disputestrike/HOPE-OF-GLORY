import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  SCROLL_TOPIC_SLUGS,
  getScrollTopic,
} from "@/data/scroll-topics";

type Params = Promise<{ topic: string }>;

export async function generateStaticParams() {
  return SCROLL_TOPIC_SLUGS.map((topic) => ({ topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getScrollTopic(slug);
  if (!topic) return {};
  return {
    title: `${topic.title} — The Scroll`,
    description: topic.summary,
  };
}

export default async function ScrollTopicPage({
  params,
}: {
  params: Params;
}) {
  const { topic: slug } = await params;
  const topic = getScrollTopic(slug);
  if (!topic) notFound();

  const askUrl = `/ask?prompt=${encodeURIComponent(topic.askHopePrompt)}`;

  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "The Scroll", href: "/scroll" },
            { name: topic.title, href: `/scroll/${topic.slug}` },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">{topic.category} · The Scroll</p>
          <h1>{topic.title}</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            {topic.summary}
          </p>
        </header>

        <section className="card mb-10" style={{ borderColor: "var(--glory-gold)" }}>
          <p className="card__eyebrow">Core claim</p>
          <p className="m-0 text-warm">{topic.coreClaim}</p>
        </section>

        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <p className="card__eyebrow">Key Scriptures</p>
            <ul className="m-0">
              {topic.keyScriptures.map((ref) => (
                <li key={ref} className="text-muted">
                  <span className="text-gold">{ref}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <p className="card__eyebrow">What this study covers</p>
            <ul className="m-0">
              {topic.subtopics.map((item) => (
                <li key={item} className="text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="card mb-10">
          <p className="card__eyebrow">Study path</p>
          <ol className="m-0 text-muted">
            <li>Read the key Scriptures slowly, in context.</li>
            <li>Trace the repeated words and images through the Bible.</li>
            <li>Ask how the passage points to Christ, the gospel, and the glory of God.</li>
            <li>Compare Scripture with Scripture before forming a final conclusion.</li>
            <li>Bring your question to Ask Hope if you want a guided answer.</li>
          </ol>
        </section>

        <section className="mb-10">
          <p className="eyebrow">Go deeper</p>
          <div className="flex flex-wrap gap-3">
            <Link href={askUrl as `/ask?${string}`} className="btn btn--primary">
              Ask Hope about this
            </Link>
            <Link href="/scroll" className="btn btn--secondary">
              Back to The Scroll
            </Link>
          </div>
        </section>

        <section>
          <p className="eyebrow">Related ministry pages</p>
          <ul className="m-0 p-0 list-none">
            {topic.relatedLinks.map((link) => (
              <li key={link.href} className="mb-2">
                <Link href={link.href} className="text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
