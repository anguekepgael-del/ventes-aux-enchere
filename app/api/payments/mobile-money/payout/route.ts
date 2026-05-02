import { NextResponse } from "next/server";
import { isValidCameroonMobileMoneyPhone, normalizeCameroonPhone } from "@/src/lib/marketplace-core";
import {
  buildNotchPayTransferPayload,
  getNotchPayGrantHeaders,
  hasNotchPayGrantKey,
  hasNotchPayPublicKey,
  NOTCHPAY_API_BASE_URL,
  type NotchPayChannel,
} from "@/src/lib/notchpay";
import { getConfiguredNotchPayMobileMoneyConfig, getNotchPayMobileMoneyChannel } from "@/src/lib/payment-config";

export const runtime = "nodejs";

type PayoutPayload = {
  sellerId?: string;
  auctionId?: string;
  provider?: string;
  phone?: string;
  sellerName?: string;
  sellerEmail?: string;
  amount?: number;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as PayoutPayload | null;

  if (!body?.sellerId || !body.provider || !body.phone || !body.sellerName || !body.amount || body.amount <= 0) {
    return NextResponse.json(
      { error: "sellerId, provider, phone, sellerName and positive amount are required" },
      { status: 400 },
    );
  }

  if (!isValidCameroonMobileMoneyPhone(body.phone)) {
    return NextResponse.json({ error: "invalid Cameroon Mobile Money phone" }, { status: 400 });
  }

  if (!hasNotchPayPublicKey() || !hasNotchPayGrantKey()) {
    return NextResponse.json(
      { error: "NOTCHPAY_PUBLIC_KEY and NOTCHPAY_GRANT_KEY are required for seller payouts" },
      { status: 503 },
    );
  }

  const channel = getNotchPayMobileMoneyChannel(body.provider);
  if (!channel) {
    return NextResponse.json({ error: "unsupported payout provider" }, { status: 400 });
  }

  const normalizedPhone = normalizeCameroonPhone(body.phone);
  const config = getConfiguredNotchPayMobileMoneyConfig();
  const providerCode = body.provider === "orange_money" ? "OM" : "MTN";
  const reference = `payout_${providerCode}_${body.sellerId}_${Date.now()}`;

  const response = await fetch(`${NOTCHPAY_API_BASE_URL}/transfers`, {
    method: "POST",
    headers: getNotchPayGrantHeaders(),
    body: JSON.stringify(
      buildNotchPayTransferPayload({
        amount: body.amount,
        currency: config.currency,
        channel: channel as NotchPayChannel,
        reference,
        description: `Reversement vendeur ${body.sellerId}`,
        beneficiary: {
          name: body.sellerName,
          phone: normalizedPhone,
          email: body.sellerEmail,
        },
        metadata: {
          sellerId: body.sellerId,
          auctionId: body.auctionId,
          purpose: "seller_payout",
        },
      }),
    ),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    return NextResponse.json({ error: "notchpay_payout_failed", details: payload }, { status: 502 });
  }

  return NextResponse.json({
    gateway: "notchpay",
    status: "payout_requested",
    reference,
    transfer: payload?.transfer ?? payload?.data ?? payload,
  });
}
