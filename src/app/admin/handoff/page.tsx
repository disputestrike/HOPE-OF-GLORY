import { sql } from "drizzle-orm";
import { optionalDb } from "@/lib/server-db";

type Row = {
  id: string;
  source_type: string;
  user_email: string | null;
  reason: string;
  status: string;
  notes: string | null;
  created_at: Date;
  assigned_to: string | null;
};

async function load(): Promise<Row[]> {
  const database = await optionalDb("admin-handoff");
  if (!database) return [];
  try {
    return await database.execute<Row>(sql`
      SELECT id, source_type, user_email, reason, status, notes, created_at, assigned_to
      FROM human_handoff
      ORDER BY
        CASE WHEN status = 'open' THEN 0 ELSE 1 END,
        created_at DESC
      LIMIT 100
    `);
  } catch {
    return [];
  }
}

export default async function AdminHandoffPage() {
  const rows = await load();
  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Human in the loop</p>
        <h1 className="m-0">Talk to a real person — queue</h1>
        <p className="text-muted m-0 mt-3">
          Open requests appear first. Contact-form submissions, doctrine disputes,
          and pastoral asks land here.
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="card">
          <p className="m-0 text-muted">
            Human handoff queue is ready. Contact-form submissions, pastoral asks, and
            safety escalations appear here after intake begins.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((r) => (
            <article key={r.id} className="card">
              <div className="flex justify-between mb-3">
                <p className="card__eyebrow m-0">
                  {r.source_type} · {r.reason}
                </p>
                <p
                  className="m-0 text-xs uppercase tracking-[0.16em]"
                  style={{
                    color: r.status === "open" ? "var(--glory-gold)" : "var(--fg-muted)",
                  }}
                >
                  {r.status}
                </p>
              </div>
              <p className="m-0 text-warm">
                <strong className="text-gold">{r.user_email ?? "(no email)"}</strong>
              </p>
              {r.notes ? (
                <p className="m-0 mt-2 text-muted text-sm">{r.notes}</p>
              ) : null}
              <p className="m-0 mt-3 text-muted text-xs">
                {new Date(r.created_at).toLocaleString("en-US")}
                {r.assigned_to ? ` · assigned to ${r.assigned_to}` : ""}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
