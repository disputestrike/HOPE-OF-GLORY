/**
 * Scroll — the read-while-you-think surface. Delegates the actual answer to
 * the Ask Hope flow but re-tags any imminent crisis alert with source='scroll'
 * so the founder's pager email shows the correct origin.
 *
 * The user-facing answer / crisis surfacing is identical to /api/ask; only the
 * internal alert metadata differs.
 */
import { z } from "zod";
import { assess as assessCrisis } from "@hog/safety";
import { POST as askPost } from "../ask/route";
import { alertOnImminentCrisis } from "@/lib/crisis-alert";
import { requestId } from "@/lib/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PeekSchema = z.object({
  question: z.string().min(2).max(2000),
  sessionId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  // Peek at the body so we can re-tag the alert with source='scroll'. We then
  // hand the SAME request off to the ask handler — but the ask route reads
  // request.json() too, so we have to clone.
  const cloned = request.clone();
  let peek: z.infer<typeof PeekSchema> | null = null;
  try {
    peek = PeekSchema.parse(await cloned.json());
  } catch {
    // ask route will return its own 400.
  }

  const response = await askPost(request);

  // If the question itself was imminent, the ask route already paged with
  // source='ask'. We add a scroll-tagged page on top so the founder can see
  // which surface the user was actually on. Both emails are idempotent in
  // practice — a real imminent event WILL be paged twice from this path,
  // which is acceptable (better duplicate than silent).
  if (peek) {
    const crisis = assessCrisis(peek.question);
    if (crisis.severity === "imminent") {
      void alertOnImminentCrisis({
        severity: "imminent",
        source: "scroll",
        sourceId: peek.sessionId ?? "scroll-anon",
        triggerPhrases: crisis.triggers,
        actionTaken: crisis.recommendedAction,
        correlationId: requestId(request),
      }).catch((err) => console.warn("[scroll] crisis alert dispatch failed:", err));
    }
  }

  return response;
}
