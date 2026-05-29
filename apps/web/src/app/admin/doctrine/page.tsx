const doctrineGuards = [
  "Scripture is the final written authority for faith and practice.",
  "Jesus Christ is fully God and fully man, crucified, risen, reigning, and returning.",
  "The Trinity is confessed as one God in three persons: Father, Son, and Holy Spirit.",
  "The gospel is freely offered; no prosperity manipulation or pay-to-blessing language is allowed.",
  "Crisis, medical, legal, and pastoral boundaries are surfaced clearly.",
  "WEB and KJV are the approved Bible text sources for public quotation.",
];

export default function AdminDoctrinePage() {
  return (
    <div className="p-10 max-w-5xl">
      <header className="mb-10">
        <p className="eyebrow">Doctrine</p>
        <h1 className="m-0">Review guardrails</h1>
        <p className="text-muted m-0 mt-3">
          These are the doctrinal checks every sermon, Ask Hope response, Scroll topic,
          and generated media brief must respect before publication.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctrineGuards.map((guard) => (
          <article key={guard} className="card">
            <p className="m-0 text-muted">{guard}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

