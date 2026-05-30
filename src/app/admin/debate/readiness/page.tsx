import Link from "next/link";

type Gate = {
  detail: string;
  met: boolean;
  name: string;
  owner: string;
  remediation: string;
};

export default async function DebateReadinessPage() {
  const { getRejectionCount } = await import("@/server/worker/agents/tone-classifier");
  const rejectionCount = await getRejectionCount().catch(() => 0);

  const gates: Gate[] = [
    {
      name: "Apologetics runway",
      met: false,
      detail: "0 tracked weeks",
      owner: "Teaching",
      remediation: "Track four weeks of apologetics responses before enabling public debate.",
    },
    {
      name: "Tone classifier hardening",
      met: rejectionCount >= 200,
      detail: `${rejectionCount}/200 attack-mode rejections`,
      owner: "Safety",
      remediation: "Keep collecting rejection samples until the classifier has enough live history.",
    },
    {
      name: "Hard-objection QA",
      met: false,
      detail: "Not yet run",
      owner: "Doctrine",
      remediation: "Run the hard-objection suite and require at least a 90% pass rate.",
    },
    {
      name: "Kill switch",
      met: process.env.FEATURE_LIVE_DEBATE === "false" || process.env.FEATURE_LIVE_DEBATE === "true",
      detail: process.env.FEATURE_LIVE_DEBATE ?? "unset",
      owner: "Operations",
      remediation: "Set FEATURE_LIVE_DEBATE explicitly to false until every launch gate is green.",
    },
  ];

  const allGreen = gates.every((gate) => gate.met);

  return (
    <div className="max-w-6xl">
      <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Live debate readiness</p>
          <h1 className="m-0">Launch gate detail</h1>
          <p className="text-muted m-0 mt-3">
            The debate room stays closed until apologetics, tone safety, doctrine QA, and the
            emergency kill switch are all verified.
          </p>
        </div>
        <span className={`admin-status ${allGreen ? "admin-status--green" : "admin-status--red"}`}>
          {allGreen ? "Ready" : "Blocked"}
        </span>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {gates.map((gate) => (
          <article key={gate.name} className="card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="card__eyebrow">{gate.owner}</p>
                <h2 className="m-0">{gate.name}</h2>
              </div>
              <span className={`admin-status ${gate.met ? "admin-status--green" : "admin-status--red"}`}>
                {gate.met ? "Pass" : "Blocked"}
              </span>
            </div>
            <p className="text-warm m-0 mt-4 font-semibold">{gate.detail}</p>
            <p className="text-muted m-0 mt-2 text-sm">{gate.remediation}</p>
          </article>
        ))}
      </section>

      <section className="card mt-6">
        <p className="card__eyebrow">Operator rule</p>
        <h2 className="m-0">No silent override</h2>
        <p className="text-muted m-0 mt-3">
          This ministry can answer hard questions, but a live debate room is a high-risk public
          surface. Override requires a recorded admin action, reviewed prompts, and the kill switch
          tested in the same environment where the broadcast will run.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/admin/debate" className="btn btn--secondary">
            Back to debate room
          </Link>
          <Link href="/admin/models" className="btn btn--ghost">
            Review models
          </Link>
          <Link href="/admin/research" className="btn btn--ghost">
            Research queue
          </Link>
        </div>
      </section>
    </div>
  );
}
