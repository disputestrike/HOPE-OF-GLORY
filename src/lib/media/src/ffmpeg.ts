/**
 * FFmpeg orchestration — composites sermon video assets.
 *
 * Pipeline:
 *   1. Generate visual scenes (Runway or still-image-with-zoom)
 *   2. Generate audio track (Deepgram TTS)
 *   3. Overlay scripture cards, title cards
 *   4. Resize for target aspect ratio
 *   5. Output single MP4 ready for upload
 *
 * Requires `ffmpeg` binary on the PATH. On Railway, use a container that
 * has ffmpeg pre-installed (jrottenberg/ffmpeg or similar) for the stream service.
 */
import { spawn } from "node:child_process";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export type CompositeInput = {
  audioBuffer: Buffer;
  imageUrls: string[];
  titleText: string;
  scriptureRef: string;
  scriptureText?: string;
  aspectRatio: "16:9" | "9:16" | "1:1";
  durationSec: number;
};

export type CompositeResult = {
  videoBuffer: Buffer;
  width: number;
  height: number;
  contentType: "video/mp4";
};

const DIMENSIONS: Record<CompositeInput["aspectRatio"], [number, number]> = {
  "16:9": [1920, 1080],
  "9:16": [1080, 1920],
  "1:1": [1080, 1080],
};

async function execFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const ff = spawn("ffmpeg", args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    ff.stderr.on("data", (d) => (stderr += d.toString()));
    ff.on("error", reject);
    ff.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-500)}`));
    });
  });
}

/**
 * Composite a single MP4 from input image(s) + audio narration + overlays.
 * Returns the video buffer (ready to upload to S3).
 */
export async function composite(input: CompositeInput): Promise<CompositeResult> {
  const tmp = path.join(os.tmpdir(), `hog-video-${Date.now()}`);
  await mkdir(tmp, { recursive: true });
  const [w, h] = DIMENSIONS[input.aspectRatio];

  // Write audio + first image to disk
  const audioPath = path.join(tmp, "audio.mp3");
  await writeFile(audioPath, input.audioBuffer);

  // For simplicity in Phase 5 v1: use the first image as a static backdrop +
  // Ken Burns zoom + scripture card overlay + audio. A multi-scene composite
  // is a worthwhile follow-up.
  const imagePath = path.join(tmp, "bg.jpg");
  const imageRes = await fetch(input.imageUrls[0] ?? "");
  if (!imageRes.ok) throw new Error("[ffmpeg] failed to fetch backdrop image");
  await writeFile(imagePath, Buffer.from(await imageRes.arrayBuffer()));

  const outPath = path.join(tmp, "out.mp4");

  // Title + scripture-ref overlay using drawtext filter.
  // Note: requires a font file present. On Railway, mount /usr/share/fonts.
  const titleEscaped = input.titleText.replace(/'/g, "\\'").replace(/:/g, "\\:");
  const refEscaped = input.scriptureRef.replace(/'/g, "\\'").replace(/:/g, "\\:");
  const drawTitle = `drawtext=text='${titleEscaped}':fontfile=/usr/share/fonts/truetype/dejavu/DejaVu-Serif.ttf:fontsize=${Math.floor(h * 0.06)}:fontcolor=0xFFF8E7:x=(w-text_w)/2:y=h*0.78:enable='between(t,1,${Math.min(input.durationSec, 10)})'`;
  const drawRef = `drawtext=text='${refEscaped}':fontfile=/usr/share/fonts/truetype/dejavu/DejaVu-Sans.ttf:fontsize=${Math.floor(h * 0.03)}:fontcolor=0xD4AF37:x=(w-text_w)/2:y=h*0.86:enable='between(t,1,${Math.min(input.durationSec, 10)})'`;

  await execFfmpeg([
    "-y",
    "-loop", "1",
    "-i", imagePath,
    "-i", audioPath,
    "-vf", `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},zoompan=z='min(zoom+0.0005,1.05)':d=${Math.floor(input.durationSec * 25)}:s=${w}x${h},${drawTitle},${drawRef}`,
    "-c:v", "libx264",
    "-preset", "medium",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "192k",
    "-shortest",
    "-t", String(input.durationSec),
    outPath,
  ]);

  const { readFile } = await import("node:fs/promises");
  const videoBuffer = await readFile(outPath);

  // Cleanup tmp
  await Promise.all([
    unlink(audioPath).catch(() => undefined),
    unlink(imagePath).catch(() => undefined),
    unlink(outPath).catch(() => undefined),
  ]);

  return { videoBuffer, width: w, height: h, contentType: "video/mp4" };
}
