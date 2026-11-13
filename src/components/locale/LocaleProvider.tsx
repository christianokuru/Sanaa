"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import type { Country } from "@/lib/locale/countries";
import { priceView, type PriceView, type Rates } from "@/lib/locale/currency";

type LocaleValue = { country: Country | null; currency: string; rates: Rates };

const LocaleContext = createContext<LocaleValue>({ country: null, currency: "USD", rates: { USD: 1 } });

export function LocaleProvider({ value, children }: { value: LocaleValue; children: React.ReactNode }) {
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleValue {
  return useContext(LocaleContext);
}

/** Price any amount in the visitor's currency. */
export function usePricer(): (price: number, from: string) => PriceView {
  const { currency, rates } = useLocale();
  return useCallback((price: number, from: string) => priceView(price, from, currency, rates), [currency, rates]);
}

export function usePrice(price: number, from: string): PriceView {
  const pricer = usePricer();
  return useMemo(() => pricer(price, from), [pricer, price, from]);
}
