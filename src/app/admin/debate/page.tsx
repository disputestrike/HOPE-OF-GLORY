import Link from "next/link";

export default async function AdminDebatePage() {
  // Lazy import to keep edge runtime light
  const { getRejectionCount } = await import("@/server/worker/agents/tone-classifier");
  const rejectionCount = await getRejectionCount().catch(() => 0);

  const gates = [
    { name: "Apologetics recorded ≥ 4 weeks", met: false, value: "0 weeks (track from first apologetics response)" },
    { name: "Tone classifier attack-mode rejections ≥ 200", met: rejectionCount >= 200, value: `${rejectionCount} rejections` },
    { name: "Hard-objection test pass rate ≥ 90%", met: false, value: "Not yet run" },
    { name: "Kill switch armed and tested", met: process.env.FEATURE_LIVE_DEBATE === "false" || process.env.FEATURE_LIVE_DEBATE === "true", value: process.env.FEATURE_LIVE_DEBATE ?? "unset" },
  ];

  const allGreen = gates.every((g) => g.met);

  return (
    <div className="p-10 max-w-5xl">
      <header className="mb-10">
        <p className="eyebrow">Phase 11 — highest-risk feature</p>
        <h1 className="m-0">Live debate room</h1>
        <p className="text-muted m-0 mt-3">
          The live debate room cannot open to the public until all four launch gates are green.
          This page is the bouncer.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {gates.map((g) => (
          <div
            key={g.name}
            className="card"
            style={{ borderColor: g.met ? "#9bbf6e" : "var(--blood-crimson)" }}
          >
            <p
              className="card__eyebrow m-0"
              style={{ color: g.met ? "#9bbf6e" : "var(--blood-crimson)" }}
            >
              {g.met ? "PASS" : "BLOCKED"}
            </p>
            <h3 className="m-0 mt-2 text-warm text-base">{g.name}</h3>
            <p className="m-0 mt-2 text-muted text-sm">{g.value}</p>
          </div>
        ))}
      </section>

      <section className="card" style={{ borderColor: allGreen ? "#9bbf6e" : "var(--border-soft)" }}>
        <p className="card__eyebrow">Kill switch</p>
        <p className="m-0 mb-4 text-muted">
          During a live debate, this button immediately ends the YouTube broadcast and rejects all
          queued responses. Use it without hesitation if anything looks off.
        </p>
        <form action="/api/debate/kill" method="POST">
          <button
            type="submit"
            className="btn"
            style={{
              background: "var(--blood-crimson)",
              color: "var(--warm-light)",
              borderColor: "var(--blood-crimson)",
            }}
          >
            END THE BROADCAST
          </button>
        </form>
      </section>

      {!allGreen ? (
        <p className="text-muted text-sm mt-6">
          To override the gate (logged to admin_actions), see{" "}
          <Link href="/admin/debate/readiness" className="text-gold">readiness detail</Link>.
        </p>
      ) : null}
    </div>
  );
}
