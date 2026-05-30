import { sql } from "drizzle-orm";
import { optionalDb } from "@/lib/server-db";

type Row = {
  id: string;
  sermon_id: string;
  asset_type: string;
  url: string;
  mime_type: string;
  duration_secs: number | null;
  sermon_title: string;
};

async function load(): Promise<Row[]> {
  const database = await optionalDb("admin-media");
  if (!database) return [];
  try {
    return await database.execute<Row>(sql`
      SELECT sa.id, sa.sermon_id, sa.asset_type, sa.url, sa.mime_type, sa.duration_secs,
             s.title as sermon_title
      FROM sermon_assets sa
      LEFT JOIN sermons s ON s.id = sa.sermon_id
      ORDER BY sa.id DESC
      LIMIT 100
    `);
  } catch {
    return [];
  }
}

export default async function AdminMediaPage() {
  const rows = await load();
  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Media library</p>
        <h1 className="m-0">Audio, video, and visual assets</h1>
        <p className="text-muted m-0 mt-3">
          {rows.length} asset{rows.length === 1 ? "" : "s"} produced.
        </p>
      </header>
      {rows.length === 0 ? (
        <div className="card">
          <p className="m-0 text-muted">
            Media queue is ready. From a sermon detail page, trigger the video pipeline.
            Requires <code>DEEPGRAM_API_KEY</code>, <code>S3_*</code> creds, and{" "}
            <code>ffmpeg</code> on the worker container.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((r) => (
            <article key={r.id} className="card">
              <p className="card__eyebrow">
                {r.asset_type} · {r.duration_secs ? `${r.duration_secs}s` : r.mime_type}
              </p>
              <h3 className="m-0 mb-3 text-warm text-base">{r.sermon_title}</h3>
              {r.mime_type.startsWith("audio") ? (
                <audio src={r.url} controls className="w-full" />
              ) : r.mime_type.startsWith("video") ? (
                <video src={r.url} controls className="w-full rounded" />
              ) : (
                <a href={r.url} className="text-gold text-sm">Open asset</a>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
