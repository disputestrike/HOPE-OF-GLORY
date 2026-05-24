import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, listSlugs } from "@/lib/content";

// Map of slugs that have richer custom routes elsewhere — skip dynamic render
const RESERVED: ReadonlySet<string> = new Set([
  "ask", // becomes interactive chat in Phase 3
  "prayer", // becomes interactive form in Phase 3
  "sermons", // becomes archive in Phase 2
]);

// Map URL paths to content filenames
const SLUG_FILE: Record<string, string> = {
  sermons: "sermons-index",
};

function fileForSlug(slug: string): string {
  return SLUG_FILE[slug] ?? slug;
}

export async function generateStaticParams() {
  const slugs = await listSlugs();
  return slugs
    .filter((s) => s !== "sermons-index") // reachable via /sermons
    .map((slug) => ({ slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(fileForSlug(slug));
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
    },
  };
}

export default async function ContentPage({
  params,
}: { params: Params }) {
  const { slug } = await params;
  const page = await getPageBySlug(fileForSlug(slug));
  if (!page) notFound();

  // Reserved paths get a stub UX until their interactive build lands
  const isReserved = RESERVED.has(slug);

  return (
    <article className="section">
      <div className="container-prose">
        <header className="mb-12">
          <p className="eyebrow">Hope of Glory</p>
          <h1>{page.title}</h1>
          {page.description ? (
            <p
              className="text-muted mt-4"
              style={{ fontSize: "var(--fs-body-lg)" }}
            >
              {page.description}
            </p>
          ) : null}
        </header>

        <div
          className="prose-ministry"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />

        {isReserved ? (
          <aside
            className="mt-12 card border-glory-gold"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="card__eyebrow">Coming soon</p>
            <p className="m-0 text-muted">
              The interactive version of this page is in active development.
              Email{" "}
              <a href="mailto:hello@hopeofglory.ministry">
                hello@hopeofglory.ministry
              </a>{" "}
              if you'd like an early invitation.
            </p>
          </aside>
        ) : null}
      </div>
    </article>
  );
}
