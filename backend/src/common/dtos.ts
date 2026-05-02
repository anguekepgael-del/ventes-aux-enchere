import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";
import type { NotificationChannel, UserRole } from "./api-types.js";

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsIn(["seller", "buyer", "admin", "moderator", "verification_agent", "customer_support", "finance", "super_admin"])
  role: UserRole;

  @IsString()
  city: string;
}

export class VerifyUserDto {
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  phoneVerified?: boolean;

  @IsOptional()
  @IsIn(["pending", "verified", "rejected", "suspended"])
  identityStatus?: "pending" | "verified" | "rejected" | "suspended";
}

export class CreateSellerDto {
  @IsString()
  userId: string;

  @IsString()
  displayName: string;

  @IsIn(["individual", "company", "professional"])
  type: "individual" | "company" | "professional";
}

export class ReviewSellerDto {
  @IsIn(["pending", "verified", "rejected", "suspended"])
  verificationStatus: "pending" | "verified" | "rejected" | "suspended";

  @IsOptional()
  @IsString({ each: true })
  trustBadges?: string[];
}

export class RequestDocumentsDto {
  @IsString({ each: true })
  documents: string[];
}

export class CreateBuyerDto {
  @IsString()
  userId: string;
}

export class CreateAuctionDto {
  @IsString()
  sellerId: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsString()
  city: string;

  @IsNumber()
  @Min(0)
  startPrice: number;

  @IsNumber()
  @Min(0)
  minimumIncrement: number;

  @IsNumber()
  @Min(0)
  reservePrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  buyNowPrice?: number;
}

export class ReviewAuctionDto {
  @IsIn(["draft", "pending_review", "live", "closed", "cancelled"])
  status: "draft" | "pending_review" | "live" | "closed" | "cancelled";

  @IsOptional()
  @IsBoolean()
  inspected?: boolean;

  @IsOptional()
  @IsBoolean()
  documentValid?: boolean;
}

export class PlaceBidDto {
  @IsString()
  buyerId: string;

  @IsNumber()
  @Min(0)
  amount: number;
}

export class CreatePaymentDto {
  @IsString()
  buyerId: string;

  @IsOptional()
  @IsString()
  sellerId?: string;

  @IsOptional()
  @IsString()
  auctionId?: string;

  @IsIn(["orange_money", "mtn_momo", "card", "bank_transfer", "manual_admin"])
  provider: "orange_money" | "mtn_momo" | "card" | "bank_transfer" | "manual_admin";

  @IsIn(["deposit", "winning_payment", "refund", "seller_payout"])
  purpose: "deposit" | "winning_payment" | "refund" | "seller_payout";

  @IsNumber()
  @Min(0)
  amount: number;
}

export class UpdatePaymentStatusDto {
  @IsIn(["pending", "authorized", "captured", "escrowed", "released", "refunded", "failed"])
  status: "pending" | "authorized" | "captured" | "escrowed" | "released" | "refunded" | "failed";

  @IsOptional()
  @IsString()
  externalReference?: string;
}

export class CreateDisputeDto {
  @IsString()
  auctionId: string;

  @IsString()
  openedByUserId: string;

  @IsString()
  reason: string;

  @IsIn(["low", "medium", "high"])
  priority: "low" | "medium" | "high";
}

export class UpdateDisputeDto {
  @IsIn(["open", "in_review", "resolved", "rejected"])
  status: "open" | "in_review" | "resolved" | "rejected";
}

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsIn(["email", "sms", "whatsapp", "in_app"])
  channel: NotificationChannel;

  @IsString()
  subject: string;

  @IsString()
  body: string;
}

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  riskLevel?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  riskLevel?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class CreateCityDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateCityDto {
  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class CreateVerificationDocumentDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  auctionId?: string;

  @IsString()
  type: string;

  @IsString()
  fileKey: string;
}

export class ReviewVerificationDocumentDto {
  @IsIn(["pending", "valid", "rejected", "expired"])
  status: "pending" | "valid" | "rejected" | "expired";

  @IsOptional()
  @IsString()
  note?: string;
}
