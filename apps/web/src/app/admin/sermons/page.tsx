import Link from "next/link";
import { sql } from "drizzle-orm";
import { formatLaunchDate, getStaticSermons } from "@/data/launch-schedule";
import { optionalDb } from "@/lib/server-db";

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

type SermonQueueRow = {
  id: string;
  slug: string;
  title: string;
  primaryPassage: string;
  status: string;
  scheduledFor: Date | string | null;
  theologyScore: string | null;
  citationScore: string | null;
  imageUrl: string | null;
  adminHref: string;
};

async function list(): Promise<Row[]> {
  const database = await optionalDb("admin-sermons");
  if (!database) return [];
  try {
    return await database.execute<Row>(sql`
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
  const dbRows = await list();
  const rows: SermonQueueRow[] =
    dbRows.length > 0
      ? dbRows.map((r) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          primaryPassage: r.primary_passage,
          status: r.status,
          scheduledFor: r.scheduled_for,
          theologyScore: r.theology_score,
          citationScore: r.citation_score,
          imageUrl: r.image_url,
          adminHref: `/admin/sermons/${r.id}`,
        }))
      : getStaticSermons().map((s) => ({
          id: s.id,
          slug: s.slug,
          title: s.title,
          primaryPassage: s.primaryPassage,
          status: s.status,
          scheduledFor: s.scheduledFor,
          theologyScore: "reviewed",
          citationScore: "1",
          imageUrl: s.imageUrl,
          adminHref: `/sermons/${s.slug}`,
        }));

  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow">Sermons</p>
          <h1 className="m-0">Editorial queue</h1>
          <p className="text-muted m-0 mt-3">
            {rows.length} sermon{rows.length === 1 ? "" : "s"} loaded in the launch queue.
          </p>
        </div>
        <form action="/api/sermons/generate" method="POST">
          <button type="submit" className="btn btn--primary">
            Generate next sermon
          </button>
        </form>
      </header>

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
                  <Link href={r.adminHref as `/${string}`} className="text-warm hover:text-gold">
                    {r.title}
                  </Link>
                </td>
                <td className="p-4 text-muted text-sm">{r.primaryPassage}</td>
                <td className="p-4 text-muted text-sm">{formatLaunchDate(r.scheduledFor)}</td>
                <td className="p-4 text-sm" style={{ color: r.theologyScore ? "var(--glory-gold)" : "var(--fg-muted)" }}>
                  {r.theologyScore ?? "review queue"}
                </td>
                <td className="p-4 text-sm" style={{ color: r.citationScore === "1" ? "var(--glory-gold)" : "var(--fg-muted)" }}>
                  {r.citationScore === "1" ? "OK" : r.citationScore === "0" ? "Review" : "review queue"}
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
    </div>
  );
}

