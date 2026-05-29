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
import { requireAdminApi } from "@/lib/admin-auth";
import { auditAdminAction } from "@/lib/ops";
import { clientIp, ipHash } from "@/lib/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request) {
  const admin = await requireAdminApi("publish");
  if (!admin.ok) return admin.response;

  // Lazy import — heavy worker deps loaded only on real call.
  const { runSermonPipeline } = await import("../../../../../../worker/src/pipelines/sermon");

  const url = new URL(request.url);
  const mode = (url.searchParams.get("mode") as "today" | "next") ?? "next";

  try {
    const result = await runSermonPipeline({ mode });
    await auditAdminAction({
      actorEmail: admin.session.email,
      action: "sermon.generate",
      targetType: "sermon",
      targetId: result.sermonId,
      diff: { mode },
      ipHash: ipHash(clientIp(request)),
      userAgent: request.headers.get("user-agent"),
    });
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
