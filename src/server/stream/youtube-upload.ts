/**
 * YouTube Data API — resumable upload of a finished MP4.
 *
 * Used by the daily-sermon → YouTube pipeline. The sermon hero video lives in
 * our S3 bucket; we stream it directly to YouTube's resumable upload endpoint
 * so we never need to download the whole file to local disk.
 *
 * Default privacyStatus is "unlisted" — admin reviews before promoting to
 * public from /admin/sermons/{id}. We do NOT publish straight to the world.
 *
 * Auth is shared with the live-streaming flow via getAccessToken() in
 * youtube.ts (same OAuth client, same refresh token).
 */
import { getAccessToken } from "./youtube";

const YT_UPLOAD_BASE =
  "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status";

export type YouTubeUploadOpts = {
  /** Public URL of the source mp4 (typically the S3 URL of sermons/{id}/hero.mp4). */
  videoUrl: string;
  /** YouTube video title. Truncated to 100 chars (YouTube max). */
  title: string;
  /** YouTube video description. Truncated to 5000 chars (YouTube max). */
  description: string;
  /** Up to ~15 tags, each <= 30 chars. We clean them before sending. */
  tags: string[];
  /** Defaults to "unlisted" at the caller; we don't assume here. */
  privacyStatus: "private" | "unlisted" | "public";
  /** Optional category id (YouTube taxonomy). 22 = People & Blogs (default). */
  categoryId?: string;
};

export type YouTubeUploadResult = {
  videoId: string;
  videoUrl: string;
};

/**
 * Clamp + sanitize tags. YouTube enforces ~500 total chars across all tags;
 * we keep it well under by trimming each and capping at 15.
 */
function cleanTags(input: string[]): string[] {
  return input
    .map((t) => t.trim().slice(0, 30))
    .filter((t) => t.length > 0)
    .slice(0, 15);
}

/**
 * Resumable upload: two requests.
 *   1. POST metadata, get an upload URL from the Location header.
 *   2. PUT the video bytes to that URL.
 *
 * We stream from S3 (or wherever videoUrl points) directly to YouTube.
 */
export async function uploadVideo(
  opts: YouTubeUploadOpts,
): Promise<YouTubeUploadResult> {
  const token = await getAccessToken();

  // 1. Probe the source so we have Content-Length + Content-Type for the
  //    resumable session metadata. YouTube wants both up front.
  const headRes = await fetch(opts.videoUrl, { method: "HEAD" });
  if (!headRes.ok) {
    throw new Error(
      `[youtube-upload] source HEAD failed: HTTP ${headRes.status} for ${opts.videoUrl}`,
    );
  }
  const contentLength = headRes.headers.get("content-length");
  const contentType = headRes.headers.get("content-type") ?? "video/mp4";
  if (!contentLength) {
    throw new Error(
      "[youtube-upload] source has no Content-Length; resumable upload requires it",
    );
  }

  // 2. Initiate the resumable session.
  const metadata = {
    snippet: {
      title: opts.title.slice(0, 100),
      description: opts.description.slice(0, 5000),
      tags: cleanTags(opts.tags),
      categoryId: opts.categoryId ?? "22",
    },
    status: {
      privacyStatus: opts.privacyStatus,
      selfDeclaredMadeForKids: false,
      embeddable: true,
    },
  };

  const initRes = await fetch(YT_UPLOAD_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Length": contentLength,
      "X-Upload-Content-Type": contentType,
    },
    body: JSON.stringify(metadata),
  });
  if (!initRes.ok) {
    const text = await initRes.text().catch(() => "");
    throw new Error(
      `[youtube-upload] init HTTP ${initRes.status}: ${text.slice(0, 300)}`,
    );
  }
  const uploadUrl = initRes.headers.get("location");
  if (!uploadUrl) {
    throw new Error("[youtube-upload] no Location header on init response");
  }

  // 3. Stream the bytes through. We pull the body once and forward to YouTube.
  //    For a typical 60s hero clip this is small enough to buffer; if we ever
  //    upload longer-form video we should chunk this in 256-KB multiples per
  //    the resumable-upload spec.
  const sourceRes = await fetch(opts.videoUrl);
  if (!sourceRes.ok || !sourceRes.body) {
    throw new Error(
      `[youtube-upload] source GET failed: HTTP ${sourceRes.status} for ${opts.videoUrl}`,
    );
  }
  const sourceBuffer = Buffer.from(await sourceRes.arrayBuffer());

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(sourceBuffer.length),
    },
    body: sourceBuffer,
  });
  if (!putRes.ok) {
    const text = await putRes.text().catch(() => "");
    throw new Error(
      `[youtube-upload] PUT HTTP ${putRes.status}: ${text.slice(0, 300)}`,
    );
  }
  const created = (await putRes.json()) as { id?: string };
  if (!created.id) {
    throw new Error("[youtube-upload] upload response missing video id");
  }
  return {
    videoId: created.id,
    videoUrl: `https://www.youtube.com/watch?v=${created.id}`,
  };
}
