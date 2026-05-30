import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmailSubscribeForm } from "@/components/EmailSubscribeForm";
import { getTodaysLaunchSermon } from "@/data/launch-schedule";

export const metadata: Metadata = {
  title: "Daily Word - A verse and a thought for today",
  description:
    "A short Scripture and a short reflection, posted every morning. No noise. No outrage. Just the Word of God and a few sentences to carry with you.",
};

export default function DailyWordPage() {
  const today = getTodaysLaunchSermon();

  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Messages", href: "/messages" },
            { name: "Daily Word", href: "/messages/daily-word" },
          ]}
        />
        <header className="mb-10">
          <p className="eyebrow">Daily Word</p>
          <h1>A verse and a thought for today.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            One short Scripture, one short reflection, posted every morning. No noise. No
            outrage. Just the Word of God and a few sentences to carry with you.
          </p>
        </header>

        <section className="card mb-10">
          <p className="card__eyebrow">Today's Word</p>
          <blockquote className="scripture-display border-none m-0 p-0">
            {today.summary}
          </blockquote>
          <p className="scripture-ref">{today.primaryPassage} - WEB focus</p>
          <p className="m-0 mt-5 text-muted">
            Today's full message is <strong className="text-warm">{today.title}</strong>.
            The Daily Word is drawn from the same publishing calendar that feeds sermons,
            email, and social posts, so the daily rhythm stays connected instead of scattered.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href={`/sermons/${today.slug}` as `/sermons/${string}`} className="btn btn--primary">
              Read today's sermon
            </Link>
            <Link href="/daily-faith" className="btn btn--secondary">
              Open Daily Faith
            </Link>
          </div>
        </section>

        <section className="card mb-10">
          <p className="card__eyebrow">Get it by email</p>
          <EmailSubscribeForm flow="daily_faith" sourcePage="/messages/daily-word" compact />
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/journey/40-day" className="btn btn--secondary">
            Start the 40-Day Journey
          </Link>
          <Link href="/ask" className="btn btn--ghost">
            Ask Hope
          </Link>
        </div>
      </div>
    </section>
  );
}

