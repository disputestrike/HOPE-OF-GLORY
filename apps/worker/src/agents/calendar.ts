/**
 * Calendar Agent — owns the editorial calendar.
 *
 * Responsibilities:
 *   - Decide what passage is preached today
 *   - Maintain the rolling series queue
 *   - Honor Christian-year alignment where applicable
 *   - Avoid hard-text rotation (no preaching Hab 2:14 weekly)
 *
 * This agent is mostly deterministic: it reads sermon_series + sermons
 * from the DB and picks the next unpublished sermon by scheduled_for.
 */
import { db } from "@hog/db";
import { sql } from "drizzle-orm";

export type CalendarPick = {
  sermonId: string;
  slug: string;
  title: string;
  primaryPassage: string;
  supportingPassages: string[];
  seriesSlug: string;
  seriesTitle: string;
  theme: string;
  scheduledFor: Date;
};

export async function pickTodaysSermon(now: Date = new Date()): Promise<CalendarPick | null> {
  // Look for a sermon scheduled today (UTC) that is not yet published.
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const rows = await db.execute<{
    id: string;
    slug: string;
    title: string;
    primary_passage: string;
    supporting_passages: string[] | null;
    series_slug: string | null;
    series_title: string | null;
    theme: string | null;
    scheduled_for: Date;
  }>(sql`
    SELECT
      s.id, s.slug, s.title, s.primary_passage, s.supporting_passages,
      series.slug as series_slug, series.title as series_title, series.theme,
      s.scheduled_for
    FROM sermons s
    LEFT JOIN sermon_series series ON series.id = s.series_id
    WHERE s.scheduled_for >= ${startOfDay.toISOString()}
      AND s.scheduled_for < ${endOfDay.toISOString()}
      AND s.status IN ('draft', 'verifying', 'ready', 'scheduled')
    ORDER BY s.scheduled_for ASC
    LIMIT 1
  `);

  const row = rows[0];
  if (!row) return null;

  return {
    sermonId: row.id,
    slug: row.slug,
    title: row.title,
    primaryPassage: row.primary_passage,
    supportingPassages: row.supporting_passages ?? [],
    seriesSlug: row.series_slug ?? "",
    seriesTitle: row.series_title ?? "",
    theme: row.theme ?? "",
    scheduledFor: row.scheduled_for,
  };
}

export async function pickNextSermon(): Promise<CalendarPick | null> {
  const rows = await db.execute<{
    id: string;
    slug: string;
    title: string;
    primary_passage: string;
    supporting_passages: string[] | null;
    series_slug: string | null;
    series_title: string | null;
    theme: string | null;
    scheduled_for: Date;
  }>(sql`
    SELECT
      s.id, s.slug, s.title, s.primary_passage, s.supporting_passages,
      series.slug as series_slug, series.title as series_title, series.theme,
      s.scheduled_for
    FROM sermons s
    LEFT JOIN sermon_series series ON series.id = s.series_id
    WHERE s.status IN ('draft', 'verifying', 'ready', 'scheduled')
    ORDER BY s.scheduled_for ASC NULLS LAST
    LIMIT 1
  `);

  const row = rows[0];
  if (!row) return null;

  return {
    sermonId: row.id,
    slug: row.slug,
    title: row.title,
    primaryPassage: row.primary_passage,
    supportingPassages: row.supporting_passages ?? [],
    seriesSlug: row.series_slug ?? "",
    seriesTitle: row.series_title ?? "",
    theme: row.theme ?? "",
    scheduledFor: row.scheduled_for,
  };
}
