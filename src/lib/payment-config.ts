export function getStripeCardPaymentConfig({
  publishableKey,
  secretKey,
  currency = "xaf",
}: {
  publishableKey?: string;
  secretKey?: string;
  currency?: string;
}) {
  const normalizedPublishableKey = publishableKey?.trim() ?? "";
  const normalizedSecretKey = secretKey?.trim() ?? "";

  return {
    provider: "stripe" as const,
    mode:
      normalizedPublishableKey.startsWith("pk_live_") || normalizedPublishableKey.startsWith("pk_live.")
        ? ("live" as const)
        : ("test" as const),
    currency: currency.toLowerCase(),
    publishableKey: normalizedPublishableKey || undefined,
    publishableKeyConfigured: normalizedPublishableKey.startsWith("pk_"),
    serverCheckoutConfigured: normalizedSecretKey.startsWith("sk_"),
  };
}

export function getConfiguredStripeCardPaymentConfig() {
  return getStripeCardPaymentConfig({
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    currency: process.env.STRIPE_CARD_CURRENCY,
  });
}
