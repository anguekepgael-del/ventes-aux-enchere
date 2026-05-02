import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateDisputeDto, UpdateDisputeDto } from "../common/dtos.js";
import { DisputesService } from "./disputes.service.js";

@Controller("disputes")
export class DisputesController {
  constructor(private readonly disputes: DisputesService) {}

  @Get()
  list(@Query("status") status?: string) {
    return this.disputes.list(status);
  }

  @Post()
  create(@Body() dto: CreateDisputeDto) {
    return this.disputes.create(dto);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.disputes.get(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateDisputeDto) {
    return this.disputes.update(id, dto);
  }
}
