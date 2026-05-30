import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section--hero">
      <div className="container-prose">
        <p className="eyebrow">404</p>
        <h1 className="mx-auto">We couldn't find that page.</h1>
        <p className="mt-6 mx-auto text-muted max-w-prose">
          The page you were looking for may have moved, or it may never have
          existed. Either way, the Shepherd still knows where you are.
        </p>
        <blockquote
          className="scripture-display border-none m-0 mt-12"
          style={{ maxWidth: "30ch" }}
        >
          What man of you, having a hundred sheep, and having lost one of
          them, doesn't leave the ninety-nine in the wilderness, and go after
          the one that was lost, until he finds it?
        </blockquote>
        <p className="scripture-ref">Luke 15 : 4 · WEB</p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn btn--primary">
            Return home
          </Link>
          <Link href="/ask" className="btn btn--secondary">
            Ask Hope
          </Link>
        </div>
      </div>
    </section>
  );
}
