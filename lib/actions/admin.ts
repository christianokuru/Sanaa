"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRates, rateFor } from "@/lib/currency";
import { createTransfer, hasFlutterwave } from "@/lib/flutterwave";

export async function reviewCourse(formData: FormData) {
  await requireRole(["admin"], "/admin");
  const courseId = String(formData.get("courseId"));
  const decision = String(formData.get("decision"));
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 500);
  await createAdminClient()
    .from("courses")
    .update(
      decision === "approve"
        ? { status: "published", rejection_reason: null }
        : { status: "rejected", rejection_reason: reason || "Please improve the course and send it again." },
    )
    .eq("id", courseId);
  revalidatePath("/admin");
  revalidatePath("/courses");
  revalidatePath("/");
}

async function teacherBalance(teacherId: string) {
  const db = createAdminClient();
  const { data } = await db.from("teacher_balances").select("earned_usd, paid_out_usd").eq("teacher_id", teacherId).single();
  return Math.max(0, Number(data?.earned_usd ?? 0) - Number(data?.paid_out_usd ?? 0));
}

/** Send a teacher their full balance through Flutterwave (or record a manual payment). */
export async function sendPayout(formData: FormData) {
  await requireRole(["admin"], "/admin?tab=payouts");
  const teacherId = String(formData.get("teacherId"));
  const manual = formData.get("manual") === "1";
  const db = createAdminClient();

  const { data: account } = await db.from("payout_accounts").select("*").eq("teacher_id", teacherId).maybeSingle();
  if (!account) return;
  const balanceUsd = Math.floor((await teacherBalance(teacherId)) * 100) / 100;
  if (balanceUsd < 1) return;

  const rates = await getRates();
  const amount = Math.floor(balanceUsd * rateFor(account.currency, rates) * 100) / 100;
  const reference = `sanaa_payout_${randomUUID()}`;

  const { data: payout } = await db
    .from("payouts")
    .insert({
      teacher_id: teacherId,
      amount_usd: balanceUsd,
      amount,
      currency: account.currency,
      reference,
      status: manual ? "paid" : "processing",
      note: manual ? "Marked as paid manually" : null,
    })
    .select("id")
    .single();

  if (!manual && payout) {
    try {
      if (!hasFlutterwave) throw new Error("Flutterwave is not set up");
      const t = await createTransfer({
        accountBank: account.provider_code,
        accountNumber: account.account_number,
        amount,
        currency: account.currency,
        reference,
        narration: "Sanaa course earnings",
        beneficiaryName: account.account_name,
      });
      await db.from("payouts").update({ flw_transfer_id: String(t.id) }).eq("id", payout.id);
    } catch (e) {
      await db.from("payouts").update({ status: "failed", note: e instanceof Error ? e.message : "Transfer failed" }).eq("id", payout.id);
    }
  }
  revalidatePath("/admin");
}
