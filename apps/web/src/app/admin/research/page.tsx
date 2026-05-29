const researchBacklog = [
  "Bible reliability and manuscript history",
  "Christianity and Islam: Scripture, tahrif, tawhid, and Trinity",
  "Old Testament roots of the Trinity",
  "Israel, Gentiles, and the nations in Romans 9-11",
  "Revelation as the unveiling of Jesus Christ",
  "Soul care: grief, fear, loneliness, shame, doubt, and crisis boundaries",
];

export default function AdminResearchPage() {
  return (
    <div className="p-10 max-w-5xl">
      <header className="mb-10">
        <p className="eyebrow">Research</p>
        <h1 className="m-0">Study backlog</h1>
        <p className="text-muted m-0 mt-3">
          Research notes feed The Scroll, Read articles, apologetics answers, and sermon
          series. Nothing here replaces Scripture; it supports careful teaching.
        </p>
      </header>

      <section className="card">
        <p className="card__eyebrow">Active lanes</p>
        <ul className="m-0 text-muted">
          {researchBacklog.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

