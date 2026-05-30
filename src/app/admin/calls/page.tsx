import Link from "next/link";
import { sql } from "drizzle-orm";
import { optionalDb } from "@/lib/server-db";

type Row = {
  id: string;
  caller_hash: string;
  started_at: Date;
  ended_at: Date | null;
  risk_level: string;
  escalated_to: string | null;
};

async function load(): Promise<Row[]> {
  const database = await optionalDb("admin-calls");
  if (!database) return [];
  try {
    return await database.execute<Row>(sql`
      SELECT id, caller_hash, started_at, ended_at, risk_level, escalated_to
      FROM call_sessions
      ORDER BY started_at DESC
      LIMIT 100
    `);
  } catch {
    return [];
  }
}

const RISK_COLOR: Record<string, string> = {
  none: "var(--fg-muted)",
  watch: "#e1c14b",
  active: "var(--blood-crimson)",
  imminent: "var(--blood-crimson)",
};

export default async function AdminCallsPage() {
  const rows = await load();
  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Hope Line</p>
        <h1 className="m-0">Call review</h1>
        <p className="text-muted m-0 mt-3">
          Every call transcript is reviewed within 24 hours. Imminent and active risk
          calls appear at the top.
        </p>
      </header>
      {rows.length === 0 ? (
        <div className="card">
          <p className="m-0 text-muted">
            Hope Line queue is ready. Provision a SignalWire number, point it at{" "}
            <code>/api/voice/inbound</code>, and run the 20+ simulated scenarios in{" "}
            <code>apps/voice/src/test-scenarios.ts</code> before going public.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((r) => (
            <Link
              key={r.id}
              href={`/admin/calls/${r.id}` as `/admin/calls/${string}`}
              className="card flex items-center justify-between hover:no-underline"
            >
              <div>
                <p className="card__eyebrow m-0">
                  Caller {r.caller_hash.slice(0, 8)} · {new Date(r.started_at).toLocaleString("en-US")}
                </p>
                <p className="m-0 text-warm">
                  {r.escalated_to ? `Escalated to ${r.escalated_to}` : "No escalation"}
                </p>
              </div>
              <p
                className="m-0 text-xs uppercase tracking-[0.16em]"
                style={{ color: RISK_COLOR[r.risk_level] ?? "var(--fg-muted)" }}
              >
                {r.risk_level}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
