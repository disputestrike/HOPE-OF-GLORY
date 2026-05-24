/**
 * Seed the editorial calendar from content/calendar/first-month.json.
 *
 * Creates sermon_series rows + placeholder sermons (status='draft').
 * The Sermon Agent fills in the content when triggered.
 *
 * Run with: pnpm seed:calendar
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { db, closeDb } from "@hog/db";
import { sql } from "drizzle-orm";

const CALENDAR_FILE = path.resolve(
  process.cwd(),
  "../content/calendar/first-month.json"
);

type CalendarFile = {
  month: string;
  anchors: string[];
  series: Array<{
    slug: string;
    title: string;
    theme: string;
    weekIndex: number;
    sermons: Array<{
      dayOfWeek?: string;
      title: string;
      primaryPassage: string;
      supportingPassages?: string[];
      angle?: string;
      callToAction?: string;
    }>;
  }>;
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function scheduledFor(weekIndex: number, dayIndex: number, baseDate: Date): Date {
  const start = new Date(baseDate);
  // Snap to next Monday
  const day = start.getUTCDay(); // 0=Sun .. 6=Sat
  const daysToMonday = day === 0 ? 1 : (8 - day) % 7;
  start.setUTCDate(start.getUTCDate() + daysToMonday);
  // Offset by (weekIndex - 1) weeks + dayIndex
  start.setUTCDate(start.getUTCDate() + (weekIndex - 1) * 7 + dayIndex);
  start.setUTCHours(6, 0, 0, 0); // 6 AM UTC ≈ 1 AM CT publish, public at 6 AM CT
  return start;
}

async function main(): Promise<void> {
  const raw = await readFile(CALENDAR_FILE, "utf8");
  const calendar = JSON.parse(raw) as CalendarFile;
  const base = new Date();

  for (const series of calendar.series) {
    const seriesRow = await db.execute<{ id: string }>(sql`
      INSERT INTO sermon_series (slug, title, theme, status)
      VALUES (${series.slug}, ${series.title}, ${series.theme}, 'planned')
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        theme = EXCLUDED.theme
      RETURNING id
    `);
    const seriesId = seriesRow[0]?.id;
    if (!seriesId) continue;

    for (let i = 0; i < series.sermons.length; i++) {
      const s = series.sermons[i];
      if (!s) continue;
      const slug = `${series.slug}-${slugify(s.title)}`;
      const sched = scheduledFor(series.weekIndex, i, base);

      await db.execute(sql`
        INSERT INTO sermons (
          slug, series_id, primary_passage, supporting_passages, title, status, scheduled_for, summary, call_to_action
        )
        VALUES (
          ${slug},
          ${seriesId},
          ${s.primaryPassage},
          ${(s.supportingPassages ?? []) as unknown as string[]}::text[],
          ${s.title},
          'draft',
          ${sched.toISOString()},
          ${s.angle ?? ""},
          ${s.callToAction ?? ""}
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          primary_passage = EXCLUDED.primary_passage,
          supporting_passages = EXCLUDED.supporting_passages,
          summary = EXCLUDED.summary,
          call_to_action = EXCLUDED.call_to_action,
          scheduled_for = EXCLUDED.scheduled_for
      `);
    }
  }

  console.log(`[seed-calendar] seeded ${calendar.series.length} series.`);
  await closeDb();
}

main().catch(async (err) => {
  console.error("[seed-calendar] failed:", err);
  await closeDb();
  process.exit(1);
});
