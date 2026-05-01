import { NextResponse } from "next/server";
import { getMarketplaceConfig } from "@/src/lib/marketplace-config";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(getMarketplaceConfig());
}
