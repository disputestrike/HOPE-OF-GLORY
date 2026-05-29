/**
 * 30-Day Hope for the Hurting Heart - daily email template.
 *
 * Trigger: user starts the soul-care journey.
 * Cadence: one email per day for 30 days.
 * CTA: "Open today's comfort" -> ctaUrl (the canonical day page on the site).
 *
 * This flow is for vulnerable readers. It never solicits donations, never
 * promises outcomes, and surfaces direct crisis help on days 2 and 20.
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

export type HurtingHeartDay = {
  /** 1-30. */
  day: number;
  /** Optional chapter label such as "Sees" or "Wounded". */
  chapterName?: string;
  theme: string;
  subtitle: string;
  scriptureRef: string;
  scriptureText: string;
  /** Pastoral reflection. Plain text or simple HTML. */
  reflection: string;
  /** Short closing prayer. */
  prayer: string;
  /** Single next-step sentence. */
  nextStep: string;
};

export type HurtingHeartOpts = {
  givenName?: string;
  /** Canonical URL for today's reading on the site - required. */
  ctaUrl: string;
  /** Force the 988/911 line for caller-detected crisis content. */
  includeSafetyLine?: boolean;
};

const REFLECTION_WORDS = 90;
const CRISIS_REFLECTION_WORDS = 70;

const SAFETY_LINE =
  "If you may hurt yourself or cannot stay safe, pause here and call or text 988 now in the U.S., or call 911 for immediate danger. Outside the U.S., contact local emergency services.";

function isDefaultCrisisDay(day: number): boolean {
  return day === 2 || day === 20;
}

function wordCount(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

function truncateWords(s: string, max: number): string {
  const words = s.split(/\s+/).filter(Boolean);
  if (words.length <= max) return s;
  return words.slice(0, max).join(" ") + "...";
}

function removeEmbeddedSafetyLine(s: string): string {
  return s.replace(
    /^If you are thinking about ending your life right now,[\s\S]*?We are here\.\s*/i,
    ""
  );
}

function compactReflection(day: HurtingHeartDay, includeSafetyLine: boolean): string {
  const plain = removeEmbeddedSafetyLine(stripHtml(day.reflection));
  const limit = includeSafetyLine ? CRISIS_REFLECTION_WORDS : REFLECTION_WORDS;
  return wordCount(plain) > limit ? truncateWords(plain, limit) : plain;
}

export function hurtingHeartDayTemplate(
  day: HurtingHeartDay,
  opts: HurtingHeartOpts
): { subject: string; html: string; text: string } {
  const name = nameSuffix(opts.givenName);
  const showSafetyLine = opts.includeSafetyLine ?? isDefaultCrisisDay(day.day);
  const reflectionText = compactReflection(day, showSafetyLine);
  const chapter = day.chapterName ? `${day.chapterName} - ` : "";
  const subject = `Day ${day.day}: ${day.theme}`;

  const safetyHtml = showSafetyLine
    ? `<p style="font-size:16px; line-height:1.55; color:#FFF8E7; margin:0 0 18px 0; padding:14px; border:1px solid rgba(212,175,55,0.55); background:rgba(212,175,55,0.08);"><strong style="color:#D4AF37;">Please pause for safety:</strong> ${SAFETY_LINE}</p>`
    : "";

  const inner = `
    ${eyebrow(`Hope for the Hurting Heart - ${chapter}Day ${day.day} of 30`)}
    ${heading(day.theme, 32)}
    <p style="font-size:17px; color:rgba(255,248,231,0.78); margin:0 0 16px 0; font-style:italic;">${day.subtitle}${name ? ` - for you${name}.` : ""}</p>
    ${safetyHtml}
    ${scripture(day.scriptureRef, day.scriptureText)}
    ${paragraph(reflectionText)}
    ${eyebrow("A prayer for today")}
    <p style="font-family:'Cormorant Garamond', Georgia, serif; font-size:19px; font-style:italic; color:#FFF8E7; margin:0 0 16px 0;">${day.prayer}</p>
    ${eyebrow("A gentle step")}
    ${paragraph(day.nextStep)}
    ${primaryButton(opts.ctaUrl, "Open today's comfort")}
  `;

  const text =
    `Day ${day.day} of 30 - ${day.theme}\n` +
    `${day.subtitle}\n\n` +
    (showSafetyLine ? `Please pause for safety: ${SAFETY_LINE}\n\n` : "") +
    `"${day.scriptureText}"\n- ${day.scriptureRef} (WEB)\n\n` +
    `${reflectionText}\n\n` +
    `A prayer for today:\n${day.prayer}\n\n` +
    `A gentle step: ${day.nextStep}\n\n` +
    `Open today's comfort: ${opts.ctaUrl}`;

  return { subject, html: shell(inner), text };
}
