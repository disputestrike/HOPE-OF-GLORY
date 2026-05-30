/**
 * Stream runtime — YouTube Live broadcast orchestration.
 *
 * Phase 7. Creates a YouTube live broadcast on schedule, ingests the
 * configured RTMP feed (OBS or FFmpeg pushing scene composites), and
 * monitors live chat for questions to feed the Q&A Agent.
 */
import { createBroadcast, endBroadcast } from "./youtube";
import { startSceneLoop } from "./scenes";
import { startChatIngestion } from "./chat";

async function main(): Promise<void> {
  const action = process.argv[2] ?? "scheduler";

  if (action === "start") {
    const sermonId = process.argv[3];
    if (!sermonId) {
      console.error("Usage: pnpm stream start <sermonId>");
      process.exit(2);
    }
    const broadcast = await createBroadcast({
      title: `Hope of Glory Live — ${new Date().toLocaleDateString("en-US")}`,
      description: "Live teaching from Hope of Glory Ministry. Crisis? Call 988 or 911.",
      privacyStatus: "public",
    });
    console.log("[stream] broadcast created:", broadcast.id, broadcast.streamUrl);
    void startChatIngestion(broadcast.liveChatId);
    await startSceneLoop({ sermonId, broadcast });
  } else if (action === "end") {
    const broadcastId = process.argv[3];
    if (!broadcastId) {
      console.error("Usage: pnpm stream end <broadcastId>");
      process.exit(2);
    }
    await endBroadcast(broadcastId);
    console.log("[stream] broadcast ended.");
  } else {
    console.log("[stream] scheduler mode — Phase 7 placeholder. Use 'start' or 'end' subcommands.");
  }
}

main().catch((err) => {
  console.error("[stream] fatal:", err);
  process.exit(1);
});
