import { Injectable, NotFoundException, Optional } from "@nestjs/common";
import type { NotificationRecord } from "../common/api-types.js";
import { shouldUsePrisma } from "../common/backend-data-source.js";
import { CreateNotificationDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";
import { mapNotification } from "../common/prisma-mappers.js";
import { PrismaService } from "../database/prisma.service.js";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly store: InMemoryMarketplaceStore,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  private getPrisma() {
    return shouldUsePrisma(this.prisma) ? this.prisma : undefined;
  }

  async list(userId?: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const notifications = await prisma.notification.findMany({
        where: userId ? { userId } : undefined,
        orderBy: { createdAt: "desc" },
      });
      return notifications.map(mapNotification);
    }

    return userId
      ? this.store.notifications.filter((notification) => notification.userId === userId)
      : this.store.notifications;
  }

  async create(dto: CreateNotificationDto): Promise<NotificationRecord> {
    const prisma = this.getPrisma();
    if (prisma) {
      const notification = await prisma.notification.create({
        data: {
          userId: dto.userId,
          channel: dto.channel,
          subject: dto.subject,
          body: dto.body,
          status: "queued",
        },
      });
      return mapNotification(notification);
    }

    const notification: NotificationRecord = {
      id: this.store.nextId("notification"),
      ...dto,
      status: "queued",
      createdAt: this.store.timestamp(),
    };
    this.store.notifications.push(notification);
    return notification;
  }

  async markSent(id: string) {
    const prisma = this.getPrisma();
    if (prisma) {
      const current = await prisma.notification.findUnique({ where: { id } });
      if (!current) {
        throw new NotFoundException("Notification introuvable");
      }
      const notification = await prisma.notification.update({
        where: { id },
        data: { status: "sent", sentAt: new Date() },
      });
      return mapNotification(notification);
    }

    const notification = this.store.notifications.find((item) => item.id === id);
    if (!notification) {
      throw new NotFoundException("Notification introuvable");
    }
    notification.status = "sent";
    return notification;
  }
}
