/**
 * Unit tests for the renderAudio pipeline.
 *
 * We mock @hog/media so the test never reaches Deepgram or S3, and never
 * pays a cent. Each case exercises a documented behavior:
 *
 *   - text shorter than skipIfShort → null
 *   - missing DEEPGRAM_API_KEY → null
 *   - missing S3_BUCKET → null
 *   - happy path → expected S3 key + url + duration + voice
 *   - default voice resolves from DEEPGRAM_TTS_VOICE env (with aura-2- alias)
 *
 * Vitest config (vitest.config.ts) globs tests/** /*.test.ts, so this file
 * is picked up automatically.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const synthesizeMock = vi.fn();
const synthesizeLongMock = vi.fn();
const uploadMock = vi.fn();

vi.mock("@hog/media", () => ({
  synthesize: (...args: unknown[]) => synthesizeMock(...args),
  synthesizeLong: (...args: unknown[]) => synthesizeLongMock(...args),
  upload: (...args: unknown[]) => uploadMock(...args),
  // The pipeline imports these as values, not types, so they must be real.
  APPROVED_VOICES: [
    "aura-asteria-en",
    "aura-helios-en",
    "aura-orion-en",
  ] as const,
  MAX_CHARS_PER_REQUEST: 1800,
}));

// Import AFTER the mock so the pipeline picks up the mocked module.
async function loadPipeline() {
  return await import(
    "../apps/worker/src/pipelines/audio"
  );
}

const ORIGINAL_ENV = { ...process.env };

describe("renderAudio", () => {
  beforeEach(() => {
    synthesizeMock.mockReset();
    synthesizeLongMock.mockReset();
    uploadMock.mockReset();
    // Default-configured env. Tests override individually.
    process.env.DEEPGRAM_API_KEY = "test-key";
    process.env.S3_BUCKET = "test-bucket";
    delete process.env.DEEPGRAM_TTS_VOICE;
    delete process.env.REDIS_URL; // disable dedupe path
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("returns null when text is shorter than skipIfShort", async () => {
    const { renderAudio } = await loadPipeline();
    const result = await renderAudio({
      text: "Too short.",
      key: "apologetics/short.mp3",
    });
    expect(result).toBeNull();
    expect(synthesizeMock).not.toHaveBeenCalled();
    expect(uploadMock).not.toHaveBeenCalled();
  });

  it("returns null when DEEPGRAM_API_KEY is not set", async () => {
    delete process.env.DEEPGRAM_API_KEY;
    const { renderAudio } = await loadPipeline();
    const text = "A".repeat(120);
    const result = await renderAudio({ text, key: "apologetics/x.mp3" });
    expect(result).toBeNull();
  });

  it("returns null when S3_BUCKET is not set", async () => {
    delete process.env.S3_BUCKET;
    const { renderAudio } = await loadPipeline();
    const text = "A".repeat(120);
    const result = await renderAudio({ text, key: "apologetics/x.mp3" });
    expect(result).toBeNull();
  });

  it("renders, uploads, and returns the public URL on the happy path", async () => {
    synthesizeMock.mockResolvedValue({
      audioBuffer: Buffer.from("fake-mp3-bytes"),
      mimeType: "audio/mpeg",
      voice: "aura-helios-en",
      approxDurationSeconds: 7.5,
    });
    uploadMock.mockResolvedValue({
      url: "https://cdn.hopeofglory.ministry/apologetics/abc.mp3",
      key: "apologetics/abc.mp3",
    });
    const { renderAudio } = await loadPipeline();
    const text =
      "The historic Christian view of the Trinity is that one God exists in three Persons, eternally distinct.";
    const result = await renderAudio({
      text,
      key: "apologetics/abc.mp3",
    });
    expect(result).not.toBeNull();
    expect(result?.url).toBe(
      "https://cdn.hopeofglory.ministry/apologetics/abc.mp3",
    );
    expect(result?.durationSec).toBe(7.5);
    expect(result?.voice).toBe("aura-helios-en");
    // Verify the upload contract: correct key, MP3 mime, immutable cache.
    expect(uploadMock).toHaveBeenCalledTimes(1);
    const uploadArgs = uploadMock.mock.calls[0]?.[0] as {
      key: string;
      contentType: string;
      cacheControl: string;
      buffer: Buffer;
    };
    expect(uploadArgs.key).toBe("apologetics/abc.mp3");
    expect(uploadArgs.contentType).toBe("audio/mpeg");
    expect(uploadArgs.cacheControl).toContain("immutable");
    expect(uploadArgs.buffer.toString()).toBe("fake-mp3-bytes");
  });

  it("normalizes DEEPGRAM_TTS_VOICE=aura-2-helios-en to aura-helios-en", async () => {
    process.env.DEEPGRAM_TTS_VOICE = "aura-2-helios-en";
    synthesizeMock.mockResolvedValue({
      audioBuffer: Buffer.from("x"),
      mimeType: "audio/mpeg",
      voice: "aura-helios-en",
      approxDurationSeconds: 1,
    });
    uploadMock.mockResolvedValue({ url: "https://x/y.mp3", key: "y.mp3" });
    const { renderAudio } = await loadPipeline();
    const text = "A".repeat(120);
    const result = await renderAudio({ text, key: "y.mp3" });
    expect(result?.voice).toBe("aura-helios-en");
    // synthesize was called with the normalized voice as 2nd arg.
    expect(synthesizeMock.mock.calls[0]?.[1]).toBe("aura-helios-en");
  });

  it("uses the chunked synthesizeLong path for text over the per-request cap", async () => {
    synthesizeLongMock.mockResolvedValue([
      {
        audioBuffer: Buffer.from("part1"),
        approxDurationSeconds: 5,
        voice: "aura-helios-en",
        mimeType: "audio/mpeg",
      },
      {
        audioBuffer: Buffer.from("part2"),
        approxDurationSeconds: 6,
        voice: "aura-helios-en",
        mimeType: "audio/mpeg",
      },
    ]);
    uploadMock.mockResolvedValue({
      url: "https://x/long.mp3",
      key: "sermons/abc/audio.mp3",
    });
    const { renderAudio } = await loadPipeline();
    const text = "x".repeat(2000); // > MAX_CHARS_PER_REQUEST (1800)
    const result = await renderAudio({ text, key: "sermons/abc/audio.mp3" });
    expect(synthesizeMock).not.toHaveBeenCalled();
    expect(synthesizeLongMock).toHaveBeenCalledTimes(1);
    expect(result?.durationSec).toBe(11);
    // Buffers concatenated in order.
    const uploadArgs = uploadMock.mock.calls[0]?.[0] as { buffer: Buffer };
    expect(uploadArgs.buffer.toString()).toBe("part1part2");
  });
});
