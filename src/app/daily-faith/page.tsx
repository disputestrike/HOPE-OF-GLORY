import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmailSubscribeForm } from "@/components/EmailSubscribeForm";
import { getTodaysLaunchSermon } from "@/data/launch-schedule";

export const metadata: Metadata = {
  title: "Daily Faith — The long rhythm of life with Christ",
  description:
    "After the 40-Day Journey, keep walking. Daily Scripture, daily prayer, daily message, daily question, daily obedience step, daily share. The long rhythm of a life lived with Christ.",
};

const modules = [
  { title: "Today's Scripture", body: "A passage to read, slowly, in the World English Bible." },
  { title: "Today's Prayer", body: "A few honest sentences you can pray as your own — or a starting place to write your own." },
  { title: "Today's Message", body: "A short reflection. Sometimes a sermon clip. Always pointing to Christ." },
  { title: "Today's Question", body: "One question Scripture asks of you today. Sit with it. Don't rush past it." },
  { title: "Today's Obedience Step", body: "One small, specific thing to do today. Forgive someone. Pray for someone. Send the message. Make the call." },
  { title: "Today's Share", body: "Something simple to pass on — a verse card, a clip, a sentence — to one person who might need it." },
];

export default function DailyFaithPage() {
  const today = getTodaysLaunchSermon();

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
              <article key={m.title} className="card">
                <p className="card__eyebrow">{m.title}</p>
                <p className="m-0 text-muted text-sm">{m.body}</p>
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
