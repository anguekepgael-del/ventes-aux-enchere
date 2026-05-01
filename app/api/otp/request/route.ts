import { NextResponse } from "next/server";
import { isValidCameroonMobileMoneyPhone, normalizeCameroonPhone } from "@/src/lib/marketplace-core";
import { createOtpChallenge, shouldExposeSandboxOtp } from "@/src/lib/otp";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        channel?: "sms" | "whatsapp" | "email";
        destination?: string;
      }
    | null;

  if (!body?.channel || !body.destination) {
    return NextResponse.json({ error: "channel and destination are required" }, { status: 400 });
  }

  const normalizedDestination =
    body.channel === "email" ? body.destination.trim().toLowerCase() : normalizeCameroonPhone(body.destination);

  if (body.channel !== "email" && !isValidCameroonMobileMoneyPhone(normalizedDestination)) {
    return NextResponse.json({ error: "invalid Cameroon phone destination" }, { status: 400 });
  }

  const challenge = createOtpChallenge({
    channel: body.channel,
    destination: normalizedDestination,
  });

  return NextResponse.json({
    challengeId: challenge.challengeId,
    channel: body.channel,
    destination: normalizedDestination,
    status: "queued_for_delivery",
    expiresInSeconds: challenge.expiresInSeconds,
    sandboxCode: shouldExposeSandboxOtp() ? challenge.code : undefined,
  });
}
