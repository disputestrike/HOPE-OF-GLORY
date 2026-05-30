/**
 * Re-engagement — 3-touch dormant sequence.
 *
 * Trigger: subscriber has been inactive for 14, 21, or 30 days.
 * CTA: "Resume your journey".
 *
 * Rules:
 *   - No shame, no guilt, no urgency.
 *   - NEVER solicits donations.
 *   - 30-day email surfaces unsubscribe prominently and blesses the unsubscriber.
 */

import {
  shell,
  heading,
  paragraph,
  scripture,
  primaryButton,
  nameSuffix,
  BRAND_URL,
} from "./_shell";

export type ReengagementOpts = {
  givenName?: string;
  /** Override the resume CTA URL. Defaults to /journey/40-day. */
  resumeUrl?: string;
};

type Built = { subject: string; html: string; text: string };

function resumeHref(opts: ReengagementOpts): string {
  return opts.resumeUrl ?? `${BRAND_URL}/journey/40-day`;
}

/* ------------------------------ 14-day ------------------------------ */

export function reengagement14day(opts: ReengagementOpts = {}): Built {
  const name = nameSuffix(opts.givenName);
  const inner = `
    ${heading(`We've missed you${name}.`, 28)}
    ${paragraph("Life happens. You do not owe us an explanation, and you do not owe us a streak. We just wanted to say we noticed, and we are glad you exist.")}
    ${scripture("Psalm 139:1-2", "Yahweh, you have searched me, and you know me. You know my sitting down and my rising up. You perceive my thoughts from afar.")}
    ${primaryButton(resumeHref(opts), "Resume your journey")}
  `;
  const text =
    `We've missed you${name}.\n\n` +
    `Life happens. You do not owe us an explanation, and you do not owe us a streak. We just wanted to say we noticed, and we are glad you exist.\n\n` +
    `"Yahweh, you have searched me, and you know me. You know my sitting down and my rising up. You perceive my thoughts from afar." — Psalm 139:1-2 (WEB)\n\n` +
    `Resume your journey: ${resumeHref(opts)}`;

  return { subject: "We've missed you", html: shell(inner), text };
}

/* ------------------------------ 21-day ------------------------------ */

export function reengagement21day(opts: ReengagementOpts = {}): Built {
  const name = nameSuffix(opts.givenName);
  const inner = `
    ${heading("A still moment from Psalm 23.", 28)}
    ${name ? paragraph(`A short word for you${name}.`) : ""}
    ${scripture("Psalm 23:1-3", "Yahweh is my shepherd; I shall lack nothing. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.")}
    ${paragraph("Whatever season you are in — busy, tired, quiet, distracted — the Shepherd has not stopped leading. The reading is still there when you are ready.")}
    ${primaryButton(resumeHref(opts), "Resume your journey")}
  `;
  const text =
    `A still moment from Psalm 23.\n\n` +
    (name ? `A short word for you${name}.\n\n` : "") +
    `"Yahweh is my shepherd; I shall lack nothing. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul." — Psalm 23:1-3 (WEB)\n\n` +
    `Whatever season you are in — busy, tired, quiet, distracted — the Shepherd has not stopped leading. The reading is still there when you are ready.\n\n` +
    `Resume your journey: ${resumeHref(opts)}`;

  return { subject: "A still moment", html: shell(inner), text };
}

/* ------------------------------ 30-day ------------------------------ */

export function reengagement30day(opts: ReengagementOpts = {}): Built {
  const name = nameSuffix(opts.givenName);
  const inner = `
    ${heading(`One last gentle note${name}.`, 28)}
    ${paragraph("We do not want to be a weight in your inbox. If the daily emails are no longer helpful, we understand — and we would rather you have a clean inbox than feel obligated.")}
    ${paragraph("If you want to keep walking with us, the journey is one click away. If not, that's okay — no hard feelings. We will still be praying for you.")}
    ${scripture("Numbers 6:24-26", "Yahweh bless you, and keep you. Yahweh make his face to shine on you, and be gracious to you. Yahweh lift up his face toward you, and give you peace.")}
    ${primaryButton(resumeHref(opts), "Resume your journey")}
    <p style="font-size:15px; color:rgba(255,248,231,0.85); margin:32px 0 0 0; padding:16px; background:rgba(255,248,231,0.04); border-radius:2px;">
      If you would rather stop receiving these emails,
      <a href="{{unsubscribeUrl}}" style="color:#D4AF37; text-decoration:underline;">click here to unsubscribe</a>.
      No hard feelings — we will still be praying for you.
    </p>
  `;
  const text =
    `One last gentle note${name}.\n\n` +
    `We do not want to be a weight in your inbox. If the daily emails are no longer helpful, we understand — and we would rather you have a clean inbox than feel obligated.\n\n` +
    `If you want to keep walking with us, the journey is one click away. If not, that's okay — no hard feelings. We will still be praying for you.\n\n` +
    `"Yahweh bless you, and keep you. Yahweh make his face to shine on you, and be gracious to you. Yahweh lift up his face toward you, and give you peace." — Numbers 6:24-26 (WEB)\n\n` +
    `Resume your journey: ${resumeHref(opts)}\n\n` +
    `If you would rather stop receiving these emails, click here to unsubscribe: {{unsubscribeUrl}}\n` +
    `No hard feelings — we will still be praying for you.`;

  return {
    subject: "One last gentle note",
    html: shell(inner),
    text,
  };
}
