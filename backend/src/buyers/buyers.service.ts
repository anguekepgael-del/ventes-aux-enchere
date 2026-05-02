import { Injectable, NotFoundException, Optional } from "@nestjs/common";
import type { BuyerRecord } from "../common/api-types.js";
import { shouldUsePrisma } from "../common/backend-data-source.js";
import { CreateBuyerDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";
import { mapBuyer, mapDispute, mapPayment, toNumber } from "../common/prisma-mappers.js";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class BuyersService {
  constructor(
    private readonly store: InMemoryMarketplaceStore,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  private getPrisma() {
    return shouldUsePrisma(this.prisma) ? this.prisma : undefined;
  }

  async list() {
    const prisma = this.getPrisma();
    if (prisma) {
      const buyers = await prisma.buyerProfile.findMany({ orderBy: { createdAt: "desc" } });
      return buyers.map(mapBuyer);
    }

    return this.store.buyers;
  }

  async create(dto: CreateBuyerDto): Promise<BuyerRecord> {
    const prisma = this.getPrisma();
    if (prisma) {
      const buyer = await prisma.buyerProfile.create({ data: { userId: dto.userId } });
      return mapBuyer(buyer);
    }

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

  async get(id: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const buyer = await prisma.buyerProfile.findUnique({ where: { id } });
      if (!buyer) {
        throw new NotFoundException("Acheteur introuvable");
      }
      return mapBuyer(buyer);
    }

    const buyer = this.store.buyers.find((item) => item.id === id);
    if (!buyer) {
      throw new NotFoundException("Acheteur introuvable");
    }
    return buyer;
  }

  async portfolio(id: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const buyer = await prisma.buyerProfile.findUnique({
        where: { id },
        include: {
          bids: true,
          payments: true,
          user: { include: { disputes: true } },
        },
      });
      if (!buyer) {
        throw new NotFoundException("Acheteur introuvable");
      }

      return {
        buyer: mapBuyer(buyer),
        bids: buyer.bids.map((bid) => ({
          auctionId: bid.auctionId,
          buyerId: bid.buyerId,
          amount: toNumber(bid.amount),
          createdAt: bid.createdAt.toISOString(),
        })),
        payments: buyer.payments.map(mapPayment),
        disputes: buyer.user.disputes.map(mapDispute),
      };
    }

    const buyer = await this.get(id);
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
