import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateNotificationDto } from "../common/dtos.js";
import { NotificationsService } from "./notifications.service.js";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  list(@Query("userId") userId?: string) {
    return this.notifications.list(userId);
  }

  @Post()
  create(@Body() dto: CreateNotificationDto) {
    return this.notifications.create(dto);
  }

  @Patch(":id/sent")
  markSent(@Param("id") id: string) {
    return this.notifications.markSent(id);
  }
}
