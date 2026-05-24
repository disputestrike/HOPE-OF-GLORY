/**
 * PayPal webhook receiver. Logs every event to provider_usage for audit.
 *
 * Verification: PayPal signs the request with the cert at `cert_url`. We
 * forward to PayPal's verify-webhook-signature endpoint to confirm.
 */
import { NextResponse } from "next/server";
import { db } from "@hog/db";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function verifySignature(headers: Headers, body: string): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!webhookId || !clientId || !secret) return false;

  // 1. Get OAuth access token
  const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!tokenRes.ok) return false;
  const { access_token } = (await tokenRes.json()) as { access_token: string };

  // 2. Verify signature
  const verifyRes = await fetch("https://api-m.paypal.com/v1/notifications/verify-webhook-signature", {
    method: "POST",
    headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }),
  });
  if (!verifyRes.ok) return false;
  const { verification_status } = (await verifyRes.json()) as { verification_status: string };
  return verification_status === "SUCCESS";
}

export async function POST(request: Request) {
  const raw = await request.text();
  const verified = await verifySignature(request.headers, raw).catch(() => false);

  await db
    .execute(sql`
      INSERT INTO provider_usage (provider, model, http_status)
      VALUES ('paypal_webhook', ${verified ? "verified" : "unverified"}, ${verified ? 200 : 401})
    `)
    .catch(() => undefined);

  if (!verified) {
    return NextResponse.json({ error: "signature failed" }, { status: 401 });
  }

  const event = JSON.parse(raw) as {
    event_type: string;
    resource: Record<string, unknown> & {
      id?: string;
      amount?: { value?: string; currency_code?: string };
      payer?: { email_address?: string; name?: { given_name?: string; surname?: string } };
      custom_id?: string;
    };
  };

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const amt = event.resource.amount;
    const payer = event.resource.payer;
    await db
      .execute(sql`
        INSERT INTO donations (provider, provider_txn_id, amount, currency, donor_email, donor_name, status, webhook_received_at)
        VALUES (
          'paypal',
          ${event.resource.id ?? ""},
          ${amt?.value ?? "0"}::numeric,
          ${amt?.currency_code ?? "USD"},
          ${payer?.email_address ?? null},
          ${[payer?.name?.given_name, payer?.name?.surname].filter(Boolean).join(" ") || null},
          'completed',
          now()
        )
        ON CONFLICT DO NOTHING
      `)
      .catch(() => undefined);
  } else if (event.event_type === "PAYMENT.CAPTURE.REFUNDED") {
    await db
      .execute(sql`UPDATE donations SET status = 'refunded' WHERE provider_txn_id = ${event.resource.id ?? ""}`)
      .catch(() => undefined);
  }

  return NextResponse.json({ ok: true });
}
