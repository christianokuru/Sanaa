"use client";

import { useLocale } from "@/components/locale/LocaleProvider";
import { formatCash, rateFor } from "@/lib/locale/currency";

/** Simple, accessible bar chart of monthly earnings in the teacher's currency. */
export function EarningsChart({ monthly, currency }: { monthly: Array<{ label: string; usd: number }>; currency: string }) {
  const { rates } = useLocale();
  const values = monthly.map((m) => Math.floor(m.usd * rateFor(currency, rates)));
  const max = Math.max(1, ...values);
  return (
    <figure>
      <figcaption className="sr-only">Earnings per month</figcaption>
      <ol className="flex h-48 items-end gap-3">
        {monthly.map((m, i) => (
          <li key={m.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-[11px] font-semibold text-ink-soft">{formatCash(values[i]!, currency).replace(/\.00$/, "")}</span>
            <span
              className={i === monthly.length - 1 ? "w-full rounded-t-lg bg-ember" : "w-full rounded-t-lg bg-ink/85"}
              style={{ height: `${Math.max(4, (values[i]! / max) * 75)}%` }}
              aria-label={`${m.label}: ${formatCash(values[i]!, currency)}`}
            />
            <span className="text-caption text-ink-soft">{m.label}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
