import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateVerificationDocumentDto, ReviewVerificationDocumentDto } from "../common/dtos.js";
import { DocumentsService } from "./documents.service.js";

@Controller("documents")
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Get()
  list(@Query("status") status?: string) {
    return this.documents.list(status);
  }

  @Post()
  create(@Body() dto: CreateVerificationDocumentDto) {
    return this.documents.create(dto);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.documents.get(id);
  }

  @Patch(":id/review")
  review(@Param("id") id: string, @Body() dto: ReviewVerificationDocumentDto) {
    return this.documents.review(id, dto);
  }
}
