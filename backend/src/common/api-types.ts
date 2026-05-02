export type UserRole =
  | "super_admin"
  | "admin"
  | "moderator"
  | "verification_agent"
  | "customer_support"
  | "finance"
  | "seller"
  | "buyer";

export type VerificationStatus = "pending" | "verified" | "rejected" | "suspended";
export type AuctionStatus = "draft" | "pending_review" | "live" | "closed" | "cancelled";
export type PaymentStatus = "pending" | "authorized" | "captured" | "escrowed" | "released" | "refunded" | "failed";
export type DisputeStatus = "open" | "in_review" | "resolved" | "rejected";
export type NotificationChannel = "email" | "sms" | "whatsapp" | "in_app";
export type DocumentStatus = "pending" | "valid" | "rejected" | "expired";

export type UserRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  identityStatus: VerificationStatus;
  suspended: boolean;
  createdAt: string;
};

export type SellerRecord = {
  id: string;
  userId: string;
  displayName: string;
  type: "individual" | "company" | "professional";
  verificationStatus: VerificationStatus;
  trustBadges: string[];
  documentsRequested: string[];
  createdAt: string;
};

export type BuyerRecord = {
  id: string;
  userId: string;
  walletBalance: number;
  blockedDeposits: number;
  activeBids: number;
  disputesCount: number;
};

export type AuctionRecord = {
  id: string;
  sellerId: string;
  title: string;
  category: string;
  city: string;
  startPrice: number;
  currentPrice: number;
  minimumIncrement: number;
  reservePrice: number;
  buyNowPrice?: number;
  status: AuctionStatus;
  inspected: boolean;
  documentValid: boolean;
  endsAt: string;
  bids: Array<{
    buyerId: string;
    amount: number;
    createdAt: string;
  }>;
};

export type PaymentRecord = {
  id: string;
  buyerId: string;
  sellerId?: string;
  auctionId?: string;
  provider: "orange_money" | "mtn_momo" | "card" | "bank_transfer" | "manual_admin";
  purpose: "deposit" | "winning_payment" | "refund" | "seller_payout";
  amount: number;
  status: PaymentStatus;
  externalReference?: string;
  createdAt: string;
};

export type DisputeRecord = {
  id: string;
  auctionId: string;
  openedByUserId: string;
  reason: string;
  status: DisputeStatus;
  priority: "low" | "medium" | "high";
  createdAt: string;
};

export type NotificationRecord = {
  id: string;
  userId: string;
  channel: NotificationChannel;
  subject: string;
  body: string;
  status: "queued" | "sent" | "failed";
  createdAt: string;
};

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  riskLevel: string;
  enabled: boolean;
  createdAt: string;
};

export type CityRecord = {
  id: string;
  name: string;
  region?: string;
  enabled: boolean;
  createdAt: string;
};

export type VerificationDocumentRecord = {
  id: string;
  userId?: string;
  auctionId?: string;
  type: string;
  fileKey: string;
  status: DocumentStatus;
  note?: string;
  createdAt: string;
};
