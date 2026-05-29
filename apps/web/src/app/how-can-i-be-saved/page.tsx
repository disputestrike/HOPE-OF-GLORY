import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "How can I be saved?",
  description:
    "A clear, biblical answer to the most important question. Repentance, faith, and the saving work of Jesus Christ.",
};

export default function HowCanIBeSavedPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Come to Christ", href: "/come-to-christ" },
            { name: "How can I be saved?", href: "/how-can-i-be-saved" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">How can I be saved?</p>
          <h1>Believe in the Lord Jesus, and you will be saved.</h1>
        </header>

        <section className="mb-10">
          <p className="eyebrow">Short answer</p>
          <p>
            Salvation is by grace, through faith in Jesus Christ, expressed in
            repentance. You cannot earn it. You receive it. Jesus did all the
            work of salvation; you turn from your sin and trust him.
          </p>
        </section>

        <section className="mb-10">
          <h2>The clearest answer in the Bible</h2>
          <p>
            A jailer once asked the apostle Paul, "Sirs, what must I do to be
            saved?" The answer was simple:
          </p>
          <blockquote className="scripture-display border-none m-0 p-0 my-10">
            Believe in the Lord Jesus Christ, and you will be saved.
          </blockquote>
          <p className="scripture-ref">Acts 16:31 · WEB</p>
          <p>
            That is the answer. Not a checklist. Not a religion. A Person.
          </p>
        </section>

        <section className="mb-10">
          <h2>What "believe" means</h2>
          <p>
            Biblical belief is not just intellectual agreement that Jesus
            existed. James says even demons believe and shudder (James 2:19).
            Saving faith means:
          </p>
          <ul>
            <li><strong className="text-warm">Knowing</strong> what Jesus did — lived, died, rose.</li>
            <li><strong className="text-warm">Agreeing</strong> that it is true.</li>
            <li><strong className="text-warm">Trusting</strong> him alone with your life and your eternity.</li>
          </ul>
          <p>
            It also means turning from sin. The Bible calls this repentance.
            Faith and repentance are two sides of the same coming-to-Christ.
            You can't turn toward him without turning away from what kept you
            from him.
          </p>
        </section>

        <section className="mb-10">
          <h2>What about good works?</h2>
          <p>
            Good works do not save you. They follow salvation, like fruit
            follows a tree being made alive.
          </p>
          <blockquote className="scripture-display border-none m-0 p-0 my-10">
            By grace you have been saved through faith, and that not of
            yourselves; it is the gift of God, not of works, that no one would
            boast.
          </blockquote>
          <p className="scripture-ref">Ephesians 2:8-9 · WEB</p>
        </section>

        <section className="mb-10">
          <h2>What about my past?</h2>
          <p>
            Whatever you've done, Jesus has paid for. Whoever you've been, he
            can make new (2 Corinthians 5:17). There is no sin so far down that
            the cross doesn't reach further. There is no shame so deep that the
            blood of Christ doesn't cleanse it.
          </p>
          <p>
            Don't try to clean yourself up first. Come to him as you are. He'll
            clean what you can't clean.
          </p>
        </section>

        <div className="flex flex-wrap gap-3 mt-10">
          <Link href="/come-to-christ" className="btn btn--primary">
            I'm ready — Come to Christ
          </Link>
          <Link href="/what-happens-after-i-pray" className="btn btn--secondary">
            What happens after I pray?
          </Link>
          <Link href="/ask" className="btn btn--ghost">
            Ask Hope a question
          </Link>
        </div>
      </div>
    </section>
  );
}
