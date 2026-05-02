import { NextResponse } from "next/server";
import { getConfiguredStripeCardPaymentConfig } from "@/src/lib/payment-config";

export const runtime = "nodejs";

type CheckoutPayload = {
  auctionId?: string;
  buyerId?: string;
  label?: string;
  amount?: number;
  purpose?: "deposit" | "winning_payment";
};

function encodeStripeForm(data: Record<string, string | number>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    params.append(key, String(value));
  }
  return params;
}

export async function POST(request: Request) {
  const config = getConfiguredStripeCardPaymentConfig();
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!config.publishableKeyConfigured) {
    return NextResponse.json({ error: "Stripe publishable key is not configured" }, { status: 503 });
  }

  if (!secretKey?.startsWith("sk_")) {
    return NextResponse.json(
      {
        error: "Stripe server checkout is not configured",
        nextStep: "Add STRIPE_SECRET_KEY on the server or in Vercel environment variables.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;
  if (!body?.auctionId || !body.buyerId || !body.amount || body.amount <= 0) {
    return NextResponse.json({ error: "auctionId, buyerId and positive amount are required" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const label = body.label ?? (body.purpose === "winning_payment" ? "Paiement adjudication" : "Caution enchere");

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodeStripeForm({
      mode: "payment",
      "line_items[0][quantity]": 1,
      "line_items[0][price_data][currency]": config.currency,
      "line_items[0][price_data][product_data][name]": label,
      "line_items[0][price_data][unit_amount]": Math.round(body.amount),
      success_url: `${appUrl}/operations?payment=success&auction=${body.auctionId}`,
      cancel_url: `${appUrl}/operations?payment=cancelled&auction=${body.auctionId}`,
      "metadata[auctionId]": body.auctionId,
      "metadata[buyerId]": body.buyerId,
      "metadata[purpose]": body.purpose ?? "deposit",
    }),
  });

  const payload = await stripeResponse.json();
  if (!stripeResponse.ok) {
    return NextResponse.json({ error: "Stripe checkout session creation failed", details: payload }, { status: 502 });
  }

  return NextResponse.json({
    id: payload.id,
    url: payload.url,
    provider: "stripe",
    status: "checkout_session_created",
  });
}
