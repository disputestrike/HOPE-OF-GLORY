"use client";

import { useState } from "react";

const STARTERS = [
  "Is the Trinity in the Bible?",
  "Why does a loving God allow evil?",
  "How can Jesus be the only way?",
  "Did Jesus rise from the dead?",
  "How would you respond to a Muslim friend?",
];

type Response = {
  steelman: string;
  christianView: string;
  objectionHandling: string;
  citations: string[];
  inviteToContinue: string;
  blocked?: boolean;
  blockedReason?: string;
};

export function ApologeticsChat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [exchanges, setExchanges] = useState<Array<{ q: string; r: Response }>>([]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setLoading(true);
    setInput("");
    try {
      const res = await fetch("/api/apologetics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const r = (await res.json()) as Response;
      setExchanges((prev) => [...prev, { q: text, r }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {exchanges.length === 0 ? (
        <div className="card">
          <p className="card__eyebrow">Start with an objection</p>
          <p className="text-muted mb-6 m-0">
            Apologetics here is conversation, not combat. We steel-man your question first, then
            offer the historic Christian view, then handle the strongest pushback.
          </p>
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="btn btn--ghost text-sm"
                style={{ padding: "0.5rem 1rem" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {exchanges.map((ex, i) => (
        <article key={i} className="card flex flex-col gap-4">
          <div>
            <p className="card__eyebrow">Your question</p>
            <p className="m-0 text-gold">{ex.q}</p>
          </div>
          {ex.r.blocked && ex.r.blockedReason === "crisis_override" ? (
            <div
              className="p-4 rounded border"
              style={{ borderColor: "var(--blood-crimson)", background: "rgba(138, 28, 28, 0.12)" }}
            >
              <p className="m-0 text-warm">{ex.r.christianView}</p>
            </div>
          ) : (
            <>
              <div>
                <p className="card__eyebrow">First, the strongest form of your question</p>
                <p className="m-0 text-warm whitespace-pre-wrap">{ex.r.steelman}</p>
              </div>
              <div>
                <p className="card__eyebrow">The historic Christian view</p>
                <p className="m-0 text-warm whitespace-pre-wrap">{ex.r.christianView}</p>
              </div>
              <div>
                <p className="card__eyebrow">Anticipating the pushback</p>
                <p className="m-0 text-warm whitespace-pre-wrap">{ex.r.objectionHandling}</p>
              </div>
              {ex.r.inviteToContinue ? (
                <p className="m-0 text-muted italic">{ex.r.inviteToContinue}</p>
              ) : null}
              {ex.r.citations.length > 0 ? (
                <p className="m-0 text-muted text-xs">
                  References: {ex.r.citations.join(", ")}
                </p>
              ) : null}
            </>
          )}
        </article>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask an honest question…"
          disabled={loading}
          className="flex-1 bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm focus:border-glory-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn btn--primary"
          style={{ opacity: loading || !input.trim() ? 0.5 : 1 }}
        >
          {loading ? "Thinking…" : "Ask"}
        </button>
      </form>
    </div>
  );
}
