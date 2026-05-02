import { Injectable, NotFoundException } from "@nestjs/common";
import type { UserRecord } from "../common/api-types.js";
import { CreateUserDto, VerifyUserDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";

@Injectable()
export class UsersService {
  constructor(private readonly store: InMemoryMarketplaceStore) {}

  list(role?: string) {
    return role ? this.store.users.filter((user) => user.role === role) : this.store.users;
  }

  create(dto: CreateUserDto): UserRecord {
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

  get(id: string) {
    const user = this.store.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    return user;
  }

  verify(id: string, dto: VerifyUserDto) {
    const user = this.get(id);
    Object.assign(user, dto);
    return user;
  }

  suspend(id: string) {
    const user = this.get(id);
    user.suspended = true;
    user.identityStatus = "suspended";
    return user;
  }
}
