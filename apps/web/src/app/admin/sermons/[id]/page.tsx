import { notFound } from "next/navigation";
import Link from "next/link";
import { db, schema } from "@hog/db";
import { sql, eq } from "drizzle-orm";
import { marked } from "marked";
import { revalidatePath } from "next/cache";

type Row = {
  id: string;
  slug: string;
  title: string;
  primary_passage: string;
  full_text: string | null;
  summary: string | null;
  prayer: string | null;
  status: string;
  theology_score: string | null;
  citation_score: string | null;
  image_url: string | null;
};

async function load(id: string): Promise<Row | null> {
  try {
    const rows = await db.execute<Row>(sql`
      SELECT id, slug, title, primary_passage, full_text, summary, prayer, status, theology_score, citation_score, image_url
      FROM sermons
      WHERE id = ${id}
      LIMIT 1
    `);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

type Params = Promise<{ id: string }>;

export default async function AdminSermonDetail({ params }: { params: Params }) {
  const { id } = await params;
  const s = await load(id);
  if (!s) notFound();

  const html = s.full_text ? await marked.parse(s.full_text, { async: true }) : "";

  async function publish() {
    "use server";
    await db.update(schema.sermons).set({
      status: "published",
      publishedAt: new Date(),
    }).where(eq(schema.sermons.id, id));
    revalidatePath("/sermons");
    revalidatePath(`/admin/sermons/${id}`);
  }

  async function withdraw() {
    "use server";
    await db.update(schema.sermons).set({ status: "withdrawn" }).where(eq(schema.sermons.id, id));
    revalidatePath("/sermons");
    revalidatePath(`/admin/sermons/${id}`);
  }

  return (
    <div className="p-10 max-w-5xl">
      <header className="mb-10">
        <Link href="/admin/sermons" className="text-muted hover:text-gold text-sm">
          ← All sermons
        </Link>
        <p className="eyebrow mt-3">Sermon · {s.status}</p>
        <h1 className="m-0">{s.title}</h1>
        <p className="text-gold m-0 mt-3">{s.primary_passage}</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="card">
          <p className="card__eyebrow">Doctrine</p>
          <p className="m-0 text-2xl text-gold" style={{ fontFamily: "var(--font-display)" }}>
            {s.theology_score ?? "—"}
          </p>
        </div>
        <div className="card">
          <p className="card__eyebrow">Citations</p>
          <p className="m-0 text-2xl text-gold" style={{ fontFamily: "var(--font-display)" }}>
            {s.citation_score === "1" ? "OK" : s.citation_score === "0" ? "FAIL" : "—"}
          </p>
        </div>
        <div className="card">
          <p className="card__eyebrow">Status</p>
          <p className="m-0 text-2xl text-gold uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-display)" }}>
            {s.status}
          </p>
        </div>
      </section>

      {s.image_url ? (
        <img src={s.image_url} alt={s.title} className="w-full mb-10 rounded" />
      ) : null}

      <section className="card mb-10">
        <p className="card__eyebrow">Body</p>
        {html ? (
          <div className="prose-ministry" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p className="m-0 text-muted">Not yet generated. Trigger generation from the list view.</p>
        )}
      </section>

      <section className="flex gap-3">
        {s.status === "ready" || s.status === "verifying" ? (
          <form action={publish}>
            <button type="submit" className="btn btn--primary">Publish</button>
          </form>
        ) : null}
        {s.status === "published" ? (
          <form action={withdraw}>
            <button type="submit" className="btn btn--ghost">Withdraw</button>
          </form>
        ) : null}
      </section>
    </div>
  );
}
