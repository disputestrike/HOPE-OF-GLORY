/**
 * Weekly Digest — opt-in roundup.
 *
 * Trigger: all opted-in subscribers.
 * Cadence: weekly.
 * Subject: "Hope of Glory · Week of {weekOf}".
 *
 * Sections render only if their data is provided. No content = no section.
 */

import {
  shell,
  heading,
  paragraph,
  scripture,
  primaryButton,
  secondaryButton,
  eyebrow,
} from "./_shell";

export type WeeklyDigestOpts = {
  /** Display string for the week — e.g. "May 26, 2026". */
  weekOf: string;
  featuredSermon?: { title: string; url: string; summary: string };
  featuredArticle?: { title: string; url: string; hub: string };
  featuredJourneyDay?: { day: number; theme: string; url: string };
  /** Optional pastoral line — e.g. a one-sentence answered-prayer snapshot. No names. */
  prayerHighlight?: string;
};

function section(html: string): string {
  return `<div style="margin:32px 0 0 0; padding-top:24px; border-top:1px solid rgba(255,248,231,0.10);">${html}</div>`;
}

export function weeklyDigestTemplate(opts: WeeklyDigestOpts): {
  subject: string;
  html: string;
  text: string;
} {
  const sections: string[] = [];
  const textSections: string[] = [];

  if (opts.featuredSermon) {
    const s = opts.featuredSermon;
    sections.push(
      section(`
        ${eyebrow("Watch / Listen")}
        ${heading(s.title, 24)}
        ${paragraph(s.summary)}
        ${primaryButton(s.url, "Open the sermon")}
      `)
    );
    textSections.push(
      `WATCH / LISTEN\n${s.title}\n${s.summary}\nOpen: ${s.url}`
    );
  }

  if (opts.featuredArticle) {
    const a = opts.featuredArticle;
    sections.push(
      section(`
        ${eyebrow(`Read · ${a.hub}`)}
        ${heading(a.title, 24)}
        ${primaryButton(a.url, "Read the article")}
      `)
    );
    textSections.push(
      `READ · ${a.hub.toUpperCase()}\n${a.title}\nRead: ${a.url}`
    );
  }

  if (opts.featuredJourneyDay) {
    const j = opts.featuredJourneyDay;
    sections.push(
      section(`
        ${eyebrow(`40-Day Journey · Day ${j.day}`)}
        ${heading(j.theme, 24)}
        ${paragraph("A featured stop from this week's journey readings.")}
        ${secondaryButton(j.url, "Open day " + j.day)}
      `)
    );
    textSections.push(
      `40-DAY JOURNEY · DAY ${j.day}\n${j.theme}\nOpen: ${j.url}`
    );
  }

  if (opts.prayerHighlight) {
    sections.push(
      section(`
        ${eyebrow("From the prayer wall")}
        <p style="font-family:'Cormorant Garamond', Georgia, serif; font-style:italic; font-size:19px; line-height:1.4; color:#FFF8E7; margin:0;">${opts.prayerHighlight}</p>
      `)
    );
    textSections.push(`FROM THE PRAYER WALL\n${opts.prayerHighlight}`);
  }

  const inner = `
    <p style="font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:#D4AF37; margin:24px 0 0 0;">Week of ${opts.weekOf}</p>
    ${heading("This week at Hope of Glory")}
    ${paragraph("A short walk through what was made this week — sermons, articles, journey readings, and a glimpse of the prayer wall. Take whichever piece meets you where you are.")}
    ${sections.length === 0 ? scripture("Psalm 118:24", "This is the day that Yahweh has made. We will rejoice and be glad in it!") : sections.join("")}
  `;

  const text =
    `Hope of Glory · Week of ${opts.weekOf}\n\n` +
    (textSections.length > 0
      ? textSections.join("\n\n")
      : `"This is the day that Yahweh has made. We will rejoice and be glad in it!" — Psalm 118:24 (WEB)`);

  return {
    subject: `Hope of Glory · Week of ${opts.weekOf}`,
    html: shell(inner),
    text,
  };
}
