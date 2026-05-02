import { Injectable, NotFoundException, Optional } from "@nestjs/common";
import type { UserRecord } from "../common/api-types.js";
import { shouldUsePrisma } from "../common/backend-data-source.js";
import { CreateUserDto, VerifyUserDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";
import { mapUser } from "../common/prisma-mappers.js";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class UsersService {
  constructor(
    private readonly store: InMemoryMarketplaceStore,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  private getPrisma() {
    return shouldUsePrisma(this.prisma) ? this.prisma : undefined;
  }

  async list(role?: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const users = await prisma.user.findMany({
        where: role ? { role: role as never } : undefined,
        orderBy: { createdAt: "desc" },
      });
      return users.map(mapUser);
    }
    return role ? this.store.users.filter((user) => user.role === role) : this.store.users;
  }

  async create(dto: CreateUserDto): Promise<UserRecord> {
    const prisma = this.getPrisma();
    if (prisma) {
      const user = await prisma.user.create({
        data: {
          fullName: dto.fullName,
          email: dto.email,
          phone: dto.phone,
          role: dto.role,
          city: dto.city,
        },
      });
      return mapUser(user);
    }

    const user: UserRecord = {
      id: this.store.nextId("user"),
      ...dto,
      emailVerified: false,
      phoneVerified: false,
      identityStatus: "pending",
      suspended: false,
      createdAt: this.store.timestamp(),
    };
    this.store.users.push(user);
    return user;
  }

  async get(id: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException("Utilisateur introuvable");
      }
      return mapUser(user);
    }

    const user = this.store.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    return user;
  }

  async verify(id: string, dto: VerifyUserDto) {
    const prisma = this.getPrisma();
    if (prisma) {
      const user = await prisma.user.update({
        where: { id },
        data: dto,
      });
      return mapUser(user);
    }

    const user = await this.get(id);
    Object.assign(user, dto);
    return user;
  }

  async suspend(id: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const user = await prisma.user.update({
        where: { id },
        data: { suspended: true, identityStatus: "suspended" },
      });
      return mapUser(user);
    }

    const user = await this.get(id);
    user.suspended = true;
    user.identityStatus = "suspended";
    return user;
  }
}
