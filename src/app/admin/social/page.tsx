import { sql } from "drizzle-orm";
import { formatLaunchDateTime, getSocialQueue } from "@/data/launch-schedule";
import { optionalDb } from "@/lib/server-db";

type Row = {
  id: string;
  platform: string;
  caption: string;
  scheduled_for: Date | null;
  status: string;
  post_url: string | null;
  posted_at: Date | null;
};

type SocialRow = {
  id: string;
  platform: string;
  caption: string;
  scheduledFor: Date | string | null;
  status: string;
  postUrl: string | null;
  sermonTitle?: string;
};

async function load(): Promise<Row[]> {
  const database = await optionalDb("admin-social");
  if (!database) return [];
  try {
    return await database.execute<Row>(sql`
      SELECT id, platform, caption, scheduled_for, status, post_url, posted_at
      FROM social_posts
      ORDER BY COALESCE(scheduled_for, posted_at) DESC NULLS LAST
      LIMIT 200
    `);
  } catch {
    return [];
  }
}

export default async function AdminSocialPage() {
  const dbRows = await load();
  const rows: SocialRow[] =
    dbRows.length > 0
      ? dbRows.map((r) => ({
          id: r.id,
          platform: r.platform,
          caption: r.caption,
          scheduledFor: r.scheduled_for ?? r.posted_at,
          status: r.status,
          postUrl: r.post_url,
        }))
      : getSocialQueue().map((r) => ({
          id: r.id,
          platform: r.platform,
          caption: r.caption,
          scheduledFor: r.scheduledFor,
          status: r.status,
          postUrl: null,
          sermonTitle: r.sermonTitle,
        }));

  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Distribution</p>
        <h1 className="m-0">Social queue</h1>
        <p className="text-muted m-0 mt-3">
          {rows.length} platform post{rows.length === 1 ? "" : "s"} queued from the launch sermon calendar.
          Postiz publishes them after <code>POSTIZ_URL</code>, <code>POSTIZ_API_KEY</code>, and the social
          accounts are connected.
        </p>
      </header>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-[var(--border-soft)]">
              <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Platform</th>
              <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Caption</th>
              <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Scheduled</th>
              <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-[var(--border-soft)]">
                <td className="p-4 text-warm uppercase text-xs tracking-[0.16em]">
                  {r.platform}
                </td>
                <td className="p-4 text-muted text-sm" style={{ maxWidth: "32rem" }}>
                  <span className="line-clamp-2">{r.caption}</span>
                  {r.sermonTitle ? <p className="m-0 mt-1 text-xs text-gold">{r.sermonTitle}</p> : null}
                </td>
                <td className="p-4 text-muted text-sm">{formatLaunchDateTime(r.scheduledFor)}</td>
                <td
                  className="p-4 text-xs uppercase tracking-[0.16em]"
                  style={{
                    color:
                      r.status === "scheduled" || r.status === "credential-gated"
                        ? "var(--glory-gold)"
                        : r.status === "posted"
                          ? "#9bbf6e"
                          : r.status === "failed"
                            ? "var(--blood-crimson)"
                            : "var(--fg-muted)",
                  }}
                >
                  {r.postUrl ? (
                    <a href={r.postUrl} className="text-gold" target="_blank" rel="noreferrer">
                      {r.status} - open
                    </a>
                  ) : (
                    r.status
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

