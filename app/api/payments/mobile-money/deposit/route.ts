import { NextResponse } from "next/server";
import {
  calculateBuyerDeposit,
  formatXaf,
  isValidCameroonMobileMoneyPhone,
  normalizeCameroonPhone,
} from "@/src/lib/marketplace-core";
import {
  getConfiguredNotchPayMobileMoneyConfig,
  getNotchPayMobileMoneyChannel,
} from "@/src/lib/payment-config";
import {
  buildNotchPayMobileMoneyProcessPayload,
  buildNotchPayPaymentPayload,
  getNotchPayPublicHeaders,
  NOTCHPAY_API_BASE_URL,
  type NotchPayChannel,
} from "@/src/lib/notchpay";

export const runtime = "nodejs";

const providers = new Set(["orange_money", "mtn_momo"]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        auctionId?: string;
        provider?: string;
        phone?: string;
        startPrice?: number;
        email?: string;
        buyerName?: string;
      }
    | null;

  if (!body?.auctionId || !body.provider || !body.phone || !body.startPrice) {
    return NextResponse.json(
      { error: "auctionId, provider, phone and startPrice are required" },
      { status: 400 },
    );
  }

  if (!providers.has(body.provider)) {
    return NextResponse.json({ error: "unsupported Mobile Money provider" }, { status: 400 });
  }

  if (!isValidCameroonMobileMoneyPhone(body.phone)) {
    return NextResponse.json({ error: "invalid Cameroon Mobile Money phone" }, { status: 400 });
  }

  const amount = calculateBuyerDeposit({ startPrice: body.startPrice });
  const providerCode = body.provider === "orange_money" ? "OM" : "MTN";
  const normalizedPhone = normalizeCameroonPhone(body.phone);
  const notchPay = getConfiguredNotchPayMobileMoneyConfig();
  const channel = getNotchPayMobileMoneyChannel(body.provider);

  if (notchPay.publicKeyConfigured && channel) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const callbackPath = process.env.NOTCHPAY_CALLBACK_PATH ?? "/operations";
    const reference = `dep_${providerCode}_${body.auctionId}_${Date.now()}`;

    const paymentPayload = buildNotchPayPaymentPayload({
      amount,
      currency: notchPay.currency,
      phone: normalizedPhone,
      email: body.email,
      description: `Caution enchere ${body.auctionId}`,
      reference,
      callback: `${appUrl}${callbackPath}?payment_provider=notchpay&reference=${reference}`,
      channel: channel as NotchPayChannel,
      metadata: {
        buyerName: body.buyerName,
        auctionId: body.auctionId,
        purpose: "deposit",
        provider: body.provider,
      },
    });

    const response = await fetch(`${NOTCHPAY_API_BASE_URL}/payments`, {
      method: "POST",
      headers: getNotchPayPublicHeaders(),
      body: JSON.stringify(paymentPayload),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        {
          error: "notchpay_payment_initialization_failed",
          details: payload,
        },
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
      status: "pending_provider_confirmation",
      provider: body.provider,
      gateway: "notchpay",
      channel,
      phone: normalizedPhone,
      amount,
      amountLabel: formatXaf(amount),
      authorizationUrl: payload?.authorization_url,
      transaction: processPayload?.transaction ?? payload?.transaction,
      nextAction: processResponse.ok ? "confirm_mobile_money_prompt" : "redirect_to_notchpay_checkout",
      process: processPayload,
    });
  }

  return NextResponse.json({
    id: `dep_${providerCode}_${body.auctionId}_${Date.now()}`,
    status: "pending_provider_confirmation",
    provider: body.provider,
    gateway: "sandbox",
    phone: normalizedPhone,
    amount,
    amountLabel: formatXaf(amount),
    nextAction: "show_mobile_money_prompt",
  });
}
