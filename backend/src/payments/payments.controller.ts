import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreatePaymentDto, UpdatePaymentStatusDto } from "../common/dtos.js";
import { PaymentsService } from "./payments.service.js";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Get()
  list(@Query("status") status?: string, @Query("purpose") purpose?: string) {
    return this.payments.list(status, purpose);
  }

  @Get("escrow/summary")
  escrowSummary() {
    return this.payments.escrowSummary();
  }

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.payments.create(dto);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.payments.get(id);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() dto: UpdatePaymentStatusDto) {
    return this.payments.updateStatus(id, dto);
  }
}
