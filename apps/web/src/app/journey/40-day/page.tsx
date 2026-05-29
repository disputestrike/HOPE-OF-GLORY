import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmailSubscribeForm } from "@/components/EmailSubscribeForm";

export const metadata: Metadata = {
  title: "The 40-Day Hope of Glory Journey",
  description:
    "Forty days through the foundations of the Christian life. Come to Christ. Learn prayer and the Word. Walk in holiness. See Christ in all Scripture. Live for the glory of God.",
};

const movements = [
  {
    n: "01",
    range: "Days 1-8",
    title: "Come to Christ",
    body: "The gospel. The new birth. Repentance and faith. Assurance. What Christ has done.",
  },
  {
    n: "02",
    range: "Days 9-16",
    title: "Learn Prayer and the Word",
    body: "How to pray honestly. How to read the Bible without drowning. Meditation, memorization, the daily rhythm.",
  },
  {
    n: "03",
    range: "Days 17-24",
    title: "Walk in Holiness",
    body: "Repentance, obedience, sin and temptation, the Spirit's help, real-life holiness in money, sex, work, words.",
  },
  {
    n: "04",
    range: "Days 25-32",
    title: "See Christ in All Scripture",
    body: "From Genesis to Revelation. The Seed, the Lamb, the Suffering Servant, the King. Christ is the point.",
  },
  {
    n: "05",
    range: "Days 33-40",
    title: "Live for the Glory of God",
    body: "Mission. Local church. Suffering and hope. Baptism, communion, witness. The return of Christ.",
  },
];

export default function FortyDayJourneyPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "40-Day Journey", href: "/journey/40-day" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Discipleship</p>
          <h1>The 40-Day Hope of Glory Journey.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            Forty days through the foundations of the Christian life. One short message per
            day, in your inbox. Five movements. A clear path for seekers, brand-new
            believers, and anyone returning home.
          </p>
        </header>

        <section className="card mb-12" style={{ borderColor: "var(--glory-gold)" }}>
          <p className="card__eyebrow">A note about "40 days"</p>
          <p className="m-0 text-muted">
            We don't promise that 40 days "creates a habit." The research on habit
            formation found an average of about 66 days, with real variation. This isn't
            a magical deadline — it's a structured pastoral walk through the bedrock of
            the Christian life. Forty days is just the shape of it; the goal is Christ,
            not the calendar.
          </p>
        </section>

        <section className="mb-12">
          <h2>The five movements</h2>
          <ol className="m-0 p-0 list-none flex flex-col gap-4">
            {movements.map((m) => (
              <li key={m.n} className="card flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <p
                    className="text-3xl text-gold m-0"
                    style={{ fontFamily: "var(--font-display)", lineHeight: 1 }}
                  >
                    {m.n}
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted mt-2">
                    {m.range}
                  </p>
                </div>
                <div>
                  <h3 className="m-0 mb-2 text-warm">{m.title}</h3>
                  <p className="m-0 text-muted text-sm">{m.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <h2>What you'll receive</h2>
          <ul className="text-muted">
            <li>One short message per day for 40 days</li>
            <li>A Scripture to read, a reflection, and a prayer</li>
            <li>One small obedience step per day</li>
            <li>Links to deeper teaching when you want to go further</li>
            <li>The freedom to pause, restart, or unsubscribe one-click anytime</li>
          </ul>
        </section>

        <section className="card mb-12">
          <p className="card__eyebrow">Start now</p>
          <p className="m-0 mb-4 text-muted">
            If you want to begin immediately, open Day 1. If you want the email
            rhythm, subscribe below and the first message in the journey is Day 1.
          </p>
          <Link href="/journey/40-day/1" className="btn btn--primary">
            Open Day 1
          </Link>
        </section>

        <section className="mb-12">
          <EmailSubscribeForm flow="forty_day" sourcePage="/journey/40-day" />
        </section>

        <section>
          <p className="eyebrow">Already on it?</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/ask" className="btn btn--ghost">
              Ask Hope a question
            </Link>
            <Link href="/daily-faith" className="btn btn--ghost">
              Where Daily Faith picks up
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
