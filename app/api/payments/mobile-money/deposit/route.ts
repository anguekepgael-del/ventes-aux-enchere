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

    const response = await fetch("https://api.notchpay.co/payments", {
      method: "POST",
      headers: {
        Authorization: process.env.NOTCHPAY_PUBLIC_KEY ?? "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: notchPay.currency,
        phone: normalizedPhone,
        email: body.email,
        description: `Caution enchere ${body.auctionId}`,
        reference,
        callback: `${appUrl}${callbackPath}?payment_provider=notchpay&reference=${reference}`,
        locked_currency: notchPay.currency,
        locked_channel: channel,
        locked_country: "CM",
        customer_meta: {
          buyerName: body.buyerName,
          auctionId: body.auctionId,
          purpose: "deposit",
          provider: body.provider,
        },
      }),
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
      transaction: payload?.transaction,
      nextAction: payload?.authorization_url ? "redirect_to_notchpay_checkout" : "show_mobile_money_prompt",
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
