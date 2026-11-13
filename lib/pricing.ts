import "server-only";
import { convertPrice, formatMoney, getRates, type Rates } from "@/lib/currency";
import { getViewerCurrency } from "@/lib/geo";

export type PriceView = { label: string; amount: number; currency: string; original: string; converted: boolean };

export function priceView(price: number, from: string, to: string, rates: Rates): PriceView {
  const amount = convertPrice(price, from, to, rates);
  return {
    label: formatMoney(amount, to),
    amount,
    currency: to,
    original: formatMoney(price, from),
    converted: from !== to && price > 0,
  };
}

/** Returns a function that prices any course in the visitor's currency. */
export async function getPricer() {
  const rates = await getRates();
  const currency = getViewerCurrency();
  return (price: number, from: string) => priceView(price, from, currency, rates);
}
