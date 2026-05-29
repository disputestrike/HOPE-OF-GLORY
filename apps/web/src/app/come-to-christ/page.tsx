import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleLd } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Come to Christ — Give Your Life to Jesus",
  description:
    "Why you need Jesus, what the gospel is, a biblical prayer of repentance and faith, and clear next steps. Jesus saves — not magic words.",
};

export default function ComeToChristPage() {
  return (
    <>
      {ArticleLd({
        headline: "Come to Christ — Give Your Life to Jesus",
        description: "The gospel of Jesus Christ explained simply, with a biblical prayer of repentance and faith.",
        url: "https://hopeofglory.ministry/come-to-christ",
        datePublished: "2025-01-01",
      })}
      <section className="section">
        <div className="container-prose">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Come to Christ", href: "/come-to-christ" },
            ]}
          />

          <header className="mb-10">
            <p className="eyebrow">Come to Christ</p>
            <h1>Give your life to Jesus.</h1>
            <p
              className="text-muted max-w-readable"
              style={{ fontSize: "var(--fs-body-lg)" }}
            >
              This is the most important page on this entire site. If you have
              never given your life to Jesus Christ — or you walked away and want
              to come home — read this slowly. There is nothing to buy. Nothing
              to pay. Nothing to prove. Christ has done it.
            </p>
          </header>

          <section className="mb-12">
            <p className="eyebrow">The short answer</p>
            <h2>Jesus saves. Not magic words.</h2>
            <p>
              You don't have to say the right phrase in the right order. You
              don't have to feel a certain way. You have to come — actually come —
              to the actual Jesus who actually lived, actually died for sin, and
              actually rose from the grave.
            </p>
          </section>

          <section className="mb-12">
            <h2>Why you need Jesus</h2>
            <p>
              God made you, and God is good. But every one of us has turned away
              from him — in our actions, in our words, in our hearts. The Bible
              calls this sin. Sin is not just a list of bad behaviors; it is a
              broken relationship with the God who made us.
            </p>
            <p>
              You can feel it. The shame you carry. The thing you can't stop
              doing. The voice that says you are too far gone. The death you know
              is coming. The ache you can't name.
            </p>
            <p>
              You can't fix yourself. Not by being better, not by being
              religious, not by being good enough. You need rescue.
            </p>
            <blockquote className="scripture-display border-none m-0 p-0 my-10">
              For God so loved the world, that he gave his one and only Son, that
              whoever believes in him should not perish, but have eternal life.
            </blockquote>
            <p className="scripture-ref">John 3:16 · WEB</p>
          </section>

          <section className="mb-12">
            <h2>What is the gospel?</h2>
            <p>
              Jesus Christ — the eternal Son of God — became a man. He lived the
              life of perfect love we couldn't live. He died on a cross to take
              the punishment our sins deserved. He rose from the dead on the
              third day, defeating death itself. He is alive right now, reigning
              as Lord. He is coming back.
            </p>
            <p>
              He invites you — by name — to turn from your sin and trust him.
              Not later. Today.
            </p>
            <blockquote className="scripture-display border-none m-0 p-0 my-10">
              Jesus said to him, "I am the way, the truth, and the life. No one
              comes to the Father, except through me."
            </blockquote>
            <p className="scripture-ref">John 14:6 · WEB</p>
          </section>

          <section className="mb-12 card" style={{ borderColor: "var(--glory-gold)" }}>
            <p className="card__eyebrow">A prayer of repentance and faith</p>
            <h2 className="m-0 mb-4">Pray this prayer — or your own words.</h2>
            <p className="text-muted">
              These words don't save you. <strong className="text-warm">Jesus saves you.</strong> The
              words are how you tell him you are coming. Speak them aloud or in
              your heart. He hears you.
            </p>
            <blockquote
              className="scripture-display border-none m-0 p-0 my-8"
              style={{ maxWidth: "32ch" }}
            >
              Lord Jesus, I have sinned and I cannot save myself. I believe you
              are the Son of God, that you died for my sins, and that you rose
              from the dead. I turn from my sin. I trust you alone. I give you
              my life. Be my Lord and my Savior. Make me yours. Amen.
            </blockquote>
          </section>

          <section className="mb-12">
            <h2>If you prayed that prayer</h2>
            <p>
              Welcome to the family. Heaven rejoices over you tonight (Luke
              15:7). The Christian life has begun — not because you said magic
              words, but because Christ has received you.
            </p>
            <p>
              Next steps:
            </p>
            <ul>
              <li><strong className="text-warm">Tell someone.</strong> A Christian friend. A pastor. Us.</li>
              <li><strong className="text-warm">Read the Bible.</strong> Start in the gospel of John. One chapter a day.</li>
              <li><strong className="text-warm">Pray every day.</strong> Talk to him. He's listening.</li>
              <li><strong className="text-warm">Get baptized.</strong> The first public step of obedience. Find a faithful local church.</li>
              <li><strong className="text-warm">Join a local church.</strong> The Christian life is not lived alone.</li>
              <li><strong className="text-warm">Start the 40-Day Journey.</strong> We'll walk it with you, one day at a time.</li>
            </ul>
          </section>

          <section className="flex flex-col sm:flex-row flex-wrap gap-3 mt-10">
            <Link href="/journey/40-day" className="btn btn--primary">
              I prayed — start the 40-Day Journey
            </Link>
            <Link href="/new-believer-next-steps" className="btn btn--secondary">
              Help me follow Jesus
            </Link>
            <Link href="/ask" className="btn btn--ghost">
              Ask Hope what to do next
            </Link>
          </section>

          <div className="gold-divider" />

          <section>
            <p className="eyebrow">Want to read more first?</p>
            <ul className="flex flex-col gap-2">
              <li><Link href="/how-can-i-be-saved" className="text-gold">How can I be saved?</Link></li>
              <li><Link href="/sinners-prayer" className="text-gold">More about the sinner's prayer</Link></li>
              <li><Link href="/what-happens-after-i-pray" className="text-gold">What happens after I pray?</Link></li>
              <li><Link href="/read/come-to-christ/why-jesus-had-to-die" className="text-gold">Why Jesus had to die</Link></li>
              <li><Link href="/read/come-to-christ/did-jesus-rise" className="text-gold">Did Jesus rise from the dead?</Link></li>
              <li><Link href="/beliefs" className="text-gold">What we believe</Link></li>
            </ul>
          </section>
        </div>
      </section>
    </>
  );
}
