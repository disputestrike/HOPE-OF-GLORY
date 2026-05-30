import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 600;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.redirect(new URL("/admin/login", request.url));

  const url = new URL(request.url);
  const sermonId = url.searchParams.get("sermonId");
  if (!sermonId) return NextResponse.json({ error: "sermonId required" }, { status: 400 });

  const { runVideoPipeline } = await import("@/server/worker/pipelines/video");
  try {
    const result = await runVideoPipeline(sermonId);
    return NextResponse.redirect(new URL(`/admin/sermons/${sermonId}`, request.url), { status: 303 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown" },
      { status: 500 }
    );
  }
}
