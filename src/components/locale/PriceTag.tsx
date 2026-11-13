"use client";

import { usePrice } from "@/components/locale/LocaleProvider";
import { cn } from "@/lib/utils/cn";

/** A course price shown in the visitor's currency. */
export function PriceTag({ price, currency, className, showOriginal }: { price: number; currency: string; className?: string; showOriginal?: boolean }) {
  const view = usePrice(price, currency);
  return (
    <span className={className}>
      <span className={cn(view.amount === 0 && "text-malachite")}>{view.label}</span>
      {showOriginal && view.converted && <span className="ml-1.5 text-caption font-normal text-ink-soft">({view.original})</span>}
    </span>
  );
}
