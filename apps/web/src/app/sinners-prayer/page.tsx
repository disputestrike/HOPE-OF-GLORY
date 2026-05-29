import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "The Sinner's Prayer — A response of repentance and faith",
  description:
    "The sinner's prayer is not a magic incantation. It is the cry of a heart turning to Christ in repentance and faith. Here is what it is, what it is not, and how to pray it.",
};

export default function SinnersPrayerPage() {
  return (
    <section className="section theme-warm">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Come to Christ", href: "/come-to-christ" },
            { name: "Sinner's Prayer", href: "/sinners-prayer" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Sinner's Prayer</p>
          <h1>It is not the words. It is the One you are coming to.</h1>
        </header>

        <section className="mb-10">
          <p className="eyebrow">Short answer</p>
          <p>
            The "sinner's prayer" is a name for any honest cry to God in which a
            person turns from sin (repentance) and trusts Jesus alone for
            salvation (faith). It is not a formula. It does not save you. Jesus
            saves you — and the prayer is how you tell him you are coming.
          </p>
        </section>

        <section className="mb-10">
          <h2>What it is</h2>
          <p>
            Across the Bible, real people are saved when they cry out to the
            Lord. The tax collector beat his chest and said, "God, be merciful
            to me, a sinner!" Jesus said he went home justified (Luke 18:13-14).
            The thief on the cross simply said, "Jesus, remember me." Jesus said,
            "Today you will be with me in Paradise" (Luke 23:42-43).
          </p>
          <p>
            That is the sinner's prayer. Not a rehearsed script. A real cry from
            a real heart to the real Christ.
          </p>
        </section>

        <section className="mb-10">
          <h2>What it is not</h2>
          <ul>
            <li>Not a magic spell that locks in salvation regardless of the heart behind it.</li>
            <li>Not a one-time vaccine against drifting from Christ.</li>
            <li>Not a guarantee that the person who said it is born again.</li>
            <li>Not a substitute for living faith, obedience, baptism, and the local church.</li>
          </ul>
          <p>
            Jesus warned that many will say "Lord, Lord" and not enter the
            kingdom (Matthew 7:21-23). The Bible never teaches salvation by
            phrase. It teaches salvation by Christ, received through repentance
            and faith.
          </p>
        </section>

        <section className="mb-10">
          <h2>A prayer you can pray</h2>
          <blockquote
            className="scripture-display border-none m-0 p-0 my-8"
            style={{ maxWidth: "32ch" }}
          >
            Lord Jesus, I have sinned and I cannot save myself. I believe you
            are the Son of God, that you died for my sins, and that you rose
            from the dead. I turn from my sin. I trust you alone. I give you my
            life. Be my Lord and my Savior. Make me yours. Amen.
          </blockquote>
        </section>

        <div className="flex flex-wrap gap-3 mt-10">
          <Link href="/come-to-christ" className="btn btn--primary">
            Come to Christ
          </Link>
          <Link href="/what-happens-after-i-pray" className="btn btn--secondary">
            What happens after I pray?
          </Link>
          <Link href="/ask" className="btn btn--ghost">
            Ask Hope
          </Link>
        </div>
      </div>
    </section>
  );
}
