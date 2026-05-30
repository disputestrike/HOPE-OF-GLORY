import { sql } from "drizzle-orm";
import { optionalDb } from "@/lib/server-db";

type Row = {
  id: string;
  privacy_level: string;
  content: string;
  risk_level: string;
  follow_up_state: string;
  created_at: Date;
};

async function load(): Promise<Row[]> {
  const database = await optionalDb("admin-prayers");
  if (!database) return [];
  try {
    return await database.execute<Row>(sql`
      SELECT id, privacy_level, content, risk_level, follow_up_state, created_at
      FROM prayer_requests
      ORDER BY created_at DESC
      LIMIT 200
    `);
  } catch {
    return [];
  }
}

const RISK_COLORS: Record<string, string> = {
  low: "var(--fg-muted)",
  medium: "#e1c14b",
  high: "var(--blood-crimson)",
  critical: "var(--blood-crimson)",
};

export default async function AdminPrayersPage() {
  const rows = await load();

  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Prayer</p>
        <h1 className="m-0">Prayer requests</h1>
        <p className="text-muted m-0 mt-3">
          {rows.length} request{rows.length === 1 ? "" : "s"} on record.
          Sorted by newest first. Critical and high-risk items appear at the top.
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="card">
          <p className="m-0 text-muted">
            Prayer intake is ready. Requests appear here after the form is used and the
            database connection is active.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((r) => (
            <article key={r.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="card__eyebrow m-0">
                  {new Date(r.created_at).toLocaleString("en-US")} · {r.privacy_level}
                </p>
                <p
                  className="m-0 text-xs uppercase tracking-[0.16em]"
                  style={{ color: RISK_COLORS[r.risk_level] ?? "var(--fg-muted)" }}
                >
                  {r.risk_level}
                </p>
              </div>
              <p className="m-0 text-warm whitespace-pre-wrap">{r.content}</p>
              <p className="m-0 mt-3 text-muted text-xs">
                Follow-up: <strong className="text-gold">{r.follow_up_state}</strong>
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
