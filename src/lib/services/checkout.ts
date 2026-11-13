"use client";

import { enroll } from "@/lib/services/library";
import { fail, ok, type Result } from "@/lib/services/result";
import { cardPaymentSchema, fieldErrors, mobileMoneyPaymentSchema } from "@/lib/validation/schemas";
import type { Enrollment } from "@/lib/store/schema";

export type PaymentMethod = "mobile_money" | "card" | "bank";

type CheckoutInput = {
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  amountUsd: number;
  method: PaymentMethod;
  details: Record<string, string>;
};

/**
 * Test-mode checkout. Validates the payment form, simulates the provider, then enrolls.
 * When the backend is connected this calls the server, which opens Flutterwave and only
 * enrolls after verifying the transaction with Flutterwave directly.
 * Card details are validated in memory and never stored.
 */
export async function payForCourse(input: CheckoutInput): Promise<Result<Enrollment>> {
  if (input.method === "card") {
    const parsed = cardPaymentSchema.safeParse(input.details);
    if (!parsed.success) return fail("Please check your card details.", fieldErrors(parsed.error));
  }
  if (input.method === "mobile_money") {
    const parsed = mobileMoneyPaymentSchema.safeParse(input.details);
    if (!parsed.success) return fail("Please check your phone number.", fieldErrors(parsed.error));
  }

  await new Promise((r) => setTimeout(r, 1400));

  return ok(
    enroll({
      userId: input.userId,
      courseId: input.courseId,
      amount: input.amount,
      currency: input.currency,
      amountUsd: input.amountUsd,
      method: input.method,
    }),
  );
}

export function enrollFree(userId: string, courseId: string, currency: string): Enrollment {
  return enroll({ userId, courseId, amount: 0, currency, amountUsd: 0, method: "free" });
}
