import { getReleaseReadiness } from "@hog/shared";

const statusClass = {
  ok: "text-emerald-700 bg-emerald-50 border-emerald-200",
  pending: "text-slate-700 bg-slate-50 border-slate-200",
  warn: "text-amber-700 bg-amber-50 border-amber-200",
  fail: "text-red-700 bg-red-50 border-red-200",
} as const;

const statusLabel = {
  ok: "READY",
  pending: "AWAITING KEY",
  warn: "DEGRADED",
  fail: "BLOCKED",
} as const;

export default function AdminReleasePage() {
  const checks = getReleaseReadiness();
  const failed = checks.filter((check) => check.status === "fail").length;
  const warned = checks.filter((check) => check.status === "warn").length;
  const pending = checks.filter((check) => check.status === "pending").length;
  const passed = checks.filter((check) => check.status === "ok").length;

  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Pre-release gate</p>
        <h1 className="m-0">Production readiness</h1>
        <p className="text-muted m-0 mt-3 max-w-readable">
          Twenty release gates for the ministry platform. <strong>Green</strong>{" "}
          means ready. <strong>Slate</strong> means the feature is wired and
          waiting for a credential — paste the key into Railway and it flips
          green on next deploy. <strong>Yellow</strong> means a real soft
          degradation. <strong>Red</strong> blocks production traffic and must
          be fixed.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="card">
          <p className="card__eyebrow">Ready</p>
          <p className="m-0 text-4xl font-semibold text-emerald-700">{passed}</p>
        </div>
        <div className="card">
          <p className="card__eyebrow">Awaiting key</p>
          <p className="m-0 text-4xl font-semibold text-slate-700">{pending}</p>
        </div>
        <div className="card">
          <p className="card__eyebrow">Degraded</p>
          <p className="m-0 text-4xl font-semibold text-amber-700">{warned}</p>
        </div>
        <div className="card">
          <p className="card__eyebrow">Blocking</p>
          <p className="m-0 text-4xl font-semibold text-red-700">{failed}</p>
        </div>
      </section>

      <section className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-4 text-left text-xs uppercase tracking-[0.16em] text-gold">Gate</th>
              <th className="p-4 text-left text-xs uppercase tracking-[0.16em] text-gold">Category</th>
              <th className="p-4 text-left text-xs uppercase tracking-[0.16em] text-gold">Status</th>
              <th className="p-4 text-left text-xs uppercase tracking-[0.16em] text-gold">Detail</th>
            </tr>
          </thead>
          <tbody>
            {checks.map((check, index) => (
              <tr key={check.id}>
                <td className="p-4">
                  <span className="text-muted text-xs mr-2">{index + 1}.</span>
                  <span className="text-warm font-semibold">{check.label}</span>
                </td>
                <td className="p-4 text-sm text-muted capitalize">{check.category}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${statusClass[check.status]}`}
                  >
                    {statusLabel[check.status]}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted">{check.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
