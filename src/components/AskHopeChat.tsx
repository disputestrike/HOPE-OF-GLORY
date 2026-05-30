"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  crisis?: { severity: string; surface_988: boolean; surface_911: boolean };
  blocked?: boolean;
};

const STARTERS = [
  "Who is Jesus?",
  "What does it mean that Christ is in me?",
  "Is the Bible reliable?",
  "What does Habakkuk 2:14 mean?",
  "How can I begin to follow Christ?",
];

export function AskHopeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const endRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    const prompt = searchParams.get("prompt") ?? searchParams.get("q");
    if (prompt && !input && messages.length === 0) {
      setInput(prompt.slice(0, 2000));
    }
  }, [input, messages.length, searchParams]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, sessionId }),
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer ?? "I'm sorry — something went wrong. Please try again.",
        citations: data.citations,
        crisis: data.crisis,
        blocked: data.blocked,
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I'm sorry — I couldn't reach the server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="card flex flex-col" style={{ minHeight: "560px" }}>
      <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: "60vh" }}>
        {messages.length === 0 ? (
          <div>
            <p className="card__eyebrow">Start with a question</p>
            <p className="m-0 text-muted mb-6">
              Ask Hope is an AI Scripture and prayer companion. Not a pastor,
              counselor, or spiritual director. If you are in crisis, please call{" "}
              <strong className="text-gold">988</strong> or{" "}
              <strong className="text-gold">911</strong>.
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
        ) : (
          <ul className="flex flex-col gap-6 m-0 p-0 list-none">
            {messages.map((m) => (
              <li
                key={m.id}
                className={m.role === "user" ? "self-end max-w-[85%]" : "self-start max-w-[95%]"}
                style={{ display: "block" }}
              >
                {m.role === "assistant" && m.crisis && m.crisis.severity !== "none" ? (
                  <aside
                    className="mb-3 p-4 rounded border"
                    style={{
                      borderColor: "var(--blood-crimson)",
                      background: "rgba(138, 28, 28, 0.12)",
                    }}
                  >
                    <p className="card__eyebrow text-warm m-0 mb-1">If you are in danger</p>
                    <p className="m-0 text-warm text-sm">
                      Call <strong className="text-gold">911</strong> if you are in immediate
                      danger. Call or text <strong className="text-gold">988</strong> for the
                      Suicide & Crisis Lifeline. You are not alone.
                    </p>
                  </aside>
                ) : null}

                <p className="card__eyebrow">
                  {m.role === "user" ? "You" : "Ask Hope"}
                </p>
                <p
                  className="m-0 whitespace-pre-wrap"
                  style={{
                    color: m.role === "user" ? "var(--glory-gold)" : "var(--warm-light)",
                  }}
                >
                  {m.content}
                </p>
                {m.citations && m.citations.length > 0 ? (
                  <p className="text-muted text-xs mt-2 m-0">
                    References: {m.citations.join(", ")}
                  </p>
                ) : null}
              </li>
            ))}
            {loading ? (
              <li className="self-start opacity-70">
                <p className="card__eyebrow">Ask Hope</p>
                <p className="m-0 text-muted">…</p>
              </li>
            ) : null}
            <div ref={endRef} />
          </ul>
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a Bible question…"
          disabled={loading}
          className="flex-1 bg-navy border border-[var(--border-soft)] rounded px-4 py-3 text-warm placeholder:text-muted focus:border-glory-gold focus:outline-none"
          aria-label="Your question"
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
