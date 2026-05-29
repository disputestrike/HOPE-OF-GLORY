/**
 * Generic audio pipeline — text → narration → S3.
 *
 * Used by:
 *   - Apologetics agent (optional spoken response)
 *   - Sermon pipeline (already wired via renderSermonAssets)
 *   - Any future surface (Hope Line voicemail playback, devotional shorts, etc.)
 *
 * Behavior contract:
 *   - Provider-agnostic on the outside; internally Deepgram Aura.
 *   - Public copy MUST NOT name the provider.
 *   - Output audio contains the source text VERBATIM. TTS does not paraphrase,
 *     summarize, or invent. Callers may concatenate / lightly format their own
 *     narration text before passing it in.
 *   - All operations are gated by env presence. If Deepgram or S3 is not
 *     configured, returns null instead of throwing — callers degrade gracefully.
 *   - Audio assets are immutable; we set 1-year immutable cache headers.
 *
 * Cost note: Deepgram bills per character. We dedupe via Redis when available
 * (SHA-256 of the narration text → cached S3 URL) so re-renders of the same
 * text (e.g. the same apologetics question asked twice) reuse the existing
 * S3 object instead of re-billing. The cache is best-effort; if Redis is
 * unreachable we just re-render.
 */
import { createHash } from "node:crypto";
import {
  synthesize,
  synthesizeLong,
  upload,
  APPROVED_VOICES,
  type DeepgramVoice,
  MAX_CHARS_PER_REQUEST,
} from "@hog/media";

export type RenderAudioResult = {
  url: string;
  durationSec: number;
  voice: string;
};

export type RenderAudioOpts = {
  /** The narration text. Will be spoken verbatim. */
  text: string;
  /** S3 object key, e.g. "apologetics/{sessionId}.mp3" or "sermons/{id}/audio.mp3". */
  key: string;
  /**
   * If text is shorter than this many trimmed characters, skip rendering.
   * Defaults to 50 — TTS for a 6-word reply is wasted money.
   */
  skipIfShort?: number;
  /** Optional voice override. Defaults to DEEPGRAM_TTS_VOICE env or the warm masculine voice. */
  voice?: DeepgramVoice;
  /**
   * If true, skip Redis dedupe (always re-render).
   * Default false — we prefer to dedupe when Redis is available.
   */
  noCache?: boolean;
};

/**
 * Resolve the default voice from env, falling back to a warm masculine voice
 * suitable for apologetics + teaching content. The brief calls out
 * "aura-2-helios-en" but Deepgram's stable production model name on the
 * approved list is "aura-helios-en"; we accept either spelling in env and
 * normalize.
 */
function resolveDefaultVoice(): DeepgramVoice {
  const raw = (process.env.DEEPGRAM_TTS_VOICE ?? "").trim();
  if (!raw) return "aura-helios-en";
  // Tolerate the "aura-2-x" alias by stripping the "-2".
  const normalized = raw.replace(/^aura-2-/, "aura-") as DeepgramVoice;
  if (APPROVED_VOICES.includes(normalized)) return normalized;
  console.warn(
    `[audio] DEEPGRAM_TTS_VOICE=${raw} is not on the approved list; falling back to aura-helios-en`,
  );
  return "aura-helios-en";
}

function ttsConfigured(): boolean {
  return Boolean(process.env.DEEPGRAM_API_KEY);
}
function s3Configured(): boolean {
  return Boolean(process.env.S3_BUCKET);
}

/**
 * SHA-256 hash of the narration text (lowercased + collapsed whitespace) plus
 * the voice. Used as the dedupe key.
 */
function fingerprint(text: string, voice: string): string {
  const normalized = text.trim().replace(/\s+/g, " ").toLowerCase();
  return createHash("sha256").update(`${voice}:${normalized}`).digest("hex");
}

/**
 * Try to load a cached S3 URL for an identical earlier render.
 * Best-effort: returns null on any failure (no Redis, key not found, parse error).
 */
async function loadCached(fp: string): Promise<string | null> {
  if (!process.env.REDIS_URL) return null;
  try {
    const { createClient } = await import("redis");
    const client = createClient({ url: process.env.REDIS_URL });
    client.on("error", () => {});
    await client.connect();
    const url = await client.get(`tts:${fp}`);
    await client.quit().catch(() => {});
    return url && typeof url === "string" ? url : null;
  } catch {
    return null;
  }
}

async function saveCached(fp: string, url: string): Promise<void> {
  if (!process.env.REDIS_URL) return;
  try {
    const { createClient } = await import("redis");
    const client = createClient({ url: process.env.REDIS_URL });
    client.on("error", () => {});
    await client.connect();
    // 90 days is enough — apologetics questions are repeated within a season.
    await client.set(`tts:${fp}`, url, { EX: 60 * 60 * 24 * 90 });
    await client.quit().catch(() => {});
  } catch {
    // ignore
  }
}

/**
 * Render narration audio for any text and upload to S3.
 *
 * Returns null when:
 *   - DEEPGRAM_API_KEY is not set (TTS unavailable)
 *   - S3_BUCKET is not set (no upload target)
 *   - Trimmed text is shorter than skipIfShort
 *
 * The caller is responsible for persisting the returned URL anywhere it
 * needs to live (chat_messages, sermon_assets, etc).
 */
export async function renderAudio(
  opts: RenderAudioOpts,
): Promise<RenderAudioResult | null> {
  const skipIfShort = opts.skipIfShort ?? 50;
  const trimmed = opts.text.trim();
  if (trimmed.length < skipIfShort) return null;
  if (!ttsConfigured()) return null;
  if (!s3Configured()) return null;

  const voice = opts.voice ?? resolveDefaultVoice();
  const fp = fingerprint(trimmed, voice);

  // 1. Dedupe — same text + voice in the last 90 days reuses the URL.
  if (!opts.noCache) {
    const cached = await loadCached(fp);
    if (cached) {
      return { url: cached, durationSec: 0, voice };
    }
  }

  // 2. Synthesize. Use chunked path when over Deepgram's per-request cap
  //    so long apologetics answers and full sermons both Just Work.
  let buffer: Buffer;
  let durationSec = 0;
  try {
    if (trimmed.length > MAX_CHARS_PER_REQUEST) {
      const parts = await synthesizeLong(trimmed, voice);
      buffer = Buffer.concat(parts.map((p) => p.audioBuffer));
      durationSec = parts.reduce(
        (sum, p) => sum + (p.approxDurationSeconds ?? 0),
        0,
      );
    } else {
      const single = await synthesize(trimmed, voice);
      buffer = single.audioBuffer;
      durationSec = single.approxDurationSeconds ?? 0;
    }
  } catch (err) {
    console.warn("[audio] synthesize failed:", err instanceof Error ? err.message : err);
    return null;
  }

  // 3. Upload with year-long immutable cache (the bytes are deterministic
  //    given the same text + voice; we never overwrite).
  let url: string;
  try {
    const result = await upload({
      buffer,
      key: opts.key,
      contentType: "audio/mpeg",
      cacheControl: "public, max-age=31536000, immutable",
    });
    url = result.url;
  } catch (err) {
    console.warn("[audio] upload failed:", err instanceof Error ? err.message : err);
    return null;
  }

  // 4. Record in the dedupe cache so the next caller skips the spend.
  if (!opts.noCache) await saveCached(fp, url);

  return { url, durationSec, voice };
}
