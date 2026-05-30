import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SCROLL_CATEGORIES, SCROLL_TOPICS } from "@/data/scroll-topics";

export const metadata: Metadata = {
  title: "The Scroll — Deep Bible study map",
  description:
    "A deep study map for Scripture, YHWH, Trinity, Christ in the Old Testament, Israel, Revelation, apologetics, and the whole counsel of God.",
};

export default function ScrollPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "The Scroll", href: "/scroll" },
          ]}
        />

        <header className="mb-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">The Scroll</p>
            <h1>The deep study desk.</h1>
            <p
              className="text-muted max-w-readable"
              style={{ fontSize: "var(--fs-body-lg)" }}
            >
              The Scroll is the ministry notebook: the Word of God, YHWH, Trinity,
              Jesus as God, prophecy, Israel and the nations, Revelation,
              Christianity and Islam, and the Scripture study method that holds it
              together.
            </p>
          </div>
          <figure className="m-0 overflow-hidden rounded-sm border border-[var(--border-soft)]">
            <Image
              src="/images/gallery/ministry_humanity_9.webp"
              alt="A man studying an open Bible beside a laptop"
              width={2560}
              height={1440}
              sizes="(min-width: 1024px) 600px, 100vw"
              priority
              className="aspect-[16/9] w-full object-cover"
            />
          </figure>
        </header>

        <section className="card mb-12" style={{ borderColor: "var(--glory-gold)" }}>
          <p className="card__eyebrow">How this differs from Ask Hope</p>
          <p className="m-0 text-muted">
            Ask Hope is the chat companion. The Scroll is the structured study
            map. Read a topic, trace the Scriptures, then open Ask Hope with a
            focused question when you want to go deeper.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/trust-the-scriptures" className="btn btn--secondary">
              Trust the Scriptures
            </Link>
            <Link href="/scroll/manuscripts-history-archaeology" className="btn btn--ghost">
              Manuscripts and history
            </Link>
          </div>
        </section>

        {SCROLL_CATEGORIES.map((category) => {
          const topics = SCROLL_TOPICS.filter((topic) => topic.category === category);
          if (topics.length === 0) return null;

          return (
            <section key={category} className="mb-12">
              <header className="mb-5">
                <p className="eyebrow">{category}</p>
                <h2 className="m-0">{category === "Study Method" ? "How to study" : category}</h2>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {topics.map((topic) => (
                  <article key={topic.slug} className="card">
                    <h3 className="m-0 mb-3 text-base">
                      <Link
                        href={`/scroll/${topic.slug}` as `/scroll/${string}`}
                        className="text-warm hover:text-gold no-underline"
                      >
                        {topic.title}
                      </Link>
                    </h3>
                    <p className="text-muted text-sm m-0 mb-4">{topic.summary}</p>
                    <ul className="m-0 p-0 list-none text-xs uppercase tracking-[0.12em] text-gold">
                      {topic.keyScriptures.slice(0, 3).map((ref) => (
                        <li key={ref} className="inline-block mr-3 mb-2">
                          {ref}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/scroll/${topic.slug}` as `/scroll/${string}`}
                      className="btn btn--ghost text-sm mt-4"
                      style={{ padding: "0.5rem 1rem" }}
                    >
                      Open study →
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
