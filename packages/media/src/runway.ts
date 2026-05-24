/**
 * Runway Gen-3 video generation client.
 *
 * Used for: short visual scenes for sermon videos and reels.
 * Falls back to a still image (from fal.ai) + zoom if Runway is unavailable
 * — keeps the pipeline working even when budget is tight.
 */
const RUNWAY_BASE = "https://api.runwayml.com/v1";

export type VideoClip = {
  url: string;
  durationSec: number;
  width: number;
  height: number;
};

export type VideoRequest = {
  prompt: string;
  durationSec?: 5 | 10;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  seed?: number;
  // Optional reference image to constrain the visual style (URL to fal.ai Flux output)
  referenceImageUrl?: string;
};

export async function generateClip(req: VideoRequest): Promise<VideoClip> {
  const key = process.env.RUNWAY_API_KEY;
  if (!key) throw new Error("RUNWAY_API_KEY not set");

  const payload = {
    promptText: req.prompt,
    promptImage: req.referenceImageUrl,
    model: "gen3a_turbo",
    duration: req.durationSec ?? 5,
    ratio: (req.aspectRatio ?? "16:9").replace(":", "_"),
    seed: req.seed,
  };

  // 1. Submit job
  const submitRes = await fetch(`${RUNWAY_BASE}/image_to_video`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "X-Runway-Version": "2024-11-06",
    },
    body: JSON.stringify(payload),
  });
  if (!submitRes.ok) {
    const text = await submitRes.text().catch(() => "");
    throw new Error(`[runway] submit HTTP ${submitRes.status}: ${text.slice(0, 200)}`);
  }
  const { id } = (await submitRes.json()) as { id: string };

  // 2. Poll for completion (typically 30-90s for a 5s clip).
  const deadline = Date.now() + 5 * 60_000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 5_000));
    const statusRes = await fetch(`${RUNWAY_BASE}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${key}`, "X-Runway-Version": "2024-11-06" },
    });
    if (!statusRes.ok) continue;
    const status = (await statusRes.json()) as {
      status: string;
      output?: string[];
      failure?: string;
    };
    if (status.status === "SUCCEEDED" && status.output?.[0]) {
      const aspect = req.aspectRatio ?? "16:9";
      const [w, h] = aspect === "16:9" ? [1280, 720] : aspect === "9:16" ? [720, 1280] : [1024, 1024];
      return {
        url: status.output[0],
        durationSec: req.durationSec ?? 5,
        width: w,
        height: h,
      };
    }
    if (status.status === "FAILED") {
      throw new Error(`[runway] generation failed: ${status.failure ?? "unknown"}`);
    }
  }
  throw new Error("[runway] timed out waiting for clip");
}
