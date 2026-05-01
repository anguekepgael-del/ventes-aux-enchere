import { NextResponse } from "next/server";
import { deriveOtpCode } from "@/src/lib/otp";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        challengeId?: string;
        destination?: string;
        code?: string;
      }
    | null;

  if (!body?.challengeId || !body.destination || !body.code) {
    return NextResponse.json(
      { error: "challengeId, destination and code are required" },
      { status: 400 },
    );
  }

  const expectedCode = deriveOtpCode({
    challengeId: body.challengeId,
    destination: body.destination,
  });

  if (body.code !== expectedCode) {
    return NextResponse.json({ verified: false, reason: "invalid_code" }, { status: 401 });
  }

  return NextResponse.json({
    verified: true,
    challengeId: body.challengeId,
    assuranceLevel: "phone_or_email_confirmed",
  });
}
