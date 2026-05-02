import { Injectable, NotFoundException, Optional } from "@nestjs/common";
import type { CityRecord } from "../common/api-types.js";
import { shouldUsePrisma } from "../common/backend-data-source.js";
import { CreateCityDto, UpdateCityDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";
import { mapCity } from "../common/prisma-mappers.js";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class CitiesService {
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
      const cities = await prisma.city.findMany({
        where: enabled === undefined ? undefined : { enabled },
        orderBy: { name: "asc" },
      });
      return cities.map(mapCity);
    }

    return enabled === undefined ? this.store.cities : this.store.cities.filter((item) => item.enabled === enabled);
  }

  async create(dto: CreateCityDto): Promise<CityRecord> {
    const prisma = this.getPrisma();
    if (prisma) {
      const city = await prisma.city.create({
        data: {
          name: dto.name,
          region: dto.region,
          enabled: dto.enabled ?? true,
        },
      });
      return mapCity(city);
    }

    const city: CityRecord = {
      id: this.store.nextId("city"),
      name: dto.name,
      region: dto.region,
      enabled: dto.enabled ?? true,
      createdAt: this.store.timestamp(),
    };
    this.store.cities.push(city);
    return city;
  }

  async get(id: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const city = await prisma.city.findUnique({ where: { id } });
      if (!city) {
        throw new NotFoundException("Ville introuvable");
      }
      return mapCity(city);
    }

    const city = this.store.cities.find((item) => item.id === id);
    if (!city) {
      throw new NotFoundException("Ville introuvable");
    }
    return city;
  }

  async update(id: string, dto: UpdateCityDto) {
    const prisma = this.getPrisma();
    if (prisma) {
      await this.get(id);
      const city = await prisma.city.update({
        where: { id },
        data: dto,
      });
      return mapCity(city);
    }

    const city = await this.get(id);
    Object.assign(city, dto);
    return city;
  }
}
