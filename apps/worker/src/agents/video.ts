/**
 * Video Agent — composes sermon video assets.
 *
 * Produces three artifacts per sermon:
 *   1. Sermon audio (MP3, full-length narration)
 *   2. Sermon hero video (16:9, ~60s teaser using hero image + opening lines)
 *   3. Scripture-card reel (9:16, ~30s, animated scripture card)
 *
 * Provider routing:
 *   - Deepgram for TTS narration
 *   - fal.ai (already wired) for still imagery
 *   - Runway Gen-3 for short motion clips (optional — degrades gracefully)
 *   - FFmpeg orchestration for final composite
 */
import { synthesize, synthesizeLong, composite, upload } from "@hog/media";
import { fal } from "@hog/ai";

export type SermonVideoAssets = {
  audioUrl: string;
  audioDurationSec: number;
  heroVideoUrl?: string;
  reelUrl?: string;
};

export async function renderSermonAssets(opts: {
  sermonId: string;
  title: string;
  primaryPassage: string;
  scriptureText: string;
  fullText: string;
  heroImageUrl?: string;
}): Promise<SermonVideoAssets> {
  // 1. Full-length audio narration via Deepgram.
  const fullAudio = await synthesizeLong(opts.fullText);
  const fullAudioBuffer = Buffer.concat(fullAudio.map((part) => part.audioBuffer));
  const audioDurationSec = fullAudio.reduce(
    (sum, part) => sum + (part.approxDurationSeconds ?? 0),
    0,
  );
  const audioUpload = await upload({
    buffer: fullAudioBuffer,
    key: `sermons/${opts.sermonId}/audio.mp3`,
    contentType: "audio/mpeg",
  });

  // 2. Short teaser audio (opening lines) for the hero video.
  const openingLines = opts.fullText.split(/\n/).slice(0, 6).join("\n").slice(0, 800);
  const teaserAudio = await synthesize(openingLines).catch(() => null);

  // 3. Ensure we have a hero image. If not, generate one quickly.
  let heroUrl = opts.heroImageUrl;
  if (!heroUrl) {
    try {
      const img = await fal.generateImage({
        prompt: `Hero image for a sermon titled "${opts.title}" based on ${opts.primaryPassage}`,
        imageSize: "landscape_16_9",
      });
      heroUrl = img[0]?.url;
    } catch {
      // No image — skip hero video
    }
  }

  // 4. Hero video (16:9) — image + Ken Burns zoom + title overlay + teaser audio.
  let heroVideoUrl: string | undefined;
  if (teaserAudio && heroUrl) {
    try {
      const heroComposite = await composite({
        audioBuffer: teaserAudio.audioBuffer,
        imageUrls: [heroUrl],
        titleText: opts.title,
        scriptureRef: opts.primaryPassage,
        scriptureText: opts.scriptureText.slice(0, 200),
        aspectRatio: "16:9",
        durationSec: Math.min((teaserAudio.approxDurationSeconds ?? 20) + 2, 60),
      });
      const upl = await upload({
        buffer: heroComposite.videoBuffer,
        key: `sermons/${opts.sermonId}/hero.mp4`,
        contentType: "video/mp4",
      });
      heroVideoUrl = upl.url;
    } catch (err) {
      console.warn("[video] hero composite failed:", err);
    }
  }

  // 5. Scripture-card reel (9:16) — vertical, ~30s.
  let reelUrl: string | undefined;
  if (heroUrl) {
    try {
      const reelAudio = await synthesize(
        `${opts.scriptureText.slice(0, 180)}. From ${opts.primaryPassage}.`
      );
      const reelComposite = await composite({
        audioBuffer: reelAudio.audioBuffer,
        imageUrls: [heroUrl],
        titleText: opts.scriptureText.slice(0, 120),
        scriptureRef: `${opts.primaryPassage} · WEB`,
        aspectRatio: "9:16",
        durationSec: Math.min((reelAudio.approxDurationSeconds ?? 18) + 2, 30),
      });
      const upl = await upload({
        buffer: reelComposite.videoBuffer,
        key: `sermons/${opts.sermonId}/reel.mp4`,
        contentType: "video/mp4",
      });
      reelUrl = upl.url;
    } catch (err) {
      console.warn("[video] reel composite failed:", err);
    }
  }

  return {
    audioUrl: audioUpload.url,
    audioDurationSec,
    heroVideoUrl,
    reelUrl,
  };
}
