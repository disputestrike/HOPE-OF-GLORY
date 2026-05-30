/**
 * Default Open Graph image for every page that doesn't override it.
 *
 * Next.js convention: a file at this path auto-becomes the OG image
 * for routes that don't define their own. Rendered at build/request
 * time as a 1200×630 PNG via @vercel/og's ImageResponse.
 *
 * Brand tokens (kept here as literal hex because ImageResponse can't
 * read CSS custom properties):
 *   Deep Heaven Blue  #0B1F3A
 *   Glory Gold        #D4AF37
 *   Warm Light        #FFF8E7
 *   Border Soft       #1F3553
 */
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hope of Glory Ministry — filling the earth with the knowledge of the glory of the Lord.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background:
            "linear-gradient(135deg, #0B1F3A 0%, #0B1F3A 55%, #122944 100%)",
          color: "#FFF8E7",
          fontFamily: '"Georgia", "Times New Roman", serif',
          position: "relative",
        }}
      >
        {/* Top: ministry mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              background: "#D4AF37",
              transform: "rotate(45deg)",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: "26px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#D4AF37",
              fontFamily: '"Inter", "Helvetica", sans-serif',
              display: "flex",
            }}
          >
            Hope of Glory Ministry
          </div>
        </div>

        {/* Middle: the anchor verse */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <div
            style={{
              fontSize: "76px",
              lineHeight: 1.08,
              fontWeight: 500,
              fontStyle: "italic",
              color: "#FFF8E7",
              maxWidth: "1020px",
              display: "flex",
            }}
          >
            Filling the earth with the knowledge of the glory of the Lord.
          </div>
          <div
            style={{
              fontSize: "22px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#D4AF37",
              fontFamily: '"Inter", "Helvetica", sans-serif',
              display: "flex",
            }}
          >
            Habakkuk 2:14 · WEB
          </div>
        </div>

        {/* Bottom: tagline + domain */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "32px",
            borderTop: "1px solid #1F3553",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              color: "rgba(255, 248, 231, 0.72)",
              fontFamily: '"Inter", "Helvetica", sans-serif',
              display: "flex",
            }}
          >
            Scripture · Prayer · Teaching · Apologetics
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#D4AF37",
              letterSpacing: "0.08em",
              fontFamily: '"Inter", "Helvetica", sans-serif',
              display: "flex",
            }}
          >
            hopeofglory.ministry
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
