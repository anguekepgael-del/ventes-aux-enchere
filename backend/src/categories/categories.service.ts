import { Injectable, NotFoundException, Optional } from "@nestjs/common";
import type { CategoryRecord } from "../common/api-types.js";
import { shouldUsePrisma } from "../common/backend-data-source.js";
import { CreateCategoryDto, UpdateCategoryDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";
import { mapCategory } from "../common/prisma-mappers.js";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly store: InMemoryMarketplaceStore,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  private getPrisma() {
    return shouldUsePrisma(this.prisma) ? this.prisma : undefined;
  }

  async list(enabled?: boolean) {
    const prisma = this.getPrisma();
    if (prisma) {
      const categories = await prisma.category.findMany({
        where: enabled === undefined ? undefined : { enabled },
        orderBy: { name: "asc" },
      });
      return categories.map(mapCategory);
    }

    return enabled === undefined ? this.store.categories : this.store.categories.filter((item) => item.enabled === enabled);
  }

  async create(dto: CreateCategoryDto): Promise<CategoryRecord> {
    const prisma = this.getPrisma();
    if (prisma) {
      const category = await prisma.category.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          riskLevel: dto.riskLevel ?? "standard",
          enabled: dto.enabled ?? true,
        },
      });
      return mapCategory(category);
    }

    const category: CategoryRecord = {
      id: this.store.nextId("category"),
      name: dto.name,
      slug: dto.slug,
      riskLevel: dto.riskLevel ?? "standard",
      enabled: dto.enabled ?? true,
      createdAt: this.store.timestamp(),
    };
    this.store.categories.push(category);
    return category;
  }

  async get(id: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const category = await prisma.category.findUnique({ where: { id } });
      if (!category) {
        throw new NotFoundException("Categorie introuvable");
      }
      return mapCategory(category);
    }

    const category = this.store.categories.find((item) => item.id === id);
    if (!category) {
      throw new NotFoundException("Categorie introuvable");
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const prisma = this.getPrisma();
    if (prisma) {
      await this.get(id);
      const category = await prisma.category.update({
        where: { id },
        data: dto,
      });
      return mapCategory(category);
    }

    const category = await this.get(id);
    Object.assign(category, dto);
    return category;
  }
}
