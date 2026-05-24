import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const CONTENT_DIR = path.resolve(
  process.cwd(),
  "../../content/site-copy"
);

export type PageContent = {
  slug: string;
  title: string;
  description?: string;
  html: string;
  raw: string;
};

function deriveTitle(raw: string, fallback: string): string {
  const match = raw.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? fallback;
}

function deriveDescription(raw: string): string | undefined {
  // First non-heading, non-blockquote paragraph
  const lines = raw.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) continue;
    if (trimmed.startsWith(">")) continue;
    if (trimmed.startsWith("---")) continue;
    return trimmed.replace(/[*_`]/g, "").slice(0, 180);
  }
  return undefined;
}

export async function getPageBySlug(
  slug: string
): Promise<PageContent | null> {
  try {
    const file = path.join(CONTENT_DIR, `${slug}.md`);
    const raw = await readFile(file, "utf8");
    const parsed = matter(raw);
    const body = parsed.content;
    const html = await marked.parse(body, { async: true });
    const title =
      (parsed.data.title as string | undefined) ??
      deriveTitle(body, slug);
    const description =
      (parsed.data.description as string | undefined) ??
      deriveDescription(body);

    return { slug, title, description, html: String(html), raw: body };
  } catch {
    return null;
  }
}

export async function listSlugs(): Promise<string[]> {
  try {
    const entries = await readdir(CONTENT_DIR, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => e.name.replace(/\.md$/, ""))
      .filter((slug) => slug !== "index"); // home rendered separately
  } catch {
    return [];
  }
}
