import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateSellerDto, RequestDocumentsDto, ReviewSellerDto } from "../common/dtos.js";
import { SellersService } from "./sellers.service.js";

@Controller("sellers")
export class SellersController {
  constructor(private readonly sellers: SellersService) {}

  @Get()
  list(@Query("status") status?: string) {
    return this.sellers.list(status);
  }

  @Post()
  create(@Body() dto: CreateSellerDto) {
    return this.sellers.create(dto);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.sellers.get(id);
  }

  @Patch(":id/review")
  review(@Param("id") id: string, @Body() dto: ReviewSellerDto) {
    return this.sellers.review(id, dto);
  }

  @Post(":id/documents/request")
  requestDocuments(@Param("id") id: string, @Body() dto: RequestDocumentsDto) {
    return this.sellers.requestDocuments(id, dto);
  }
}
