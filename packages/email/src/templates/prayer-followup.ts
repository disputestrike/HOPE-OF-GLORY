/**
 * Prayer Request Follow-up — 3-touch sequence.
 *
 * Trigger: user submits a prayer request.
 * Cadence: same-day acknowledgment + day 3 + day 7.
 * CTA: pray again / Ask Hope. NEVER solicits donations in this flow.
 */

import {
  shell,
  heading,
  paragraph,
  scripture,
  buttonRow,
  primaryButton,
  nameSuffix,
  stripHtml,
  BRAND_URL,
} from "./_shell";

export type PrayerFollowupOpts = {
  givenName?: string;
  /** Short excerpt of the prayer request — included only if caller chooses. */
  prayerExcerpt?: string;
  /** Optional override URLs. */
  prayUrl?: string;
  askUrl?: string;
};

type Built = { subject: string; html: string; text: string };

function prayHref(o: PrayerFollowupOpts): string {
  return o.prayUrl ?? `${BRAND_URL}/prayer`;
}
function askHref(o: PrayerFollowupOpts): string {
  return o.askUrl ?? `${BRAND_URL}/ask`;
}

/* ------------------------ Same-day acknowledgment ------------------------ */

export function prayerSameDayAck(opts: PrayerFollowupOpts = {}): Built {
  const name = nameSuffix(opts.givenName);
  const excerptBlock = opts.prayerExcerpt
    ? `<p style="font-size:15px; color:rgba(255,248,231,0.7); border-left:2px solid rgba(212,175,55,0.4); padding-left:14px; margin:16px 0; font-style:italic;">"${opts.prayerExcerpt}"</p>`
    : "";

  const inner = `
    ${heading(`We received your prayer${name}.`, 28)}
    ${paragraph("Thank you for trusting us with what you shared. A member of the ministry will read it and pray for you today.")}
    ${excerptBlock}
    ${paragraph("If your situation is urgent or worsening, please call <strong style=\"color:#D4AF37;\">911</strong> for emergencies or <strong style=\"color:#D4AF37;\">988</strong> for the U.S. Suicide & Crisis Lifeline. You are not alone.")}
    ${scripture("Psalm 34:18", "The Lord is near to the brokenhearted, and saves those who have a crushed spirit.")}
    ${paragraph("You can reply to this email any time — a real person will see it.")}
  `;

  const text =
    `We received your prayer${name}.\n\n` +
    `Thank you for trusting us with what you shared. A member of the ministry will read it and pray for you today.\n\n` +
    (opts.prayerExcerpt ? `You wrote: "${opts.prayerExcerpt}"\n\n` : "") +
    `If urgent, call 988 or 911. You are not alone.\n\n` +
    `"The Lord is near to the brokenhearted, and saves those who have a crushed spirit." — Psalm 34:18 (WEB)\n\n` +
    `You can reply to this email any time — a real person will see it.`;

  return {
    subject: "We received your prayer request",
    html: shell(inner),
    text,
  };
}

/* ----------------------------- Day 3 follow-up ----------------------------- */

export function prayerThreeDayFollowup(opts: PrayerFollowupOpts = {}): Built {
  const name = nameSuffix(opts.givenName);
  const inner = `
    ${heading(`We've been praying${name}.`, 28)}
    ${paragraph("It has been a few days since you wrote, and we wanted you to know your request has not been forgotten. We have been bringing it before the Lord.")}
    ${paragraph("How are you, honestly? You can write back — even a single line. We read every reply.")}
    ${scripture("1 Peter 5:7", "casting all your worries on him, because he cares for you.")}
    ${buttonRow(
      { href: prayHref(opts), label: "Pray again" },
      { href: askHref(opts), label: "Ask Hope" }
    )}
  `;

  const text =
    `We've been praying${name}.\n\n` +
    `It has been a few days since you wrote, and we wanted you to know your request has not been forgotten. We have been bringing it before the Lord.\n\n` +
    `How are you, honestly? You can write back — even a single line. We read every reply.\n\n` +
    `"casting all your worries on him, because he cares for you." — 1 Peter 5:7 (WEB)\n\n` +
    `Pray again: ${prayHref(opts)}\n` +
    `Ask Hope: ${askHref(opts)}`;

  return {
    subject: "We've been praying. How are you?",
    html: shell(inner),
    text,
  };
}

/* ----------------------------- Day 7 check-in ----------------------------- */

export function prayerSevenDayCheckIn(opts: PrayerFollowupOpts = {}): Built {
  const name = nameSuffix(opts.givenName);
  const inner = `
    ${heading(`A week later${name}.`, 28)}
    ${paragraph("We are still praying for you. We do not need an update, and we do not want to add weight to a week that may already be heavy. We simply wanted to check in.")}
    ${paragraph("If you would like to share how things have unfolded — better, worse, or unchanged — we would be glad to hear. And if you have a new request, the prayer page is always open.")}
    ${paragraph("If you are struggling right now and need to talk with a person trained to help, the U.S. Suicide & Crisis Lifeline is available 24/7 at <strong style=\"color:#D4AF37;\">988</strong>. For emergencies, call <strong style=\"color:#D4AF37;\">911</strong>.")}
    ${scripture("Lamentations 3:22-23", "It is because of Yahweh's loving kindnesses that we are not consumed, because his compassion doesn't fail. They are new every morning. Great is your faithfulness.")}
    ${buttonRow(
      { href: prayHref(opts), label: "Share an update" },
      { href: askHref(opts), label: "Ask Hope" }
    )}
  `;

  const text =
    `A week later${name}.\n\n` +
    `We are still praying for you. We do not need an update, and we do not want to add weight to a week that may already be heavy. We simply wanted to check in.\n\n` +
    `If you would like to share how things have unfolded — better, worse, or unchanged — we would be glad to hear. And if you have a new request, the prayer page is always open.\n\n` +
    `If you are struggling right now and need to talk with a person trained to help, the U.S. Suicide & Crisis Lifeline is available 24/7 at 988. For emergencies, call 911.\n\n` +
    `"It is because of Yahweh's loving kindnesses that we are not consumed, because his compassion doesn't fail. They are new every morning. Great is your faithfulness." — Lamentations 3:22-23 (WEB)\n\n` +
    `Share an update: ${prayHref(opts)}\n` +
    `Ask Hope: ${askHref(opts)}`;

  return {
    subject: "A week later — still praying",
    html: shell(inner),
    text,
  };
}
