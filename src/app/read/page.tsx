import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Read — The Hope of Glory library",
  description:
    "Plain biblical teaching on the gospel, God, Christ in all Scripture, life's biggest questions, prayer and healing, holiness, the church, the nations, apologetics, and soul care.",
};

const hubs = [
  {
    slug: "come-to-christ",
    eyebrow: "Begin",
    title: "Come to Christ / Gospel",
    body: "Why you need Jesus. What the gospel is. Why he had to die. Did he rise? How can you be saved?",
    sample: ["Why You Need Jesus", "Did Jesus Rise from the Dead?", "Born Again", "Baptism", "Assurance of Salvation"],
  },
  {
    slug: "god-trinity-word-spirit",
    eyebrow: "God",
    title: "God, Trinity, the Word, and the Holy Spirit",
    body: "Who God is. The triune God. The Word and the Spirit. Walking by the Spirit. Fruit and gifts.",
    sample: ["Who Is God?", "The Triune God", "Who Is the Holy Spirit?", "Born Again", "Walking by the Spirit"],
  },
  {
    slug: "christ-in-all-scripture",
    eyebrow: "Bible",
    title: "Christ in All Scripture",
    body: "From Genesis to Revelation, the Bible's spine is Jesus. The seed, the lamb, the suffering servant, the king.",
    sample: ["Christ in You", "Messianic Prophecies", "The Suffering Servant", "The Passover Lamb", "The Mystery Hidden and Revealed"],
  },
  {
    slug: "lifes-biggest-questions",
    eyebrow: "Questions",
    title: "Life's Biggest Questions",
    body: "Purpose. Evil. Suffering. Sin. Truth. Death. Why Jesus? What happens when I die?",
    sample: ["What Is the Purpose of Life?", "Why Is There Evil?", "Why Do I Suffer?", "Is Christianity True?", "What Happens When I Die?"],
  },
  {
    slug: "word-prayer-and-power",
    eyebrow: "Prayer",
    title: "Word, Prayer, and Power",
    body: "How to pray honestly. What biblical meditation means. Does God still heal? When the answer is no.",
    sample: ["Does God Really Answer Prayer?", "How Do We Pray?", "Meditate on the Word Day and Night", "Does God Still Heal Today?", "When God Says No"],
  },
  {
    slug: "following-jesus",
    eyebrow: "Discipleship",
    title: "Following Jesus in Real Life",
    body: "Holiness, repentance, sexuality, money, work, family, anger, forgiveness, integrity, humility.",
    sample: ["Overcoming Sin", "Repentance", "Marriage and Sexuality", "Money and Contentment", "Forgiveness"],
  },
  {
    slug: "what-the-world-needs",
    eyebrow: "Mission",
    title: "What the World Needs",
    body: "One Savior. One kingdom. One mission. False gospels. Idolatry. Justice and mercy. The hope of the nations.",
    sample: ["Why You Need Jesus", "The Only Savior", "The Kingdom of God", "False Gospels", "The Hope of the Nations"],
  },
  {
    slug: "nations-unity-and-glory",
    eyebrow: "Glory",
    title: "Nations, Unity, and Glory",
    body: "One new people in Christ. Different peoples, one Lord. The earth filled with his glory.",
    sample: ["One New People in Christ", "Racism and the Gospel", "The Knowledge of Christ for All Peoples", "Unity of the Spirit", "The Earth Filled With His Glory"],
  },
  {
    slug: "apologetics",
    eyebrow: "Defense",
    title: "Apologetics and Hard Questions",
    body: "The Bible. The Trinity. The resurrection. Islam. Atheism. Science. Suffering. Compare doctrines, never insult persons.",
    sample: ["Why Trust the Bible?", "Christianity and Islam", "Did Jesus Really Rise?", "Atheism and Unbelief", "Why Jesus and Not Another Way?"],
  },
  {
    slug: "worship-love-and-obedience",
    eyebrow: "Heart",
    title: "Worship, Love, and Obedience",
    body: "True worship. Love God. Love your neighbor. Love your enemies. Abide in Christ.",
    sample: ["True Worship", "Love Your Neighbor", "Love Your Enemies", "Faith Working Through Love", "Abide in Christ"],
  },
  {
    slug: "church-and-discipleship",
    eyebrow: "Church",
    title: "The Church and Discipleship",
    body: "What the church is. Why the local church matters. Baptism. Communion. Gifts. Membership.",
    sample: ["What Is the Church?", "Why Local Church Matters", "Body of Christ", "Baptism", "Communion / Lord's Supper"],
  },
  {
    slug: "hope-for-the-human-heart",
    eyebrow: "Soul care",
    title: "Hope for the Human Heart",
    body: "Grief. Fear. Death. Loneliness. Doubt. Shame. Confession. Hopelessness. Family pain. Waiting on God.",
    sample: ["Where Is God in My Grief?", "What Does the Bible Say About Fear?", "Can God Forgive Me?", "Does God See Me When I Feel Alone?", "Where Is God When I Feel Hopeless?"],
  },
] as const;

export default function ReadPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Read", href: "/read" }]} />

        <header className="mb-12">
          <p className="eyebrow">Read</p>
          <h1>The Hope of Glory library.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            Plain biblical teaching on the gospel, who God is, who Christ is, who you are
            in him, and what it looks like to live the Christian life. Twelve doorways into
            the Word. Hundreds of articles. One Lord.
          </p>
        </header>

        <section
          className="card mb-8"
          style={{ borderColor: "var(--glory-gold)" }}
        >
          <p className="card__eyebrow">Bible confidence</p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="m-0 mb-2 text-base text-warm">
                Questions about manuscripts, corruption, history, archaeology, or science?
              </h2>
              <p className="m-0 text-muted text-sm">
                Start with the dedicated Bible-confidence page, then go deeper
                through the Apologetics hub and The Scroll.
              </p>
            </div>
            <Link href="/trust-the-scriptures" className="btn btn--secondary">
              Trust the Scriptures
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hubs.map((h) => (
            <article key={h.slug} className="card">
              <p className="card__eyebrow">{h.eyebrow}</p>
              <h2 className="m-0 mb-2 text-base">
                <Link
                  href={`/read/${h.slug}` as `/read/${string}`}
                  className="text-warm hover:text-gold no-underline"
                >
                  {h.title}
                </Link>
              </h2>
              <p className="text-muted text-sm mb-4">{h.body}</p>
              <ul className="m-0 p-0 list-none text-sm">
                {h.sample.map((s) => (
                  <li key={s} className="text-muted mb-1">
                    · {s}
                  </li>
                ))}
              </ul>
              <Link
                href={`/read/${h.slug}` as `/read/${string}`}
                className="btn btn--ghost text-sm mt-4"
                style={{ padding: "0.5rem 1rem" }}
              >
                Open hub →
              </Link>
            </article>
          ))}
        </div>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Looking for something specific?</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/ask" className="btn btn--primary">
              Ask Hope
            </Link>
            <Link href="/messages" className="btn btn--secondary">
              Browse Messages
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
