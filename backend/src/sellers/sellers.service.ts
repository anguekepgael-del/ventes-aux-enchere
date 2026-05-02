import { Injectable, NotFoundException } from "@nestjs/common";
import type { SellerRecord } from "../common/api-types.js";
import { CreateSellerDto, RequestDocumentsDto, ReviewSellerDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";

@Injectable()
export class SellersService {
  constructor(private readonly store: InMemoryMarketplaceStore) {}

  list(status?: string) {
    return status ? this.store.sellers.filter((seller) => seller.verificationStatus === status) : this.store.sellers;
  }

  create(dto: CreateSellerDto): SellerRecord {
    const seller: SellerRecord = {
      id: this.store.nextId("seller"),
      ...dto,
      verificationStatus: "pending",
      trustBadges: [],
      documentsRequested: ["CNI", "Preuve de propriete"],
      createdAt: this.store.timestamp(),
    };
    this.store.sellers.push(seller);
    return seller;
  }

  get(id: string) {
    const seller = this.store.sellers.find((item) => item.id === id);
    if (!seller) {
      throw new NotFoundException("Vendeur introuvable");
    }
    return seller;
  }

  review(id: string, dto: ReviewSellerDto) {
    const seller = this.get(id);
    seller.verificationStatus = dto.verificationStatus;
    if (dto.trustBadges) {
      seller.trustBadges = dto.trustBadges;
    }
    return seller;
  }

  requestDocuments(id: string, dto: RequestDocumentsDto) {
    const seller = this.get(id);
    seller.documentsRequested = Array.from(new Set([...seller.documentsRequested, ...dto.documents]));
    return seller;
  }
}
