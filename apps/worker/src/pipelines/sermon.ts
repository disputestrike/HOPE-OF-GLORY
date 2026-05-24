/**
 * Sermon pipeline — the daily end-to-end sermon generation flow.
 *
 *   1. Calendar Agent → today's sermon metadata
 *   2. Scripture lookup → primary + supporting passage text
 *   3. Sermon Agent (outline)
 *   4. Sermon Agent (full draft)
 *   5. Citation validator → flag any hallucinated references
 *   6. Greek/Hebrew Agent → original-language insight (optional, may skip)
 *   7. Prayer Agent → closing prayer
 *   8. Branding Agent → hero image + Scripture card
 *   9. Doctrine Agent → gate (must approve)
 *  10. Persist to sermons table, status='ready'
 *
 * Returns a SermonPipelineResult describing what landed and any flags.
 */
import { db, schema } from "@hog/db";
import { eq } from "drizzle-orm";
import { parseReference, getVerses, formatReference } from "@hog/scripture";
import { moderate } from "@hog/safety";
import {
  pickTodaysSermon,
  pickNextSermon,
  generateOutline,
  generateDraft,
  generateNote,
  renderNote,
  generateSermonPrayer,
  renderSermonHero,
} from "../agents";
import { runDoctrineGate } from "../agents/doctrine";

export type SermonPipelineResult = {
  sermonId: string;
  status: "ready" | "needs_review" | "blocked";
  doctrineScore: number;
  doctrineVerdict: string;
  citationsValid: boolean;
  citationIssues: string[];
  moderationViolations: number;
  heroImageUrl?: string;
  notes: string[];
};

export async function runSermonPipeline(
  opts: { mode?: "today" | "next"; force?: boolean } = {}
): Promise<SermonPipelineResult> {
  const notes: string[] = [];

  // 1. Pick the sermon
  const pick = opts.mode === "next" ? await pickNextSermon() : await pickTodaysSermon();
  if (!pick) throw new Error("No sermon scheduled. Seed the calendar first.");
  notes.push(`Picked: ${pick.title} (${pick.primaryPassage})`);

  // 2. Scripture text
  const parsed = parseReference(pick.primaryPassage);
  let scriptureText = "";
  if (parsed) {
    const verses = await getVerses(db, parsed);
    scriptureText = verses
      .map((v) => `${v.verse}. ${v.text}`)
      .join(" ");
  }
  if (!scriptureText) {
    notes.push(`Warning: primary passage ${pick.primaryPassage} had no verse text. Ingestion may be incomplete.`);
  }

  // 3. Outline
  const outline = await generateOutline({
    title: pick.title,
    primaryPassage: pick.primaryPassage,
    supportingPassages: pick.supportingPassages,
    theme: pick.theme,
    seriesTitle: pick.seriesTitle,
    scriptureText,
  });
  notes.push(`Outline: ${outline.big_idea}`);

  // 4. Draft
  const draft = await generateDraft(
    {
      title: pick.title,
      primaryPassage: pick.primaryPassage,
      supportingPassages: pick.supportingPassages,
      theme: pick.theme,
      seriesTitle: pick.seriesTitle,
      scriptureText,
    },
    outline
  );
  notes.push(`Draft length: ${draft.fullText.length} chars`);
  if (!draft.citationsValid) {
    notes.push(`Citation issues: ${draft.citationIssues.join(", ")}`);
  }

  // 5. Greek/Hebrew insight (optional)
  let fullText = draft.fullText;
  const ghNote = await generateNote(pick.primaryPassage, scriptureText).catch(() => null);
  if (ghNote && ghNote.confidence !== "low") {
    fullText = fullText.replace(
      /## \[GREEK_HEBREW_PLACEHOLDER\][\s\S]*?(?=\n## |\n# |$)/,
      renderNote(ghNote) + "\n\n"
    );
    notes.push(`Greek/Hebrew note attached (confidence: ${ghNote.confidence})`);
  } else {
    fullText = fullText.replace(/## \[GREEK_HEBREW_PLACEHOLDER\][\s\S]*?(?=\n## |\n# |$)/, "");
    notes.push("Greek/Hebrew note skipped (no high-confidence insight)");
  }

  // 6. Prayer
  const prayer = await generateSermonPrayer({
    title: pick.title,
    bigIdea: outline.big_idea,
    prayerFocus: outline.prayer_focus,
  });
  fullText = fullText.replace(
    /## \[PRAYER_PLACEHOLDER\][\s\S]*?(?=\n## |\n# |$)/,
    `## Closing prayer\n\n${prayer}\n\n`
  );
  notes.push("Prayer attached");

  // 7. Moderation pass
  const moderation = moderate(fullText);
  if (!moderation.pass) {
    notes.push(
      `BLOCKED by moderation: ${moderation.violations.map((v) => v.category).join(", ")}`
    );
    return {
      sermonId: pick.sermonId,
      status: "blocked",
      doctrineScore: 0,
      doctrineVerdict: "blocked_by_moderation",
      citationsValid: draft.citationsValid,
      citationIssues: draft.citationIssues,
      moderationViolations: moderation.violations.length,
      notes,
    };
  }

  // 8. Hero image
  let heroUrl: string | undefined;
  try {
    const hero = await renderSermonHero({
      title: pick.title,
      primaryPassage: pick.primaryPassage,
      theme: pick.theme,
    });
    heroUrl = hero.url;
    notes.push(`Hero image: ${hero.url}`);
  } catch (err) {
    notes.push(`Hero image failed: ${err instanceof Error ? err.message : "unknown"}`);
  }

  // 9. Doctrine gate (MUST PASS to publish)
  const verdict = await runDoctrineGate({
    content: fullText,
    agentName: "sermon-pipeline",
    taskType: "sermon_verify",
  });
  notes.push(`Doctrine verdict: ${verdict.verdict} (score=${verdict.score})`);

  // 10. Persist
  const newStatus =
    verdict.verdict === "approve" && draft.citationsValid && moderation.pass
      ? "ready"
      : "verifying"; // human review required

  await db
    .update(schema.sermons)
    .set({
      summary: outline.big_idea,
      outline: JSON.stringify(outline),
      fullText,
      prayer,
      callToAction: outline.application_steps.join(" | "),
      status: newStatus,
      imageUrl: heroUrl,
      theologyScore: verdict.score.toString(),
      citationScore: draft.citationsValid ? "1" : "0",
      verifiedByModel: "claude-sonnet-4-5",
      createdByModel: "llama-3.3-70b",
    })
    .where(eq(schema.sermons.id, pick.sermonId));

  return {
    sermonId: pick.sermonId,
    status: newStatus === "ready" ? "ready" : "needs_review",
    doctrineScore: verdict.score,
    doctrineVerdict: verdict.verdict,
    citationsValid: draft.citationsValid,
    citationIssues: draft.citationIssues,
    moderationViolations: 0,
    heroImageUrl: heroUrl,
    notes,
  };
}
