export function getStripeCardPaymentConfig({
  publishableKey,
  secretKey,
  currency = "xaf",
}) {
  const normalizedPublishableKey = publishableKey?.trim() ?? "";
  const normalizedSecretKey = secretKey?.trim() ?? "";

  return {
    provider: "stripe",
    mode: normalizedPublishableKey.startsWith("pk_live_") || normalizedPublishableKey.startsWith("pk_live.")
      ? "live"
      : "test",
    currency: currency.toLowerCase(),
    publishableKey: normalizedPublishableKey || undefined,
    publishableKeyConfigured: normalizedPublishableKey.startsWith("pk_"),
    serverCheckoutConfigured: normalizedSecretKey.startsWith("sk_"),
  };
}
