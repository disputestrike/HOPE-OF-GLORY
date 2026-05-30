/**
 * Cross-package shared types.
 */
import { z } from "zod";

export const Platforms = [
  "youtube",
  "x",
  "instagram",
  "facebook",
  "tiktok",
  "linkedin",
  "bluesky",
  "threads",
  "mastodon",
  "pinterest",
  "discord",
  "email",
] as const;

export type Platform = (typeof Platforms)[number];

export const SermonStatus = z.enum([
  "draft",
  "verifying",
  "ready",
  "scheduled",
  "published",
  "withdrawn",
]);
export type SermonStatus = z.infer<typeof SermonStatus>;

export const RiskLevel = z.enum(["low", "medium", "high", "critical"]);
export type RiskLevel = z.infer<typeof RiskLevel>;

export const HumanHandoffReason = z.enum([
  "user_requested_human",
  "crisis_escalation",
  "doctrine_dispute",
  "complex_pastoral",
  "moderation_appeal",
  "donor_inquiry",
  "media_inquiry",
  "technical_support",
]);
export type HumanHandoffReason = z.infer<typeof HumanHandoffReason>;

export const PrayerPrivacy = z.enum(["public", "anonymous", "private"]);
export type PrayerPrivacy = z.infer<typeof PrayerPrivacy>;

/** Sermon JSON schema enforced on Sermon Agent output. */
export const SermonOutlineSchema = z.object({
  title: z.string(),
  primary_passage: z.string(),
  big_idea: z.string(),
  outline_points: z.array(z.string()),
  cross_references: z.array(z.string()),
  prayer_focus: z.string(),
  application_steps: z.array(z.string()),
});
export type SermonOutline = z.infer<typeof SermonOutlineSchema>;

/** Doctrine Agent verdict output. */
export const DoctrineVerdictSchema = z.object({
  verdict: z.enum(["approve", "revise", "block"]),
  score: z.number().min(0).max(1),
  anchors: z.object({
    habakkuk_2_14: z.boolean(),
    psalm_72_19: z.boolean(),
    colossians_1_27: z.boolean(),
  }).optional(),
  creedal_alignment: z.object({
    trinity: z.boolean(),
    christology: z.boolean(),
    bible_authority: z.boolean(),
  }).optional(),
  drift_flags: z.array(z.string()),
  escalate_to_human: z.boolean(),
  notes: z.string(),
});
export type DoctrineVerdict = z.infer<typeof DoctrineVerdictSchema>;
