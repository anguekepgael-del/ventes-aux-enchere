export type AuctionRules = {
  currentPrice: number;
  increment: number;
};

export type BidderTrustState = {
  identityVerified: boolean;
  phoneVerified: boolean;
};

export function formatXaf(amount: number) {
  const grouped = Math.round(amount)
    .toLocaleString("fr-FR")
    .replace(/\u202f/g, " ");
  return `${grouped} FCFA`;
}

export function getMinimumNextBid({ currentPrice, increment }: AuctionRules) {
  return currentPrice + increment;
}

export function calculateBuyerDeposit({
  startPrice,
  rate = 0.1,
  minimum = 25000,
}: {
  startPrice: number;
  rate?: number;
  minimum?: number;
}) {
  return Math.max(Math.round(startPrice * rate), minimum);
}

export function calculateCommission({
  finalPrice,
  rate = 0.075,
}: {
  finalPrice: number;
  rate?: number;
}) {
  return Math.round(finalPrice * rate);
}

export function calculateSellerPayout({
  finalPrice,
  commissionRate = 0.075,
}: {
  finalPrice: number;
  commissionRate?: number;
}) {
  const commission = calculateCommission({ finalPrice, rate: commissionRate });
  return {
    commission,
    payout: Math.max(finalPrice - commission, 0),
  };
}

export function normalizeCameroonPhone(phone: string) {
  return phone.replace(/[\s().-]/g, "").replace(/^00237/, "237").replace(/^\+237/, "237");
}

export function isValidCameroonMobileMoneyPhone(phone: string) {
  return /^2376\d{8}$/.test(normalizeCameroonPhone(phone));
}

export function getEscrowDecision({
  paymentCaptured,
  buyerConfirmed,
  disputeOpen,
  adminApproved,
}: {
  paymentCaptured: boolean;
  buyerConfirmed: boolean;
  disputeOpen: boolean;
  adminApproved: boolean;
}) {
  if (disputeOpen) {
    return "disputed";
  }

  if (paymentCaptured && buyerConfirmed && adminApproved) {
    return "releasable";
  }

  return "hold";
}

export function canPlaceBid({
  user,
  auction,
  bidAmount,
  depositPaid,
}: {
  user: BidderTrustState;
  auction: AuctionRules;
  bidAmount: number;
  depositPaid: boolean;
}) {
  if (!user.identityVerified) {
    return { allowed: false, reason: "identity verification required" };
  }

  if (!user.phoneVerified) {
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
