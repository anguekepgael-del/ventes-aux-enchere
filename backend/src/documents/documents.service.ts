import { Injectable, NotFoundException, Optional } from "@nestjs/common";
import type { VerificationDocumentRecord } from "../common/api-types.js";
import { shouldUsePrisma } from "../common/backend-data-source.js";
import { CreateVerificationDocumentDto, ReviewVerificationDocumentDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";
import { mapDocument } from "../common/prisma-mappers.js";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class DocumentsService {
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
      const documents = await prisma.verificationDocument.findMany({
        where: status ? { status: status as never } : undefined,
        orderBy: { createdAt: "desc" },
      });
      return documents.map(mapDocument);
    }

    return status ? this.store.documents.filter((document) => document.status === status) : this.store.documents;
  }

  async create(dto: CreateVerificationDocumentDto): Promise<VerificationDocumentRecord> {
    const prisma = this.getPrisma();
    if (prisma) {
      const document = await prisma.verificationDocument.create({
        data: {
          userId: dto.userId,
          auctionId: dto.auctionId,
          type: dto.type,
          fileKey: dto.fileKey,
          status: "pending",
        },
      });
      return mapDocument(document);
    }

    const document: VerificationDocumentRecord = {
      id: this.store.nextId("document"),
      userId: dto.userId,
      auctionId: dto.auctionId,
      type: dto.type,
      fileKey: dto.fileKey,
      status: "pending",
      createdAt: this.store.timestamp(),
    };
    this.store.documents.push(document);
    return document;
  }

  async get(id: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const document = await prisma.verificationDocument.findUnique({ where: { id } });
      if (!document) {
        throw new NotFoundException("Document introuvable");
      }
      return mapDocument(document);
    }

    const document = this.store.documents.find((item) => item.id === id);
    if (!document) {
      throw new NotFoundException("Document introuvable");
    }
    return document;
  }

  async review(id: string, dto: ReviewVerificationDocumentDto) {
    const prisma = this.getPrisma();
    if (prisma) {
      await this.get(id);
      const document = await prisma.verificationDocument.update({
        where: { id },
        data: dto,
      });
      return mapDocument(document);
    }

    const document = await this.get(id);
    document.status = dto.status;
    document.note = dto.note;
    return document;
  }
}
