/**
 * Branding Agent — orchestrates image generation via fal.ai Flux 1.1 Pro.
 *
 * Every visual that leaves the workshop runs through here so the brand-style
 * anchors and forbidden-imagery rules are enforced.
 *
 * From docs/brand/visual-style-guide.md:
 *   - No realistic faces of fictional preachers
 *   - No Jesus' face
 *   - No scary Revelation imagery
 *   - No currency / money imagery on Give page
 *   - Always reverent, luminous, gold + deep blue palette
 */
import { fal } from "@hog/ai";
import type { GeneratedImage } from "@hog/ai/src/providers/fal";

/** Compose a sermon hero image prompt — 16:9 landscape. */
export function composeSermonHeroPrompt(opts: {
  title: string;
  primaryPassage: string;
  theme: string;
}): string {
  return `A cinematic, hyper-realistic landscape capturing the theme of "${opts.title}" — ${opts.theme}. Wide horizon, soft volumetric golden light breaking through deep blue clouds, a sense of awe and revelation. No people in foreground. Composition leaves the lower third clear for sermon title overlay text. Mood: reverent, royal, scriptural — evoking "${opts.primaryPassage}" without any literal text or scripture overlay in the image itself.`;
}

/** Compose a Scripture card prompt — 1:1 square. */
export function composeScriptureCardPrompt(opts: {
  passage: string;
  motif: "water" | "light" | "wilderness" | "mountain" | "sky" | "field" | "vineyard" | "river" | "dawn" | "dove";
}): string {
  const motifPrompts: Record<typeof opts.motif, string> = {
    water: "still water at dawn, gentle ripples, reflections of soft gold sky",
    light: "rays of warm gold light breaking through deep blue mist, no source visible",
    wilderness: "a sweeping wilderness landscape at golden hour, distant mountains, no figures",
    mountain: "a single mountain peak against a deep blue sky, gold light on the summit",
    sky: "a vast deep blue sky with scattered gold-edged clouds at dawn",
    field: "a field of grain bending in soft wind, gold light, no figures",
    vineyard: "an old vineyard at sunrise, gold light on green leaves, no figures",
    river: "a wide calm river at dawn, gold reflections on the surface, no figures",
    dawn: "the first moments of dawn over a hilly horizon, soft gold and deep blue gradient sky",
    dove: "a single white dove in soft golden light against a deep blue background, painterly",
  };
  return `A square 1:1 ${motifPrompts[opts.motif]}. Reverent, museum-quality, painterly photographic. Composition centered with negative space at top and bottom for text overlay. Suitable as a Scripture card for "${opts.passage}". No people, no faces, no literal text in the image.`;
}

export async function renderSermonHero(opts: {
  title: string;
  primaryPassage: string;
  theme: string;
}): Promise<GeneratedImage> {
  const prompt = composeSermonHeroPrompt(opts);
  const images = await fal.generateImage({
    prompt,
    imageSize: "landscape_16_9",
    numImages: 1,
    enableSafetyChecker: true,
  });
  if (!images[0]) throw new Error("[branding] no image returned for sermon hero");
  return images[0];
}

export async function renderScriptureCard(opts: {
  passage: string;
  motif: Parameters<typeof composeScriptureCardPrompt>[0]["motif"];
}): Promise<GeneratedImage> {
  const prompt = composeScriptureCardPrompt(opts);
  const images = await fal.generateImage({
    prompt,
    imageSize: "square_hd",
    numImages: 1,
    enableSafetyChecker: true,
  });
  if (!images[0]) throw new Error("[branding] no image returned for scripture card");
  return images[0];
}
