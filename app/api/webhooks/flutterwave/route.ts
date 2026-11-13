import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { finalizePayment } from "@/lib/payments";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function sameSecret(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// Flutterwave calls this when a payment or a payout finishes.
export async function POST(req: Request) {
  const secret = process.env.FLW_WEBHOOK_HASH;
  const sent = req.headers.get("verif-hash");
  if (!secret || !sent || !sameSecret(sent, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | { event?: string; data?: { id?: number; status?: string; reference?: string } }
    | null;
  if (!body?.event || !body.data) return NextResponse.json({ ok: true });

  try {
    if (body.event === "charge.completed" && body.data.id) {
      await finalizePayment(String(body.data.id));
    }
    if (body.event === "transfer.completed" && body.data.reference) {
      const status = body.data.status === "SUCCESSFUL" ? "paid" : body.data.status === "FAILED" ? "failed" : null;
      if (status) {
        await createAdminClient()
          .from("payouts")
          .update({ status, flw_transfer_id: body.data.id ? String(body.data.id) : null })
          .eq("reference", body.data.reference);
      }
    }
  } catch (e) {
    console.error("Webhook handling failed", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
