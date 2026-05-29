import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "What happens after I pray?",
  description:
    "If you have come to Christ, here is what changes — and what doesn't. The first hours, the first days, the first steps of the Christian life.",
};

export default function WhatHappensAfterIPrayPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Come to Christ", href: "/come-to-christ" },
            { name: "What happens after I pray?", href: "/what-happens-after-i-pray" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">What happens after I pray?</p>
          <h1>You are not the same. Even when you feel the same.</h1>
        </header>

        <section className="mb-10">
          <p className="eyebrow">Short answer</p>
          <p>
            If you have truly come to Christ, you have been forgiven, adopted by
            the Father, indwelled by the Holy Spirit, and made part of the
            people of God. Your feelings will follow eventually — or they
            won't, in the way you expect. Your standing before God has changed
            even when your feelings haven't.
          </p>
        </section>

        <section className="mb-10">
          <h2>What is true of you now</h2>
          <ul>
            <li><strong className="text-warm">You are forgiven.</strong> Every sin you have ever committed, past, present, future — paid for by Christ (Colossians 2:13-14).</li>
            <li><strong className="text-warm">You are adopted.</strong> The God who made you is now your Father (Romans 8:15).</li>
            <li><strong className="text-warm">You have the Holy Spirit.</strong> God himself lives in you (1 Corinthians 6:19).</li>
            <li><strong className="text-warm">You have eternal life.</strong> Already begun — to be completed when Christ returns (John 3:36).</li>
            <li><strong className="text-warm">You belong to the family of God.</strong> Brothers and sisters all over the world (Ephesians 2:19).</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2>What to do today</h2>
          <ol>
            <li><strong className="text-warm">Tell someone.</strong> Someone you trust. Heaven is rejoicing — let earth know too.</li>
            <li><strong className="text-warm">Read one chapter of John.</strong> Start at chapter 1. Read slowly. Underline what stands out.</li>
            <li><strong className="text-warm">Pray.</strong> Just talk to him. Say what's on your heart. Thank him.</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2>What to do this week</h2>
          <ol>
            <li><strong className="text-warm">Find a faithful local church.</strong> Not a building — a body. Look for: the Bible taught carefully, Christ preached, baptism and communion practiced, love among the members.</li>
            <li><strong className="text-warm">Start the 40-Day Hope of Glory Journey.</strong> One short message per day. We'll walk you through the foundations.</li>
            <li><strong className="text-warm">Ask questions.</strong> Use Ask Hope. Email us. Ask your local pastor. There are no dumb questions in this family.</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2>What about doubt?</h2>
          <p>
            You will have doubts. Most Christians do. Doubt isn't the opposite
            of faith — unbelief is. A doubting believer cries with the man in
            Mark 9:24: "I believe; help my unbelief." Christ heard him. He
            hears you.
          </p>
          <p>
            Bring your doubts to him. Read the Bible anyway. Pray anyway.
            Belong to the church anyway. Feelings will catch up.
          </p>
        </section>

        <section className="mb-10">
          <h2>What about baptism?</h2>
          <p>
            Baptism is the first public step of obedience for a new believer.
            It pictures dying to your old life and rising to new life with
            Christ (Romans 6:3-4). It is not what saves you — Christ saves you —
            but it is what Christ commands his disciples to do. Talk to a
            faithful local pastor about getting baptized soon.
          </p>
        </section>

        <div className="flex flex-wrap gap-3 mt-10">
          <Link href="/journey/40-day" className="btn btn--primary">
            Start the 40-Day Journey
          </Link>
          <Link href="/new-believer-next-steps" className="btn btn--secondary">
            More next steps
          </Link>
          <Link href="/ask" className="btn btn--ghost">
            Ask Hope
          </Link>
        </div>
      </div>
    </section>
  );
}
