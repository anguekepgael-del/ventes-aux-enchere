import { Injectable, NotFoundException, Optional } from "@nestjs/common";
import type { PaymentRecord } from "../common/api-types.js";
import { shouldUsePrisma } from "../common/backend-data-source.js";
import { CreatePaymentDto, UpdatePaymentStatusDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";
import { mapPayment, toNumber } from "../common/prisma-mappers.js";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class PaymentsService {
  constructor(
    private readonly store: InMemoryMarketplaceStore,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  private getPrisma() {
    return shouldUsePrisma(this.prisma) ? this.prisma : undefined;
  }

  async list(status?: string, purpose?: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const payments = await prisma.payment.findMany({
        where: {
          ...(status ? { status: status as never } : {}),
          ...(purpose ? { purpose: purpose as never } : {}),
        },
        orderBy: { createdAt: "desc" },
      });
      return payments.map(mapPayment);
    }

    return this.store.payments.filter((payment) => {
      const statusMatch = status ? payment.status === status : true;
      const purposeMatch = purpose ? payment.purpose === purpose : true;
      return statusMatch && purposeMatch;
    });
  }

  async create(dto: CreatePaymentDto): Promise<PaymentRecord> {
    const prisma = this.getPrisma();
    if (prisma) {
      const status = dto.provider === "manual_admin" ? "pending" : "authorized";
      const payment = await prisma.$transaction(async (tx) => {
        const created = await tx.payment.create({
          data: {
            buyerId: dto.buyerId,
            sellerId: dto.sellerId,
            auctionId: dto.auctionId,
            provider: dto.provider,
            purpose: dto.purpose,
            amount: dto.amount,
            status,
          },
        });

        if (dto.purpose === "deposit") {
          await tx.buyerProfile.update({
            where: { id: dto.buyerId },
            data: { blockedDeposits: { increment: dto.amount } },
          });
        }

        return created;
      });
      return mapPayment(payment);
    }

    const payment: PaymentRecord = {
      id: this.store.nextId("payment"),
      ...dto,
      status: dto.provider === "manual_admin" ? "pending" : "authorized",
      createdAt: this.store.timestamp(),
    };
    this.store.payments.push(payment);

    if (payment.purpose === "deposit") {
      const buyer = this.store.buyers.find((item) => item.id === payment.buyerId);
      if (buyer) {
        buyer.blockedDeposits += payment.amount;
      }
    }

    return payment;
  }

  async get(id: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const payment = await prisma.payment.findUnique({ where: { id } });
      if (!payment) {
        throw new NotFoundException("Paiement introuvable");
      }
      return mapPayment(payment);
    }

    const payment = this.store.payments.find((item) => item.id === id);
    if (!payment) {
      throw new NotFoundException("Paiement introuvable");
    }
    return payment;
  }

  async updateStatus(id: string, dto: UpdatePaymentStatusDto) {
    const prisma = this.getPrisma();
    if (prisma) {
      await this.get(id);
      const payment = await prisma.payment.update({
        where: { id },
        data: {
          status: dto.status,
          externalReference: dto.externalReference,
        },
      });
      return mapPayment(payment);
    }

    const payment = await this.get(id);
    payment.status = dto.status;
    if (dto.externalReference) {
      payment.externalReference = dto.externalReference;
    }
    return payment;
  }

  async escrowSummary() {
    const prisma = this.getPrisma();
    if (prisma) {
      const [escrowed, deposits, paymentsCount] = await Promise.all([
        prisma.payment.aggregate({
          where: { status: { in: ["escrowed", "captured"] } },
          _sum: { amount: true },
        }),
        prisma.payment.aggregate({
          where: { purpose: "deposit" },
          _sum: { amount: true },
        }),
        prisma.payment.count(),
      ]);

      return {
        escrowed: toNumber(escrowed._sum.amount ?? 0),
        deposits: toNumber(deposits._sum.amount ?? 0),
        paymentsCount,
      };
    }

    const escrowed = this.store.payments
      .filter((payment) => payment.status === "escrowed" || payment.status === "captured")
      .reduce((total, payment) => total + payment.amount, 0);
    const deposits = this.store.payments
      .filter((payment) => payment.purpose === "deposit")
      .reduce((total, payment) => total + payment.amount, 0);
    return {
      escrowed,
      deposits,
      paymentsCount: this.store.payments.length,
    };
  }
}
