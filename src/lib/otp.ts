import { createHash, randomUUID } from "node:crypto";

const OTP_TTL_SECONDS = 300;

function getOtpSecret() {
  return process.env.OTP_SIGNING_SECRET ?? "local-development-otp-secret";
}

export function createOtpChallenge({
  channel,
  destination,
}: {
  channel: string;
  destination: string;
}) {
  const nonce = randomUUID();
  const issuedAt = Math.floor(Date.now() / 1000);
  const challengeId = `otp_${channel}_${issuedAt}_${nonce}`;

  return {
    challengeId,
    code: deriveOtpCode({ challengeId, destination }),
    expiresInSeconds: OTP_TTL_SECONDS,
  };
}

export function deriveOtpCode({
  challengeId,
  destination,
}: {
  challengeId: string;
  destination: string;
}) {
  const digest = createHash("sha256")
    .update(`${getOtpSecret()}|${challengeId}|${destination}`)
    .digest("hex");

  return `${parseInt(digest.slice(0, 10), 16) % 1000000}`.padStart(6, "0");
}

export function shouldExposeSandboxOtp() {
  return process.env.OTP_SANDBOX_EXPOSE_CODE === "true" && process.env.NODE_ENV !== "production";
}
