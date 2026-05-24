import Link from "next/link";
import { db } from "@hog/db";
import { sql } from "drizzle-orm";

type Row = {
  id: string;
  slug: string;
  title: string;
  primary_passage: string;
  status: string;
  scheduled_for: Date | null;
  theology_score: string | null;
  citation_score: string | null;
  image_url: string | null;
};

async function list(): Promise<Row[]> {
  try {
    return await db.execute<Row>(sql`
      SELECT id, slug, title, primary_passage, status, scheduled_for, theology_score, citation_score, image_url
      FROM sermons
      ORDER BY scheduled_for ASC NULLS LAST
      LIMIT 100
    `);
  } catch (err) {
    console.warn("[admin sermons] DB unreachable:", err);
    return [];
  }
}

const STATUS_COLORS: Record<string, string> = {
  draft: "var(--fg-muted)",
  verifying: "#e1c14b",
  ready: "var(--glory-gold)",
  scheduled: "var(--glory-gold)",
  published: "#9bbf6e",
  withdrawn: "var(--blood-crimson)",
};

export default async function AdminSermonsPage() {
  const rows = await list();

  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow">Sermons</p>
          <h1 className="m-0">Editorial queue</h1>
          <p className="text-muted m-0 mt-3">
            {rows.length} sermon{rows.length === 1 ? "" : "s"} in the calendar.
          </p>
        </div>
        <form action="/api/sermons/generate" method="POST">
          <button type="submit" className="btn btn--primary">
            Generate next sermon
          </button>
        </form>
      </header>

      {rows.length === 0 ? (
        <div className="card">
          <p className="card__eyebrow">Empty calendar</p>
          <p className="m-0 text-muted">
            Run <code>pnpm seed:calendar</code> to load the first-month schedule, then return here.
          </p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[var(--border-soft)]">
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Title</th>
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Passage</th>
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Scheduled</th>
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Doctrine</th>
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Citations</th>
                <th className="p-4 text-xs uppercase tracking-[0.16em] text-gold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[var(--border-soft)] hover:bg-[var(--accent-soft)]">
                  <td className="p-4">
                    <Link href={`/admin/sermons/${r.id}` as `/admin/sermons/${string}`} className="text-warm hover:text-gold">
                      {r.title}
                    </Link>
                  </td>
                  <td className="p-4 text-muted text-sm">{r.primary_passage}</td>
                  <td className="p-4 text-muted text-sm">
                    {r.scheduled_for ? new Date(r.scheduled_for).toLocaleDateString("en-US") : "—"}
                  </td>
                  <td className="p-4 text-sm" style={{ color: r.theology_score ? "var(--glory-gold)" : "var(--fg-muted)" }}>
                    {r.theology_score ?? "—"}
                  </td>
                  <td className="p-4 text-sm" style={{ color: r.citation_score === "1" ? "var(--glory-gold)" : "var(--fg-muted)" }}>
                    {r.citation_score === "1" ? "OK" : r.citation_score === "0" ? "FAIL" : "—"}
                  </td>
                  <td
                    className="p-4 text-xs uppercase tracking-[0.16em]"
                    style={{ color: STATUS_COLORS[r.status] ?? "var(--fg-muted)" }}
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
