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

export function getNotchPayMobileMoneyConfig({ publicKey, currency = "XAF" }) {
  const normalizedPublicKey = publicKey?.trim() ?? "";

  return {
    provider: "notchpay",
    mode: normalizedPublicKey.includes("live") ? "live" : "test",
    currency: currency.toUpperCase(),
    publicKeyConfigured: Boolean(normalizedPublicKey),
  };
}

export function getNotchPayMobileMoneyChannel(provider) {
  if (provider === "orange_money") {
    return "cm.orange";
  }

  if (provider === "mtn_momo") {
    return "cm.mtn";
  }

  return undefined;
}
