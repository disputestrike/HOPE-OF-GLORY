/**
 * fal.ai image generation provider — Flux 1.1 Pro for hyper-realistic Scripture cards
 * and sermon visuals. Picked over DALL-E 3 / Imagen for photoreal quality + cost
 * (~$0.04 per 1024×1024 image, ~2-3s sync mode).
 *
 * Used by the Branding Agent. Never call directly from Cerebras-rendered text;
 * always go through the Branding Agent so the brand-style anchors and
 * forbidden-imagery guards are applied.
 */
import { ProviderUnavailable } from "../types";

const FAL_BASE = "https://fal.run";
const FLUX_PRO = "/fal-ai/flux-pro/v1.1";

export type ImageSize =
  | "square_hd"
  | "square"
  | "portrait_4_3"
  | "portrait_16_9"
  | "landscape_4_3"
  | "landscape_16_9"
  | { width: number; height: number };

export type GeneratedImage = {
  url: string;
  width: number;
  height: number;
  contentType: string;
  seed?: number;
};

/** Style anchor injected into every brand image. Locked at the workshop. */
export const BRAND_STYLE_ANCHOR =
  "photographic, cinematic lighting, reverent, dignified, gold and deep blue palette, soft volumetric light, painterly atmosphere, high detail, museum-quality composition";

/** Negative prompt — forbidden imagery from the brand guide. Locked. */
export const FORBIDDEN_IMAGERY =
  "realistic faces of fictional preachers, identifiable Jesus face, low quality, watermark, text artifacts, AI artifacts, deformed, cartoon, anime, lurid, gore, fear-mongering imagery, currency, money, cash, dollar signs";

export type FluxRequest = {
  prompt: string;
  imageSize?: ImageSize;
  numImages?: number;
  seed?: number;
  guidanceScale?: number;
  enableSafetyChecker?: boolean;
  negativePrompt?: string;
};

export async function generateImage(req: FluxRequest): Promise<GeneratedImage[]> {
  const key = process.env.FAL_API_KEY;
  if (!key) throw new ProviderUnavailable("openai", "FAL_API_KEY not set"); // re-use error type until we add 'fal'

  const fullPrompt = `${req.prompt}, ${BRAND_STYLE_ANCHOR}`;
  const negative = req.negativePrompt
    ? `${req.negativePrompt}, ${FORBIDDEN_IMAGERY}`
    : FORBIDDEN_IMAGERY;

  const body: Record<string, unknown> = {
    prompt: fullPrompt,
    image_size: req.imageSize ?? "landscape_16_9",
    num_images: req.numImages ?? 1,
    enable_safety_checker: req.enableSafetyChecker ?? true,
    sync_mode: true,
    guidance_scale: req.guidanceScale ?? 3.5,
    output_format: "jpeg",
    negative_prompt: negative,
  };
  if (req.seed !== undefined) body.seed = req.seed;

  const response = await fetch(`${FAL_BASE}${FLUX_PRO}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`[fal] HTTP ${response.status}: ${text.slice(0, 200)}`);
  }

  const json = (await response.json()) as {
    images?: Array<{ url: string; width: number; height: number; content_type: string }>;
    seed?: number;
  };

  if (!json.images || json.images.length === 0) {
    throw new Error("[fal] no images returned");
  }

  return json.images.map((img) => ({
    url: img.url,
    width: img.width,
    height: img.height,
    contentType: img.content_type,
    seed: json.seed,
  }));
}
