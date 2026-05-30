"use client";

import { useState } from "react";
import Link from "next/link";

type Response = {
  id: string | null;
  prayerText: string;
  crisis: { severity: string; surface_988: boolean; surface_911: boolean };
};

export function PrayerForm() {
  const [content, setContent] = useState("");
  const [privacyLevel, setPrivacyLevel] = useState<"public" | "anonymous" | "private">(
    "anonymous"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          privacyLevel,
          name: name.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });
      const data = (await res.json()) as Response;
      setResponse(data);
    } catch {
      // ignore — server returns its own error message in JSON; here we just guard
    } finally {
      setLoading(false);
    }
  }

  if (response) {
    return (
      <div className="flex flex-col gap-6">
        {response.crisis.severity !== "none" ? (
          <aside
            className="p-6 rounded border"
            style={{
              borderColor: "var(--blood-crimson)",
              background: "rgba(138, 28, 28, 0.12)",
            }}
          >
            <p className="card__eyebrow text-warm m-0 mb-2">If you are in danger</p>
            <p className="m-0 text-warm">
              What you shared sounds urgent. If you are in immediate danger, call{" "}
              <strong className="text-gold">911</strong>. For the U.S. Suicide & Crisis
              Lifeline, call or text <strong className="text-gold">988</strong>. You are
              not alone.
            </p>
          </aside>
        ) : null}

        <div className="card">
          <p className="card__eyebrow">A prayer with you</p>
          <p className="m-0 whitespace-pre-wrap" style={{ fontSize: "var(--fs-body-lg)" }}>
            {response.prayerText}
          </p>
        </div>

        <p className="text-muted">
          Your request has been received. A member of the ministry will read it and pray.
        </p>

        <div>
          <Link href="/" className="btn btn--ghost">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-5">
      <div>
        <label className="card__eyebrow block mb-2" htmlFor="prayer-content">
          What would you like prayer for?
        </label>
        <textarea
          id="prayer-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          maxLength={4000}
          className="w-full bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm placeholder:text-muted focus:border-glory-gold focus:outline-none"
          placeholder="Share as much or as little as you like."
        />
      </div>

      <div>
        <label className="card__eyebrow block mb-2" htmlFor="privacy">
          Privacy
        </label>
        <select
          id="privacy"
          value={privacyLevel}
          onChange={(e) => setPrivacyLevel(e.target.value as typeof privacyLevel)}
          className="bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm focus:border-glory-gold focus:outline-none"
        >
          <option value="private">Private — only the ministry reads this</option>
          <option value="anonymous">Anonymous — may be shared without your name</option>
          <option value="public">Public — may be shared with your name</option>
        </select>
      </div>

      <div>
        <label className="card__eyebrow block mb-2" htmlFor="name">
          Your name <span className="text-muted normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          className="w-full bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm placeholder:text-muted focus:border-glory-gold focus:outline-none"
          placeholder="First name is fine"
        />
      </div>

      <div>
        <label className="card__eyebrow block mb-2" htmlFor="email">
          Email <span className="text-muted normal-case tracking-normal">(optional, only if you'd like follow-up)</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={200}
          className="w-full bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm placeholder:text-muted focus:border-glory-gold focus:outline-none"
          placeholder="you@example.com"
        />
        <p className="text-muted text-xs mt-2 m-0">
          We do not sell or share your email. See our{" "}
          <Link href="/privacy" className="text-gold">privacy policy</Link>.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="btn btn--primary"
          style={{ opacity: loading || !content.trim() ? 0.5 : 1 }}
        >
          {loading ? "Sending…" : "Send my prayer request"}
        </button>
      </div>
    </form>
  );
}
