import { features } from "@hog/shared";

export default function AdminDashboard() {
  const flags = features();

  const widgets = [
    {
      label: "Sermons today",
      value: "—",
      sub: "Phase 2 lights this up",
    },
    {
      label: "Prayer requests",
      value: "—",
      sub: "Phase 3 enables intake",
    },
    {
      label: "Ask Hope conversations",
      value: "—",
      sub: "Phase 3 chat live",
    },
    {
      label: "Hope Line calls",
      value: "—",
      sub: "Phase 9",
    },
    {
      label: "Flagged outputs",
      value: "—",
      sub: "Moderation queue",
    },
    {
      label: "Pending corrections",
      value: "—",
      sub: "Public trail",
    },
    {
      label: "Donations today",
      value: "—",
      sub: "Phase 10",
    },
    {
      label: "Cerebras 429 rate",
      value: "—",
      sub: "Key pool health",
    },
  ];

  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-12">
        <p className="eyebrow">Operations</p>
        <h1 className="m-0">Workshop dashboard</h1>
        <p className="text-muted max-w-readable mt-3">
          A snapshot of every active agent and the state of the workshop.
          Empty cells light up as each phase rolls out.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="m-0 mb-4">Live agents</h2>
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
        <h2 className="m-0 mb-4">Feature flags</h2>
        <div className="card">
          <table className="w-full">
            <tbody>
              {Object.entries(flags).map(([key, on]) => (
                <tr
                  key={key}
                  className="border-b border-[var(--border-soft)] last:border-0"
                >
                  <td className="py-3 text-warm">{key}</td>
                  <td className="py-3 text-right">
                    <span
                      className={
                        on
                          ? "text-gold uppercase text-xs tracking-[0.16em]"
                          : "text-muted uppercase text-xs tracking-[0.16em]"
                      }
                    >
                      {on ? "On" : "Off"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="m-0 mb-4">Build progress</h2>
        <div className="card">
          <p className="m-0 text-muted">
            See <code>MASTER-PLAN.md</code> at the repo root for the full 13-phase plan
            and green-light gates. See <code>OWNER-PUNCHLIST.md</code> for the credentials
            and accounts needed at each step.
          </p>
        </div>
      </section>
    </div>
  );
}
