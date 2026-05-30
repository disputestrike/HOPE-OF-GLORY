import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Healing and Miracles",
  description:
    "What the Bible says about healing, prayer for the sick, and the sovereignty of God — without manipulation.",
};

export default function HealingPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Messages", href: "/messages" },
            { name: "Healing and Miracles", href: "/messages/healing-and-miracles" },
          ]}
        />
        <header className="mb-10">
          <p className="eyebrow">Healing and Miracles</p>
          <h1>God still heals. Not by formula.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            What the Bible says about healing, prayer for the sick, miracles, and the
            sovereignty of God — without manipulation, prosperity-gospel claims, or shaming
            those who suffer.
          </p>
        </header>
        <section className="card mb-10" style={{ borderColor: "var(--blood-crimson)" }}>
          <p className="card__eyebrow" style={{ color: "var(--blood-crimson)" }}>
            We will not teach
          </p>
          <ul className="m-0 text-muted">
            <li>That you can be healed if you "just have enough faith"</li>
            <li>That sickness is always punishment for sin</li>
            <li>That God promises physical healing in this life to every believer</li>
            <li>That a particular minister, anointing, or seed-gift unlocks healing</li>
            <li>That medicine and doctors are signs of weak faith</li>
          </ul>
        </section>
        <section className="card mb-10">
          <p className="card__eyebrow">We will teach</p>
          <ul className="m-0 text-muted">
            <li>That God is sovereign, and he still heals</li>
            <li>That prayer for the sick is commanded — James 5</li>
            <li>That faith trusts God; it does not coerce him</li>
            <li>That ultimate healing comes at the resurrection</li>
            <li>That suffering is not the verdict on your life</li>
          </ul>
        </section>
        <div className="flex flex-wrap gap-3">
          <Link href="/read/word-prayer-and-power/does-god-still-heal" className="btn btn--primary">
            Read: Does God Still Heal?
          </Link>
          <Link href="/prayer" className="btn btn--secondary">
            Pray with us
          </Link>
        </div>
      </div>
    </section>
  );
}
