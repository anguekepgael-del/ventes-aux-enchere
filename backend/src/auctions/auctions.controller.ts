import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateAuctionDto, PlaceBidDto, ReviewAuctionDto } from "../common/dtos.js";
import { AuctionsService } from "./auctions.service.js";

@Controller("auctions")
export class AuctionsController {
  constructor(private readonly auctions: AuctionsService) {}

  @Get()
  list(@Query("status") status?: string, @Query("category") category?: string) {
    return this.auctions.list(status, category);
  }

  @Post()
  create(@Body() dto: CreateAuctionDto) {
    return this.auctions.create(dto);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.auctions.get(id);
  }

  @Patch(":id/review")
  review(@Param("id") id: string, @Body() dto: ReviewAuctionDto) {
    return this.auctions.review(id, dto);
  }

  @Post(":id/bids")
  placeBid(@Param("id") id: string, @Body() dto: PlaceBidDto) {
    return this.auctions.placeBid(id, dto);
  }

  @Post(":id/buy-now")
  buyNow(@Param("id") id: string, @Body("buyerId") buyerId: string) {
    return this.auctions.buyNow(id, buyerId);
  }
}
