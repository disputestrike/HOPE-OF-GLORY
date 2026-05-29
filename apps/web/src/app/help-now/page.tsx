import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Need help today?",
  description:
    "Choose what fits where you are. Salvation, prayer, crisis resources, grief, fear, rejection, anger, financial stress, or shelter.",
};

const cards = [
  {
    href: "/come-to-christ",
    label: "I want to give my life to Jesus",
    sub: "The gospel and a prayer of repentance and faith.",
    tone: "primary",
  },
  {
    href: "/help/suicide",
    label: "I am thinking about ending my life",
    sub: "Crisis-mode help. Immediate steps.",
    tone: "danger",
  },
  {
    href: "/prayer",
    label: "I need prayer",
    sub: "Share a request. Anonymous OK.",
    tone: "default",
  },
  {
    href: "/help/grief",
    label: "I am grieving",
    sub: "Where God meets us in loss.",
    tone: "default",
  },
  {
    href: "/help/fear",
    label: "I feel afraid",
    sub: "Anxiety, worry, the future.",
    tone: "default",
  },
  {
    href: "/help/rejection",
    label: "I feel lost or unwanted",
    sub: "When no one seems to see you.",
    tone: "default",
  },
  {
    href: "/help/anger",
    label: "I need help with anger or bitterness",
    sub: "Bring the wound to Christ.",
    tone: "default",
  },
  {
    href: "/help/no-money",
    label: "I have no money",
    sub: "Prayer + practical resources.",
    tone: "default",
  },
  {
    href: "/help/homeless",
    label: "I need shelter",
    sub: "Local resources for tonight.",
    tone: "default",
  },
  {
    href: "/ask",
    label: "Ask Hope",
    sub: "Type what's on your heart.",
    tone: "default",
  },
] as const;

export default function HelpNowPage() {
  return (
    <section className="section theme-warm">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Need help today?", href: "/help-now" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Need help today?</p>
          <h1>Choose what fits where you are right now.</h1>
          <p className="text-muted max-w-readable" style={{ fontSize: "var(--fs-body-lg)" }}>
            No registration. No payment. No pressure. Just hope, Scripture, prayer, and the
            right next step.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href as `/${string}`}
              className="card block hover:no-underline"
              style={
                c.tone === "danger"
                  ? { borderColor: "var(--blood-crimson)" }
                  : c.tone === "primary"
                    ? { borderColor: "var(--glory-gold)" }
                    : undefined
              }
            >
              <p
                className="card__eyebrow"
                style={
                  c.tone === "danger"
                    ? { color: "var(--blood-crimson)" }
                    : c.tone === "primary"
                      ? { color: "var(--glory-gold)" }
                      : undefined
                }
              >
                {c.tone === "primary"
                  ? "Most important"
                  : c.tone === "danger"
                    ? "Highest priority"
                    : "Help"}
              </p>
              <h3 className="m-0 mb-2 text-warm">{c.label}</h3>
              <p className="m-0 text-muted text-sm">{c.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
