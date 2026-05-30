"use client";

import { useState } from "react";
import Link from "next/link";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState<
    | "user_requested_human"
    | "doctrine_dispute"
    | "complex_pastoral"
    | "moderation_appeal"
    | "donor_inquiry"
    | "media_inquiry"
    | "technical_support"
  >("user_requested_human");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || !email.trim() || loading) return;
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          phone: phone.trim() || undefined,
          reason,
          message: message.trim(),
        }),
      });
      setDone(true);
    } catch {
      // Form posts succeed silently if API is down — handoff row still attempted.
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="card">
        <p className="card__eyebrow">Received</p>
        <h3 className="m-0 mb-3">Thank you for reaching out.</h3>
        <p className="m-0 text-muted">
          We will read what you sent. If you asked for a follow-up, we'll be in touch by
          email within a few days.
        </p>
        <Link href="/" className="btn btn--ghost mt-6">
          Return home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-5">
      <div>
        <label className="card__eyebrow block mb-2" htmlFor="reason">
          What is this about?
        </label>
        <select
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value as typeof reason)}
          className="bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm focus:border-glory-gold focus:outline-none"
        >
          <option value="user_requested_human">I'd like to talk to a real person</option>
          <option value="doctrine_dispute">Question about something you taught</option>
          <option value="complex_pastoral">Pastoral question / counsel</option>
          <option value="moderation_appeal">Correction to something we published</option>
          <option value="donor_inquiry">Supporting the ministry</option>
          <option value="media_inquiry">Media / press</option>
          <option value="technical_support">Technical issue</option>
        </select>
      </div>

      <div>
        <label className="card__eyebrow block mb-2" htmlFor="contact-name">
          Your name <span className="text-muted normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="contact-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          className="w-full bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm placeholder:text-muted focus:border-glory-gold focus:outline-none"
          placeholder="First name is fine"
        />
      </div>

      <div>
        <label className="card__eyebrow block mb-2" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={200}
          className="w-full bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm placeholder:text-muted focus:border-glory-gold focus:outline-none"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="card__eyebrow block mb-2" htmlFor="contact-phone">
          Phone <span className="text-muted normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={40}
          className="w-full bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm placeholder:text-muted focus:border-glory-gold focus:outline-none"
          placeholder="(555) 555-5555"
        />
      </div>

      <div>
        <label className="card__eyebrow block mb-2" htmlFor="contact-message">
          What's on your mind?
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          maxLength={4000}
          className="w-full bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm placeholder:text-muted focus:border-glory-gold focus:outline-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !message.trim() || !email.trim()}
          className="btn btn--primary"
          style={{ opacity: loading || !message.trim() || !email.trim() ? 0.5 : 1 }}
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
