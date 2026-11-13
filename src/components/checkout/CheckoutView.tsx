"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Rating } from "@/components/ui/Rating";
import { CourseCover } from "@/components/course/CourseCover";
import { BankFields, CardFields, MethodPicker, MobileMoneyFields } from "@/components/checkout/PaymentMethods";
import { useRequiredUser } from "@/components/auth/RequireAuth";
import { useLocale } from "@/components/locale/LocaleProvider";
import { MOBILE_MONEY_NETWORKS } from "@/config/payments";
import { chargeCurrency, convertPrice, formatPrice, toUsd } from "@/lib/locale/currency";
import { useEnrollment } from "@/lib/hooks/use-store";
import { enrollFree, payForCourse, type PaymentMethod } from "@/lib/services/checkout";
import { toast } from "@/lib/services/toast";
import type { Course } from "@/lib/catalog/types";

type Props = { course: Course; teacherName: string; lessonCount: number };

export function CheckoutView({ course, teacherName, lessonCount }: Props) {
  const user = useRequiredUser();
  const router = useRouter();
  const enrollment = useEnrollment(course.id);
  const { country, currency, rates } = useLocale();

  const charge = chargeCurrency(currency);
  const amount = convertPrice(course.price, course.currency, charge, rates);
  const shown = convertPrice(course.price, course.currency, currency, rates);
  const networks = (country && MOBILE_MONEY_NETWORKS[country.code]) || [];
  const methods = useMemo<PaymentMethod[]>(
    () => (charge === "USD" && currency !== "USD" ? ["card"] : [...(networks.length ? (["mobile_money"] as const) : []), "card", "bank"]),
    [charge, currency, networks.length],
  );

  const [method, setMethod] = useState<PaymentMethod>(methods[0]!);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (enrollment && !busy) router.replace(`/learn/${course.slug}`);
  }, [enrollment, busy, router, course.slug]);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    if (amount === 0) {
      setBusy(true);
      const en = enrollFree(user.id, course.id, currency);
      return router.replace(`/checkout/${course.slug}/success?enrollment=${en.id}`);
    }
    setBusy(true);
    const res = await payForCourse({
      userId: user.id,
      courseId: course.id,
      amount,
      currency: charge,
      amountUsd: toUsd(amount, charge, rates),
      method,
      details: method === "mobile_money" ? { phone: details.phone ?? "" } : method === "card" ? { number: details.number ?? "", expiry: details.expiry ?? "", cvv: details.cvv ?? "", name: details.name ?? "" } : {},
    });
    if (!res.ok) {
      setBusy(false);
      setErrors(res.fields ?? {});
      toast(res.error, { tone: "error" });
      return;
    }
    // Card details only lived in component state; clear them straight away.
    setDetails({});
    router.replace(`/checkout/${course.slug}/success?enrollment=${res.data.id}`);
  }

  const set = (k: string, v: string) => {
    setDetails((d) => ({ ...d, [k]: v }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  const summary = (
    <div className="rounded-2xl border border-line p-6">
      <div className="flex gap-4">
        <div className="w-28 shrink-0"><CourseCover id={course.id} category={course.category} cover={course.cover} /></div>
        <div className="min-w-0">
          <p className="text-ui font-semibold leading-snug">{course.title}</p>
          <p className="mt-1 text-body text-ink-soft">{teacherName}</p>
          <Rating value={course.rating} count={course.ratingCount} className="mt-2 text-caption" />
        </div>
      </div>
      <Divider className="my-6" />
      <h2 className="text-title font-semibold">Price details</h2>
      <dl className="mt-4 space-y-3 text-ui">
        <div className="flex justify-between"><dt>Course ({lessonCount} lessons, lifetime access)</dt><dd>{formatPrice(shown, currency)}</dd></div>
        {charge !== currency && <div className="flex justify-between text-ink-soft"><dt>Charged in {charge}</dt><dd>{formatPrice(amount, charge)}</dd></div>}
        <div className="flex justify-between text-ink-soft"><dt>Fees</dt><dd>None</dd></div>
      </dl>
      <Divider className="my-5" />
      <div className="flex justify-between text-ui font-semibold"><span>Total ({charge})</span><span>{formatPrice(amount, charge)}</span></div>
    </div>
  );

  return (
    <div className="pb-10">
      <div className="flex items-center gap-2 py-4 md:py-10">
        <button type="button" onClick={() => router.back()} aria-label="Go back" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-canvas">
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <h1 className="text-[1.5rem] font-bold tracking-[-0.03em] md:text-[2rem]">Confirm and pay</h1>
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_420px] lg:gap-20">
        <form onSubmit={pay} noValidate className="order-2 md:order-1">
          <div className="md:hidden">{summary}<Divider className="my-8" /></div>
          {amount > 0 ? (
            <>
              <h2 className="text-section font-semibold">Pay with</h2>
              <div className="mt-5"><MethodPicker methods={methods} value={method} onChange={(m) => { setMethod(m); setErrors({}); }} /></div>
              <div className="mt-6">
                {method === "mobile_money" && <MobileMoneyFields networks={networks} details={details} set={set} errors={errors} />}
                {method === "card" && <CardFields details={details} set={set} errors={errors} />}
                {method === "bank" && <BankFields />}
              </div>
            </>
          ) : (
            <p className="text-ui">This course is free. Confirm to add it to your learning.</p>
          )}
          <Divider className="my-8" />
          <p className="text-caption leading-relaxed text-ink-soft">
            By paying, you agree to the <a href="/terms" className="underline">Terms</a> and our refund policy. Test mode: no real money is charged until payments are connected.
          </p>
          <Button type="submit" size="lg" loading={busy} className="mt-6 w-full bg-gradient-to-r from-ember-bright to-ember md:w-auto">
            <Lock className="h-4 w-4" />
            {busy ? "Processing payment…" : amount === 0 ? "Enroll for free" : `Pay ${formatPrice(amount, charge)}`}
          </Button>
          <p className="mt-4 flex items-center gap-2 text-caption text-ink-soft"><ShieldCheck className="h-4 w-4 text-malachite" /> Secured payment · card details are never stored by Sanaa</p>
        </form>
        <aside className="order-1 hidden md:order-2 md:block">
          <div className="sticky top-[calc(var(--header-h)+32px)]">{summary}</div>
        </aside>
      </div>
    </div>
  );
}
