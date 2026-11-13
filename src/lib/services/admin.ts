"use client";

import { getStore, setStore } from "@/lib/store/app-store";
import { randomId } from "@/lib/security/password";
import { rateFor, type Rates } from "@/lib/locale/currency";

/** Admin actions. On the real backend these run server-side, checked against the admin role. */

function assertAdmin(adminId: string) {
  const u = getStore().users.find((x) => x.id === adminId);
  if (u?.role !== "admin") throw new Error("Not allowed");
}

export function reviewDraft(adminId: string, draftId: string, approve: boolean, reason?: string) {
  assertAdmin(adminId);
  setStore((s) => ({
    drafts: s.drafts.map((d) =>
      d.id === draftId && d.status === "pending"
        ? {
            ...d,
            status: approve ? "published" : "rejected",
            rejectionReason: approve ? undefined : (reason?.trim().slice(0, 500) || "Please improve the course and send it again."),
            updatedAt: new Date().toISOString(),
          }
        : d,
    ),
  }));
}

export async function sendPayout(adminId: string, teacherUserId: string, amountUsd: number, rates: Rates) {
  assertAdmin(adminId);
  const account = getStore().payoutAccounts[teacherUserId];
  if (!account || amountUsd < 1) return;
  const id = `p-${randomId(6)}`;
  const amount = Math.floor(amountUsd * rateFor(account.currency, rates));
  setStore((s) => ({
    payouts: [
      { id, userId: teacherUserId, amountUsd, amount, currency: account.currency, status: "processing", createdAt: new Date().toISOString() },
      ...s.payouts,
    ],
  }));
  // Simulated transfer confirmation (the real one arrives by Flutterwave webhook).
  await new Promise((r) => setTimeout(r, 1200));
  setStore((s) => ({ payouts: s.payouts.map((p) => (p.id === id ? { ...p, status: "paid" } : p)) }));
}
