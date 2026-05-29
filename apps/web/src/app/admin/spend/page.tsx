/**
 * AI spend dashboard — daily and monthly spend per provider with cap visibility.
 */
import Link from "next/link";
import { getSpendSnapshot } from "@hog/ai";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Provider = "cerebras" | "anthropic" | "openai";

function pctOfCap(spent: number, cap?: number): { pct: number; tone: "ok" | "warn" | "fail" } {
  if (!cap || cap <= 0) return { pct: 0, tone: "ok" };
  const pct = (spent / cap) * 100;
  return { pct, tone: pct >= 100 ? "fail" : pct >= 80 ? "warn" : "ok" };
}

const TONE_COLOR = {
  ok: "var(--glory-gold)",
  warn: "#e1c14b",
  fail: "var(--blood-crimson)",
} as const;

export default async function SpendDashboard() {
  const snap = await getSpendSnapshot();
  const dayPct = pctOfCap(snap.total.day, snap.caps.daily);
  const monthPct = pctOfCap(snap.total.month, snap.caps.monthly);

  const providers: Provider[] = ["cerebras", "anthropic", "openai"];

  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Spend</p>
        <h1 className="m-0">AI provider spend</h1>
        <p className="text-muted m-0 mt-3 max-w-readable">
          Daily and monthly spend across Cerebras, Anthropic, and OpenAI. Caps come from{" "}
          <code>AI_DAILY_BUDGET_USD</code> and <code>AI_MONTHLY_BUDGET_USD</code>. When
          <code>AI_BUDGET_HARD_STOP=true</code> (the default), the router refuses calls at 100%.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="card">
          <p className="card__eyebrow">Today</p>
          <p className="m-0 text-3xl" style={{ fontFamily: "var(--font-display)", color: TONE_COLOR[dayPct.tone] }}>
            ${snap.total.day.toFixed(2)}
            {snap.caps.daily ? <span className="text-muted text-base"> / ${snap.caps.daily.toFixed(0)}</span> : null}
          </p>
          {snap.caps.daily ? (
            <p className="m-0 text-muted text-sm mt-2">{dayPct.pct.toFixed(0)}% of daily cap</p>
          ) : (
            <p className="m-0 text-muted text-sm mt-2">No daily cap set</p>
          )}
        </div>
        <div className="card">
          <p className="card__eyebrow">This month</p>
          <p className="m-0 text-3xl" style={{ fontFamily: "var(--font-display)", color: TONE_COLOR[monthPct.tone] }}>
            ${snap.total.month.toFixed(2)}
            {snap.caps.monthly ? <span className="text-muted text-base"> / ${snap.caps.monthly.toFixed(0)}</span> : null}
          </p>
          {snap.caps.monthly ? (
            <p className="m-0 text-muted text-sm mt-2">{monthPct.pct.toFixed(0)}% of monthly cap</p>
          ) : (
            <p className="m-0 text-muted text-sm mt-2">No monthly cap set</p>
          )}
        </div>
      </section>

      <section className="card p-0 overflow-hidden mb-10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-soft)]">
              <th className="p-4 text-left text-xs uppercase tracking-[0.16em] text-gold">Provider</th>
              <th className="p-4 text-left text-xs uppercase tracking-[0.16em] text-gold">Today</th>
              <th className="p-4 text-left text-xs uppercase tracking-[0.16em] text-gold">This month</th>
              <th className="p-4 text-left text-xs uppercase tracking-[0.16em] text-gold">Role</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p} className="border-b border-[var(--border-soft)]">
                <td className="p-4 text-warm uppercase tracking-[0.12em]">{p}</td>
                <td className="p-4 text-gold">${snap.byProvider[p].day.toFixed(2)}</td>
                <td className="p-4 text-gold">${snap.byProvider[p].month.toFixed(2)}</td>
                <td className="p-4 text-muted text-sm">
                  {p === "cerebras" ? "Workhorse (low/medium risk)" : p === "anthropic" ? "Brain (critical risk, doctrine, crisis)" : "Verifier + embeddings"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <p className="eyebrow">Configuration</p>
        <div className="card">
          <ul className="m-0 text-muted">
            <li><code>AI_DAILY_BUDGET_USD</code> — hard daily cap (currently {snap.caps.daily ? `$${snap.caps.daily.toFixed(0)}` : "unset"})</li>
            <li><code>AI_MONTHLY_BUDGET_USD</code> — hard monthly cap (currently {snap.caps.monthly ? `$${snap.caps.monthly.toFixed(0)}` : "unset"})</li>
            <li><code>AI_BUDGET_ALERT_THRESHOLD_PCT</code> — alert at this % (default 80)</li>
            <li><code>AI_BUDGET_HARD_STOP</code> — refuse calls at 100% (default true)</li>
            <li><code>AI_BUDGET_ALERT_EMAILS</code> — comma-separated emails for budget alerts</li>
          </ul>
        </div>
        <p className="text-muted text-sm mt-6">
          <Link href="/admin/dashboard" className="text-gold">← Back to dashboard</Link>
        </p>
      </section>
    </div>
  );
}
