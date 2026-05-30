type Db = typeof import("@hog/db").db;

function hasRealDatabaseUrl(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;

  // .env.example ships a placeholder URL. Treat it as "not configured" so
  // local preview forms do not hang while Postgres rejects fake credentials.
  return !(
    url.includes("user:pass") ||
    url.includes("username:password") ||
    url.includes("@host") ||
    url.includes("host:5432") ||
    url.includes("database_name") ||
    url.includes("your_") ||
    url.includes("<")
  );
}

export async function optionalDb(label: string): Promise<Db | null> {
  if (!hasRealDatabaseUrl()) return null;

  try {
    const mod = await import("@hog/db");
    return mod.db;
  } catch (err) {
    console.warn(`[${label}] db unavailable:`, err);
    return null;
  }
}
