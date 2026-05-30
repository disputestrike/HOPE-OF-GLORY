import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import {
  formatLaunchDate,
  getEditorialCalendar,
  type LaunchSermon,
  type PlannedSermon,
} from "@/data/launch-schedule";
import { optionalDb } from "@/lib/server-db";

type Row = {
  series_title: string;
  series_slug: string;
  series_theme: string | null;
  sermon_id: string;
  sermon_title: string;
  primary_passage: string;
  status: string;
  scheduled_for: Date | null;
};

type CalendarCard = {
  seriesTitle: string;
  seriesSlug: string;
  seriesTheme: string;
  sermonId: string;
  sermonTitle: string;
  primaryPassage: string;
  status: string;
  scheduledFor: Date | string | null;
};

type SearchParams = Promise<{
  status?: string;
  series?: string;
  notice?: string;
}>;

async function load(): Promise<Row[]> {
  const database = await optionalDb("admin-calendar");
  if (!database) return [];
  try {
    return await database.execute<Row>(sql`
      SELECT
        series.title as series_title,
        series.slug as series_slug,
        series.description as series_theme,
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

function fromLaunch(item: LaunchSermon | PlannedSermon): CalendarCard {
  return {
    seriesTitle: item.seriesTitle,
    seriesSlug: item.seriesSlug,
    seriesTheme: item.seriesTheme,
    sermonId: item.id,
    sermonTitle: item.title,
    primaryPassage: item.primaryPassage,
    status: item.status,
    scheduledFor: item.scheduledFor,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 190);
}

async function createCalendarItem(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const primaryPassage = String(formData.get("primaryPassage") ?? "").trim();
  const seriesTitle = String(formData.get("seriesTitle") ?? "Standalone").trim() || "Standalone";
  const seriesTheme = String(formData.get("seriesTheme") ?? "").trim();
  const scheduledFor = String(formData.get("scheduledFor") ?? "").trim();
  const status = String(formData.get("status") ?? "scheduled").trim();

  if (!title || !primaryPassage || !scheduledFor) {
    redirect("/admin/calendar?notice=missing");
  }

  const database = await optionalDb("admin-calendar-create");
  if (!database) {
    redirect("/admin/calendar?notice=db_required");
  }

  const seriesSlug = slugify(seriesTitle) || "standalone";
  const sermonSlug = slugify(title);

  try {
    const seriesRows = await database.execute<{ id: string }>(sql`
      INSERT INTO sermon_series (slug, title, description, status, start_date)
      VALUES (${seriesSlug}, ${seriesTitle}, ${seriesTheme || null}, 'scheduled', ${scheduledFor}::timestamptz)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = COALESCE(EXCLUDED.description, sermon_series.description),
        updated_at = now()
      RETURNING id
    `);
    const seriesId = seriesRows[0]?.id ?? null;

    await database.execute(sql`
      INSERT INTO sermons (
        slug, series_id, title, primary_passage, status, scheduled_for, summary, metadata
      )
      VALUES (
        ${sermonSlug},
        ${seriesId},
        ${title},
        ${primaryPassage},
        ${status},
        ${scheduledFor}::timestamptz,
        ${`Scheduled teaching from ${primaryPassage}.`},
        ${JSON.stringify({ source: "admin-calendar" })}::jsonb
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        primary_passage = EXCLUDED.primary_passage,
        status = EXCLUDED.status,
        scheduled_for = EXCLUDED.scheduled_for,
        series_id = EXCLUDED.series_id,
        updated_at = now()
    `);
  } catch (error) {
    console.warn("[admin calendar] create failed:", error);
    redirect("/admin/calendar?notice=save_failed");
  }

  revalidatePath("/admin/calendar");
  revalidatePath("/calendar");
  redirect("/admin/calendar?notice=saved");
}

function noticeCopy(notice?: string) {
  switch (notice) {
    case "saved":
      return "Calendar item saved.";
    case "missing":
      return "Title, passage, and scheduled date are required.";
    case "db_required":
      return "Database is not connected yet. The production form is wired; add DATABASE_URL to save new items.";
    case "save_failed":
      return "Save failed. Check the database connection and schema.";
    default:
      return null;
  }
}

export default async function CalendarPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const dbRows = await load();
  const source = dbRows.length > 0 ? "database" : "launch schedule";
  const rows: CalendarCard[] =
    dbRows.length > 0
      ? dbRows.map((r) => ({
          seriesTitle: r.series_title,
          seriesSlug: r.series_slug,
          seriesTheme: r.series_theme ?? "",
          sermonId: r.sermon_id,
          sermonTitle: r.sermon_title,
          primaryPassage: r.primary_passage,
          status: r.status,
          scheduledFor: r.scheduled_for,
        }))
      : getEditorialCalendar().map(fromLaunch);

  const seriesOptions = Array.from(new Set(rows.map((row) => row.seriesSlug)));
  const filtered = rows.filter((row) => {
    if (params.status && row.status !== params.status) return false;
    if (params.series && row.seriesSlug !== params.series) return false;
    return true;
  });
  const notice = noticeCopy(params.notice);

  return (
    <div className="max-w-7xl">
      <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Editorial calendar</p>
          <h1 className="m-0">Sermon calendar</h1>
          <p className="text-muted m-0 mt-3">
            Plan the daily message, passage, status, and series. This same schedule feeds
            sermons, Daily Word, email, and social posts.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="admin-status admin-status--green">{source}</span>
          <span className="admin-status admin-status--gold">{rows.length} items</span>
        </div>
      </header>

      {notice ? (
        <section className="card mb-6">
          <p className="m-0 text-muted">{notice}</p>
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[26rem_1fr]">
        <aside className="card">
          <p className="card__eyebrow">Add calendar item</p>
          <form action={createCalendarItem} className="flex flex-col gap-4">
            <div>
              <label className="admin-label" htmlFor="title">Title</label>
              <input id="title" name="title" className="admin-input" placeholder="Christ in You, the Hope of Glory" />
            </div>
            <div>
              <label className="admin-label" htmlFor="primaryPassage">Primary passage</label>
              <input id="primaryPassage" name="primaryPassage" className="admin-input" placeholder="Colossians 1:27" />
            </div>
            <div>
              <label className="admin-label" htmlFor="seriesTitle">Series</label>
              <input id="seriesTitle" name="seriesTitle" className="admin-input" placeholder="Foundations: The Earth Filled With His Glory" />
            </div>
            <div>
              <label className="admin-label" htmlFor="seriesTheme">Series note</label>
              <textarea id="seriesTheme" name="seriesTheme" className="admin-textarea" placeholder="Mission, identity, and the gospel that fills the earth." />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="admin-label" htmlFor="scheduledFor">Scheduled for</label>
                <input id="scheduledFor" name="scheduledFor" type="datetime-local" className="admin-input" />
              </div>
              <div>
                <label className="admin-label" htmlFor="status">Status</label>
                <select id="status" name="status" className="admin-select" defaultValue="scheduled">
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="ready">Ready</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn--primary">Save item</button>
          </form>
        </aside>

        <section className="flex flex-col gap-4">
          <form className="card grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto]" action="/admin/calendar">
            <div>
              <label className="admin-label" htmlFor="series">Series filter</label>
              <select id="series" name="series" className="admin-select" defaultValue={params.series ?? ""}>
                <option value="">All series</option>
                {seriesOptions.map((series) => (
                  <option key={series} value={series}>{series}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label" htmlFor="status-filter">Status</label>
              <select id="status-filter" name="status" className="admin-select" defaultValue={params.status ?? ""}>
                <option value="">All statuses</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="ready">Ready</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="btn btn--secondary">Apply</button>
              <Link href="/admin/calendar" className="btn btn--ghost">Reset</Link>
            </div>
          </form>

          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="p-4">Date</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Passage</th>
                  <th className="p-4">Series</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.sermonId} className="border-b last:border-0">
                    <td className="p-4 text-sm text-muted">{formatLaunchDate(item.scheduledFor)}</td>
                    <td className="p-4">
                      <p className="m-0 font-semibold text-warm">{item.sermonTitle}</p>
                      {item.seriesTheme ? <p className="m-0 mt-1 text-xs text-muted">{item.seriesTheme}</p> : null}
                    </td>
                    <td className="p-4 text-sm text-gold">{item.primaryPassage}</td>
                    <td className="p-4 text-sm text-muted">{item.seriesTitle}</td>
                    <td className="p-4"><span className="admin-status admin-status--gold">{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  );
}
