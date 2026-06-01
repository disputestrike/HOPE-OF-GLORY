"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

type Props = {
  reference: string;
  text: string;
  readerUrl: string;
  className?: string;
};

/**
 * Inline scripture reference that reveals the verified WEB verse text in a
 * popover on hover (desktop) or tap (touch / keyboard). Positioned with fixed
 * coordinates computed from the trigger so it is never clipped by an
 * overflow-hidden ancestor. Accessible: button trigger, Escape to close,
 * focus/blur support.
 */
export function VersePopover({ reference, text, readerUrl, className }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const place = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.min(340, window.innerWidth - 24);
    const left = Math.max(12, Math.min(r.left, window.innerWidth - width - 12));
    setPos({ top: r.bottom + 8, left });
  }, []);

  const show = useCallback(() => {
    place();
    setOpen(true);
  }, [place]);
  const hide = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onScroll = () => setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-describedby={open ? panelId : undefined}
        onFocus={show}
        onBlur={hide}
        onClick={() => (open ? hide() : show())}
        className={
          className ??
          "text-gold underline decoration-dotted decoration-1 underline-offset-2 hover:text-cream focus:outline-none"
        }
      >
        {reference}
      </button>

      {open && pos ? (
        <span
          id={panelId}
          role="tooltip"
          className="block"
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: "min(340px, calc(100vw - 24px))",
            zIndex: 60,
          }}
        >
          <span
            className="block rounded-sm border p-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            style={{
              background: "var(--deep-heaven)",
              borderColor: "var(--glory-gold)",
              color: "var(--warm-light)",
            }}
          >
            <span
              className="block text-xs uppercase tracking-[0.16em] mb-2"
              style={{ color: "var(--glory-gold)" }}
            >
              {reference} · WEB
            </span>
            <span
              className="block text-sm leading-relaxed"
              style={{ maxHeight: "12rem", overflowY: "auto" }}
            >
              {text}
            </span>
            <a
              href={readerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs uppercase tracking-[0.14em]"
              style={{ color: "var(--glory-gold)" }}
            >
              Read full passage ↗
            </a>
          </span>
        </span>
      ) : null}
    </span>
  );
}
