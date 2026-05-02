import { NextResponse } from "next/server";
import {
  getNotchPayPublicHeaders,
  mapNotchPayPaymentStatus,
  NOTCHPAY_API_BASE_URL,
} from "@/src/lib/notchpay";
import { getConfiguredNotchPayMobileMoneyConfig } from "@/src/lib/payment-config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { reference?: string } | null;

  if (!body?.reference) {
    return NextResponse.json({ error: "reference is required" }, { status: 400 });
  }

  if (!getConfiguredNotchPayMobileMoneyConfig().publicKeyConfigured) {
    return NextResponse.json({ error: "NOTCHPAY_PUBLIC_KEY is required" }, { status: 503 });
  }

  const response = await fetch(`${NOTCHPAY_API_BASE_URL}/payments/${encodeURIComponent(body.reference)}`, {
    headers: getNotchPayPublicHeaders(),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json({ error: "notchpay_payment_verification_failed", details: payload }, { status: 502 });
  }

  const transaction = payload?.transaction ?? payload?.payment ?? payload?.data;
  const providerStatus = transaction?.status ?? payload?.status;

  return NextResponse.json({
    reference: body.reference,
    gateway: "notchpay",
    providerStatus,
    internalStatus: mapNotchPayPaymentStatus(providerStatus),
    transaction,
  });
}
