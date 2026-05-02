import { Injectable, NotFoundException, Optional } from "@nestjs/common";
import type { SellerRecord } from "../common/api-types.js";
import { shouldUsePrisma } from "../common/backend-data-source.js";
import { CreateSellerDto, RequestDocumentsDto, ReviewSellerDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";
import { mapSeller } from "../common/prisma-mappers.js";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class SellersService {
  constructor(
    private readonly store: InMemoryMarketplaceStore,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  private getPrisma() {
    return shouldUsePrisma(this.prisma) ? this.prisma : undefined;
  }

  async list(status?: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const sellers = await prisma.sellerProfile.findMany({
        where: status ? { verificationStatus: status as never } : undefined,
        orderBy: { createdAt: "desc" },
      });
      return sellers.map(mapSeller);
    }
    return status ? this.store.sellers.filter((seller) => seller.verificationStatus === status) : this.store.sellers;
  }

  async create(dto: CreateSellerDto): Promise<SellerRecord> {
    const prisma = this.getPrisma();
    if (prisma) {
      const seller = await prisma.sellerProfile.create({
        data: {
          userId: dto.userId,
          displayName: dto.displayName,
          type: dto.type,
          documentsRequested: ["CNI", "Preuve de propriete"],
        },
      });
      return mapSeller(seller);
    }

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

  async get(id: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const seller = await prisma.sellerProfile.findUnique({ where: { id } });
      if (!seller) {
        throw new NotFoundException("Vendeur introuvable");
      }
      return mapSeller(seller);
    }

    const seller = this.store.sellers.find((item) => item.id === id);
    if (!seller) {
      throw new NotFoundException("Vendeur introuvable");
    }
    return seller;
  }

  async review(id: string, dto: ReviewSellerDto) {
    const prisma = this.getPrisma();
    if (prisma) {
      const seller = await prisma.sellerProfile.update({
        where: { id },
        data: {
          verificationStatus: dto.verificationStatus,
          ...(dto.trustBadges ? { trustBadges: dto.trustBadges } : {}),
        },
      });
      return mapSeller(seller);
    }

    const seller = await this.get(id);
    seller.verificationStatus = dto.verificationStatus;
    if (dto.trustBadges) {
      seller.trustBadges = dto.trustBadges;
    }
    return seller;
  }

  async requestDocuments(id: string, dto: RequestDocumentsDto) {
    const prisma = this.getPrisma();
    if (prisma) {
      const current = await this.get(id);
      const documentsRequested = Array.from(new Set([...current.documentsRequested, ...dto.documents]));
      const seller = await prisma.sellerProfile.update({
        where: { id },
        data: { documentsRequested },
      });
      return mapSeller(seller);
    }

    const seller = await this.get(id);
    seller.documentsRequested = Array.from(new Set([...seller.documentsRequested, ...dto.documents]));
    return seller;
  }
}
