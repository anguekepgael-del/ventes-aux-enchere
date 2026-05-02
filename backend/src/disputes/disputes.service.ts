import { Injectable, NotFoundException, Optional } from "@nestjs/common";
import type { DisputeRecord } from "../common/api-types.js";
import { shouldUsePrisma } from "../common/backend-data-source.js";
import { CreateDisputeDto, UpdateDisputeDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";
import { mapDispute } from "../common/prisma-mappers.js";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class DisputesService {
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
      const disputes = await prisma.dispute.findMany({
        where: status ? { status: status as never } : undefined,
        orderBy: { createdAt: "desc" },
      });
      return disputes.map(mapDispute);
    }

    return status ? this.store.disputes.filter((dispute) => dispute.status === status) : this.store.disputes;
  }

  async create(dto: CreateDisputeDto): Promise<DisputeRecord> {
    const prisma = this.getPrisma();
    if (prisma) {
      const dispute = await prisma.dispute.create({
        data: {
          auctionId: dto.auctionId,
          openedByUserId: dto.openedByUserId,
          reason: dto.reason,
          priority: dto.priority,
          status: "open",
        },
      });
      return mapDispute(dispute);
    }

    const dispute: DisputeRecord = {
      id: this.store.nextId("dispute"),
      ...dto,
      status: "open",
      createdAt: this.store.timestamp(),
    };
    this.store.disputes.push(dispute);
    return dispute;
  }

  async get(id: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const dispute = await prisma.dispute.findUnique({ where: { id } });
      if (!dispute) {
        throw new NotFoundException("Litige introuvable");
      }
      return mapDispute(dispute);
    }

    const dispute = this.store.disputes.find((item) => item.id === id);
    if (!dispute) {
      throw new NotFoundException("Litige introuvable");
    }
    return dispute;
  }

  async update(id: string, dto: UpdateDisputeDto) {
    const prisma = this.getPrisma();
    if (prisma) {
      await this.get(id);
      const dispute = await prisma.dispute.update({
        where: { id },
        data: { status: dto.status },
      });
      return mapDispute(dispute);
    }

    const dispute = await this.get(id);
    dispute.status = dto.status;
    return dispute;
  }
}
