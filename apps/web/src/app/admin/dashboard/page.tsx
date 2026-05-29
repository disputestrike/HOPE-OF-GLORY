/**
 * Founder dashboard — single pane of glass.
 *
 * One screen. Everything that matters. Drill-downs from here to specific
 * admin sub-pages. Read-only by design; mutations live on the sub-pages.
 */
import Link from "next/link";
import { sql } from "drizzle-orm";
import { optionalDb } from "@/lib/server-db";
import { getReleaseReadiness } from "@hog/shared";
import { getSpendSnapshot } from "@hog/ai";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Metric = { label: string; value: string | number; sub?: string; href?: string; tone?: "ok" | "warn" | "fail" };

async function loadMetrics(): Promise<Metric[]> {
  const db = await optionalDb("admin-dashboard");
  const metrics: Metric[] = [];

  if (!db) {
    return [
      { label: "Database", value: "not connected", tone: "warn", sub: "Set DATABASE_URL to populate this dashboard." },
    ];
  }

  const queries = await Promise.all([
    db.execute<{ count: string }>(sql`SELECT COUNT(*) as count FROM sermons WHERE status IN ('published','ready') AND scheduled_for::date = current_date`).catch(() => []),
    db.execute<{ count: string }>(sql`SELECT COUNT(*) as count FROM sermons WHERE status = 'verifying'`).catch(() => []),
    db.execute<{ count: string }>(sql`SELECT COUNT(*) as count FROM prayer_requests WHERE created_at::date = current_date`).catch(() => []),
    db.execute<{ count: string }>(sql`SELECT COUNT(*) as count FROM prayer_requests WHERE follow_up_state = 'needs_human_review'`).catch(() => []),
    db.execute<{ count: string }>(sql`SELECT COUNT(*) as count FROM crisis_events WHERE severity IN ('imminent','urgent') AND created_at > now() - interval '7 days'`).catch(() => []),
    db.execute<{ count: string }>(sql`SELECT COUNT(*) as count FROM call_sessions WHERE started_at::date = current_date`).catch(() => []),
    db.execute<{ count: string }>(sql`SELECT COUNT(*) as count FROM social_posts WHERE status = 'queued'`).catch(() => []),
    db.execute<{ count: string }>(sql`SELECT COUNT(*) as count FROM social_posts WHERE status = 'failed' AND updated_at > now() - interval '24 hours'`).catch(() => []),
    db.execute<{ count: string }>(sql`SELECT COUNT(*) as count FROM email_campaigns WHERE status = 'scheduled'`).catch(() => []),
    db.execute<{ count: string }>(sql`SELECT COUNT(*) as count FROM moderation_flags WHERE status = 'open'`).catch(() => []),
    db.execute<{ amount: string }>(sql`SELECT COALESCE(SUM(amount),0) as amount FROM donations WHERE created_at::date = current_date AND status = 'completed'`).catch(() => []),
    db.execute<{ amount: string }>(sql`SELECT COALESCE(SUM(amount),0) as amount FROM donations WHERE created_at >= date_trunc('month', now()) AND status = 'completed'`).catch(() => []),
    db.execute<{ count: string }>(sql`SELECT COUNT(*) as count FROM job_runs WHERE status = 'failed' AND COALESCE(finished_at, started_at, created_at) > now() - interval '24 hours'`).catch(() => []),
    db.execute<{ count: string }>(sql`SELECT COUNT(*) as count FROM human_handoff WHERE status = 'open'`).catch(() => []),
  ]);

  const [todaySermon, verifying, prayersToday, prayersReview, crisis7d, callsToday, socialQueued, socialFailed, emailScheduled, modOpen, donateToday, donateMonth, jobsFailed, handoffOpen] = queries;
  const num = (r: Array<{ count?: string; amount?: string }>): number => Number(r[0]?.count ?? r[0]?.amount ?? 0);

  return [
    { label: "Today's sermon", value: num(todaySermon) ? "Published" : "Not yet", tone: num(todaySermon) ? "ok" : "warn", href: "/admin/sermons" },
    { label: "Sermons needing review", value: num(verifying), tone: num(verifying) > 0 ? "warn" : "ok", href: "/admin/sermons" },
    { label: "Prayer requests today", value: num(prayersToday), href: "/admin/prayers" },
    { label: "Prayers needing review", value: num(prayersReview), tone: num(prayersReview) > 0 ? "warn" : "ok", href: "/admin/prayers" },
    { label: "Crisis events (7d, urgent+)", value: num(crisis7d), tone: num(crisis7d) > 0 ? "warn" : "ok", href: "/admin/calls" },
    { label: "Calls today", value: num(callsToday), href: "/admin/calls" },
    { label: "Social posts queued", value: num(socialQueued), href: "/admin/social" },
    { label: "Social failures (24h)", value: num(socialFailed), tone: num(socialFailed) > 0 ? "fail" : "ok", href: "/admin/social" },
    { label: "Email campaigns scheduled", value: num(emailScheduled), href: "/admin/email" },
    { label: "Open moderation flags", value: num(modOpen), tone: num(modOpen) > 0 ? "warn" : "ok", href: "/admin/corrections" },
    { label: "Donations today", value: `$${num(donateToday).toFixed(2)}`, href: "/admin/donations" },
    { label: "Donations this month", value: `$${num(donateMonth).toFixed(2)}`, href: "/admin/donations" },
    { label: "Failed jobs (24h)", value: num(jobsFailed), tone: num(jobsFailed) > 0 ? "fail" : "ok" },
    { label: "Open human handoffs", value: num(handoffOpen), tone: num(handoffOpen) > 0 ? "warn" : "ok", href: "/admin/handoff" },
  ];
}

export default async function FounderDashboard() {
  const metrics = await loadMetrics();
  const readiness = getReleaseReadiness();
  const spend = await getSpendSnapshot();

  const failed = readiness.filter((c) => c.status === "fail").length;
  const warned = readiness.filter((c) => c.status === "warn").length;

  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Founder dashboard</p>
        <h1 className="m-0">Today at a glance</h1>
        <p className="text-muted m-0 mt-3 max-w-readable">
          One page. Everything that matters. Click any tile to drill in.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {metrics.map((m) => {
          const inner = (
            <>
              <p className="card__eyebrow">{m.label}</p>
              <p className="m-0 text-3xl text-gold" style={{ fontFamily: "var(--font-display)", color: m.tone === "fail" ? "var(--blood-crimson)" : m.tone === "warn" ? "#e1c14b" : undefined }}>
                {m.value}
              </p>
              {m.sub ? <p className="m-0 text-muted text-sm mt-1">{m.sub}</p> : null}
            </>
          );
          return m.href ? (
            <Link key={m.label} href={m.href as `/${string}`} className="card hover:no-underline">
              {inner}
            </Link>
          ) : (
            <div key={m.label} className="card">{inner}</div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <Link href="/admin/release" className="card hover:no-underline">
          <p className="card__eyebrow">Release readiness</p>
          <p className="m-0">
            <span className="text-2xl" style={{ color: failed > 0 ? "var(--blood-crimson)" : "var(--glory-gold)" }}>
              {failed === 0 ? "READY" : `${failed} blocked`}
            </span>
            <span className="text-muted text-sm"> · {warned} warnings</span>
          </p>
          <p className="m-0 text-muted text-sm mt-2">20 gates, the canonical definition of go-live.</p>
        </Link>
        <Link href="/admin/spend" className="card hover:no-underline">
          <p className="card__eyebrow">AI spend</p>
          <p className="m-0">
            <span className="text-2xl text-gold" style={{ fontFamily: "var(--font-display)" }}>
              ${spend.total.day.toFixed(2)} <span className="text-muted text-sm">today</span>
            </span>
            <span className="text-muted text-sm"> · ${spend.total.month.toFixed(2)} this month</span>
          </p>
          {spend.caps.daily ? (
            <p className="m-0 text-muted text-sm mt-2">
              Daily cap ${spend.caps.daily.toFixed(0)} · monthly cap ${spend.caps.monthly?.toFixed(0) ?? "—"}
            </p>
          ) : (
            <p className="m-0 text-muted text-sm mt-2">Set AI_DAILY_BUDGET_USD to enable caps.</p>
          )}
        </Link>
      </section>

      <section>
        <p className="eyebrow">Other admin pages</p>
        <div className="flex flex-wrap gap-2">
          {[
            ["/admin/sermons", "Sermons"],
            ["/admin/calendar", "Calendar"],
            ["/admin/prayers", "Prayers"],
            ["/admin/questions", "Q&A log"],
            ["/admin/calls", "Calls"],
            ["/admin/live", "Live"],
            ["/admin/social", "Social"],
            ["/admin/email", "Email"],
            ["/admin/donations", "Donations"],
            ["/admin/corrections", "Corrections"],
            ["/admin/handoff", "Handoffs"],
            ["/admin/doctrine", "Doctrine"],
            ["/admin/research", "Research"],
            ["/admin/models", "Models"],
            ["/admin/release", "Release"],
            ["/admin/spend", "Spend"],
            ["/admin/debate", "Debate"],
            ["/admin/engagement", "Engagement"],
            ["/admin/media", "Media"],
          ].map(([href, label]) => (
            <Link key={href} href={href as `/${string}`} className="text-muted hover:text-gold text-sm uppercase tracking-[0.12em] border border-[var(--border-soft)] rounded px-3 py-1">
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
