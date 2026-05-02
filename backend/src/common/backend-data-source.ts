import type { PrismaService } from "../database/prisma.service.js";

export function shouldUsePrisma(prisma?: PrismaService) {
  return Boolean(prisma && process.env.BACKEND_DATA_SOURCE === "prisma" && process.env.DATABASE_URL);
}
