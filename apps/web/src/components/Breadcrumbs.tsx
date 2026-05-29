import Link from "next/link";
import { BreadcrumbListLd } from "./StructuredData";

export type BreadcrumbItem = { name: string; href: string };

/**
 * Visible breadcrumbs + JSON-LD BreadcrumbList in one component.
 * Pass an ordered list from root to current page.
 */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hopeofglory.ministry";
  const ldItems = items.map((i) => ({
    name: i.name,
    url: `${base}${i.href}`,
  }));

  return (
    <>
      {BreadcrumbListLd(ldItems)}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted m-0 p-0 list-none">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {isLast ? (
                  <span className="text-gold" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="hover:text-gold">
                      {item.name}
                    </Link>
                    <span aria-hidden className="text-muted">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
