"use client";

import { useState } from "react";

type Flow =
  | "forty_day"
  | "hurting_heart"
  | "daily_faith"
  | "weekly_digest";

const flowCopy: Record<
  Flow,
  { label: string; promise: string; button: string; done: string }
> = {
  forty_day: {
    label: "40-Day Journey",
    promise:
      "You will receive Day 1 first, then one Scripture, reflection, prayer, and next step each day through Day 40.",
    button: "Send me Day 1",
    done: "You are signed up for the 40-Day Journey. Day 1 is the first message in this flow.",
  },
  hurting_heart: {
    label: "30-Day Hope Journey",
    promise:
      "You will receive a gentle soul-care day at a time: Scripture, reflection, prayer, and one next step for the hurting heart.",
    button: "Send me Day 1",
    done: "You are signed up for the 30-Day Hope Journey. Day 1 is the first message in this flow.",
  },
  daily_faith: {
    label: "Daily Faith",
    promise:
      "You will receive Scripture, prayer, a short message, a question, an obedience step, and something to share.",
    button: "Subscribe",
    done: "You are signed up for Daily Faith.",
  },
  weekly_digest: {
    label: "Weekly Digest",
    promise:
      "You will receive a weekly roundup of messages, studies, prayers, and ministry updates.",
    button: "Subscribe",
    done: "You are signed up for the weekly digest.",
  },
};

type Props = {
  flow: Flow;
  sourcePage: string;
  compact?: boolean;
};

export function EmailSubscribeForm({ flow, sourcePage, compact = false }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = flowCopy[flow];

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          flow,
          sourcePage,
        }),
      });

      if (!response.ok) {
        setError("Please check your email and try again.");
        return;
      }

      setDone(true);
    } catch {
      setError("We could not reach the subscription service. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className={compact ? "" : "card"}>
        <p className="card__eyebrow">Subscribed</p>
        <h3 className="m-0 mb-3">{copy.label}</h3>
        <p className="m-0 text-muted">{copy.done}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "flex flex-col gap-4" : "card flex flex-col gap-5"}>
      <div>
        <p className="card__eyebrow m-0 mb-2">{copy.label}</p>
        <p className="m-0 text-muted text-sm">{copy.promise}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="card__eyebrow block mb-2" htmlFor={`${flow}-name`}>
            Name <span className="text-muted normal-case tracking-normal">(optional)</span>
          </label>
          <input
            id={`${flow}-name`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={120}
            className="w-full bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm placeholder:text-muted focus:border-glory-gold focus:outline-none"
            placeholder="First name"
          />
        </div>
        <div>
          <label className="card__eyebrow block mb-2" htmlFor={`${flow}-email`}>
            Email
          </label>
          <input
            id={`${flow}-email`}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={200}
            className="w-full bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm placeholder:text-muted focus:border-glory-gold focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {error ? (
        <p role="alert" className="m-0 text-sm" style={{ color: "#ffb4b4" }}>
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-muted text-xs">
          No spam. No selling your email. Unsubscribe anytime.
        </p>
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="btn btn--primary"
          style={{ opacity: loading || !email.trim() ? 0.5 : 1 }}
        >
          {loading ? "Signing up…" : copy.button}
        </button>
      </div>
    </form>
  );
}
