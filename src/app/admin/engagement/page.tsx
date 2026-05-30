import { sql } from "drizzle-orm";
import { optionalDb } from "@/lib/server-db";

type Row = {
  id: string;
  platform: string;
  author_handle: string;
  content: string;
  sentiment: string | null;
  suggested_reply: string | null;
  status: string;
  replied_at: Date | null;
};

async function load(): Promise<Row[]> {
  const database = await optionalDb("admin-engagement");
  if (!database) return [];
  try {
    return await database.execute<Row>(sql`
      SELECT id, platform, author_handle, content, sentiment, suggested_reply, status, replied_at
      FROM social_engagements
      ORDER BY
        CASE WHEN status = 'pending_approval' THEN 0 ELSE 1 END,
        id DESC
      LIMIT 200
    `);
  } catch {
    return [];
  }
}

export default async function AdminEngagementPage() {
  const rows = await load();
  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Engagement</p>
        <h1 className="m-0">Comments &amp; DMs queue</h1>
        <p className="text-muted m-0 mt-3">
          For the first 30 days, every reply is human-approved. After that, approved
          templates may auto-send while substantive replies still queue here.
        </p>
      </header>
      {rows.length === 0 ? (
        <div className="card">
          <p className="m-0 text-muted">
            Engagement queue is ready. Comments and DMs appear here after Postiz/social
            accounts are connected and replies are pulled into the review queue.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((r) => (
            <article key={r.id} className="card">
              <div className="flex justify-between mb-3">
                <p className="card__eyebrow m-0">
                  {r.platform} · @{r.author_handle} · {r.sentiment ?? "?"}
                </p>
                <p
                  className="m-0 text-xs uppercase tracking-[0.16em]"
                  style={{ color: r.status === "pending_approval" ? "var(--glory-gold)" : "var(--fg-muted)" }}
                >
                  {r.status}
                </p>
              </div>
              <p className="m-0 text-warm">
                <strong className="text-muted">In:</strong> {r.content}
              </p>
              {r.suggested_reply ? (
                <p className="m-0 mt-3 text-gold">
                  <strong className="text-muted">Draft reply:</strong> {r.suggested_reply}
                </p>
              ) : (
                <p className="m-0 mt-3 text-muted text-sm">
                  (no auto-draft — requires human compose)
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
