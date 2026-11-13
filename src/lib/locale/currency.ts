/** Pure currency helpers. Rates are "units per 1 USD". Safe on server and client. */

export type Rates = Record<string, number>;

export const FALLBACK_RATES: Rates = {
  USD: 1, EUR: 0.92, GBP: 0.78, CAD: 1.38, AUD: 1.52, AED: 3.67,
  NGN: 1550, GHS: 12, KES: 129, ZAR: 18, UGX: 3700, TZS: 2600, RWF: 1400,
  XOF: 600, XAF: 600, EGP: 49, ETB: 125, MAD: 10, DZD: 135, TND: 3.1,
  ZMW: 26, MWK: 1740, BWP: 13.6, NAD: 18, LSL: 18, SZL: 18, MZN: 64,
  AOA: 910, CDF: 2850, BIF: 2950, CVE: 101, KMF: 450, DJF: 178, ERN: 15,
  GMD: 71, GNF: 8650, LRD: 185, LYD: 5.4, MGA: 4500, MRU: 40, MUR: 46,
  STN: 22.5, SCR: 14, SLE: 23, SOS: 571, SSP: 4500, SDG: 600,
};

/** Currencies the payment provider (Flutterwave) can charge in. Others are charged in USD. */
export const CHARGEABLE_CURRENCIES = new Set([
  "NGN", "GHS", "KES", "UGX", "TZS", "RWF", "ZAR", "ZMW", "XAF", "XOF",
  "EGP", "MWK", "ETB", "USD", "GBP", "EUR", "CAD",
]);

export const PLATFORM_FEE_RATE = 0.2;

export function rateFor(currency: string, rates: Rates): number {
  return rates[currency] ?? FALLBACK_RATES[currency] ?? 1;
}

/** Round converted prices to friendly numbers, e.g. 15,050 instead of 15,037.42. */
function niceRound(x: number): number {
  if (x <= 0) return 0;
  if (x >= 10000) return Math.ceil(x / 100) * 100;
  if (x >= 1000) return Math.ceil(x / 50) * 50;
  if (x >= 100) return Math.ceil(x / 5) * 5;
  if (x >= 10) return Math.ceil(x);
  return Math.ceil(x * 2) / 2;
}

export function convertPrice(amount: number, from: string, to: string, rates: Rates): number {
  if (amount <= 0) return 0;
  if (from === to) return amount;
  return niceRound((amount / rateFor(from, rates)) * rateFor(to, rates));
}

export function toUsd(amount: number, currency: string, rates: Rates): number {
  return Math.round((amount / rateFor(currency, rates)) * 100) / 100;
}

export function chargeCurrency(viewerCurrency: string): string {
  return CHARGEABLE_CURRENCIES.has(viewerCurrency) ? viewerCurrency : "USD";
}

export function formatCash(amount: number, currency: string): string {
  const whole = amount % 1 === 0;
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: whole ? 0 : 2,
      minimumFractionDigits: whole ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en")}`;
  }
}

export function formatPrice(amount: number, currency: string): string {
  return amount <= 0 ? "Free" : formatCash(amount, currency);
}

export type PriceView = {
  amount: number;
  currency: string;
  label: string;
  original: string;
  converted: boolean;
};

export function priceView(price: number, from: string, to: string, rates: Rates): PriceView {
  const amount = convertPrice(price, from, to, rates);
  return {
    amount,
    currency: to,
    label: formatPrice(amount, to),
    original: formatPrice(price, from),
    converted: from !== to && price > 0,
  };
}

/** Keep only the rates the client needs, to keep the page small. */
export function pickRates(rates: Rates, currencies: Iterable<string>): Rates {
  const out: Rates = {};
  for (const c of currencies) out[c] = rateFor(c, rates);
  return out;
}
