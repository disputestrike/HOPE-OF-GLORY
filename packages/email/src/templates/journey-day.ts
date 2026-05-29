/**
 * 40-Day Journey — daily email template.
 *
 * Trigger: user starts the journey.
 * Cadence: one email per day for 40 days.
 * CTA: "Open today's reading" → ctaUrl (the canonical day page on the site).
 *
 * The reflection is shown in full if it is short (< 110 words) and gently
 * truncated otherwise — the full reading lives on the web page.
 */

import {
  shell,
  heading,
  paragraph,
  scripture,
  primaryButton,
  eyebrow,
  nameSuffix,
  stripHtml,
} from "./_shell";

export type JourneyDay = {
  /** 1–40. */
  day: number;
  /** Short title — e.g. "The Word made flesh". */
  theme: string;
  /** One-line subtitle/teaser. */
  subtitle: string;
  /** e.g. "John 1:1-18". */
  scriptureRef: string;
  /** WEB text of the passage (short pull-quote — 1–3 verses). */
  scriptureText: string;
  /** Long-form reflection. Plain text or simple HTML (paragraphs separated by blank lines or <p>). */
  reflection: string;
  /** Short closing prayer. */
  prayer: string;
  /** Single next-step sentence — e.g. "Read the full reflection and journal today's prompt." */
  nextStep: string;
};

export type JourneyOpts = {
  givenName?: string;
  /** Canonical URL for today's reading on the site — required. */
  ctaUrl: string;
};

/** Soft word-count limit for the inline reflection. */
const FULL_REFLECTION_LIMIT = 110;
/** Target length when truncating so the whole email stays near 120-220 words. */
const TRUNCATED_REFLECTION_WORDS = 95;

function wordCount(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

function truncateWords(s: string, max: number): string {
  const words = s.split(/\s+/).filter(Boolean);
  if (words.length <= max) return s;
  return words.slice(0, max).join(" ") + "…";
}

/** Convert paragraphs of plain text (or simple HTML) into styled <p> blocks. */
function renderReflection(text: string): string {
  // If it already contains <p>, trust it.
  if (/<p[\s>]/i.test(text)) return text;
  return text
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map(
      (para) =>
        `<p style="font-size:17px; margin:0 0 16px 0;">${para.replace(/\n/g, "<br>")}</p>`
    )
    .join("");
}

export function journeyDayTemplate(
  day: JourneyDay,
  opts: JourneyOpts
): { subject: string; html: string; text: string } {
  const name = nameSuffix(opts.givenName);
  const subject = `Day ${day.day}: ${day.theme}`;

  // Decide whether to include the full reflection or truncate.
  const wc = wordCount(stripHtml(day.reflection));
  const showFull = wc < FULL_REFLECTION_LIMIT;
  const reflectionText = showFull
    ? day.reflection
    : truncateWords(stripHtml(day.reflection), TRUNCATED_REFLECTION_WORDS);
  const reflectionHtml = renderReflection(reflectionText);

  const inner = `
    ${eyebrow(`40-Day Journey · Day ${day.day} of 40`)}
    ${heading(day.theme, 32)}
    <p style="font-size:17px; color:rgba(255,248,231,0.78); margin:0 0 16px 0; font-style:italic;">${day.subtitle}${name ? ` — for you${name}.` : ""}</p>
    ${scripture(day.scriptureRef, day.scriptureText)}
    ${reflectionHtml}
    ${eyebrow("A prayer for today")}
    <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:19px; font-style:italic; color:#FFF8E7; margin:0 0 16px 0;">${day.prayer}</p>
    ${eyebrow("Today's step")}
    ${paragraph(day.nextStep)}
    ${primaryButton(opts.ctaUrl, "Open today's reading")}
  `;

  const text =
    `Day ${day.day} of 40 — ${day.theme}\n` +
    `${day.subtitle}\n\n` +
    `"${day.scriptureText}"\n— ${day.scriptureRef} (WEB)\n\n` +
    `${stripHtml(reflectionText)}\n\n` +
    `A prayer for today:\n${day.prayer}\n\n` +
    `Today's step: ${day.nextStep}\n\n` +
    `Open today's reading: ${opts.ctaUrl}`;

  return { subject, html: shell(inner), text };
}
