/**
 * YouTube Data API + Live Streaming API client.
 *
 * Uses OAuth refresh-token flow. Token stored in env: YOUTUBE_REFRESH_TOKEN.
 */
const YT_BASE = "https://www.googleapis.com/youtube/v3";

let _accessToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (_accessToken && _accessToken.expiresAt > Date.now() + 60_000) return _accessToken.token;

  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
  const clientId = process.env.YOUTUBE_OAUTH_CLIENT_ID ?? process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_OAUTH_CLIENT_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;
  if (!refreshToken || !clientId || !clientSecret) {
    throw new Error("YouTube OAuth not configured (YOUTUBE_REFRESH_TOKEN + client id/secret)");
  }
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`[youtube] token refresh failed: HTTP ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  _accessToken = { token: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return _accessToken.token;
}

export type Broadcast = {
  id: string;
  liveChatId: string;
  streamId: string;
  streamUrl: string; // rtmps URL
  streamKey: string;
};

export async function createBroadcast(opts: {
  title: string;
  description: string;
  privacyStatus: "public" | "unlisted" | "private";
  scheduledStartTime?: Date;
}): Promise<Broadcast> {
  const token = await getAccessToken();
  const startTime = opts.scheduledStartTime ?? new Date(Date.now() + 60_000);

  // 1. Create broadcast
  const broadcastRes = await fetch(
    `${YT_BASE}/liveBroadcasts?part=snippet,contentDetails,status`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        snippet: {
          title: opts.title,
          description: opts.description,
          scheduledStartTime: startTime.toISOString(),
        },
        status: {
          privacyStatus: opts.privacyStatus,
          selfDeclaredMadeForKids: false,
        },
        contentDetails: { enableAutoStart: true, enableAutoStop: true, enableDvr: true },
      }),
    }
  );
  if (!broadcastRes.ok) {
    const text = await broadcastRes.text().catch(() => "");
    throw new Error(`[youtube] createBroadcast HTTP ${broadcastRes.status}: ${text.slice(0, 300)}`);
  }
  const broadcast = (await broadcastRes.json()) as {
    id: string;
    snippet: { liveChatId: string };
  };

  // 2. Create stream
  const streamRes = await fetch(`${YT_BASE}/liveStreams?part=snippet,cdn,contentDetails`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      snippet: { title: opts.title },
      cdn: { frameRate: "30fps", ingestionType: "rtmp", resolution: "1080p" },
      contentDetails: { isReusable: false },
    }),
  });
  if (!streamRes.ok) throw new Error(`[youtube] createStream HTTP ${streamRes.status}`);
  const stream = (await streamRes.json()) as {
    id: string;
    cdn: { ingestionInfo: { ingestionAddress: string; streamName: string } };
  };

  // 3. Bind broadcast → stream
  await fetch(
    `${YT_BASE}/liveBroadcasts/bind?part=id&id=${broadcast.id}&streamId=${stream.id}`,
    { method: "POST", headers: { Authorization: `Bearer ${token}` } }
  );

  return {
    id: broadcast.id,
    liveChatId: broadcast.snippet.liveChatId,
    streamId: stream.id,
    streamUrl: `${stream.cdn.ingestionInfo.ingestionAddress}`,
    streamKey: stream.cdn.ingestionInfo.streamName,
  };
}

export async function endBroadcast(broadcastId: string): Promise<void> {
  const token = await getAccessToken();
  await fetch(
    `${YT_BASE}/liveBroadcasts/transition?part=status&id=${broadcastId}&broadcastStatus=complete`,
    { method: "POST", headers: { Authorization: `Bearer ${token}` } }
  );
}
