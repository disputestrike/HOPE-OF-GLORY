import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://hopeofglory.ministry"
  ),
  title: {
    default: "Hope of Glory Ministry",
    template: "%s · Hope of Glory Ministry",
  },
  description:
    "Filling the earth with the knowledge of the glory of the Lord. A Christian media ministry proclaiming Jesus Christ through Scripture, prayer, teaching, and apologetics.",
  applicationName: "Hope of Glory Ministry",
  keywords: [
    "Christian ministry",
    "Bible teaching",
    "prayer",
    "apologetics",
    "Jesus Christ",
    "discipleship",
    "Scripture",
  ],
  authors: [{ name: "Hope of Glory Ministry" }],
  creator: "Hope of Glory Ministry",
  publisher: "Hope of Glory Ministry",
  // NOTE: no blanket `alternates` here. Setting it in the root layout would
  // force every inheriting page to declare the homepage as its canonical and
  // advertise 8 "translated" alternates that currently just redirect to
  // English — an actively harmful, contradictory hreflang cluster. The i18n
  // scaffold (alternateLinks/buildLocalizedPath) stays ready in @/lib/i18n;
  // re-wire per-page alternates here once real translated routes ship.
  openGraph: {
    title: "Hope of Glory Ministry",
    description:
      "Filling the earth with the knowledge of the glory of the Lord.",
    url: "https://hopeofglory.ministry",
    siteName: "Hope of Glory Ministry",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hope of Glory Ministry",
    description:
      "Filling the earth with the knowledge of the glory of the Lord.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-glory-gold focus:text-midnight-navy focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
