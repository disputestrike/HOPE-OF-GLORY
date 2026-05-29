/**
 * PayPal webhook receiver.
 *
 * Verification: PayPal signs the request with the cert at `cert_url`. We
 * forward to PayPal's verify-webhook-signature endpoint to confirm.
 */
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { optionalDb } from "@/lib/server-db";
import { logJobRun } from "@/lib/ops";
import { publicRateLimit, rateLimitResponse, requestId } from "@/lib/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function verifySignature(headers: Headers, body: string): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!webhookId || !clientId || !secret) return false;

  // 1. Get OAuth access token
  const base = process.env.PAYPAL_API_BASE ?? "https://api-m.paypal.com";
  const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
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
  const verifyRes = await fetch(`${base}/v1/notifications/verify-webhook-signature`, {
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
  const rl = publicRateLimit(request, "paypal-webhook", { limit: 120, windowMs: 60 * 1000 });
  if (!rl.ok) return rateLimitResponse(rl);

  const correlationId = requestId(request);
  const raw = await request.text();
  const verified = await verifySignature(request.headers, raw).catch(() => false);
  const database = await optionalDb("paypal-webhook");

  await logJobRun({
    jobName: "paypal_webhook",
    queue: "webhooks",
    status: verified ? "succeeded" : "failed",
    payload: { verified, length: raw.length },
    correlationId,
  });

  if (!verified) {
    return NextResponse.json({ error: "signature failed" }, { status: 401 });
  }

  const event = JSON.parse(raw) as {
    id?: string;
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
    await database
      ?.execute(sql`
        INSERT INTO donations (
          provider, provider_txn_id, amount, currency, donor_email, donor_name,
          is_recurring, status, webhook_received_at, metadata
        )
        VALUES (
          'paypal',
          ${event.resource.id ?? event.id ?? ""},
          ${amt?.value ?? "0"}::numeric,
          ${amt?.currency_code ?? "USD"},
          ${payer?.email_address ?? null},
          ${[payer?.name?.given_name, payer?.name?.surname].filter(Boolean).join(" ") || null},
          ${Boolean(event.resource.billing_agreement_id ?? event.resource.custom_id === "monthly")},
          'succeeded',
          now(),
          ${JSON.stringify({ eventId: event.id, eventType: event.event_type, correlationId })}::jsonb
        )
        ON CONFLICT DO NOTHING
      `)
      .catch(() => undefined);
  } else if (event.event_type === "PAYMENT.CAPTURE.REFUNDED") {
    await database
      ?.execute(sql`UPDATE donations SET status = 'refunded' WHERE provider_txn_id = ${event.resource.id ?? ""}`)
      .catch(() => undefined);
  } else if (event.event_type === "PAYMENT.CAPTURE.DENIED" || event.event_type === "PAYMENT.CAPTURE.REVERSED") {
    await database
      ?.execute(sql`UPDATE donations SET status = 'failed' WHERE provider_txn_id = ${event.resource.id ?? ""}`)
      .catch(() => undefined);
  }

  return NextResponse.json({ ok: true });
}
