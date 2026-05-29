import { sql } from "drizzle-orm";
import { optionalDb } from "@/lib/server-db";

type Row = {
  id: string;
  provider_txn_id: string;
  amount: string;
  currency: string;
  donor_email: string | null;
  donor_name: string | null;
  status: string;
  created_at: Date;
};

async function load(): Promise<{ rows: Row[]; totalMonth: number; totalYear: number }> {
  const database = await optionalDb("admin-donations");
  if (!database) return { rows: [], totalMonth: 0, totalYear: 0 };
  try {
    const [rows, monthly, yearly] = await Promise.all([
      database.execute<Row>(sql`
        SELECT id, provider_txn_id, amount::text, currency, donor_email, donor_name, status, created_at
        FROM donations
        ORDER BY created_at DESC
        LIMIT 200
      `),
      database.execute<{ sum: string }>(sql`
        SELECT COALESCE(SUM(amount), 0)::text as sum FROM donations
        WHERE created_at >= date_trunc('month', now())
          AND status = 'completed'
      `),
      database.execute<{ sum: string }>(sql`
        SELECT COALESCE(SUM(amount), 0)::text as sum FROM donations
        WHERE created_at >= date_trunc('year', now())
          AND status = 'completed'
      `),
    ]);
    return {
      rows,
      totalMonth: Number(monthly[0]?.sum ?? "0"),
      totalYear: Number(yearly[0]?.sum ?? "0"),
    };
  } catch {
    return { rows: [], totalMonth: 0, totalYear: 0 };
  }
}

function maskEmail(email: string | null): string {
  if (!email) return "(anonymous)";
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  return `${user.slice(0, 2)}…@${domain}`;
}

export default async function AdminDonationsPage() {
  const { rows, totalMonth, totalYear } = await load();
  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Stewardship</p>
        <h1 className="m-0">Donations</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="card">
          <p className="card__eyebrow">This month</p>
          <p className="m-0 text-3xl text-gold" style={{ fontFamily: "var(--font-display)" }}>
            ${totalMonth.toLocaleString()}
          </p>
        </div>
        <div className="card">
          <p className="card__eyebrow">This year</p>
          <p className="m-0 text-3xl text-gold" style={{ fontFamily: "var(--font-display)" }}>
            ${totalYear.toLocaleString()}
          </p>
        </div>
      </section>

      {rows.length === 0 ? (
        <div className="card">
          <p className="m-0 text-muted">
            Donation ledger is ready. Configure <code>PAYPAL_CLIENT_ID</code>, register the webhook,
            and complete 501(c)(3) status before flipping <code>FEATURE_DONATIONS=true</code>.
          </p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[var(--border-soft)]">
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Date</th>
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Donor</th>
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Amount</th>
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[var(--border-soft)]">
                  <td className="p-4 text-muted text-sm">{new Date(r.created_at).toLocaleDateString("en-US")}</td>
                  <td className="p-4 text-warm text-sm">{maskEmail(r.donor_email)}</td>
                  <td className="p-4 text-gold text-sm">
                    {r.currency} {Number(r.amount).toFixed(2)}
                  </td>
                  <td className="p-4 text-xs uppercase tracking-[0.16em] text-muted">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
