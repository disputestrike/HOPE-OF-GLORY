import { db } from "@hog/db";
import { sql } from "drizzle-orm";

type Row = {
  series_title: string;
  series_slug: string;
  series_theme: string;
  sermon_id: string;
  sermon_title: string;
  primary_passage: string;
  status: string;
  scheduled_for: Date | null;
};

async function load(): Promise<Row[]> {
  try {
    return await db.execute<Row>(sql`
      SELECT
        series.title as series_title,
        series.slug as series_slug,
        series.theme as series_theme,
        s.id as sermon_id,
        s.title as sermon_title,
        s.primary_passage,
        s.status,
        s.scheduled_for
      FROM sermons s
      LEFT JOIN sermon_series series ON series.id = s.series_id
      ORDER BY s.scheduled_for ASC NULLS LAST
    `);
  } catch {
    return [];
  }
}

export default async function CalendarPage() {
  const rows = await load();
  const bySeries = new Map<string, Row[]>();
  for (const r of rows) {
    const arr = bySeries.get(r.series_slug ?? "_standalone") ?? [];
    arr.push(r);
    bySeries.set(r.series_slug ?? "_standalone", arr);
  }

  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Editorial calendar</p>
        <h1 className="m-0">Sermon series</h1>
        <p className="text-muted m-0 mt-3">
          The rolling 5-week schedule. Each entry shows what the Calendar Agent will pick next.
        </p>
      </header>

      {bySeries.size === 0 ? (
        <div className="card">
          <p className="m-0 text-muted">
            Run <code>pnpm seed:calendar</code> to populate the calendar from{" "}
            <code>content/calendar/first-month.json</code>.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {Array.from(bySeries.entries()).map(([slug, sermons]) => {
            const first = sermons[0];
            return (
              <article key={slug} className="card">
                <p className="card__eyebrow">{first?.series_title ?? "Standalone"}</p>
                {first?.series_theme ? (
                  <p className="text-muted text-sm m-0 mb-4">{first.series_theme}</p>
                ) : null}
                <ol className="flex flex-col gap-2 m-0 p-0 list-none">
                  {sermons.map((s) => (
                    <li
                      key={s.sermon_id}
                      className="flex items-center justify-between gap-4 border-b border-[var(--border-soft)] last:border-0 py-2"
                    >
                      <div>
                        <p className="m-0 text-warm">{s.sermon_title}</p>
                        <p className="m-0 text-gold text-sm">{s.primary_passage}</p>
                      </div>
                      <div className="text-right text-sm text-muted">
                        <p className="m-0">
                          {s.scheduled_for ? new Date(s.scheduled_for).toLocaleDateString("en-US") : "—"}
                        </p>
                        <p className="m-0 uppercase tracking-[0.16em] text-xs">{s.status}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
