"use client";

/**
 * EngagementActions — public reaction row for ministry content.
 *
 * Actions (LOCKED naming, do not change without doctrine review):
 *   Amen · Helpful · Save · Share · Download
 *
 * - No "Like" verb, no heart iconography (theological misalignment).
 * - No public counts (privacy on first launch — moderators see counts in
 *   the admin surface, not here).
 * - Anonymous posting is fine; the server resolves an opaque anon key
 *   from the `hog_session` cookie. The active state is purely local —
 *   we never read counts back to the client.
 * - Share uses navigator.share when available, else clipboard fallback
 *   with a transient "Copied" pill (no toast library).
 */
import type { MouseEvent, ReactElement } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export type EngagementTargetType =
  | "sermon"
  | "article"
  | "journey_day"
  | "message";

export type EngagementAction =
  | "amen"
  | "helpful"
  | "save"
  | "share"
  | "download";

type Props = {
  targetType: EngagementTargetType;
  targetId: string;
  downloadUrl?: string;
  className?: string;
};

type IconProps = { filled: boolean };

/* ---------- Icons ---------- */

function CrossIcon({ filled }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 3h4v6h6v4h-6v8h-4v-8H4V9h6V3z" />
    </svg>
  );
}

function CheckIcon({ filled }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {filled ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5l2.5 2.5L16 9.5" stroke="var(--midnight-navy)" />
        </>
      ) : (
        <path d="M4 12.5l5 5L20 6.5" />
      )}
    </svg>
  );
}

function BookmarkIcon({ filled }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12v18l-6-4-6 4V3z" />
    </svg>
  );
}

function ShareIcon({ filled }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <path d="M12 3v13" />
      <path d="M7 8l5-5 5 5" />
    </svg>
  );
}

function DownloadIcon({ filled }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v13" />
      <path d="M7 11l5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  );
}

type ButtonSpec = {
  action: EngagementAction;
  label: string;
  Icon: (p: IconProps) => ReactElement;
};

const BUTTONS: ReadonlyArray<ButtonSpec> = [
  {
    action: "amen",
    label: "Amen",
    Icon: CrossIcon,
  },
  {
    action: "helpful",
    label: "Helpful",
    Icon: CheckIcon,
  },
  {
    action: "save",
    label: "Save",
    Icon: BookmarkIcon,
  },
  {
    action: "share",
    label: "Share",
    Icon: ShareIcon,
  },
];

type RecordOptions = {
  keepalive?: boolean;
};

function isShareAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function copyWithTextArea(text: string): boolean {
  if (typeof document === "undefined") return false;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  const nav = typeof navigator !== "undefined" ? navigator : null;
  if (nav?.clipboard?.writeText) {
    try {
      await nav.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the textarea copy path below.
    }
  }

  return copyWithTextArea(text);
}

export function EngagementActions({
  targetType,
  targetId,
  downloadUrl,
  className,
}: Props) {
  const [active, setActive] = useState<Record<EngagementAction, boolean>>({
    amen: false,
    helpful: false,
    save: false,
    share: false,
    download: false,
  });
  const [pending, setPending] = useState<Record<EngagementAction, boolean>>({
    amen: false,
    helpful: false,
    save: false,
    share: false,
    download: false,
  });
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, []);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => setNotice(null), 2200);
  }, []);

  const recordAction = useCallback(
    async (action: EngagementAction, options: RecordOptions = {}) => {
      const body = JSON.stringify({ targetType, targetId, action });

      try {
        if (
          options.keepalive &&
          typeof navigator !== "undefined" &&
          typeof navigator.sendBeacon === "function"
        ) {
          const blob = new Blob([body], { type: "application/json" });
          if (navigator.sendBeacon("/api/engagement", blob)) return;
        }

        await fetch("/api/engagement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          keepalive: options.keepalive,
          body,
        });
      } catch {
        // Fail soft — the local "thanks" state is the user's reward.
      }
    },
    [targetType, targetId],
  );

  const onActionClick = useCallback(
    async (action: EngagementAction) => {
      if (pending[action]) return;
      setPending((p) => ({ ...p, [action]: true }));

      if (action === "share") {
        const shareUrl =
          typeof window !== "undefined" ? window.location.href : "";
        const shareTitle =
          typeof document !== "undefined" ? document.title : "Hope of Glory";
        let sharedOrCopied = false;
        let shareCancelled = false;
        try {
          const nav = typeof navigator !== "undefined" ? navigator : null;
          if (nav && typeof nav.share === "function") {
            await nav.share({ title: shareTitle, url: shareUrl });
            sharedOrCopied = true;
          } else if (await copyToClipboard(shareUrl)) {
            sharedOrCopied = true;
            showNotice("Link copied");
          }
        } catch (err) {
          if (isShareAbort(err)) {
            shareCancelled = true;
          } else if (await copyToClipboard(shareUrl)) {
            sharedOrCopied = true;
            showNotice("Link copied");
          }
        }
        if (sharedOrCopied) {
          setActive((s) => ({ ...s, share: true }));
          await recordAction("share");
        } else if (!shareCancelled) {
          showNotice("Share unavailable");
        }
        setPending((p) => ({ ...p, share: false }));
        return;
      }

      // Toggle on (one-way for now — the server is idempotent).
      setActive((s) => ({ ...s, [action]: true }));
      await recordAction(action);
      setPending((p) => ({ ...p, [action]: false }));
    },
    [pending, recordAction, showNotice],
  );

  const onDownloadClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!downloadUrl || pending.download) {
        event.preventDefault();
        return;
      }

      setPending((p) => ({ ...p, download: true }));
      setActive((s) => ({ ...s, download: true }));

      void recordAction("download", { keepalive: true }).finally(() => {
        setPending((p) => ({ ...p, download: false }));
      });
    },
    [downloadUrl, pending.download, recordAction],
  );

  return (
    <section
      className={["mt-10", className].filter(Boolean).join(" ")}
      aria-labelledby="engagement-actions-heading"
    >
      <p id="engagement-actions-heading" className="card__eyebrow">
        Reactions
      </p>
      <div
        role="group"
        aria-label="Reactions"
        className="flex flex-wrap items-center gap-2 md:gap-3"
      >
        {BUTTONS.map(({ action, label, Icon }) => {
          const isActive = active[action];
          return (
            <button
              key={action}
              type="button"
              aria-label={label}
              aria-pressed={action === "share" ? undefined : isActive}
              onClick={() => onActionClick(action)}
              disabled={pending[action]}
              className="inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glory-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--deep-heaven)] disabled:opacity-60"
              style={{
                borderColor: isActive
                  ? "var(--glory-gold)"
                  : "var(--border-soft)",
                background: isActive
                  ? "var(--accent-soft)"
                  : "transparent",
                color: isActive ? "var(--glory-gold)" : "var(--warm-light)",
                minHeight: 44,
              }}
            >
              <span className="inline-flex" aria-hidden="true">
                <Icon filled={isActive} />
              </span>
              <span>{label}</span>
            </button>
          );
        })}

        {downloadUrl ? (
          <a
            href={downloadUrl}
            download
            onClick={onDownloadClick}
            aria-label="Download"
            className="inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glory-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--deep-heaven)]"
            style={{
              borderColor: active.download
                ? "var(--glory-gold)"
                : "var(--border-soft)",
              background: active.download
                ? "var(--accent-soft)"
                : "transparent",
              color: active.download
                ? "var(--glory-gold)"
                : "var(--warm-light)",
              minHeight: 44,
            }}
          >
            <span className="inline-flex" aria-hidden="true">
              <DownloadIcon filled={active.download} />
            </span>
            <span>Download</span>
          </a>
        ) : null}

        {notice ? (
          <span
            role="status"
            aria-live="polite"
            className="inline-flex items-center rounded-sm px-3 py-2 text-xs uppercase tracking-[0.12em]"
            style={{
              background: "var(--accent-soft)",
              color: "var(--glory-gold)",
              border: "1px solid var(--glory-gold)",
            }}
          >
            {notice}
          </span>
        ) : null}
      </div>
    </section>
  );
}

export default EngagementActions;
