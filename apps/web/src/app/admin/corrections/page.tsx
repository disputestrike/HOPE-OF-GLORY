const correctionPolicy = [
  "Every public correction is dated, plain, and easy to understand.",
  "Doctrinal corrections are reviewed before publication.",
  "Typos and formatting fixes do not need a public correction unless they changed meaning.",
  "AI-generated material can be withdrawn, corrected, or annotated by the ministry.",
];

export default function AdminCorrectionsPage() {
  return (
    <div className="p-10 max-w-5xl">
      <header className="mb-10">
        <p className="eyebrow">Corrections</p>
        <h1 className="m-0">Public correction trail</h1>
        <p className="text-muted m-0 mt-3">
          The correction system is part of trust and transparency. Items enter here from
          content review, contact reports, doctrine review, and moderation.
        </p>
      </header>

      <section className="card">
        <p className="card__eyebrow">Operating policy</p>
        <ul className="m-0 text-muted">
          {correctionPolicy.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

