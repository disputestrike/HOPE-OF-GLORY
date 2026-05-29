/**
 * Donor Stewardship.
 *
 * Trigger: a gift is recorded.
 * Cadence: immediate thank-you + monthly impact summary.
 *
 * Rules:
 *   - No emotional manipulation. No urgency. No "matching gift" pressure.
 *   - Tax-deductibility note is REQUIRED on every donor email until 501(c)(3) is granted.
 *   - Mentions amount only if the caller supplies it.
 */

import {
  shell,
  heading,
  paragraph,
  scripture,
  primaryButton,
  eyebrow,
  nameSuffix,
  BRAND_URL,
} from "./_shell";

const TAX_NOTICE = `Hope of Glory Ministry is currently completing nonprofit incorporation. Until 501(c)(3) status is granted, this gift is not yet tax-deductible. If approval applies retroactively, we will issue updated receipts as appropriate.`;

function taxNoticeHtml(): string {
  return `
    <p style="font-size:13px; color:rgba(255,248,231,0.65); margin:24px 0 0 0; padding:14px; border:1px solid rgba(255,248,231,0.15); border-radius:2px; line-height:1.5;">
      <strong style="color:rgba(255,248,231,0.85);">A note on tax deductibility:</strong>
      ${TAX_NOTICE}
    </p>`;
}

function formatAmount(amount?: string, currency?: string): string {
  if (!amount) return "";
  const cur = currency ? `${currency} ` : "";
  return ` of ${cur}${amount}`;
}

/* ------------------------- Immediate thank-you ------------------------- */

export function donorImmediateThanks(opts: {
  givenName?: string;
  amount?: string;
  currency?: string;
  isMonthly?: boolean;
  /** Override the impact page URL. */
  impactUrl?: string;
}): { subject: string; html: string; text: string } {
  const name = nameSuffix(opts.givenName);
  const amt = formatAmount(opts.amount, opts.currency);
  const monthlyLine = opts.isMonthly
    ? paragraph(
        "Because you set this up as a monthly gift, you will hear from us once a month with a short, honest summary of what your giving has funded. You can change or cancel at any time."
      )
    : "";
  const impactUrl = opts.impactUrl ?? `${BRAND_URL}/give`;

  const inner = `
    ${heading(`Thank you${name}.`, 28)}
    ${paragraph(`Your gift${amt} was received today. We do not take it lightly.`)}
    ${paragraph("Every dollar goes toward making the gospel a little more findable — sermons, articles, Ask Hope, the prayer team, and the journey. Real costs, plainly accounted for.")}
    ${monthlyLine}
    ${scripture("2 Corinthians 9:7", "Let each man give according as he has determined in his heart, not grudgingly or under compulsion, for God loves a cheerful giver.")}
    ${primaryButton(impactUrl, "See what your gift supports")}
    ${taxNoticeHtml()}
  `;

  const text =
    `Thank you${name}.\n\n` +
    `Your gift${amt} was received today. We do not take it lightly.\n\n` +
    `Every dollar goes toward making the gospel a little more findable — sermons, articles, Ask Hope, the prayer team, and the journey. Real costs, plainly accounted for.\n\n` +
    (opts.isMonthly
      ? `Because you set this up as a monthly gift, you will hear from us once a month with a short, honest summary of what your giving has funded. You can change or cancel at any time.\n\n`
      : "") +
    `"Let each man give according as he has determined in his heart, not grudgingly or under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7 (WEB)\n\n` +
    `See what your gift supports: ${impactUrl}\n\n` +
    `A note on tax deductibility: ${TAX_NOTICE}`;

  return { subject: "Thank you for your gift", html: shell(inner), text };
}

/* -------------------------- Monthly impact -------------------------- */

export function donorMonthlyImpact(opts: {
  /** Display month — e.g. "May 2026". */
  monthLabel: string;
  givenName?: string;
  /** Plain-text bullets describing what gifts funded that month. */
  impactBullets: string[];
  /** Override the impact page URL. */
  impactUrl?: string;
}): { subject: string; html: string; text: string } {
  const name = nameSuffix(opts.givenName);
  const impactUrl = opts.impactUrl ?? `${BRAND_URL}/give`;

  const bulletsHtml = opts.impactBullets
    .map(
      (b) =>
        `<li style="margin:0 0 10px 0; font-size:17px; line-height:1.5;">${b}</li>`
    )
    .join("");

  const inner = `
    ${eyebrow(`Impact · ${opts.monthLabel}`)}
    ${heading(`What your giving funded this month${name}.`)}
    ${paragraph("Here is a plain account of where your gift went in " + opts.monthLabel + ".")}
    <ul style="padding-left:20px; margin:16px 0 0 0; color:#FFF8E7;">
      ${bulletsHtml}
    </ul>
    ${paragraph("Thank you for partnering with us. We aim to steward every dollar with care, clarity, and accountability.")}
    ${primaryButton(impactUrl, "See the full breakdown")}
    ${taxNoticeHtml()}
  `;

  const text =
    `Impact · ${opts.monthLabel}\n\n` +
    `What your giving funded this month${name}.\n\n` +
    `Here is a plain account of where your gift went in ${opts.monthLabel}:\n\n` +
    opts.impactBullets.map((b) => `- ${b}`).join("\n") +
    `\n\nThank you for partnering with us. We aim to steward every dollar with care, clarity, and accountability.\n\n` +
    `See the full breakdown: ${impactUrl}\n\n` +
    `A note on tax deductibility: ${TAX_NOTICE}`;

  return {
    subject: `Hope of Glory · Impact for ${opts.monthLabel}`,
    html: shell(inner),
    text,
  };
}
