import type { Metadata } from "next";
import Link from "next/link";
import { AskHopeChat } from "@/components/AskHopeChat";

export const metadata: Metadata = {
  title: "Ask Hope — Bible Q&A",
  description:
    "Ask honest Bible questions. Hope is an AI Q&A companion that points you to Scripture and the local church. Not a pastor, counselor, or spiritual director.",
};

export default function AskPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <header className="mb-10">
          <p className="eyebrow">Ask Hope</p>
          <h1>Ask a Bible question.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            Hope is an AI Bible Q&A companion. It is not a pastor, counselor, or spiritual director.
            It points you to Scripture and, where appropriate, to a faithful local church.
          </p>
          <aside
            className="mt-6 p-4 rounded border max-w-readable"
            style={{ borderColor: "var(--blood-crimson)", background: "rgba(138, 28, 28, 0.08)" }}
          >
            <p className="m-0 text-warm text-sm">
              <strong>If you are in crisis</strong>, please skip the chat. Call{" "}
              <strong className="text-gold">911</strong> for immediate danger or{" "}
              <strong className="text-gold">988</strong> for the U.S. Suicide & Crisis Lifeline.
              See our <Link href="/hope-line" className="text-gold">Hope Line</Link>.
            </p>
          </aside>
        </header>

        <AskHopeChat />

        <p className="text-muted text-xs mt-8 max-w-readable">
          Conversations are stored to help us improve quality and correct errors. We never
          sell or share what you write. See our <Link href="/privacy">privacy policy</Link>{" "}
          and <Link href="/ai-disclosure">AI disclosure</Link>.
        </p>
      </div>
    </section>
  );
}
