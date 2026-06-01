import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmailSubscribeForm } from "@/components/EmailSubscribeForm";
import { ScriptureRef } from "@/components/ScriptureRef";
import { getTodaysLaunchSermon } from "@/data/launch-schedule";

export const metadata: Metadata = {
  title: "Daily Faith — The long rhythm of life with Christ",
  description:
    "After the 40-Day Journey, keep walking. Daily Scripture, daily prayer, daily message, daily question, daily obedience step, daily share. The long rhythm of a life lived with Christ.",
};

export default function DailyFaithPage() {
  const today = getTodaysLaunchSermon();
  const sermonHref = `/sermons/${today.slug}` as `/sermons/${string}`;

  const modules: {
    title: string;
    body: string;
    scripture?: string;
    href: `/${string}`;
    cta: string;
  }[] = [
    {
      title: "Today's Scripture",
      scripture: today.primaryPassage,
      body: "Read today's passage slowly in the World English Bible. Hover the reference to read it now.",
      href: sermonHref,
      cta: "Open today's reading",
    },
    {
      title: "Today's Prayer",
      body: "Pray a few honest sentences as your own — or send a request and we will pray with you.",
      href: "/prayer",
      cta: "Pray with us",
    },
    {
      title: "Today's Message",
      body: today.summary,
      href: sermonHref,
      cta: "Read the message",
    },
    {
      title: "Today's Question",
      body: "Bring one honest question to the Word today, and sit with it. Don't rush past it.",
      href: "/ask",
      cta: "Ask Hope",
    },
    {
      title: "Today's Obedience Step",
      body: "One small, specific thing to do today. Forgive someone. Make the call. Take the next step.",
      href: "/journey/40-day",
      cta: "Continue the Journey",
    },
    {
      title: "Today's Share",
      body: "Pass something simple on — a verse, a message, a sentence — to one person who needs it.",
      href: "/messages",
      cta: "Browse Messages",
    },
  ];

  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Daily Faith", href: "/daily-faith" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Daily Faith</p>
          <h1>The long rhythm of life with Christ.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            After the 40-Day Journey, keep walking. Daily Faith is the everyday cadence
            that follows — Scripture, prayer, a short word, a question, a step, and
            something to share.
          </p>
        </header>

        <section className="card mb-12">
          <p className="card__eyebrow">Today's Message</p>
          <h2 className="m-0 mb-2" style={{ fontSize: "var(--fs-h3)" }}>
            {today.title}
          </h2>
          <p className="m-0 mb-3 text-gold">{today.primaryPassage}</p>
          <p className="m-0 mb-5 text-muted">{today.summary}</p>
          <Link href={`/sermons/${today.slug}` as `/sermons/${string}`} className="btn btn--primary">
            Read today's message
          </Link>
        </section>

        <section className="mb-12">
          <h2>Six daily modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((m) => (
              <article key={m.title} className="card flex flex-col">
                <p className="card__eyebrow">{m.title}</p>
                {m.scripture ? (
                  <p className="m-0 mb-2 text-sm">
                    <ScriptureRef reference={m.scripture} />
                  </p>
                ) : null}
                <p className="m-0 mb-4 text-muted text-sm flex-1">{m.body}</p>
                <Link
                  href={m.href}
                  className="btn btn--ghost text-sm self-start"
                  style={{ padding: "0.5rem 1rem" }}
                >
                  {m.cta} →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="card mb-12">
          <p className="card__eyebrow">How to use it</p>
          <p className="m-0 text-muted">
            10-15 minutes a day. Same time if you can. With coffee, on the train, before
            bed — Christ meets you where you are. You can take all six modules slowly,
            or just two on a busy day. The goal is faithful, not flashy.
          </p>
        </section>

        <section className="mb-12">
          <h2>Choose your rhythm</h2>
          <ul className="text-muted">
            <li><strong className="text-warm">Daily email</strong> — six modules every morning</li>
            <li><strong className="text-warm">3× per week</strong> — Monday / Wednesday / Friday</li>
            <li><strong className="text-warm">Weekend rest</strong> — daily Monday-Friday, lighter on the weekend</li>
            <li><strong className="text-warm">Self-paced</strong> — bookmark this page, open when you're ready</li>
          </ul>
        </section>

        <section className="card mb-12">
          <p className="card__eyebrow">Subscribe</p>
          <EmailSubscribeForm flow="daily_faith" sourcePage="/daily-faith" compact />
        </section>

        <section>
          <p className="eyebrow">Haven't started yet?</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/journey/40-day" className="btn btn--secondary">
              Start the 40-Day Journey first
            </Link>
            <Link href="/come-to-christ" className="btn btn--ghost">
              Come to Christ
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
