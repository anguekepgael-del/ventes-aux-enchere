import type {
  Auction,
  Bid,
  BuyerProfile,
  Category,
  City,
  Dispute,
  Notification,
  Payment,
  SellerProfile,
  User,
  VerificationDocument,
} from "@prisma/client";
import type {
  AuctionRecord,
  BuyerRecord,
  CategoryRecord,
  CityRecord,
  DisputeRecord,
  NotificationRecord,
  PaymentRecord,
  SellerRecord,
  UserRecord,
  VerificationDocumentRecord,
} from "./api-types.js";

export function toNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }
  if (value && typeof value === "object" && "toNumber" in value && typeof value.toNumber === "function") {
    return value.toNumber();
  }
  return Number(value);
}

export function mapUser(user: User): UserRecord {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    city: user.city,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    identityStatus: user.identityStatus,
    suspended: user.suspended,
    createdAt: user.createdAt.toISOString(),
  };
}

export function mapSeller(seller: SellerProfile): SellerRecord {
  return {
    id: seller.id,
    userId: seller.userId,
    displayName: seller.displayName,
    type: seller.type,
    verificationStatus: seller.verificationStatus,
    trustBadges: seller.trustBadges,
    documentsRequested: seller.documentsRequested,
    createdAt: seller.createdAt.toISOString(),
  };
}

export function mapBuyer(buyer: BuyerProfile): BuyerRecord {
  return {
    id: buyer.id,
    userId: buyer.userId,
    walletBalance: toNumber(buyer.walletBalance),
    blockedDeposits: toNumber(buyer.blockedDeposits),
    activeBids: buyer.activeBids,
    disputesCount: buyer.disputesCount,
  };
}

export function mapAuction(auction: Auction & { bids?: Bid[] }): AuctionRecord {
  return {
    id: auction.id,
    sellerId: auction.sellerId,
    title: auction.title,
    category: auction.category,
    city: auction.city,
    startPrice: toNumber(auction.startPrice),
    currentPrice: toNumber(auction.currentPrice),
    minimumIncrement: toNumber(auction.minimumIncrement),
    reservePrice: toNumber(auction.reservePrice),
    buyNowPrice: auction.buyNowPrice === null ? undefined : toNumber(auction.buyNowPrice),
    status: auction.status,
    inspected: auction.inspected,
    documentValid: auction.documentValid,
    endsAt: auction.endsAt.toISOString(),
    bids: (auction.bids ?? []).map((bid) => ({
      buyerId: bid.buyerId,
      amount: toNumber(bid.amount),
      createdAt: bid.createdAt.toISOString(),
    })),
  };
}

export function mapPayment(payment: Payment): PaymentRecord {
  return {
    id: payment.id,
    buyerId: payment.buyerId,
    sellerId: payment.sellerId ?? undefined,
    auctionId: payment.auctionId ?? undefined,
    provider: payment.provider,
    purpose: payment.purpose,
    amount: toNumber(payment.amount),
    status: payment.status,
    externalReference: payment.externalReference ?? undefined,
    createdAt: payment.createdAt.toISOString(),
  };
}

export function mapDispute(dispute: Dispute): DisputeRecord {
  return {
    id: dispute.id,
    auctionId: dispute.auctionId,
    openedByUserId: dispute.openedByUserId,
    reason: dispute.reason,
    status: dispute.status,
    priority: dispute.priority,
    createdAt: dispute.createdAt.toISOString(),
  };
}

export function mapNotification(notification: Notification): NotificationRecord {
  return {
    id: notification.id,
    userId: notification.userId,
    channel: notification.channel,
    subject: notification.subject,
    body: notification.body,
    status: notification.status,
    createdAt: notification.createdAt.toISOString(),
  };
}

export function mapCategory(category: Category): CategoryRecord {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    riskLevel: category.riskLevel,
    enabled: category.enabled,
    createdAt: category.createdAt.toISOString(),
  };
}

export function mapCity(city: City): CityRecord {
  return {
    id: city.id,
    name: city.name,
    region: city.region ?? undefined,
    enabled: city.enabled,
    createdAt: city.createdAt.toISOString(),
  };
}

export function mapDocument(document: VerificationDocument): VerificationDocumentRecord {
  return {
    id: document.id,
    userId: document.userId ?? undefined,
    auctionId: document.auctionId ?? undefined,
    type: document.type,
    fileKey: document.fileKey,
    status: document.status,
    note: document.note ?? undefined,
    createdAt: document.createdAt.toISOString(),
  };
}
