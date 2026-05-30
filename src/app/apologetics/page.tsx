import type { Metadata } from "next";
import Link from "next/link";
import { ApologeticsChat } from "@/components/ApologeticsChat";

export const metadata: Metadata = {
  title: "Apologetics — Defending the faith, charitably",
  description:
    "Honest answers to honest questions about Christianity. We compare doctrines, not insult persons. We invite the conversation rather than shut it down.",
};

export default function ApologeticsPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <header className="mb-10">
          <p className="eyebrow">Apologetics desk</p>
          <h1>Defending the faith — firmly and charitably.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            Apologetics is not combat. It is conversation. We steel-man your question first.
            We respond with the historic Christian view. We anticipate the strongest pushback.
            We never mock, and we never degrade any person or group.
          </p>
          <aside
            className="mt-6 p-4 rounded border max-w-readable"
            style={{ borderColor: "var(--blood-crimson)", background: "rgba(138, 28, 28, 0.08)" }}
          >
            <p className="m-0 text-warm text-sm">
              If you are in crisis, please skip the debate. Call{" "}
              <strong className="text-gold">911</strong> for immediate danger or{" "}
              <strong className="text-gold">988</strong> for the Suicide & Crisis Lifeline. See the{" "}
              <Link href="/hope-line" className="text-gold">Hope Line</Link>.
            </p>
          </aside>
        </header>

        <ApologeticsChat />
      </div>
    </section>
  );
}
