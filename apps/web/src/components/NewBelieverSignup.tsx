"use client";

import { useState } from "react";

export function NewBelieverSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    try {
      await fetch("/api/new-believers/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), givenName: name.trim() || undefined }),
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="card">
        <p className="card__eyebrow">Welcome</p>
        <h3 className="m-0 mb-3">Day 1 is on its way to your inbox.</h3>
        <p className="m-0 text-muted">
          Check your email — if it's not there in a few minutes, check spam and add us to your contacts.
          We're so glad you're here.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-5">
      <div>
        <label className="card__eyebrow block mb-2" htmlFor="nb-name">
          Your name <span className="text-muted normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="nb-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          className="w-full bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm focus:border-glory-gold focus:outline-none"
          placeholder="First name"
        />
      </div>
      <div>
        <label className="card__eyebrow block mb-2" htmlFor="nb-email">Email</label>
        <input
          id="nb-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={200}
          className="w-full bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm focus:border-glory-gold focus:outline-none"
          placeholder="you@example.com"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="btn btn--primary"
          style={{ opacity: loading || !email.trim() ? 0.5 : 1 }}
        >
          {loading ? "Enrolling…" : "Start day 1"}
        </button>
      </div>
    </form>
  );
}
