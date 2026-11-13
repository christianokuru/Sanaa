import "server-only";
import { PLATFORM_FEE_RATE } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction } from "@/lib/flutterwave";

export type FinalizeResult =
  | { ok: true; courseSlug: string }
  | { ok: false; reason: string; courseSlug?: string };

/**
 * Confirm a payment with Flutterwave (never trust the browser), then enroll the student
 * and record the 80/20 split. Safe to call more than once for the same payment.
 */
export async function finalizePayment(transactionId: string): Promise<FinalizeResult> {
  const tx = await verifyTransaction(transactionId);
  const db = createAdminClient();

  const { data: payment } = await db
    .from("payments")
    .select("id, status, amount, currency, usd_rate, student_id, course_id, courses(slug)")
    .eq("tx_ref", tx.tx_ref)
    .maybeSingle();

  if (!payment) return { ok: false, reason: "Payment not found." };
  const courseSlug = (payment.courses as unknown as { slug: string } | null)?.slug;

  if (payment.status === "successful") return { ok: true, courseSlug: courseSlug ?? "" };

  if (tx.status !== "successful") {
    await db.from("payments").update({ status: "failed", flw_transaction_id: String(tx.id) }).eq("id", payment.id);
    return { ok: false, reason: "The payment did not go through.", courseSlug };
  }

  if (tx.currency !== payment.currency || Number(tx.amount) < Number(payment.amount)) {
    await db.from("payments").update({ status: "failed", flw_transaction_id: String(tx.id) }).eq("id", payment.id);
    return { ok: false, reason: "The amount paid does not match the course price.", courseSlug };
  }

  const amountUsd = Math.round((Number(payment.amount) / Number(payment.usd_rate)) * 100) / 100;
  const fee = Math.round(amountUsd * PLATFORM_FEE_RATE * 100) / 100;

  await db
    .from("payments")
    .update({
      status: "successful",
      flw_transaction_id: String(tx.id),
      amount_usd: amountUsd,
      platform_fee_usd: fee,
      teacher_earning_usd: Math.round((amountUsd - fee) * 100) / 100,
      paid_at: new Date().toISOString(),
    })
    .eq("id", payment.id)
    .neq("status", "successful");

  // Safe if the webhook and the redirect both get here: duplicates are ignored.
  await db
    .from("enrollments")
    .upsert(
      { course_id: payment.course_id, student_id: payment.student_id, payment_id: payment.id },
      { onConflict: "course_id,student_id", ignoreDuplicates: true },
    );

  return { ok: true, courseSlug: courseSlug ?? "" };
}
