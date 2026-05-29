import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Next steps for a new believer",
  description:
    "If you have just come to Christ, here are the next steps in plain English. The Bible, prayer, the church, baptism, and the rest of your life.",
};

export default function NewBelieverNextStepsPage() {
  const steps = [
    { n: "01", title: "Tell someone you trust", body: "Speak it out loud. The first public step matters." },
    { n: "02", title: "Read one chapter of the Bible today", body: "Start in John. One chapter is enough. Mark what stands out." },
    { n: "03", title: "Pray every day", body: "Talk to him in your own words. He hears you." },
    { n: "04", title: "Find a faithful local church", body: "Not just any church. One that teaches the Bible, preaches Christ, practices baptism and communion, and lives in love." },
    { n: "05", title: "Get baptized", body: "Christ's first command for a new believer. Talk to a local pastor soon." },
    { n: "06", title: "Start the 40-Day Journey", body: "One short message per day. The foundations of the Christian life." },
    { n: "07", title: "Take communion with the local church", body: "When you are part of the body, share the meal Christ commanded." },
    { n: "08", title: "Begin to share Christ", body: "You don't need to be an expert. You just need to be a witness." },
    { n: "09", title: "Keep coming back", body: "The Christian life is daily. Not a single decision, but a lifelong following." },
  ];
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Come to Christ", href: "/come-to-christ" },
            { name: "Next steps", href: "/new-believer-next-steps" },
          ]}
        />
        <header className="mb-10">
          <p className="eyebrow">Next steps</p>
          <h1>You came to him. Now keep coming.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            The Christian life is not a one-time prayer. It is a lifelong
            relationship. Here are the steps to take this week, this month, and
            the rest of your life.
          </p>
        </header>
        <ol className="m-0 p-0 list-none flex flex-col gap-4">
          {steps.map((s) => (
            <li key={s.n} className="card flex gap-6 items-start">
              <span
                className="text-3xl text-gold flex-shrink-0"
                style={{ fontFamily: "var(--font-display)", lineHeight: 1 }}
              >
                {s.n}
              </span>
              <div>
                <h3 className="m-0 mb-2 text-warm">{s.title}</h3>
                <p className="m-0 text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-3 mt-10">
          <Link href="/journey/40-day" className="btn btn--primary">
            Start the 40-Day Journey
          </Link>
          <Link href="/ask" className="btn btn--secondary">
            Ask Hope
          </Link>
        </div>
      </div>
    </section>
  );
}
