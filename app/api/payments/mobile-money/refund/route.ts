import { NextResponse } from "next/server";
import {
  buildNotchPayRefundPayload,
  getNotchPayGrantHeaders,
  hasNotchPayGrantKey,
  hasNotchPayPublicKey,
  NOTCHPAY_API_BASE_URL,
} from "@/src/lib/notchpay";

export const runtime = "nodejs";

type RefundPayload = {
  payment?: string;
  amount?: number;
  reason?: string;
  auctionId?: string;
  buyerId?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RefundPayload | null;

  if (!body?.payment || !body.reason) {
    return NextResponse.json({ error: "payment and reason are required" }, { status: 400 });
  }

  if (!hasNotchPayPublicKey() || !hasNotchPayGrantKey()) {
    return NextResponse.json(
      { error: "NOTCHPAY_PUBLIC_KEY and NOTCHPAY_GRANT_KEY are required for refunds" },
      { status: 503 },
    );
  }

  const response = await fetch(`${NOTCHPAY_API_BASE_URL}/refunds`, {
    method: "POST",
    headers: getNotchPayGrantHeaders(),
    body: JSON.stringify(
      buildNotchPayRefundPayload({
        payment: body.payment,
        amount: body.amount,
        reason: body.reason,
        metadata: {
          auctionId: body.auctionId,
          buyerId: body.buyerId,
          purpose: "refund",
        },
      }),
    ),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    return NextResponse.json({ error: "notchpay_refund_failed", details: payload }, { status: 502 });
  }

  return NextResponse.json({
    gateway: "notchpay",
    status: "refund_requested",
    refund: payload?.refund ?? payload?.data ?? payload,
  });
}
