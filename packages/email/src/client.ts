/**
 * Resend email client plus lifecycle send helpers.
 *
 * Persistence/audit logging lives in the caller. These helpers render the
 * correct template, substitute the unsubscribe URL, and attach Resend tags so
 * downstream webhooks/logs can identify the lifecycle flow.
 */
import { Resend } from "resend";
import {
  dailyFaithTemplate,
  donorImmediateThanks,
  donorMonthlyImpact,
  hurtingHeartDayTemplate,
  journeyDayTemplate,
  newBelieverDay0,
  newBelieverDay1,
  newBelieverDay10,
  newBelieverDay14,
  newBelieverDay3,
  newBelieverDay5,
  newBelieverDay7,
  prayerSameDayAck,
  prayerSevenDayCheckIn,
  prayerThreeDayFollowup,
  reengagement14day,
  reengagement21day,
  reengagement30day,
  weeklyDigestTemplate,
} from "./templates/index";
import type {
  DailyFaithOpts,
  HurtingHeartDay,
  HurtingHeartOpts,
  JourneyDay,
  JourneyOpts,
  NewBelieverOpts,
  PrayerFollowupOpts,
  ReengagementOpts,
  WeeklyDigestOpts,
} from "./templates/index";

let _client: Resend | null = null;
function client(): Resend {
  if (_client) return _client;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");
  _client = new Resend(key);
  return _client;
}

export type EmailTag = { name: string; value: string };

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

export type SendEmailOpts = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: EmailTag[];
  unsubscribeUrl?: string;
};

export type SendEmailResult = { id: string | null; error?: string };

export type LifecycleSendBase = {
  to: string | string[];
  replyTo?: string;
  tags?: EmailTag[];
  unsubscribeUrl?: string;
};

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://hopeofglory.ministry"
  ).replace(/\/$/, "");
}

function unsubscribeUrl(explicit?: string): string {
  return explicit ?? process.env.EMAIL_UNSUBSCRIBE_URL ?? `${siteUrl()}/unsubscribe`;
}

function replaceUnsubscribeToken(s: string, url: string): string {
  return s.replace(/\{\{unsubscribeUrl\}\}/g, url);
}

export async function sendEmail(
  opts: SendEmailOpts
): Promise<SendEmailResult> {
  const from = `${process.env.EMAIL_FROM_NAME ?? "Hope of Glory Ministry"} <${process.env.EMAIL_FROM ?? "hello@hopeofglory.ministry"}>`;
  const resolvedUnsubscribeUrl = unsubscribeUrl(opts.unsubscribeUrl);
  try {
    const res = await client().emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html: replaceUnsubscribeToken(opts.html, resolvedUnsubscribeUrl),
      text: opts.text
        ? replaceUnsubscribeToken(opts.text, resolvedUnsubscribeUrl)
        : undefined,
      replyTo: opts.replyTo,
      tags: opts.tags,
    });
    if (res.error) {
      return { id: null, error: res.error.message };
    }
    return { id: res.data?.id ?? null };
  } catch (err) {
    return { id: null, error: err instanceof Error ? err.message : "Unknown" };
  }
}

async function sendLifecycleEmail(opts: LifecycleSendBase & {
  flow: string;
  templateKey: string;
  rendered: RenderedEmail;
}): Promise<SendEmailResult> {
  return sendEmail({
    to: opts.to,
    subject: opts.rendered.subject,
    html: opts.rendered.html,
    text: opts.rendered.text,
    replyTo: opts.replyTo,
    unsubscribeUrl: opts.unsubscribeUrl,
    tags: [
      { name: "flow", value: opts.flow },
      { name: "template", value: opts.templateKey },
      ...(opts.tags ?? []),
    ],
  });
}

export type NewBelieverWelcomeStep = 0 | 1 | 3 | 5 | 7 | 10 | 14;

const newBelieverTemplates: Record<
  NewBelieverWelcomeStep,
  (opts: NewBelieverOpts) => RenderedEmail
> = {
  0: newBelieverDay0,
  1: newBelieverDay1,
  3: newBelieverDay3,
  5: newBelieverDay5,
  7: newBelieverDay7,
  10: newBelieverDay10,
  14: newBelieverDay14,
};

export async function sendNewBelieverWelcomeEmail(
  opts: LifecycleSendBase & NewBelieverOpts & { step?: NewBelieverWelcomeStep }
): Promise<SendEmailResult> {
  const step = opts.step ?? 0;
  return sendLifecycleEmail({
    ...opts,
    flow: "new_believer_welcome",
    templateKey: `new_believer_day_${step}`,
    rendered: newBelieverTemplates[step](opts),
  });
}

export async function sendFortyDayJourneyDayEmail(
  opts: LifecycleSendBase & JourneyOpts & { day: JourneyDay }
): Promise<SendEmailResult> {
  return sendLifecycleEmail({
    ...opts,
    flow: "forty_day_journey",
    templateKey: `forty_day_journey_day_${opts.day.day}`,
    rendered: journeyDayTemplate(opts.day, opts),
  });
}

export async function sendHurtingHeartDayEmail(
  opts: LifecycleSendBase & HurtingHeartOpts & { day: HurtingHeartDay }
): Promise<SendEmailResult> {
  return sendLifecycleEmail({
    ...opts,
    flow: "hurting_heart_journey",
    templateKey: `hurting_heart_day_${opts.day.day}`,
    rendered: hurtingHeartDayTemplate(opts.day, opts),
  });
}

export async function sendDailyFaithEmail(
  opts: LifecycleSendBase & DailyFaithOpts
): Promise<SendEmailResult> {
  return sendLifecycleEmail({
    ...opts,
    flow: "daily_faith",
    templateKey: "daily_faith",
    rendered: dailyFaithTemplate(opts),
  });
}

export type PrayerFollowupTouch = "same_day" | "day_3" | "day_7";

const prayerFollowupTemplates: Record<
  PrayerFollowupTouch,
  (opts: PrayerFollowupOpts) => RenderedEmail
> = {
  same_day: prayerSameDayAck,
  day_3: prayerThreeDayFollowup,
  day_7: prayerSevenDayCheckIn,
};

export async function sendPrayerFollowupEmail(
  opts: LifecycleSendBase & PrayerFollowupOpts & { touch?: PrayerFollowupTouch }
): Promise<SendEmailResult> {
  const touch = opts.touch ?? "same_day";
  return sendLifecycleEmail({
    ...opts,
    flow: "prayer_followup",
    templateKey: `prayer_followup_${touch}`,
    rendered: prayerFollowupTemplates[touch](opts),
  });
}

export async function sendWeeklyDigestEmail(
  opts: LifecycleSendBase & WeeklyDigestOpts
): Promise<SendEmailResult> {
  return sendLifecycleEmail({
    ...opts,
    flow: "weekly_digest",
    templateKey: `weekly_digest_${opts.weekOf.toLowerCase().replace(/\W+/g, "_")}`,
    rendered: weeklyDigestTemplate(opts),
  });
}

export type ReengagementTouch = "day_14" | "day_21" | "day_30";

const reengagementTemplates: Record<
  ReengagementTouch,
  (opts: ReengagementOpts) => RenderedEmail
> = {
  day_14: reengagement14day,
  day_21: reengagement21day,
  day_30: reengagement30day,
};

export async function sendReengagementEmail(
  opts: LifecycleSendBase & ReengagementOpts & { touch: ReengagementTouch }
): Promise<SendEmailResult> {
  return sendLifecycleEmail({
    ...opts,
    flow: "reengagement",
    templateKey: `reengagement_${opts.touch}`,
    rendered: reengagementTemplates[opts.touch](opts),
  });
}

export type DonorStewardshipTouch = "immediate_thanks" | "monthly_impact";

export type SendDonorImmediateThanksEmailOpts = LifecycleSendBase &
  Parameters<typeof donorImmediateThanks>[0];

export type SendDonorMonthlyImpactEmailOpts = LifecycleSendBase &
  Parameters<typeof donorMonthlyImpact>[0];

export async function sendDonorImmediateThanksEmail(
  opts: SendDonorImmediateThanksEmailOpts
): Promise<SendEmailResult> {
  return sendLifecycleEmail({
    ...opts,
    flow: "donor_stewardship",
    templateKey: "donor_immediate_thanks",
    rendered: donorImmediateThanks(opts),
  });
}

export async function sendDonorMonthlyImpactEmail(
  opts: SendDonorMonthlyImpactEmailOpts
): Promise<SendEmailResult> {
  return sendLifecycleEmail({
    ...opts,
    flow: "donor_stewardship",
    templateKey: "donor_monthly_impact",
    rendered: donorMonthlyImpact(opts),
  });
}

export async function sendDonorStewardshipEmail(
  opts:
    | (SendDonorImmediateThanksEmailOpts & { touch: "immediate_thanks" })
    | (SendDonorMonthlyImpactEmailOpts & { touch: "monthly_impact" })
): Promise<SendEmailResult> {
  if (opts.touch === "monthly_impact") {
    return sendDonorMonthlyImpactEmail(opts);
  }
  return sendDonorImmediateThanksEmail(opts);
}
