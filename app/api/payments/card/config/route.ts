import { NextResponse } from "next/server";
import { getConfiguredStripeCardPaymentConfig } from "@/src/lib/payment-config";

export function GET() {
  const config = getConfiguredStripeCardPaymentConfig();

  return NextResponse.json({
    ...config,
    checkoutStrategy: "stripe_checkout",
    note: config.serverCheckoutConfigured
      ? "Stripe Checkout peut creer des sessions serveur."
      : "Ajoutez STRIPE_SECRET_KEY cote serveur pour creer des sessions Checkout.",
  });
}
