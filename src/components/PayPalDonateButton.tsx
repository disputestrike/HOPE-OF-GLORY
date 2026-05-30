"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    PayPal?: {
      Donation?: {
        Button?: (opts: Record<string, unknown>) => { render: (selector: string) => void };
      };
    };
  }
}

export type PayPalDonateMode = "once" | "monthly";

interface PayPalDonateButtonProps {
  mode?: PayPalDonateMode;
}

/**
 * Renders a PayPal Donate hosted button for either a one-time gift or a
 * recurring monthly gift. Both variants can mount on the same page because
 * each one renders into a mode-scoped DOM id.
 *
 * Env vars (NEXT_PUBLIC, exposed to the client):
 *   - NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID_ONCE     — one-time gift button id
 *   - NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID_MONTHLY  — monthly gift button id
 *   - NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID          — legacy alias, used as a
 *                                                    fallback for mode="once"
 *                                                    only, so older config
 *                                                    keeps working.
 *
 * When no hosted button id is available, we render a plain status message
 * instead of sending donors to an unconfigured generic PayPal page.
 */
export function PayPalDonateButton({ mode = "once" }: PayPalDonateButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderedButtonIdRef = useRef<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  const onceId =
    process.env.NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID_ONCE ??
    process.env.NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID ??
    "";
  const monthlyId = process.env.NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID_MONTHLY ?? "";

  const hostedButtonId = mode === "monthly" ? monthlyId : onceId;
  const elementId =
    mode === "monthly" ? "paypal-donate-button-monthly" : "paypal-donate-button-once";
  const buttonLabel = mode === "monthly" ? "Give monthly via PayPal" : "Give once via PayPal";
  const unavailableLabel =
    mode === "monthly"
      ? "Monthly giving is not active yet."
      : "Online giving is not active yet.";

  useEffect(() => {
    const container = containerRef.current;
    if (!hostedButtonId || !container) return;

    const SDK_SELECTOR = 'script[src*="paypalobjects.com/donate/sdk"]';
    let cancelled = false;
    const handleLoadError = () => {
      if (!cancelled) setLoadFailed(true);
    };

    const renderButton = () => {
      if (cancelled || !containerRef.current) return;
      if (renderedButtonIdRef.current === hostedButtonId) return;

      const button = window.PayPal?.Donation?.Button?.({
        env: "production",
        hosted_button_id: hostedButtonId,
        image: {
          src: "https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif",
          alt: buttonLabel,
          title: "Support Hope of Glory Ministry",
        },
      });

      if (!button) return;

      containerRef.current.innerHTML = "";
      button.render(`#${elementId}`);
      renderedButtonIdRef.current = hostedButtonId;
    };

    if (window.PayPal?.Donation?.Button) {
      renderButton();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(SDK_SELECTOR);

    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js";
      script.async = true;
      document.body.appendChild(script);
    }

    script.addEventListener("load", renderButton, { once: true });
    script.addEventListener("error", handleLoadError, { once: true });

    return () => {
      cancelled = true;
      script?.removeEventListener("load", renderButton);
      script?.removeEventListener("error", handleLoadError);
    };
  }, [hostedButtonId, elementId, buttonLabel]);

  if (!hostedButtonId) {
    return (
      <p className="m-0 text-muted text-sm" role="status">
        {unavailableLabel} Please check back after the donation setup is
        complete.
      </p>
    );
  }

  if (loadFailed) {
    return (
      <p className="m-0 text-muted text-sm" role="status">
        PayPal did not load. Please try again later or contact{" "}
        <a href="mailto:hello@hopeofglory.ministry" className="text-gold">
          hello@hopeofglory.ministry
        </a>
        .
      </p>
    );
  }

  return <div id={elementId} ref={containerRef} aria-label={buttonLabel} />;
}
