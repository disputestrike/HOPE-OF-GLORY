/**
 * YouTube live chat ingestion. Polls the LiveChatMessages endpoint and
 * feeds eligible questions into the live_questions table for the Q&A Agent.
 */
import { db } from "@hog/db";
import { sql } from "drizzle-orm";

const YT_BASE = "https://www.googleapis.com/youtube/v3";

let _accessToken: { token: string; expiresAt: number } | null = null;
async function getAccessToken(): Promise<string> {
  if (_accessToken && _accessToken.expiresAt > Date.now() + 60_000) return _accessToken.token;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.YOUTUBE_OAUTH_CLIENT_ID ?? process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.YOUTUBE_OAUTH_CLIENT_SECRET ?? process.env.GOOGLE_CLIENT_SECRET ?? "",
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
  });
  const json = (await res.json()) as { access_token: string; expires_in: number };
  _accessToken = { token: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return _accessToken.token;
}

export async function startChatIngestion(liveChatId: string): Promise<void> {
  let nextPageToken: string | undefined;
  let pollMs = 5000;

  while (true) {
    try {
      const token = await getAccessToken();
      const url = new URL(`${YT_BASE}/liveChat/messages`);
      url.searchParams.set("liveChatId", liveChatId);
      url.searchParams.set("part", "id,snippet,authorDetails");
      if (nextPageToken) url.searchParams.set("pageToken", nextPageToken);

      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        if (res.status === 404) {
          console.log("[chat] live chat closed");
          return;
        }
        console.warn("[chat] poll HTTP", res.status);
        await new Promise((r) => setTimeout(r, pollMs));
        continue;
      }
      const data = (await res.json()) as {
        nextPageToken?: string;
        pollingIntervalMillis?: number;
        items: Array<{
          id: string;
          snippet: { displayMessage: string; publishedAt: string };
          authorDetails: { displayName: string };
        }>;
      };
      nextPageToken = data.nextPageToken;
      pollMs = data.pollingIntervalMillis ?? 5000;

      for (const item of data.items) {
        const text = item.snippet.displayMessage.trim();
        if (!text || text.length < 3) continue;
        // Only ingest questions (ends with ?) or @hope mentions
        const isQuestion = text.endsWith("?") || /\bhope\b/i.test(text);
        if (!isQuestion) continue;
        await db
          .execute(sql`
            INSERT INTO live_questions (platform_message_id, author_handle, question_text, status)
            VALUES (${item.id}, ${item.authorDetails.displayName}, ${text}, 'queued')
            ON CONFLICT DO NOTHING
          `)
          .catch(() => undefined);
      }
    } catch (err) {
      console.error("[chat] poll error:", err);
    }
    await new Promise((r) => setTimeout(r, pollMs));
  }
}
