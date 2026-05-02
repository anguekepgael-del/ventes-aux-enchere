export function formatXaf(amount) {
  const grouped = Math.round(amount)
    .toLocaleString("fr-FR")
    .replace(/\u202f/g, " ");
  return `${grouped} FCFA`;
}

export function getMinimumNextBid({ currentPrice, increment }) {
  return currentPrice + increment;
}

export function calculateBuyerDeposit({ startPrice, rate, minimum }) {
  if (rate !== undefined || minimum !== undefined) {
    return Math.max(Math.round(startPrice * (rate ?? 0.1)), minimum ?? 0);
  }

  return getDepositPolicy({ startPrice }).amount;
}

export function getDepositPolicy({ startPrice }) {
  if (startPrice < 50000) {
    return {
      amount: 0,
      required: false,
      status: "optional",
      verification: "standard",
    };
  }

  if (startPrice <= 200000) {
    return {
      amount: 5000,
      required: true,
      status: "blocked",
      verification: "standard",
    };
  }

  return {
    amount: Math.round(startPrice * 0.1),
    required: true,
    status: "blocked",
    verification: startPrice > 1000000 ? "enhanced" : "standard",
  };
}

export function calculateCommission({ finalPrice, rate = 0.075 }) {
  return Math.round(finalPrice * rate);
}

export function calculateSellerPayout({ finalPrice, commissionRate = 0.075 }) {
  const commission = calculateCommission({ finalPrice, rate: commissionRate });
  return {
    commission,
    payout: Math.max(finalPrice - commission, 0),
  };
}

export function normalizeCameroonPhone(phone) {
  return phone.replace(/[\s().-]/g, "").replace(/^00237/, "237").replace(/^\+237/, "237");
}

export function isValidCameroonMobileMoneyPhone(phone) {
  return /^2376\d{8}$/.test(normalizeCameroonPhone(phone));
}

export function getEscrowDecision({
  paymentCaptured,
  buyerConfirmed,
  disputeOpen,
  adminApproved,
}) {
  if (disputeOpen) {
    return "disputed";
  }

  if (paymentCaptured && buyerConfirmed && adminApproved) {
    return "releasable";
  }

  return "hold";
}

export function getAntiSnipingEndTime({
  auctionEndsAt,
  bidAt,
  windowMinutes = 2,
  extensionMinutes = 3,
}) {
  const windowMs = windowMinutes * 60 * 1000;
  const extensionMs = extensionMinutes * 60 * 1000;
  const remainingMs = auctionEndsAt.getTime() - bidAt.getTime();

  if (remainingMs >= 0 && remainingMs <= windowMs) {
    return new Date(auctionEndsAt.getTime() + extensionMs);
  }

  return auctionEndsAt;
}

export function canPlaceBid({ user, auction, bidAmount, depositPaid }) {
  if (!user?.identityVerified) {
    return { allowed: false, reason: "identity verification required" };
  }

  if (!user?.phoneVerified) {
    return { allowed: false, reason: "phone verification required" };
  }

  if (!depositPaid) {
    return { allowed: false, reason: "deposit required before bidding" };
  }

  const minimumBid = getMinimumNextBid(auction);
  if (bidAmount < minimumBid) {
    return { allowed: false, reason: `minimum bid is ${formatXaf(minimumBid)}` };
  }

  return { allowed: true, reason: "eligible" };
}
