/**
 * Deepgram Aura TTS — narration voice for sermon videos, reels, and Scripture shorts.
 *
 * API surface (subject to change — recheck periodically):
 *   POST https://api.deepgram.com/v1/speak?model=<voice>
 *   Headers:
 *     Authorization: Token <DEEPGRAM_API_KEY>
 *     Content-Type:  application/json
 *   Body:
 *     { "text": "<utterance>" }
 *   Response:
 *     Raw audio bytes (default container: linear16 wav for aura-* models).
 *     Override container by adding ?encoding=mp3 or ?encoding=linear16&container=wav
 *     to the query string. We default to mp3 because it's friendlier for ffmpeg
 *     concat and 5-10x smaller for the kind of mid-length narration we generate.
 *
 * Note on text length: Deepgram caps a single /speak request at ~2000 characters.
 * Callers that need longer narration should chunk on sentence boundaries and stitch
 * the resulting mp3s with `addAudioTrack` / `concatenateClips` in ffmpeg.ts.
 *
 * Public copy MUST NOT name the provider. Internally we call it "narration".
 */

/** Default voice — warm female. See https://developers.deepgram.com/docs/tts-models */
export const DEFAULT_VOICE = "aura-asteria-en";

/** All Aura voices we have approved for ministry use. Locked at the workshop. */
export const APPROVED_VOICES = [
  "aura-asteria-en", // warm, female, conversational
  "aura-luna-en", // soft, female, contemplative
  "aura-stella-en", // bright, female, hopeful
  "aura-athena-en", // mature, female, dignified
  "aura-hera-en", // resonant, female, authoritative
  "aura-orion-en", // grounded, male, pastoral
  "aura-arcas-en", // calm, male, reflective
  "aura-perseus-en", // confident, male, teaching
  "aura-angus-en", // warm, male, Irish lilt
  "aura-orpheus-en", // expressive, male, storytelling
  "aura-helios-en", // bright, male, hopeful
  "aura-zeus-en", // deep, male, declarative
] as const;

export type DeepgramVoice = (typeof APPROVED_VOICES)[number];

export type TtsResult = {
  /** Raw audio bytes ready to write to disk or upload to S3. */
  audioBuffer: Buffer;
  /** MIME type of the buffer (matches the encoding we requested). */
  mimeType: string;
  /** Voice that was used. */
  voice: DeepgramVoice;
  /** Approximate duration in seconds, derived from response header if present. */
  approxDurationSeconds?: number;
};

const DEEPGRAM_BASE = "https://api.deepgram.com/v1/speak";

/** Conservative character cap for a single /speak call. Caller should chunk above this. */
export const MAX_CHARS_PER_REQUEST = 1800;

/**
 * Synthesize a single utterance.
 *
 * @param text   The narration text. Must be <= MAX_CHARS_PER_REQUEST.
 * @param voice  Optional Aura voice. Defaults to aura-asteria-en.
 */
export async function synthesize(
  text: string,
  voice: DeepgramVoice = DEFAULT_VOICE,
): Promise<TtsResult> {
  const key = process.env.DEEPGRAM_API_KEY;
  if (!key) throw new Error("[deepgram-tts] DEEPGRAM_API_KEY not set");

  const trimmed = text.trim();
  if (!trimmed) throw new Error("[deepgram-tts] text is empty");
  if (trimmed.length > MAX_CHARS_PER_REQUEST) {
    throw new Error(
      `[deepgram-tts] text is ${trimmed.length} chars, exceeds cap ${MAX_CHARS_PER_REQUEST}. Chunk on sentence boundaries.`,
    );
  }
  if (!APPROVED_VOICES.includes(voice)) {
    throw new Error(`[deepgram-tts] voice ${voice} is not on the approved list`);
  }

  // mp3 is the default we want — smaller files, native ffmpeg compatibility.
  const url = `${DEEPGRAM_BASE}?model=${encodeURIComponent(voice)}&encoding=mp3`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Token ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: trimmed }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(
      `[deepgram-tts] HTTP ${response.status}: ${errText.slice(0, 300)}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength === 0) {
    throw new Error("[deepgram-tts] empty audio response");
  }

  // Deepgram returns a `dg-model-uuid` and sometimes `x-dg-audio-duration` header.
  const durationHeader = response.headers.get("x-dg-audio-duration");
  const approxDurationSeconds = durationHeader
    ? Number.parseFloat(durationHeader)
    : undefined;

  return {
    audioBuffer: Buffer.from(arrayBuffer),
    mimeType: "audio/mpeg",
    voice,
    approxDurationSeconds:
      approxDurationSeconds && !Number.isNaN(approxDurationSeconds)
        ? approxDurationSeconds
        : undefined,
  };
}

/**
 * Chunked synthesis — splits long narration on sentence boundaries and returns
 * an array of buffers. Callers stitch them together with ffmpeg.
 *
 * The split is deliberately naive (period/!/? followed by whitespace). The
 * sermon generator already writes one-sentence-per-line in the prose pipe so
 * we rarely hit an edge case here.
 */
export async function synthesizeLong(
  text: string,
  voice: DeepgramVoice = DEFAULT_VOICE,
): Promise<TtsResult[]> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("[deepgram-tts] text is empty");

  if (trimmed.length <= MAX_CHARS_PER_REQUEST) {
    return [await synthesize(trimmed, voice)];
  }

  // Split into sentences. Keep the trailing punctuation by using a lookbehind-style split.
  const sentences = trimmed.match(/[^.!?]+[.!?]+(?:\s|$)/g) ?? [trimmed];

  // Greedily pack sentences into chunks up to the cap.
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > MAX_CHARS_PER_REQUEST) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  // Sequential, not parallel — Deepgram rate-limits hard and we want narration
  // ordering to be deterministic anyway.
  const results: TtsResult[] = [];
  for (const chunk of chunks) {
    results.push(await synthesize(chunk, voice));
  }
  return results;
}
