export const NOTCHPAY_API_BASE_URL = "https://api.notchpay.co";

export function buildNotchPayPaymentPayload({
  amount,
  currency,
  phone,
  email,
  reference,
  description,
  callback,
  channel,
  metadata,
}) {
  return {
    amount,
    currency,
    phone,
    email,
    description,
    reference,
    callback,
    locked_currency: currency,
    locked_channel: channel,
    locked_country: "CM",
    customer_meta: metadata,
  };
}

export function buildNotchPayMobileMoneyProcessPayload({ channel, phone, clientIp }) {
  return {
    channel,
    data: {
      phone,
      account_number: phone,
    },
    client_ip: clientIp,
  };
}

export function buildNotchPayRefundPayload({ payment, amount, reason, metadata }) {
  return {
    payment,
    ...(amount ? { amount } : {}),
    reason,
    ...(metadata ? { metadata } : {}),
  };
}

export function buildNotchPayTransferPayload({
  amount,
  currency,
  channel,
  reference,
  description,
  beneficiary,
  metadata,
}) {
  return {
    amount,
    currency,
    channel,
    reference,
    description,
    beneficiary_data: {
      name: beneficiary.name,
      phone: beneficiary.phone,
      ...(beneficiary.email ? { email: beneficiary.email } : {}),
      country: "CM",
    },
    ...(metadata ? { metadata } : {}),
  };
}

export function mapNotchPayPaymentStatus(status) {
  if (status === "complete") {
    return "captured";
  }

  if (status === "pending" || status === "processing") {
    return "authorized";
  }

  if (status === "canceled" || status === "expired" || status === "failed") {
    return "failed";
  }

  return "pending";
}
