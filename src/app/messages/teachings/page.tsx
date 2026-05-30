import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Teachings",
  description:
    "Longer-form teaching on doctrine, the gospel, prayer, holiness, and the Christian life.",
};

export default function TeachingsPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Messages", href: "/messages" },
            { name: "Teachings", href: "/messages/teachings" },
          ]}
        />
        <header className="mb-10">
          <p className="eyebrow">Teachings</p>
          <h1>Longer teaching, plainly.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            Articles, essays, and series on the gospel, who God is, the Christian life,
            apologetics, and the hard places where Scripture meets real life.
          </p>
        </header>
        <section className="card mb-10">
          <p className="card__eyebrow">For now</p>
          <p className="m-0 text-muted">
            The teaching archive is being built. The full catalog will live here. In the
            meantime, the Read library covers the same ground in shorter form.
          </p>
        </section>
        <div className="flex flex-wrap gap-3">
          <Link href="/read" className="btn btn--primary">
            Open the Read library
          </Link>
          <Link href="/sermons" className="btn btn--secondary">
            Browse sermons
          </Link>
          <Link href="/ask" className="btn btn--ghost">
            Ask Hope
          </Link>
        </div>
      </div>
    </section>
  );
}
