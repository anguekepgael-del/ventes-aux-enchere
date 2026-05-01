import { NextResponse } from "next/server";
import {
  calculateBuyerDeposit,
  formatXaf,
  isValidCameroonMobileMoneyPhone,
  normalizeCameroonPhone,
} from "@/src/lib/marketplace-core";

const providers = new Set(["orange_money", "mtn_momo"]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        auctionId?: string;
        provider?: string;
        phone?: string;
        startPrice?: number;
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

  return NextResponse.json({
    id: `dep_${providerCode}_${body.auctionId}_${Date.now()}`,
    status: "pending_provider_confirmation",
    provider: body.provider,
    phone: normalizeCameroonPhone(body.phone),
    amount,
    amountLabel: formatXaf(amount),
    nextAction: "show_mobile_money_prompt",
  });
}
