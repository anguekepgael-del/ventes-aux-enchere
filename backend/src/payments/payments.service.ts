import { Injectable, NotFoundException } from "@nestjs/common";
import type { PaymentRecord } from "../common/api-types.js";
import { CreatePaymentDto, UpdatePaymentStatusDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";

@Injectable()
export class PaymentsService {
  constructor(private readonly store: InMemoryMarketplaceStore) {}

  list(status?: string, purpose?: string) {
    return this.store.payments.filter((payment) => {
      const statusMatch = status ? payment.status === status : true;
      const purposeMatch = purpose ? payment.purpose === purpose : true;
      return statusMatch && purposeMatch;
    });
  }

  create(dto: CreatePaymentDto): PaymentRecord {
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

  get(id: string) {
    const payment = this.store.payments.find((item) => item.id === id);
    if (!payment) {
      throw new NotFoundException("Paiement introuvable");
    }
    return payment;
  }

  updateStatus(id: string, dto: UpdatePaymentStatusDto) {
    const payment = this.get(id);
    payment.status = dto.status;
    if (dto.externalReference) {
      payment.externalReference = dto.externalReference;
    }
    return payment;
  }

  escrowSummary() {
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
