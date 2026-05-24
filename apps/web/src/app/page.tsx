import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hope of Glory Ministry — Filling the earth with His glory",
  description:
    "A Christian media ministry proclaiming Jesus Christ through Scripture, prayer, teaching, and apologetics. The Word of God, day after day, in every place a phone or a screen can reach.",
};

const sections = [
  {
    eyebrow: "Daily Word",
    title: "A verse and a thought for today.",
    body:
      "A short Scripture, a short reflection, posted every morning. No noise. No outrage. Just the Word of God and a few sentences to carry with you.",
    cta: { href: "/sermons" as const, label: "Today's Word" },
  },
  {
    eyebrow: "Ask Hope",
    title: "Ask a real question. Receive a scriptural answer.",
    body:
      "A Bible Q&A chat where you can ask honest questions about Scripture, faith, and the Christian life. Hope is an AI assistant — not a pastor, counselor, or spiritual director. It points you to the Word, and to the local church.",
    cta: { href: "/ask" as const, label: "Ask a question" },
  },
  {
    eyebrow: "Sermons",
    title: "Verse-by-verse teaching, Old Testament and New.",
    body:
      "Each sermon includes Scripture, written notes, and audio. Browse by book of the Bible, by topic, or by date.",
    cta: { href: "/sermons" as const, label: "Listen to sermons" },
  },
  {
    eyebrow: "Prayer",
    title: "You are not alone.",
    body:
      "If you would like prayer, you can send a request. Requests can be anonymous. We never sell, share, or publish what you send us.",
    cta: { href: "/prayer" as const, label: "Share a prayer request" },
  },
  {
    eyebrow: "Revelation",
    title: "The revelation of Jesus Christ — Christ-centered, hope-filled.",
    body:
      "Verse-by-verse teaching from the book of Revelation. No date-setting. No fear-mongering. Christ at the center, glory at the end.",
    cta: { href: "/revelation" as const, label: "Revelation desk" },
  },
  {
    eyebrow: "Apologetics",
    title: "Defending the faith — firmly and charitably.",
    body:
      "Honest answers to honest questions. We compare doctrines, not insult persons. We invite the conversation rather than shut it down.",
    cta: { href: "/apologetics" as const, label: "See the apologetics desk" },
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="section--hero">
        <div className="container-prose">
          <p className="eyebrow">A Christian media ministry</p>
          <h1 className="mx-auto">
            Filling the earth with the knowledge of the glory of the Lord.
          </h1>
          <p
            className="mt-6 mx-auto text-muted"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            Hope of Glory exists to share the gospel of Jesus Christ in plain
            words, day after day, in every place a phone or a screen can
            reach. We are small, we are honest, and we are aimed at one
            thing: helping you know the Lord who is already drawing near to
            you.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ask" className="btn btn--primary">
              Ask Hope a Question
            </Link>
            <Link href="/sermons" className="btn btn--secondary">
              Listen to Today's Sermon
            </Link>
          </div>
        </div>
      </section>

      {/* OPENING SCRIPTURE */}
      <section className="section bg-navy border-y border-[var(--border-soft)]">
        <div className="container-prose">
          <blockquote className="scripture-display border-none m-0 p-0">
            For the earth shall be filled with the knowledge of the glory of
            the Lord, as the waters cover the sea.
          </blockquote>
          <p className="scripture-ref">Habakkuk 2 : 14 · WEB</p>
        </div>
      </section>

      {/* MINISTRY GRID */}
      <section className="section">
        <div className="container-prose">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {sections.map((s) => (
              <article key={s.eyebrow} className="card">
                <p className="card__eyebrow">{s.eyebrow}</p>
                <h3 className="m-0 mb-3">{s.title}</h3>
                <p className="text-muted mb-6">{s.body}</p>
                <Link href={s.cta.href} className="btn btn--ghost">
                  {s.cta.label} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING SCRIPTURE */}
      <section className="section bg-navy border-y border-[var(--border-soft)]">
        <div className="container-prose">
          <blockquote className="scripture-display border-none m-0 p-0">
            Christ in you, the hope of glory.
          </blockquote>
          <p className="scripture-ref">Colossians 1 : 27 · WEB</p>
        </div>
      </section>

      {/* AI NOTE + START HERE */}
      <section className="section">
        <div className="container-prose grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="eyebrow">A note about AI</p>
            <h2 className="m-0 mb-4">A help, not a head.</h2>
            <p className="text-muted">
              Hope of Glory uses AI tools to help produce sermons, prayer
              prompts, study notes, audio, and visuals. A human reviews what
              we publish.
            </p>
            <p className="text-muted">
              AI is a help, not a head. The Word of God is the Word of God,
              and Christ alone is Lord of the church.
            </p>
            <Link href="/ai-disclosure" className="btn btn--ghost mt-2">
              Read our full AI disclosure →
            </Link>
          </div>
          <div>
            <p className="eyebrow">New to Christ?</p>
            <h2 className="m-0 mb-4">Start here.</h2>
            <p className="text-muted">
              If you have just begun to follow Jesus — or you are still
              wondering who He is — start here. We will walk with you and
              point you to a faithful local church near you.
            </p>
            <Link href="/new-believers" className="btn btn--primary mt-2">
              Begin
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
