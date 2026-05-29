import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Prayers",
  description:
    "Prayers you can pray as your own - for healing, faith, family, the nations, and your own heart.",
};

const prayers = [
  {
    title: "A Prayer to Come to Christ",
    need: "Salvation",
    body: "Lord Jesus, I have sinned and I need mercy. I believe you died for sinners and rose from the dead. Forgive me, make me new, and teach me to follow you. Amen.",
    href: "/come-to-christ",
  },
  {
    title: "A Prayer When You Are Grieving",
    need: "Grief",
    body: "Father, I am hurting. Do not let me pretend this loss is small. Meet me as the God who is near to the brokenhearted, and hold me in the hope of resurrection. Amen.",
    href: "/help/grief",
  },
  {
    title: "A Prayer When You Are Afraid",
    need: "Fear",
    body: "Lord, when I am afraid, teach me to trust in you. Give me wisdom for the next step and peace that does not depend on everything being easy. Amen.",
    href: "/help/fear",
  },
  {
    title: "A Prayer for Provision",
    need: "Financial stress",
    body: "Father, you know what I need before I ask. Give me daily bread, honest work, wise help, and courage to ask trusted people for support without shame. Amen.",
    href: "/help/no-money",
  },
  {
    title: "A Prayer for Holiness",
    need: "Obedience",
    body: "Holy Spirit, do not let sin rule me. Show me what to confess, strengthen what is weak, and make obedience to Jesus real in ordinary life. Amen.",
    href: "/read/following-jesus",
  },
  {
    title: "A Prayer for the Nations",
    need: "Mission",
    body: "Lord, let the whole earth be filled with your glory. Send your Word, raise up faithful witnesses, and gather worshipers to Jesus from every people. Amen.",
    href: "/sermons/a-great-multitude-from-every-nation",
  },
];

export default function PrayersPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Messages", href: "/messages" },
            { name: "Prayers", href: "/messages/prayers" },
          ]}
        />
        <header className="mb-10">
          <p className="eyebrow">Prayers</p>
          <h1>Prayers you can pray.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            Written prayers you can pray as your own - for healing, faith, family, the
            nations, and your own heart. Borrow the words on days when your own won't
            come. Then make them yours.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {prayers.map((prayer) => (
            <Link key={prayer.title} href={prayer.href as `/${string}`} className="card block hover:no-underline">
              <p className="card__eyebrow">{prayer.need}</p>
              <h2 className="m-0 mb-3" style={{ fontSize: "var(--fs-h3)" }}>
                {prayer.title}
              </h2>
              <p className="m-0 text-muted text-sm">{prayer.body}</p>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/prayer" className="btn btn--primary">
            Share a prayer request
          </Link>
          <Link href="/ask" className="btn btn--secondary">
            Pray with Ask Hope
          </Link>
          <Link href="/help" className="btn btn--ghost">
            Hope for the Human Heart
          </Link>
        </div>
      </div>
    </section>
  );
}

