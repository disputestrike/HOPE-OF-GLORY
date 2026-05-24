"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    PayPal?: {
      Donation?: { Button?: (opts: Record<string, unknown>) => { render: (selector: string) => void } };
    };
  }
}

export function PayPalDonateButton() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hostedButtonId = process.env.NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID;

  useEffect(() => {
    if (!hostedButtonId || !containerRef.current) return;

    const existing = document.querySelector('script[src*="paypalobjects.com/donate/sdk"]');
    const onReady = () => {
      window.PayPal?.Donation?.Button?.({
        env: "production",
        hosted_button_id: hostedButtonId,
        image: {
          src: "https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif",
          alt: "Donate with PayPal",
          title: "Support Hope of Glory Ministry",
        },
      })?.render("#paypal-donate-button");
    };

    if (existing) {
      onReady();
    } else {
      const s = document.createElement("script");
      s.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js";
      s.async = true;
      s.onload = onReady;
      document.body.appendChild(s);
    }
  }, [hostedButtonId]);

  if (!hostedButtonId) {
    return (
      <a
        href="https://www.paypal.com/donate"
        className="btn btn--primary"
        target="_blank"
        rel="noreferrer"
      >
        Give via PayPal
      </a>
    );
  }

  return <div id="paypal-donate-button" ref={containerRef} />;
}
