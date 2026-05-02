import { NextResponse } from "next/server";
import { formatXaf, isValidCameroonMobileMoneyPhone, normalizeCameroonPhone } from "@/src/lib/marketplace-core";
import {
  buildNotchPayMobileMoneyProcessPayload,
  buildNotchPayPaymentPayload,
  getNotchPayPublicHeaders,
  NOTCHPAY_API_BASE_URL,
  type NotchPayChannel,
} from "@/src/lib/notchpay";
import {
  getConfiguredNotchPayMobileMoneyConfig,
  getNotchPayMobileMoneyChannel,
} from "@/src/lib/payment-config";

export const runtime = "nodejs";

type MobileMoneyCheckoutPayload = {
  auctionId?: string;
  buyerId?: string;
  provider?: string;
  phone?: string;
  email?: string;
  buyerName?: string;
  amount?: number;
  purpose?: "deposit" | "winning_payment";
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as MobileMoneyCheckoutPayload | null;

  if (!body?.auctionId || !body.buyerId || !body.provider || !body.phone || !body.amount || body.amount <= 0) {
    return NextResponse.json(
      { error: "auctionId, buyerId, provider, phone and positive amount are required" },
      { status: 400 },
    );
  }

  if (!isValidCameroonMobileMoneyPhone(body.phone)) {
    return NextResponse.json({ error: "invalid Cameroon Mobile Money phone" }, { status: 400 });
  }

  const notchPay = getConfiguredNotchPayMobileMoneyConfig();
  if (!notchPay.publicKeyConfigured) {
    return NextResponse.json({ error: "NOTCHPAY_PUBLIC_KEY is required" }, { status: 503 });
  }

  const channel = getNotchPayMobileMoneyChannel(body.provider);
  if (!channel) {
    return NextResponse.json({ error: "unsupported Mobile Money provider" }, { status: 400 });
  }

  const normalizedPhone = normalizeCameroonPhone(body.phone);
  const providerCode = body.provider === "orange_money" ? "OM" : "MTN";
  const purpose = body.purpose ?? "winning_payment";
  const reference = `${purpose === "deposit" ? "dep" : "win"}_${providerCode}_${body.auctionId}_${Date.now()}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const callbackPath = process.env.NOTCHPAY_CALLBACK_PATH ?? "/operations";

  const paymentResponse = await fetch(`${NOTCHPAY_API_BASE_URL}/payments`, {
    method: "POST",
    headers: getNotchPayPublicHeaders(),
    body: JSON.stringify(
      buildNotchPayPaymentPayload({
        amount: body.amount,
        currency: notchPay.currency,
        phone: normalizedPhone,
        email: body.email,
        description: purpose === "deposit" ? `Caution enchere ${body.auctionId}` : `Paiement adjudication ${body.auctionId}`,
        reference,
        callback: `${appUrl}${callbackPath}?payment_provider=notchpay&reference=${reference}`,
        channel: channel as NotchPayChannel,
        metadata: {
          auctionId: body.auctionId,
          buyerId: body.buyerId,
          buyerName: body.buyerName,
          purpose,
          provider: body.provider,
        },
      }),
    ),
  });

  const paymentPayload = await paymentResponse.json().catch(() => null);
  if (!paymentResponse.ok) {
    return NextResponse.json(
      { error: "notchpay_payment_initialization_failed", details: paymentPayload },
      { status: 502 },
    );
  }

  const processResponse = await fetch(`${NOTCHPAY_API_BASE_URL}/payments/${reference}`, {
    method: "POST",
    headers: getNotchPayPublicHeaders(),
    body: JSON.stringify(
      buildNotchPayMobileMoneyProcessPayload({
        channel: channel as NotchPayChannel,
        phone: normalizedPhone,
        clientIp: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      }),
    ),
  });

  const processPayload = await processResponse.json().catch(() => null);

  return NextResponse.json({
    id: reference,
    gateway: "notchpay",
    provider: body.provider,
    channel,
    phone: normalizedPhone,
    purpose,
    amount: body.amount,
    amountLabel: formatXaf(body.amount),
    authorizationUrl: paymentPayload?.authorization_url,
    transaction: processPayload?.transaction ?? paymentPayload?.transaction,
    nextAction: processResponse.ok ? "confirm_mobile_money_prompt" : "redirect_to_notchpay_checkout",
    process: processPayload,
  });
}
