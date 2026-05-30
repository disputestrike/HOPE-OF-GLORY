/**
 * Scheduling Agent — assigns platform × time slots to content.
 *
 * Honors the daily cadence from MASTER-PLAN.md:
 *   6:00 AM CT Morning Scripture card
 *   9:00 AM CT Short teaching post
 *  12:00 PM CT Midday prayer
 *   3:00 PM CT Ask Hope featured Q&A
 *   6:00 PM CT Daily sermon
 *   8:00 PM CT Live station or premiere
 *  10:00 PM CT Night reflection
 *
 * America/Chicago timezone. Deterministic — does not call an LLM.
 */
import type { Platform } from "@hog/shared";
import type { SocialPack } from "./summarize";
import type { ComposedPost, ScheduledPost } from "@hog/publishing";

const PLATFORM_LIVE: Platform[] = [
  "instagram",
  "facebook",
  "linkedin",
  "bluesky",
  "threads",
  "mastodon",
  "pinterest",
  "discord",
  "tiktok",
  "youtube",
];

const PLATFORM_PAUSED: Platform[] = ["x"]; // built but not launched

type Slot = { hour: number; minute: number; kind: "morning" | "noon" | "afternoon" | "evening" | "night" };

const DAILY_SLOTS: Slot[] = [
  { hour: 6, minute: 0, kind: "morning" },
  { hour: 9, minute: 0, kind: "morning" },
  { hour: 12, minute: 0, kind: "noon" },
  { hour: 15, minute: 0, kind: "afternoon" },
  { hour: 18, minute: 0, kind: "evening" },
  { hour: 20, minute: 0, kind: "evening" },
  { hour: 22, minute: 0, kind: "night" },
];

function chicagoOffsetHours(date: Date): number {
  // Rough DST handling. Production: use a real tz library.
  const month = date.getUTCMonth();
  // CST = UTC-6, CDT = UTC-5
  const isDst = month >= 2 && month <= 10;
  return isDst ? 5 : 6;
}

function atChicagoTime(base: Date, hour: number, minute: number): Date {
  const offset = chicagoOffsetHours(base);
  const d = new Date(base);
  d.setUTCHours(hour + offset, minute, 0, 0);
  return d;
}

export type ScheduleInput = {
  sermonId: string;
  primaryPassage: string;
  pack: SocialPack;
  heroImageUrl?: string;
  scriptureCardUrl?: string;
  baseDate?: Date;
};

export function schedulePack(input: ScheduleInput): ScheduledPost[] {
  const base = input.baseDate ?? new Date();
  const scheduled: ScheduledPost[] = [];

  const platformContent: Partial<Record<Platform, string>> = {
    instagram: input.pack.instagramCaption,
    facebook: input.pack.instagramCaption, // re-use IG body for FB
    linkedin: input.pack.linkedinPost,
    bluesky: input.pack.blueskyPost,
    threads: input.pack.threadsPost,
    mastodon: input.pack.threadsPost,
    pinterest: input.pack.pinterestDescription,
    discord: input.pack.email.body.slice(0, 1800),
    tiktok: `${input.pack.tiktokHook}\n\n${input.pack.tiktokCaption}`,
    youtube: input.pack.youtubeDescription,
    x: input.pack.xThread[0] ?? "", // first tweet — rest is threadContinuation
  };

  for (const platform of [...PLATFORM_LIVE, ...PLATFORM_PAUSED]) {
    const content = platformContent[platform];
    if (!content) continue;

    // Pick a slot — evening for hero, morning for scripture card, etc.
    const slot = platform === "pinterest" || platform === "instagram"
      ? DAILY_SLOTS[0] // morning scripture card visual
      : platform === "tiktok" || platform === "youtube"
      ? DAILY_SLOTS[4] // evening — sermon
      : DAILY_SLOTS[3]; // mid-afternoon Q&A-ish

    const post: ComposedPost = {
      platform,
      content,
      media: input.heroImageUrl
        ? [{ url: input.heroImageUrl, mimeType: "image/jpeg" }]
        : [],
    };

    // For X, attach thread continuation.
    if (platform === "x" && input.pack.xThread.length > 1) {
      post.threadContinuation = input.pack.xThread.slice(1).map((t) => ({
        platform: "x" as const,
        content: t,
        media: [],
      }));
    }

    scheduled.push({
      ...post,
      scheduledFor: slot
        ? atChicagoTime(base, slot.hour, slot.minute)
        : atChicagoTime(base, 9, 0),
      sermonId: input.sermonId,
    });
  }

  return scheduled;
}

export function isPlatformPaused(platform: Platform): boolean {
  return PLATFORM_PAUSED.includes(platform);
}
