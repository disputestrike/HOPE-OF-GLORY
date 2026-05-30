import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.string().email().max(200),
  givenName: z.string().max(120).optional(),
});

export async function POST(request: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: true }); // never leak whether enrollment failed
  }
  try {
    const { enrollNewBeliever } = await import(
      "@/server/worker/agents/discipleship"
    );
    await enrollNewBeliever({ email: body.email, givenName: body.givenName });
  } catch (err) {
    console.warn("[new-believers] enroll failed:", err);
  }
  return NextResponse.json({ ok: true });
}
