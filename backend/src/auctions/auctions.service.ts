import { BadRequestException, Injectable, NotFoundException, Optional } from "@nestjs/common";
import type { AuctionRecord } from "../common/api-types.js";
import { shouldUsePrisma } from "../common/backend-data-source.js";
import { CreateAuctionDto, PlaceBidDto, ReviewAuctionDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";
import { mapAuction } from "../common/prisma-mappers.js";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class AuctionsService {
  constructor(
    private readonly store: InMemoryMarketplaceStore,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  private getPrisma() {
    return shouldUsePrisma(this.prisma) ? this.prisma : undefined;
  }

  async list(status?: string, category?: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const auctions = await prisma.auction.findMany({
        where: {
          ...(status ? { status: status as never } : {}),
          ...(category ? { category } : {}),
        },
        include: { bids: true },
        orderBy: { createdAt: "desc" },
      });
      return auctions.map(mapAuction);
    }

    return this.store.auctions.filter((auction) => {
      const statusMatch = status ? auction.status === status : true;
      const categoryMatch = category ? auction.category === category : true;
      return statusMatch && categoryMatch;
    });
  }

  async create(dto: CreateAuctionDto): Promise<AuctionRecord> {
    const prisma = this.getPrisma();
    if (prisma) {
      const auction = await prisma.auction.create({
        data: {
          sellerId: dto.sellerId,
          title: dto.title,
          category: dto.category,
          city: dto.city,
          startPrice: dto.startPrice,
          currentPrice: dto.startPrice,
          minimumIncrement: dto.minimumIncrement,
          reservePrice: dto.reservePrice,
          buyNowPrice: dto.buyNowPrice,
          status: "pending_review",
          endsAt: new Date(Date.now() + 1000 * 60 * 60 * 72),
        },
        include: { bids: true },
      });
      return mapAuction(auction);
    }

    const auction: AuctionRecord = {
      id: this.store.nextId("auction"),
      ...dto,
      currentPrice: dto.startPrice,
      status: "pending_review",
      inspected: false,
      documentValid: false,
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
      bids: [],
    };
    this.store.auctions.push(auction);
    return auction;
  }

  async get(id: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const auction = await prisma.auction.findUnique({ where: { id }, include: { bids: true } });
      if (!auction) {
        throw new NotFoundException("Enchere introuvable");
      }
      return mapAuction(auction);
    }

    const auction = this.store.auctions.find((item) => item.id === id);
    if (!auction) {
      throw new NotFoundException("Enchere introuvable");
    }
    return auction;
  }

  async review(id: string, dto: ReviewAuctionDto) {
    const prisma = this.getPrisma();
    if (prisma) {
      const auction = await prisma.auction.update({
        where: { id },
        data: dto,
        include: { bids: true },
      });
      return mapAuction(auction);
    }

    const auction = await this.get(id);
    Object.assign(auction, dto);
    return auction;
  }

  async placeBid(id: string, dto: PlaceBidDto) {
    const prisma = this.getPrisma();
    if (prisma) {
      const auction = await prisma.auction.findUnique({ where: { id }, include: { bids: true } });
      if (!auction) {
        throw new NotFoundException("Enchere introuvable");
      }
      if (auction.status !== "live") {
        throw new BadRequestException("Cette enchere n'est pas ouverte");
      }

      const currentPrice = Number(auction.currentPrice);
      const minimumIncrement = Number(auction.minimumIncrement);
      const minimumBid = currentPrice + minimumIncrement;
      if (dto.amount < minimumBid) {
        throw new BadRequestException(`Montant insuffisant. Prochaine enchere minimale: ${minimumBid} XAF`);
      }

      const buyer = await prisma.buyerProfile.findUnique({ where: { id: dto.buyerId } });
      if (!buyer) {
        throw new BadRequestException("Acheteur introuvable");
      }

      const updatedAuction = await prisma.$transaction(async (tx) => {
        await tx.bid.create({ data: { auctionId: id, buyerId: dto.buyerId, amount: dto.amount } });
        await tx.buyerProfile.update({ where: { id: dto.buyerId }, data: { activeBids: { increment: 1 } } });
        return tx.auction.update({
          where: { id },
          data: { currentPrice: dto.amount },
          include: { bids: true },
        });
      });

      return {
        accepted: true,
        auction: mapAuction(updatedAuction),
        minimumNextBid: dto.amount + minimumIncrement,
      };
    }

    const auction = await this.get(id);
    if (auction.status !== "live") {
      throw new BadRequestException("Cette enchere n'est pas ouverte");
    }

    const minimumBid = auction.currentPrice + auction.minimumIncrement;
    if (dto.amount < minimumBid) {
      throw new BadRequestException(`Montant insuffisant. Prochaine enchere minimale: ${minimumBid} XAF`);
    }

    const buyer = this.store.buyers.find((item) => item.id === dto.buyerId);
    if (!buyer) {
      throw new BadRequestException("Acheteur introuvable");
    }

    auction.currentPrice = dto.amount;
    auction.bids.push({
      buyerId: dto.buyerId,
      amount: dto.amount,
      createdAt: this.store.timestamp(),
    });
    buyer.activeBids += 1;

    return {
      accepted: true,
      auction,
      minimumNextBid: auction.currentPrice + auction.minimumIncrement,
    };
  }

  async buyNow(id: string, buyerId: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const auction = await this.get(id);
      if (!auction.buyNowPrice) {
        throw new BadRequestException("Achat immediat indisponible");
      }
      const updatedAuction = await prisma.$transaction(async (tx) => {
        await tx.bid.create({ data: { auctionId: id, buyerId, amount: auction.buyNowPrice ?? 0 } });
        return tx.auction.update({
          where: { id },
          data: { currentPrice: auction.buyNowPrice, status: "closed" },
          include: { bids: true },
        });
      });
      return mapAuction(updatedAuction);
    }

    const auction = await this.get(id);
    if (!auction.buyNowPrice) {
      throw new BadRequestException("Achat immediat indisponible");
    }
    auction.currentPrice = auction.buyNowPrice;
    auction.status = "closed";
    auction.bids.push({
      buyerId,
      amount: auction.buyNowPrice,
      createdAt: this.store.timestamp(),
    });
    return auction;
  }
}
