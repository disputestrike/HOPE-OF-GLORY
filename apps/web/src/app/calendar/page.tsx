import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { formatLaunchDate, getEditorialCalendar } from "@/data/launch-schedule";

export const metadata: Metadata = {
  title: "Ministry Calendar",
  description:
    "The Hope of Glory Ministry editorial calendar: daily sermons, Scripture focus, and the current launch schedule.",
};

export default function CalendarPage() {
  const calendar = getEditorialCalendar();

  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Messages", href: "/messages" },
            { name: "Calendar", href: "/calendar" },
          ]}
        />
        <header className="mb-10">
          <p className="eyebrow">Ministry calendar</p>
          <h1>What is being published.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            The daily sermon calendar keeps Messages, Daily Word, email, and social
            posts moving together around one Scripture focus.
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {calendar.map((item) => {
            const hasSermonPage = "fullText" in item;
            return (
              <article key={item.id} className="card">
                <p className="card__eyebrow">
                  {formatLaunchDate(item.scheduledFor)} - {item.seriesTitle}
                </p>
                <h2 className="m-0 mb-2" style={{ fontSize: "var(--fs-h3)" }}>
                  {hasSermonPage ? (
                    <Link href={`/sermons/${item.slug}` as `/sermons/${string}`} className="text-warm">
                      {item.title}
                    </Link>
                  ) : (
                    item.title
                  )}
                </h2>
                <p className="m-0 mb-3 text-gold">{item.primaryPassage}</p>
                <p className="m-0 text-muted text-sm">{item.summary}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

