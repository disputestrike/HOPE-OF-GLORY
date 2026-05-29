import Link from "next/link";

/**
 * Persistent help affordance. WCAG 2.2 — Consistent Help: when help is
 * available across multiple pages, it should appear in the same location
 * with consistent labeling. Embed near the top of every page that touches
 * crisis-adjacent content (Ask Hope, Prayer, Hope Line, Apologetics, Help).
 */
export function NeedHelpBanner({
  variant = "default",
}: {
  variant?: "default" | "compact";
}) {
  if (variant === "compact") {
    return (
      <aside
        className="p-3 rounded border max-w-readable text-xs"
        style={{
          borderColor: "var(--blood-crimson)",
          background: "rgba(138, 28, 28, 0.08)",
        }}
        role="complementary"
        aria-label="Need help today"
      >
        <p className="m-0 text-warm">
          <strong>Need help today?</strong> Call{" "}
          <a href="tel:988" className="text-gold underline">988</a>{" "}
          (Suicide & Crisis Lifeline) · Emergency:{" "}
          <a href="tel:911" className="text-gold underline">911</a> · Housing:{" "}
          <a href="tel:211" className="text-gold underline">211</a> ·{" "}
          <Link href="/help/crisis-resources" className="text-gold underline">
            More resources
          </Link>
        </p>
      </aside>
    );
  }

  return (
    <aside
      className="p-4 md:p-5 rounded border max-w-readable"
      style={{
        borderColor: "var(--blood-crimson)",
        background: "rgba(138, 28, 28, 0.08)",
      }}
      role="complementary"
      aria-label="Need help today"
    >
      <p className="card__eyebrow text-warm m-0 mb-2">Need help today?</p>
      <p className="m-0 text-warm text-sm">
        If you are in immediate danger, call{" "}
        <strong className="text-gold">
          <a href="tel:911" className="underline">911</a>
        </strong>
        . If you are having thoughts of suicide or self-harm, call or text{" "}
        <strong className="text-gold">
          <a href="tel:988" className="underline">988</a>
        </strong>{" "}
        — the U.S. Suicide & Crisis Lifeline. For housing crisis or basic needs, dial{" "}
        <strong className="text-gold">
          <a href="tel:211" className="underline">211</a>
        </strong>
        . Outside the U.S., see{" "}
        <Link href="/help/crisis-resources" className="text-gold underline">
          our international resources
        </Link>
        .
      </p>
    </aside>
  );
}
