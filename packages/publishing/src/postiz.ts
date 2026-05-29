/**
 * Self-hosted Postiz client.
 *
 * Postiz (MIT, self-hostable) handles per-platform posting OAuth + queue.
 * We deploy it as a sibling Railway service and call its public API.
 *
 * Setup: see docs/runbook/postiz-self-host.md
 *
 * The Postiz API surface evolves — this wrapper centralizes the URL
 * building so we can adapt to version changes without touching every
 * agent. POSTIZ_URL and POSTIZ_API_KEY must be set in env.
 */
import type { ComposedPost, PublishResult } from "./types";
import type { Platform } from "@hog/shared";

function postizBase(): string {
  return process.env.POSTIZ_URL ?? "http://localhost:3000";
}

function postizKey(): string {
  return process.env.POSTIZ_API_KEY ?? "";
}

type PostizIntegration = {
  id: string;
  providerIdentifier: string;
  name: string;
  picture?: string;
};

type PostizCreateRequest = {
  type: "now" | "schedule" | "draft";
  date?: string;
  tags?: string[];
  shortLink?: boolean;
  posts: Array<{
    integration: { id: string };
    value: Array<{
      content: string;
      image?: Array<{ id?: string; path?: string; url?: string }>;
    }>;
  }>;
};

type PostizCreateResponse = {
  posts: Array<{ id: string; integrationId?: string; releaseURL?: string }>;
};

async function request<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {}
): Promise<T> {
  const { json, ...rest } = init;
  const res = await fetch(`${postizBase()}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${postizKey()}`,
      "Content-Type": "application/json",
      ...(rest.headers ?? {}),
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[postiz] HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

export async function listIntegrations(): Promise<PostizIntegration[]> {
  return request<PostizIntegration[]>("/public/v1/integrations", { method: "GET" });
}

/** Maps our Platform enum to Postiz provider identifiers. */
const PROVIDER_MAP: Record<Platform, string> = {
  youtube: "youtube",
  x: "x",
  instagram: "instagram",
  facebook: "facebook",
  tiktok: "tiktok",
  linkedin: "linkedin",
  bluesky: "bluesky",
  threads: "threads",
  mastodon: "mastodon",
  pinterest: "pinterest",
  discord: "discord",
  email: "email", // not a Postiz target — handled by Resend, but listed for completeness
};

async function findIntegrationId(platform: Platform): Promise<string | null> {
  const provider = PROVIDER_MAP[platform];
  if (!provider) return null;
  const integrations = await listIntegrations().catch(() => []);
  const match = integrations.find((i) => i.providerIdentifier === provider);
  return match?.id ?? null;
}

export async function schedulePost(opts: {
  post: ComposedPost;
  scheduledFor: Date;
  tags?: string[];
}): Promise<PublishResult> {
  if (opts.post.platform === "email") {
    // Email is handled by Resend, not Postiz.
    return {
      platform: "email",
      status: "failed",
      error: "Use Resend client for email posts",
    };
  }
  if (!postizKey()) {
    return {
      platform: opts.post.platform,
      status: "failed",
      error: "POSTIZ_API_KEY not configured",
    };
  }

  const integrationId = await findIntegrationId(opts.post.platform).catch(() => null);
  if (!integrationId) {
    return {
      platform: opts.post.platform,
      status: "failed",
      error: `No connected ${opts.post.platform} integration in Postiz`,
    };
  }

  const payload: PostizCreateRequest = {
    type: "schedule",
    date: opts.scheduledFor.toISOString(),
    tags: opts.tags,
    shortLink: false,
    posts: [
      {
        integration: { id: integrationId },
        value: [
          {
            content: opts.post.content,
            image: opts.post.media.map((m) => ({ url: m.url })),
          },
          ...(opts.post.threadContinuation ?? []).map((t) => ({
            content: t.content,
            image: t.media.map((m) => ({ url: m.url })),
          })),
        ],
      },
    ],
  };

  try {
    const res = await request<PostizCreateResponse>("/public/v1/posts", {
      method: "POST",
      json: payload,
    });
    const first = res.posts[0];
    return {
      platform: opts.post.platform,
      externalId: first?.id,
      postUrl: first?.releaseURL,
      status: "scheduled",
    };
  } catch (err) {
    return {
      platform: opts.post.platform,
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown",
    };
  }
}
