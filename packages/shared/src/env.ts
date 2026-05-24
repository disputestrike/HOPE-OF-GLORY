/**
 * Typed environment access — fails loudly if required vars are missing.
 */
export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Required environment variable missing: ${name}`);
  return v;
}

export function envOr(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export function envBool(name: string, fallback: boolean): boolean {
  const v = process.env[name];
  if (v === undefined) return fallback;
  return v === "true" || v === "1";
}

export type FeatureFlags = {
  askHope: boolean;
  prayer: boolean;
  donations: boolean;
  hopeLine: boolean;
  liveYouTube: boolean;
  liveDebate: boolean;
  x: boolean;
};

export function features(): FeatureFlags {
  return {
    askHope: envBool("FEATURE_ASK_HOPE", true),
    prayer: envBool("FEATURE_PRAYER", true),
    donations: envBool("FEATURE_DONATIONS", false),
    hopeLine: envBool("FEATURE_HOPE_LINE", false),
    liveYouTube: envBool("FEATURE_LIVE_YOUTUBE", false),
    liveDebate: envBool("FEATURE_LIVE_DEBATE", false),
    x: envBool("FEATURE_X", false),
  };
}
