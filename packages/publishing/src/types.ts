import type { Platform } from "@hog/shared";

export type PostMedia = {
  url: string;
  mimeType: string;
  width?: number;
  height?: number;
  altText?: string;
};

export type ComposedPost = {
  platform: Platform;
  content: string;
  media: PostMedia[];
  hashtags?: string[];
  threadContinuation?: ComposedPost[]; // for X / threads
};

export type ScheduledPost = ComposedPost & {
  scheduledFor: Date;
  sermonId?: string;
  series?: string;
};

export type PublishResult = {
  platform: Platform;
  externalId?: string;
  postUrl?: string;
  status: "scheduled" | "published" | "failed";
  error?: string;
};
