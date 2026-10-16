import crypto from "node:crypto";
import Razorpay from "razorpay";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/AppError";

let client: Razorpay | null = null;

export const isRazorpayConfigured = (): boolean =>
  Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);

function credentials(): { keyId: string; keySecret: string } {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new AppError(503, "Online payment is not available right now");
  }
  return { keyId: env.RAZORPAY_KEY_ID, keySecret: env.RAZORPAY_KEY_SECRET };
}

export function getRazorpay(): { razorpay: Razorpay; keyId: string } {
  const { keyId, keySecret } = credentials();
  client ??= new Razorpay({ key_id: keyId, key_secret: keySecret });
  return { razorpay: client, keyId };
}

export function isValidSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
): boolean {
  const { keySecret } = credentials();
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}