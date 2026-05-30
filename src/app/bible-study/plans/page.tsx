import Link from "next/link";

const plans = [
  {
    title: "30 Days With Jesus",
    pace: "One chapter or passage per day",
    path: [
      "John 1-7",
      "John 8-14",
      "John 15-21",
      "Mark 1-8",
      "Mark 9-16",
      "Luke 15; Luke 23-24",
    ],
    outcome: "Meet Jesus clearly before moving into the rest of Scripture.",
  },
  {
    title: "90-Day Gospel Foundations",
    pace: "Three to four chapters per day",
    path: [
      "Genesis",
      "Exodus 1-20",
      "Psalms 1-41",
      "Isaiah 40-55",
      "Luke",
      "Acts",
      "Romans",
      "Ephesians",
    ],
    outcome: "Trace creation, covenant, promise, Christ, church, and new life.",
  },
  {
    title: "One-Year Whole Bible Path",
    pace: "Old Testament, Psalm or Proverbs, and New Testament each day",
    path: [
      "Torah and history",
      "Psalms and wisdom",
      "Prophets",
      "Gospels",
      "Acts and Epistles",
      "Revelation",
    ],
    outcome: "Read the whole Bible as one story centered on Jesus Christ.",
  },
];

export default function BibleStudyPlansPage() {
  return (
    <main className="section">
      <div className="container-prose">
        <header className="mb-12">
          <p className="eyebrow">Bible study</p>
          <h1>Reading plans</h1>
          <p className="text-muted mt-4" style={{ fontSize: "var(--fs-body-lg)" }}>
            Simple paths for reading Scripture with attention, prayer, and obedience.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.title} className="card">
              <p className="card__eyebrow">{plan.pace}</p>
              <h2 className="m-0">{plan.title}</h2>
              <p className="text-muted m-0 mt-3">{plan.outcome}</p>
              <ul className="mt-5">
                {plan.path.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="card mt-8">
          <p className="card__eyebrow">How to read</p>
          <h2 className="m-0">Pray, read, ask, obey</h2>
          <p className="text-muted m-0 mt-3">
            Begin with prayer, read the passage slowly, write down what God reveals about
            Himself, ask how the passage points to Christ, and take one concrete step of obedience.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/bible-study" className="btn btn--secondary">
              Back to Bible study
            </Link>
            <Link href="/ask" className="btn btn--primary">
              Ask Hope
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
