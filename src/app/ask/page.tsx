import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AskHopeChat } from "@/components/AskHopeChat";
import { NeedHelpBanner } from "@/components/NeedHelpBanner";

export const metadata: Metadata = {
  title: "Ask Hope - AI biblical guidance",
  description:
    "Ask honest questions about Scripture, faith, prayer, and the Christian life. Ask Hope points you to the Word and to the local church. Not a pastor, counselor, or spiritual director.",
};

export default function AskHopePage() {
  return (
    <section className="section">
      <div className="container-prose">
        <header className="mb-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Ask Hope</p>
            <h1>Ask. Listen. Come.</h1>
            <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
              Ask Hope is an AI Scripture and prayer companion. It points you to the Word,
              to Christ, and to the local church. It is not a pastor, counselor, or
              spiritual director.
            </p>
          </div>
          <figure className="m-0 overflow-hidden rounded-sm border border-[var(--border-soft)]">
            <Image
              src="/images/gallery/ministry_humanity_3.webp"
              alt="A woman holding a phone at night near a window"
              width={2560}
              height={1440}
              sizes="(min-width: 1024px) 620px, 100vw"
              priority
              className="aspect-[16/9] w-full object-cover"
            />
          </figure>
        </header>

        <NeedHelpBanner />

        <div className="mt-10">
          <Suspense fallback={<div className="card text-muted">Loading Ask Hope…</div>}>
            <AskHopeChat />
          </Suspense>
        </div>

        <p className="text-muted text-xs mt-8 max-w-readable">
          Conversations are stored to help us improve quality and correct errors. We
          never sell or share what you write. See our{" "}
          <Link href="/privacy">privacy policy</Link> and{" "}
          <Link href="/ai-disclosure">AI disclosure</Link>.
        </p>
      </div>
    </section>
  );
}
