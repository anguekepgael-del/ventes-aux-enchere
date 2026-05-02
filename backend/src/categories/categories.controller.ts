import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateCategoryDto, UpdateCategoryDto } from "../common/dtos.js";
import { CategoriesService } from "./categories.service.js";

function parseEnabled(value?: string) {
  return value === undefined ? undefined : value === "true";
}

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  list(@Query("enabled") enabled?: string) {
    return this.categories.list(parseEnabled(enabled));
  }

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categories.create(dto);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.categories.get(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCategoryDto) {
    return this.categories.update(id, dto);
  }
}
