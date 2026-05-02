import { Injectable, NotFoundException } from "@nestjs/common";
import type { NotificationRecord } from "../common/api-types.js";
import { CreateNotificationDto } from "../common/dtos.js";
import { InMemoryMarketplaceStore } from "../common/in-memory-marketplace.store.js";

@Injectable()
export class NotificationsService {
  constructor(private readonly store: InMemoryMarketplaceStore) {}

  list(userId?: string) {
    return userId
      ? this.store.notifications.filter((notification) => notification.userId === userId)
      : this.store.notifications;
  }

  create(dto: CreateNotificationDto): NotificationRecord {
    const notification: NotificationRecord = {
      id: this.store.nextId("notification"),
      ...dto,
      status: "queued",
      createdAt: this.store.timestamp(),
    };
    this.store.notifications.push(notification);
    return notification;
  }

  markSent(id: string) {
    const notification = this.store.notifications.find((item) => item.id === id);
    if (!notification) {
      throw new NotFoundException("Notification introuvable");
    }
    notification.status = "sent";
    return notification;
  }
}
