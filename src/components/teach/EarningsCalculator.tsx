"use client";

import { useState } from "react";
import { useLocale } from "@/components/locale/LocaleProvider";
import { PLATFORM_FEE_RATE, convertPrice, formatCash } from "@/lib/locale/currency";

/** Lets a would-be teacher see what they'd earn, in their own currency. */
export function EarningsCalculator() {
  const { currency, rates } = useLocale();
  const suggested = convertPrice(12, "USD", currency, rates);
  const [price, setPrice] = useState(String(suggested));
  const [students, setStudents] = useState(150);
  const amount = Math.max(0, Number(price) || 0);
  const earnings = Math.floor(amount * students * (1 - PLATFORM_FEE_RATE));

  return (
    <div className="rounded-[28px] bg-white p-6 text-ink shadow-modal md:p-8">
      <p className="text-caption font-semibold uppercase tracking-[0.2em] text-ember">Earnings calculator</p>
      <p className="mt-4 text-body text-ink-soft">You could earn</p>
      <p className="text-[2.5rem] font-bold leading-none tracking-[-0.04em] md:text-[3.25rem]" aria-live="polite">{formatCash(earnings, currency)}</p>
      <div className="mt-8 space-y-6">
        <label className="block">
          <span className="text-body font-semibold">Your course price ({currency})</span>
          <input type="number" inputMode="decimal" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className="mt-2 h-12 w-full rounded-field border border-line-strong px-4 text-ui focus:border-ink focus:outline-none" />
        </label>
        <label className="block">
          <span className="flex justify-between text-body font-semibold"><span>Students</span><span>{students}</span></span>
          <input type="range" min={10} max={1000} step={10} value={students} onChange={(e) => setStudents(Number(e.target.value))} className="mt-3 w-full accent-ember" />
        </label>
      </div>
      <p className="mt-6 text-caption text-ink-soft">You keep {Math.round((1 - PLATFORM_FEE_RATE) * 100)}% of every sale. Paid to mobile money or bank.</p>
    </div>
  );
}
