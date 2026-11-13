import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PayoutForm } from "@/components/teach/PayoutForm";

export const metadata = { title: "Payout details" };
export const dynamic = "force-dynamic";

export default async function PayoutPage() {
  const user = await requireRole(["teacher", "admin"], "/teach/payout");
  const { data: account } = await createClient()
    .from("payout_accounts")
    .select("method, country, provider_code, provider_name, account_number, account_name")
    .eq("teacher_id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <Link href="/teach/dashboard" className="flex items-center gap-1 text-sm font-semibold text-earth-soft"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
      <h1 className="mt-3 font-display text-3xl font-bold">How should we pay you?</h1>
      <p className="mt-1 text-earth-soft">You keep 80% of every sale. We send it to your mobile money or bank account.</p>
      <div className="card mt-6 p-5"><PayoutForm account={account} defaultCountry={user.profile.country ?? undefined} /></div>
      <p className="mt-4 flex items-start gap-2 text-xs text-earth-soft">
        <ShieldCheck className="h-4 w-4 shrink-0 text-forest" /> Only you and the Sanaa team can see these details.
      </p>
    </div>
  );
}
