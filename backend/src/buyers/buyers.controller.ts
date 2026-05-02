import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateBuyerDto } from "../common/dtos.js";
import { BuyersService } from "./buyers.service.js";

@Controller("buyers")
export class BuyersController {
  constructor(private readonly buyers: BuyersService) {}

  @Get()
  list() {
    return this.buyers.list();
  }

  @Post()
  create(@Body() dto: CreateBuyerDto) {
    return this.buyers.create(dto);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.buyers.get(id);
  }

  @Get(":id/portfolio")
  portfolio(@Param("id") id: string) {
    return this.buyers.portfolio(id);
  }
}
