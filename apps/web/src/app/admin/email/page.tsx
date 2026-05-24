import { db } from "@hog/db";
import { sql } from "drizzle-orm";

type Row = {
  id: string;
  provider: string;
  template_key: string;
  audience: string;
  status: string;
  sent_at: Date | null;
  recipient_count: number | null;
};

async function load(): Promise<Row[]> {
  try {
    return await db.execute<Row>(sql`
      SELECT id, provider, template_key, audience, status, sent_at, recipient_count
      FROM email_campaigns
      ORDER BY COALESCE(sent_at, created_at) DESC NULLS LAST
      LIMIT 200
    `);
  } catch {
    return [];
  }
}

export default async function AdminEmailPage() {
  const rows = await load();
  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Email</p>
        <h1 className="m-0">Email log</h1>
        <p className="text-muted m-0 mt-3">
          {rows.length} send{rows.length === 1 ? "" : "s"} on record.
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="card">
          <p className="m-0 text-muted">
            No emails sent yet. Resend integration is wired — populate <code>RESEND_API_KEY</code>{" "}
            and verify the <code>hopeofglory.ministry</code> domain.
          </p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[var(--border-soft)]">
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Template</th>
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Recipient</th>
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Sent</th>
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[var(--border-soft)]">
                  <td className="p-4 text-warm text-sm">{r.template_key}</td>
                  <td className="p-4 text-muted text-sm">{r.audience}</td>
                  <td className="p-4 text-muted text-sm">
                    {r.sent_at ? new Date(r.sent_at).toLocaleString("en-US") : "—"}
                  </td>
                  <td
                    className="p-4 text-xs uppercase tracking-[0.16em]"
                    style={{
                      color: r.status === "sent" ? "#9bbf6e" : "var(--blood-crimson)",
                    }}
                  >
                    {r.status}
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
