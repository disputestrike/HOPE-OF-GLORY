import { db } from "@hog/db";
import { sql } from "drizzle-orm";

type Row = {
  session_id: string;
  user_text: string | null;
  assistant_text: string | null;
  citations: string[] | null;
  created_at: Date;
};

async function load(): Promise<Row[]> {
  try {
    return await db.execute<Row>(sql`
      WITH pairs AS (
        SELECT
          m1.session_id,
          m1.content as user_text,
          (SELECT content FROM chat_messages m2 WHERE m2.session_id = m1.session_id AND m2.role = 'assistant' AND m2.created_at > m1.created_at ORDER BY m2.created_at ASC LIMIT 1) as assistant_text,
          m1.created_at
        FROM chat_messages m1
        WHERE m1.role = 'user'
        ORDER BY m1.created_at DESC
        LIMIT 200
      )
      SELECT
        session_id,
        user_text,
        assistant_text,
        ARRAY[]::text[] as citations,
        created_at
      FROM pairs
    `);
  } catch {
    return [];
  }
}

export default async function AdminQuestionsPage() {
  const rows = await load();

  return (
    <div className="p-10 max-w-7xl">
      <header className="mb-10">
        <p className="eyebrow">Q&A</p>
        <h1 className="m-0">Ask Hope log</h1>
        <p className="text-muted m-0 mt-3">
          The most recent {rows.length} question{rows.length === 1 ? "" : "s"}.
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="card">
          <p className="m-0 text-muted">No Ask Hope questions yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((r, i) => (
            <article key={`${r.session_id}-${i}`} className="card">
              <p className="card__eyebrow">
                {new Date(r.created_at).toLocaleString("en-US")}
              </p>
              <p className="m-0 mb-3 text-gold">
                <strong>Q:</strong> {r.user_text}
              </p>
              <p className="m-0 text-warm whitespace-pre-wrap">
                <strong className="text-muted">A:</strong> {r.assistant_text ?? "(no reply yet)"}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
