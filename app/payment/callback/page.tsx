import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { finalizePayment, type FinalizeResult } from "@/lib/payments";
import { hasSupabase } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payment" };

export default async function PaymentCallback({
  searchParams,
}: { searchParams: { status?: string; tx_ref?: string; transaction_id?: string } }) {
  let result: FinalizeResult;
  if (!hasSupabase) {
    result = { ok: false, reason: "Payments are not set up yet." };
  } else if (searchParams.status === "cancelled" || !searchParams.transaction_id) {
    result = { ok: false, reason: "You cancelled the payment. You have not been charged." };
  } else {
    try {
      result = await finalizePayment(searchParams.transaction_id);
    } catch (e) {
      console.error("Payment verify failed", e);
      result = { ok: false, reason: "We could not confirm your payment yet. If money left your account, it will show in My learning within a few minutes." };
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      {result.ok ? (
        <>
          <CheckCircle2 className="mx-auto h-16 w-16 text-forest" />
          <h1 className="mt-4 font-display text-3xl font-bold">Payment successful</h1>
          <p className="mt-2 text-earth-soft">You now have full access to the course. Enjoy learning!</p>
          <Link href={`/learn/${result.courseSlug}`} className="btn-primary mt-8 w-full">Start learning</Link>
        </>
      ) : (
        <>
          <XCircle className="mx-auto h-16 w-16 text-terracotta" />
          <h1 className="mt-4 font-display text-3xl font-bold">Payment not completed</h1>
          <p className="mt-2 text-earth-soft">{result.reason}</p>
          <Link href={result.courseSlug ? `/courses/${result.courseSlug}` : "/my-learning"} className="btn-primary mt-8 w-full">
            {result.courseSlug ? "Back to course" : "Go to My learning"}
          </Link>
        </>
      )}
    </div>
  );
}
