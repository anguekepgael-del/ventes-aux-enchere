import type { Auction, Bid, BuyerProfile, SellerProfile, User } from "@prisma/client";
import type { AuctionRecord, BuyerRecord, SellerRecord, UserRecord } from "./api-types.js";

function toNumber(value: unknown) {
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
