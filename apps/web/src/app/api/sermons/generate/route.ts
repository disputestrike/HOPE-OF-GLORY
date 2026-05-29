/**
 * Trigger sermon pipeline manually. Admin only.
 *
 * POST /api/sermons/generate
 *   mode=today|next (default: today)
 *
 * Runs the full pipeline inline. For production scale this should enqueue a
 * job and return 202 with a job id — Phase 4 wires that up.
 */
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authIsConfigured() {
  return Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
}

export async function POST(request: Request) {
  if (authIsConfigured()) {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Lazy import — heavy worker deps loaded only on real call.
  const { runSermonPipeline } = await import("../../../../../../worker/src/pipelines/sermon");

  const url = new URL(request.url);
  const mode = (url.searchParams.get("mode") as "today" | "next") ?? "next";

  try {
    const result = await runSermonPipeline({ mode });
    return NextResponse.redirect(
      new URL(`/admin/sermons/${result.sermonId}`, request.url),
      { status: 303 }
    );
  } catch (err) {
    console.error("[sermon generate] failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
