/**
 * Health endpoint for Railway / uptime checks.
 * Returns version + feature flags. No DB calls (those have their own probes).
 */
import { NextResponse } from "next/server";
import { features } from "@hog/shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    name: "hope-of-glory-web",
    version: process.env.APP_VERSION ?? "0.1.0",
    env: process.env.APP_ENV ?? "development",
    features: features(),
    time: new Date().toISOString(),
  });
}
