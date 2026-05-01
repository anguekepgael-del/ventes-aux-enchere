import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "enchere-cm-web",
    version: "0.1.0",
  });
}
