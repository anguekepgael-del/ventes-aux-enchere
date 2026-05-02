import { Injectable, NotFoundException } from "@nestjs/common";
import type { DisputeRecord } from "../common/api-types.js";
import { CreateDisputeDto, UpdateDisputeDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";

@Injectable()
export class DisputesService {
  constructor(private readonly store: InMemoryMarketplaceStore) {}

  list(status?: string) {
    return status ? this.store.disputes.filter((dispute) => dispute.status === status) : this.store.disputes;
  }

  create(dto: CreateDisputeDto): DisputeRecord {
    const dispute: DisputeRecord = {
      id: this.store.nextId("dispute"),
      ...dto,
      status: "open",
      createdAt: this.store.timestamp(),
    };
    this.store.disputes.push(dispute);
    return dispute;
  }

  get(id: string) {
    const dispute = this.store.disputes.find((item) => item.id === id);
    if (!dispute) {
      throw new NotFoundException("Litige introuvable");
    }
    return dispute;
  }

  update(id: string, dto: UpdateDisputeDto) {
    const dispute = this.get(id);
    dispute.status = dto.status;
    return dispute;
  }
}
