import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateUserDto, VerifyUserDto } from "../common/dtos.js";
import { UsersService } from "./users.service.js";

@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list(@Query("role") role?: string) {
    return this.users.list(role);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.users.get(id);
  }

  @Patch(":id/verification")
  verify(@Param("id") id: string, @Body() dto: VerifyUserDto) {
    return this.users.verify(id, dto);
  }

  @Patch(":id/suspend")
  suspend(@Param("id") id: string) {
    return this.users.suspend(id);
  }
}
