import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateCityDto, UpdateCityDto } from "../common/dtos.js";
import { CitiesService } from "./cities.service.js";

function parseEnabled(value?: string) {
  return value === undefined ? undefined : value === "true";
}

@Controller("cities")
export class CitiesController {
  constructor(private readonly cities: CitiesService) {}

  @Get()
  list(@Query("enabled") enabled?: string) {
    return this.cities.list(parseEnabled(enabled));
  }

  @Post()
  create(@Body() dto: CreateCityDto) {
    return this.cities.create(dto);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.cities.get(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCityDto) {
    return this.cities.update(id, dto);
  }
}
