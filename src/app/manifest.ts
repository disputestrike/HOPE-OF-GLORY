import type { MetadataRoute } from "next";

/**
 * Web app manifest (PWA). Lets the site be "added to home screen" with a
 * proper name, icon, and brand splash — meaningful for a daily-devotional
 * habit product. Icons are generated from the brand logo on the Deep
 * Heaven Blue field (see scripts note / public/icon-*.png).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hope of Glory Ministry",
    short_name: "Hope of Glory",
    description:
      "Filling the earth with the knowledge of the glory of the Lord. Scripture, prayer, teaching, and apologetics.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1F3A",
    theme_color: "#0B1F3A",
    categories: ["education", "lifestyle", "books"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
