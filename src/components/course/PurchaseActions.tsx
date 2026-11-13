"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLocale, usePrice } from "@/components/locale/LocaleProvider";
import { useCurrentUser, useEnrollment, useHydrated } from "@/lib/hooks/use-store";
import { enrollFree } from "@/lib/services/checkout";
import { toast } from "@/lib/services/toast";
import { chargeCurrency } from "@/lib/locale/currency";
import { cn } from "@/lib/utils/cn";

type Props = { courseId: string; slug: string; price: number; currency: string; previewLessonId?: string };

function usePurchase({ courseId, slug, price }: Props) {
  const router = useRouter();
  const user = useCurrentUser();
  const enrollment = useEnrollment(courseId);
  const hydrated = useHydrated();
  const { currency } = useLocale();
  const [busy, setBusy] = useState(false);

  function enrollForFree() {
    if (!user) return router.push(`/login?next=${encodeURIComponent(`/courses/${slug}`)}`);
    setBusy(true);
    enrollFree(user.id, courseId, currency);
    toast("You're in! Enjoy the course.", { tone: "success" });
    router.push(`/learn/${slug}`);
  }

  return { enrolled: Boolean(enrollment), hydrated, busy, enrollForFree, isFree: price === 0 };
}

function PrimaryAction({ props, block }: { props: Props; block?: boolean }) {
  const { enrolled, hydrated, busy, enrollForFree, isFree } = usePurchase(props);
  if (!hydrated) return <Button block={block} disabled>Loading…</Button>;
  if (enrolled) return <Button href={`/learn/${props.slug}`} block={block} variant="dark"><PlayCircle className="h-5 w-5" /> Continue learning</Button>;
  if (isFree) return <Button block={block} onClick={enrollForFree} loading={busy}>Enroll for free</Button>;
  return <Button href={`/checkout/${props.slug}`} block={block} className="bg-gradient-to-r from-ember-bright to-ember">Buy now</Button>;
}

/** Desktop sticky card. */
export function PurchaseCard(props: Props) {
  const view = usePrice(props.price, props.currency);
  const { currency } = useLocale();
  const charged = chargeCurrency(currency);
  return (
    <div className="rounded-2xl border border-line p-6 shadow-float">
      <p className="text-[1.75rem] font-bold tracking-[-0.02em]">
        <span className={cn(view.amount === 0 && "text-malachite")}>{view.label}</span>
      </p>
      {view.converted && <p className="mt-1 text-body text-ink-soft">Teacher&apos;s price {view.original} · converted at today&apos;s rate</p>}
      <div className="mt-6 space-y-3">
        <PrimaryAction props={props} block />
        {props.previewLessonId && (
          <Button href={`/learn/${props.slug}?lesson=${props.previewLessonId}`} variant="outline" block>
            Watch a free preview
          </Button>
        )}
      </div>
      <p className="mt-4 text-center text-caption text-ink-soft">
        {props.price === 0 ? "Free forever. No card needed." : charged === currency ? "Mobile money, card or bank transfer" : "Charged in USD by card. Mobile money coming to your country soon."}
      </p>
    </div>
  );
}

/** Phone bottom bar, like a booking bar. */
export function PurchaseBar(props: Props) {
  const view = usePrice(props.price, props.currency);
  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white md:hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div className="min-w-0">
          <p className={cn("text-ui font-bold", view.amount === 0 && "text-malachite")}>{view.label}</p>
          {props.previewLessonId ? (
            <a href={`/learn/${props.slug}?lesson=${props.previewLessonId}`} className="text-caption font-semibold underline underline-offset-2">Watch free preview</a>
          ) : (
            view.converted && <p className="truncate text-caption text-ink-soft">{view.original}</p>
          )}
        </div>
        <div className="w-44 shrink-0">
          <PrimaryAction props={props} block />
        </div>
      </div>
    </div>
  );
}
