import { sql } from "drizzle-orm";
import { optionalDb } from "@/lib/server-db";

type Row = {
  id: string;
  platform: string;
  broadcast_id: string | null;
  scheduled_for: Date | null;
  started_at: Date | null;
  ended_at: Date | null;
  status: string;
  theme: string | null;
  agent_host: string | null;
};

async function load(): Promise<Row[]> {
  const database = await optionalDb("admin-live");
  if (!database) return [];
  try {
    return await database.execute<Row>(sql`
      SELECT id, platform, broadcast_id, scheduled_for, started_at, ended_at, status, theme, agent_host
      FROM live_events
      ORDER BY scheduled_for DESC NULLS LAST
      LIMIT 50
    `);
  } catch {
    return [];
  }
}

export default async function AdminLivePage() {
  const events = await load();
  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Live</p>
        <h1 className="m-0">Live broadcasts</h1>
        <p className="text-muted m-0 mt-3">
          Weekly cadence: Mon Ask the Bible · Tue Revelation Watch · Wed New Believer School ·
          Thu Defending the Faith · Fri Prayer Night · Sat Word to the Nations · Sun The Hope of
          Glory Sermon.
        </p>
      </header>
      {events.length === 0 ? (
        <div className="card">
          <p className="m-0 text-muted">
            Live broadcast queue is ready. The stream service creates the YouTube broadcast when triggered.
            Requires <code>YOUTUBE_REFRESH_TOKEN</code> + OAuth client + an OBS or FFmpeg push to
            the issued RTMP URL.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((e) => (
            <article key={e.id} className="card flex items-center justify-between">
              <div>
                <p className="card__eyebrow m-0">{e.platform} · {e.theme ?? "Live event"}</p>
                <p className="m-0 text-warm">
                  {e.scheduled_for ? new Date(e.scheduled_for).toLocaleString("en-US") : "Schedule pending"}
                </p>
              </div>
              <p
                className="m-0 text-xs uppercase tracking-[0.16em]"
                style={{ color: e.status === "live" ? "#9bbf6e" : "var(--fg-muted)" }}
              >
                {e.status}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
