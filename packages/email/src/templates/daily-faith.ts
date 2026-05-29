/**
 * Daily Faith devotional.
 *
 * Trigger: user completes the 40-Day Journey OR subscribes to the daily list.
 * Cadence: daily.
 * Primary CTA: "Open today's reading" → askUrl/devotional page.
 *
 * Differs from the existing `dailyDevotionalTemplate` (in templates.ts) by
 * taking a caller-supplied subject (short concrete title pulled from the
 * day's theme), and by surfacing the closing prayer.
 */

import {
  shell,
  heading,
  paragraph,
  scripture,
  primaryButton,
  secondaryButton,
  eyebrow,
  nameSuffix,
  stripHtml,
} from "./_shell";

export type DailyFaithOpts = {
  /** Short concrete subject line (≤ 60 chars). Caller supplies. */
  subject: string;
  scriptureRef: string;
  scriptureText: string;
  /** Reflection — paragraphs separated by blank lines or already-rendered HTML. */
  reflection: string;
  /** Closing prayer (plain text). */
  prayer: string;
  /** Optional companion sermon link. */
  sermonUrl?: string;
  /** Always-required deep link to the day's reading or prayer/chat surface. */
  askUrl: string;
  givenName?: string;
};

const REFLECTION_WORDS = 95;

function wordCount(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

function truncateWords(s: string, max: number): string {
  const words = s.split(/\s+/).filter(Boolean);
  if (words.length <= max) return s;
  return words.slice(0, max).join(" ") + "…";
}

function compactReflection(text: string): string {
  const plain = stripHtml(text);
  return wordCount(plain) > REFLECTION_WORDS
    ? truncateWords(plain, REFLECTION_WORDS)
    : text;
}

function renderReflection(text: string): string {
  if (/<p[\s>]/i.test(text)) return text;
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="font-size:17px; margin:0 0 16px 0;">${p.replace(/\n/g, "<br>")}</p>`
    )
    .join("");
}

export function dailyFaithTemplate(opts: DailyFaithOpts): {
  subject: string;
  html: string;
  text: string;
} {
  const name = nameSuffix(opts.givenName);
  const greeting = name
    ? `<p style="font-size:17px; margin:0 0 8px 0;">Good morning${name}.</p>`
    : "";
  const reflection = compactReflection(opts.reflection);

  const ctaBlock = opts.sermonUrl
    ? `
      <table cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0 0;"><tr><td>
        <a href="${opts.askUrl}" style="display:inline-block; padding:14px 28px; background:#D4AF37; color:#050B18; font-weight:600; font-size:15px; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; border-radius:2px;">Open today's reading</a>
      </td><td style="padding-left:12px;">
        ${secondaryButton(opts.sermonUrl, "Listen to the sermon")}
      </td></tr></table>`
    : primaryButton(opts.askUrl, "Open today's reading");

  const inner = `
    ${greeting}
    ${heading(opts.subject)}
    ${scripture(opts.scriptureRef, opts.scriptureText)}
    ${renderReflection(reflection)}
    ${eyebrow("A prayer for today")}
    <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:19px; font-style:italic; color:#FFF8E7; margin:0;">${opts.prayer}</p>
    ${ctaBlock}
  `;

  const text =
    `${opts.subject}\n\n` +
    `"${opts.scriptureText}"\n— ${opts.scriptureRef} (WEB)\n\n` +
    `${stripHtml(reflection)}\n\n` +
    `A prayer for today:\n${opts.prayer}\n\n` +
    `Open today's reading: ${opts.askUrl}` +
    (opts.sermonUrl ? `\nListen to the sermon: ${opts.sermonUrl}` : "");

  return { subject: opts.subject, html: shell(inner), text };
}
