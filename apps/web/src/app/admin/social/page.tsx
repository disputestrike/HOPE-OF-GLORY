import { db } from "@hog/db";
import { sql } from "drizzle-orm";

type Row = {
  id: string;
  platform: string;
  caption: string;
  scheduled_for: Date | null;
  status: string;
  post_url: string | null;
  posted_at: Date | null;
};

async function load(): Promise<Row[]> {
  try {
    return await db.execute<Row>(sql`
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
  const rows = await load();
  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Distribution</p>
        <h1 className="m-0">Social queue</h1>
        <p className="text-muted m-0 mt-3">
          {rows.length} post{rows.length === 1 ? "" : "s"} scheduled, posted, or failed.
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="card">
          <p className="m-0 text-muted">
            Distribution pipeline is wired and waiting. Publish a sermon, then trigger
            distribution from the sermon detail page. Self-hosted Postiz must be reachable
            at <code>POSTIZ_URL</code>.
          </p>
        </div>
      ) : (
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
                  </td>
                  <td className="p-4 text-muted text-sm">
                    {r.scheduled_for ? new Date(r.scheduled_for).toLocaleString("en-US") : "—"}
                  </td>
                  <td
                    className="p-4 text-xs uppercase tracking-[0.16em]"
                    style={{
                      color:
                        r.status === "scheduled"
                          ? "var(--glory-gold)"
                          : r.status === "posted"
                          ? "#9bbf6e"
                          : r.status === "failed"
                          ? "var(--blood-crimson)"
                          : "var(--fg-muted)",
                    }}
                  >
                    {r.post_url ? (
                      <a href={r.post_url} className="text-gold" target="_blank" rel="noreferrer">
                        {r.status} ↗
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
      )}
    </div>
  );
}
