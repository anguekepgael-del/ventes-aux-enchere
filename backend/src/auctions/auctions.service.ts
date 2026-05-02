import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { AuctionRecord } from "../common/api-types.js";
import { CreateAuctionDto, PlaceBidDto, ReviewAuctionDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";

@Injectable()
export class AuctionsService {
  constructor(private readonly store: InMemoryMarketplaceStore) {}

  list(status?: string, category?: string) {
    return this.store.auctions.filter((auction) => {
      const statusMatch = status ? auction.status === status : true;
      const categoryMatch = category ? auction.category === category : true;
      return statusMatch && categoryMatch;
    });
  }

  create(dto: CreateAuctionDto): AuctionRecord {
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

  get(id: string) {
    const auction = this.store.auctions.find((item) => item.id === id);
    if (!auction) {
      throw new NotFoundException("Enchere introuvable");
    }
    return auction;
  }

  review(id: string, dto: ReviewAuctionDto) {
    const auction = this.get(id);
    Object.assign(auction, dto);
    return auction;
  }

  placeBid(id: string, dto: PlaceBidDto) {
    const auction = this.get(id);
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

  buyNow(id: string, buyerId: string) {
    const auction = this.get(id);
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
