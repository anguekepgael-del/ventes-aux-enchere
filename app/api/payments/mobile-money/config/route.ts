import { NextResponse } from "next/server";
import { getConfiguredNotchPayMobileMoneyConfig } from "@/src/lib/payment-config";

export function GET() {
  const config = getConfiguredNotchPayMobileMoneyConfig();

  return NextResponse.json({
    ...config,
    channels: {
      orange_money: "cm.orange",
      mtn_momo: "cm.mtn",
    },
    checkoutStrategy: "notchpay_mobile_money",
    note: config.publicKeyConfigured
      ? "NotchPay Mobile Money est configure cote serveur."
      : "Ajoutez NOTCHPAY_PUBLIC_KEY cote serveur pour activer NotchPay.",
  });
}
