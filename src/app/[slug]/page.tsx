import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, listSlugs } from "@/lib/content";

// Slugs that have their own dedicated page route. Keep this list in sync with apps/web/src/app/*/page.tsx.
const SLUGS_WITH_CUSTOM_ROUTES: ReadonlySet<string> = new Set([
  "ask",
  "prayer",
  "sermons",
  "apologetics",
  "give",
  "new-believers",
  "contact",
  "donation-ethics",
]);

const SLUG_FILE: Record<string, string> = {};

function fileForSlug(slug: string): string {
  return SLUG_FILE[slug] ?? slug;
}

export async function generateStaticParams() {
  const slugs = await listSlugs();
  return slugs
    .filter((s) => s !== "sermons-index")
    .filter((s) => !SLUGS_WITH_CUSTOM_ROUTES.has(s))
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

export default async function ContentPage({ params }: { params: Params }) {
  const { slug } = await params;
  const page = await getPageBySlug(fileForSlug(slug));
  if (!page) notFound();

  return (
    <article className="section">
      <div className="container-prose">
        <header className="mb-12">
          <p className="eyebrow">Hope of Glory</p>
          <h1>{page.title}</h1>
          {page.description ? (
            <p className="text-muted mt-4" style={{ fontSize: "var(--fs-body-lg)" }}>
              {page.description}
            </p>
          ) : null}
        </header>

        <div className="prose-ministry" dangerouslySetInnerHTML={{ __html: page.html }} />
      </div>
    </article>
  );
}

