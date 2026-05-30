import Link from "next/link";
import { features } from "@hog/shared";
import {
  AUTOMATION_RUNBOOK,
  EMAIL_LIFECYCLE,
  LAUNCH_SERMONS,
  getEditorialCalendar,
  getSocialQueue,
  getTodaysLaunchSermon,
} from "@/data/launch-schedule";

export default function AdminDashboard() {
  const flags = features();
  const today = getTodaysLaunchSermon();
  const calendar = getEditorialCalendar();
  const socialQueue = getSocialQueue();

  const widgets = [
    {
      label: "Today's sermon",
      value: "1",
      sub: today.title,
    },
    {
      label: "Launch sermons",
      value: String(LAUNCH_SERMONS.length),
      sub: "Substantial messages loaded",
    },
    {
      label: "Calendar items",
      value: String(calendar.length),
      sub: "Five-week editorial schedule",
    },
    {
      label: "Social posts",
      value: String(socialQueue.length),
      sub: "Platform-ready queue",
    },
    {
      label: "Email flows",
      value: String(EMAIL_LIFECYCLE.length),
      sub: "Lifecycle templates wired",
    },
    {
      label: "Automation steps",
      value: String(AUTOMATION_RUNBOOK.length),
      sub: "Daily runbook visible",
    },
    {
      label: "Voice line",
      value: flags.hopeLine ? "On" : "Setup",
      sub: "SignalWire / Deepgram gated",
    },
    {
      label: "Donations",
      value: flags.donations ? "On" : "Setup",
      sub: "PayPal gated by credentials",
    },
  ];

  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-12">
        <p className="eyebrow">Operations</p>
        <h1 className="m-0">Workshop dashboard</h1>
        <p className="text-muted max-w-readable mt-3">
          This is the control-room view: daily sermon, editorial calendar, email flows,
          social queue, phone ministry, donations, and review surfaces in one place.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="m-0 mb-4">Operational state</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {widgets.map((w) => (
            <div key={w.label} className="card">
              <p className="card__eyebrow">{w.label}</p>
              <p
                className="m-0 mb-1"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.25rem",
                  fontWeight: 600,
                  color: "var(--glory-gold)",
                  lineHeight: 1,
                }}
              >
                {w.value}
              </p>
              <p className="text-muted text-sm m-0">{w.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="m-0 mb-4">Today's content chain</h2>
        <div className="card">
          <p className="card__eyebrow">{today.primaryPassage}</p>
          <h3 className="m-0 mb-2">{today.title}</h3>
          <p className="m-0 mb-5 text-muted">{today.summary}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/sermons/${today.slug}` as `/sermons/${string}`} className="btn btn--primary">
              Open sermon
            </Link>
            <Link href="/admin/calendar" className="btn btn--secondary">
              Calendar
            </Link>
            <Link href="/admin/social" className="btn btn--ghost">
              Social queue
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="m-0 mb-4">Daily automation runbook</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {AUTOMATION_RUNBOOK.map((step) => (
            <article key={`${step.time}-${step.owner}`} className="card">
              <p className="card__eyebrow">{step.time} - {step.owner}</p>
              <h3 className="m-0 mb-2" style={{ fontSize: "var(--fs-h3)" }}>
                {step.action}
              </h3>
              <p className="m-0 mb-3 text-muted text-sm">{step.output}</p>
              <p className="m-0 text-muted text-xs">Requires: {step.requires}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="m-0 mb-4">Feature flags</h2>
        <div className="card">
          <table className="w-full">
            <tbody>
              {Object.entries(flags).map(([key, on]) => (
                <tr key={key} className="border-b border-[var(--border-soft)] last:border-0">
                  <td className="py-3 text-warm">{key}</td>
                  <td className="py-3 text-right">
                    <span
                      className={
                        on
                          ? "text-gold uppercase text-xs tracking-[0.16em]"
                          : "text-muted uppercase text-xs tracking-[0.16em]"
                      }
                    >
                      {on ? "On" : "Credential gated"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
