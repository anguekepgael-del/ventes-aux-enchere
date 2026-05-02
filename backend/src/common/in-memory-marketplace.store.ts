import { Injectable } from "@nestjs/common";
import type {
  AuctionRecord,
  BuyerRecord,
  DisputeRecord,
  NotificationRecord,
  PaymentRecord,
  SellerRecord,
  UserRecord,
} from "./api-types.js";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

@Injectable()
export class InMemoryMarketplaceStore {
  readonly users: UserRecord[] = [
    {
      id: "user_buyer_demo",
      fullName: "Jean Fotso",
      email: "jean@enchere.cm",
      phone: "+237699000111",
      role: "buyer",
      city: "Douala",
      emailVerified: true,
      phoneVerified: true,
      identityStatus: "verified",
      suspended: false,
      createdAt: now(),
    },
    {
      id: "user_seller_demo",
      fullName: "Kamer Digital SARL",
      email: "seller@enchere.cm",
      phone: "+237677000222",
      role: "seller",
      city: "Yaounde",
      emailVerified: true,
      phoneVerified: true,
      identityStatus: "verified",
      suspended: false,
      createdAt: now(),
    },
  ];

  readonly sellers: SellerRecord[] = [
    {
      id: "seller_demo",
      userId: "user_seller_demo",
      displayName: "Kamer Digital SARL",
      type: "company",
      verificationStatus: "verified",
      trustBadges: ["Vendeur verifie", "Document valide"],
      documentsRequested: [],
      createdAt: now(),
    },
  ];

  readonly buyers: BuyerRecord[] = [
    {
      id: "buyer_demo",
      userId: "user_buyer_demo",
      walletBalance: 2450000,
      blockedDeposits: 125000,
      activeBids: 3,
      disputesCount: 1,
    },
  ];

  readonly auctions: AuctionRecord[] = [
    {
      id: "auction_demo",
      sellerId: "seller_demo",
      title: "iPhone 14 Pro Max 256 Go",
      category: "Telephones",
      city: "Douala",
      startPrice: 650000,
      currentPrice: 840000,
      minimumIncrement: 25000,
      reservePrice: 900000,
      buyNowPrice: 1180000,
      status: "live",
      inspected: true,
      documentValid: true,
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
      bids: [],
    },
  ];

  readonly payments: PaymentRecord[] = [];
  readonly disputes: DisputeRecord[] = [];
  readonly notifications: NotificationRecord[] = [];

  nextId(prefix: string) {
    return id(prefix);
  }

  timestamp() {
    return now();
  }
}
