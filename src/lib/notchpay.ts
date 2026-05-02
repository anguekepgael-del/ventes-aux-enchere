export const NOTCHPAY_API_BASE_URL = "https://api.notchpay.co";

export type NotchPayChannel = "cm.orange" | "cm.mtn" | "cm.mobile";

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
}: {
  amount: number;
  currency: string;
  phone: string;
  email?: string;
  reference: string;
  description: string;
  callback: string;
  channel: NotchPayChannel;
  metadata?: Record<string, unknown>;
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

export function buildNotchPayMobileMoneyProcessPayload({
  channel,
  phone,
  clientIp,
}: {
  channel: NotchPayChannel;
  phone: string;
  clientIp?: string;
}) {
  return {
    channel,
    data: {
      phone,
      account_number: phone,
    },
    client_ip: clientIp,
  };
}

export function buildNotchPayRefundPayload({
  payment,
  amount,
  reason,
  metadata,
}: {
  payment: string;
  amount?: number;
  reason: string;
  metadata?: Record<string, unknown>;
}) {
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
}: {
  amount: number;
  currency: string;
  channel: NotchPayChannel;
  reference: string;
  description: string;
  beneficiary: {
    name: string;
    phone: string;
    email?: string;
  };
  metadata?: Record<string, unknown>;
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

export function mapNotchPayPaymentStatus(status?: string) {
  if (status === "complete") {
    return "captured" as const;
  }

  if (status === "pending" || status === "processing") {
    return "authorized" as const;
  }

  if (status === "canceled" || status === "expired" || status === "failed") {
    return "failed" as const;
  }

  return "pending" as const;
}

export function getNotchPayPublicHeaders() {
  return {
    Authorization: process.env.NOTCHPAY_PUBLIC_KEY ?? "",
    "Content-Type": "application/json",
  };
}

export function getNotchPayGrantHeaders() {
  return {
    ...getNotchPayPublicHeaders(),
    "X-Grant": process.env.NOTCHPAY_GRANT_KEY ?? "",
  };
}

export function hasNotchPayPublicKey() {
  return Boolean(process.env.NOTCHPAY_PUBLIC_KEY?.trim());
}

export function hasNotchPayGrantKey() {
  return Boolean(process.env.NOTCHPAY_GRANT_KEY?.trim());
}
