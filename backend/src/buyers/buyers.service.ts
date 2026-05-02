import { Injectable, NotFoundException } from "@nestjs/common";
import type { BuyerRecord } from "../common/api-types.js";
import { CreateBuyerDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";

@Injectable()
export class BuyersService {
  constructor(private readonly store: InMemoryMarketplaceStore) {}

  list() {
    return this.store.buyers;
  }

  create(dto: CreateBuyerDto): BuyerRecord {
    const buyer: BuyerRecord = {
      id: this.store.nextId("buyer"),
      userId: dto.userId,
      walletBalance: 0,
      blockedDeposits: 0,
      activeBids: 0,
      disputesCount: 0,
    };
    this.store.buyers.push(buyer);
    return buyer;
  }

  get(id: string) {
    const buyer = this.store.buyers.find((item) => item.id === id);
    if (!buyer) {
      throw new NotFoundException("Acheteur introuvable");
    }
    return buyer;
  }

  portfolio(id: string) {
    const buyer = this.get(id);
    return {
      buyer,
      bids: this.store.auctions.flatMap((auction) =>
        auction.bids.filter((bid) => bid.buyerId === id).map((bid) => ({ ...bid, auctionId: auction.id })),
      ),
      payments: this.store.payments.filter((payment) => payment.buyerId === id),
      disputes: this.store.disputes.filter((dispute) => dispute.openedByUserId === buyer.userId),
    };
  }
}
