/**
 * Scene composition loop — produces the RTMP feed via FFmpeg.
 *
 * Scenes:
 *   1. Logo card (intro, ~5s)
 *   2. Sermon title card
 *   3. Scripture card with Deepgram-narrated passage
 *   4. Q&A card with viewer questions answered by the Q&A Agent
 *   5. Prayer card
 *   6. Closing mission card
 *
 * For Phase 7 v1, this is a simple FFmpeg loop pushing a single composite
 * image with text overlays + a sermon audio track to YouTube RTMP. Real
 * dynamic scene switching is a follow-up.
 */
import { spawn } from "node:child_process";

export type Broadcast = {
  id: string;
  streamUrl: string;
  streamKey: string;
};

export async function startSceneLoop(opts: {
  sermonId: string;
  broadcast: Broadcast;
}): Promise<void> {
  const rtmpTarget = `${opts.broadcast.streamUrl}/${opts.broadcast.streamKey}`;

  // Phase 7 v1: push a static "On Air — sermon in progress" backdrop + sermon audio
  // sourced from the Phase 5 video pipeline.
  // Replace with a multi-scene OBS-driven setup as the operation matures.
  const audioUrl = process.env.STREAM_FALLBACK_AUDIO ?? "";
  const imageUrl = process.env.STREAM_FALLBACK_IMAGE ?? "";

  if (!audioUrl || !imageUrl) {
    console.error("[scenes] STREAM_FALLBACK_AUDIO + STREAM_FALLBACK_IMAGE required for Phase 7 v1");
    return;
  }

  const args = [
    "-re",
    "-loop", "1", "-i", imageUrl,
    "-i", audioUrl,
    "-c:v", "libx264", "-preset", "veryfast", "-tune", "stillimage",
    "-pix_fmt", "yuv420p",
    "-b:v", "4500k", "-maxrate", "5000k", "-bufsize", "9000k",
    "-c:a", "aac", "-b:a", "192k", "-ar", "44100",
    "-shortest",
    "-f", "flv",
    rtmpTarget,
  ];
  console.log("[scenes] ffmpeg pushing to", opts.broadcast.streamUrl);
  const ff = spawn("ffmpeg", args, { stdio: ["ignore", "inherit", "inherit"] });
  await new Promise<void>((resolve, reject) => {
    ff.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`))));
    ff.on("error", reject);
  });
}
