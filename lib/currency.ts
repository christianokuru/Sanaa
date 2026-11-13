import "server-only";

// Rough rates (units per 1 USD), used only if the live rates service is down.
const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.78, CAD: 1.38, AUD: 1.52, AED: 3.67,
  NGN: 1550, GHS: 12, KES: 129, ZAR: 18, UGX: 3700, TZS: 2600, RWF: 1400,
  XOF: 600, XAF: 600, EGP: 49, ETB: 125, MAD: 10, DZD: 135, TND: 3.1,
  ZMW: 26, MWK: 1740, BWP: 13.6, NAD: 18, LSL: 18, SZL: 18, MZN: 64,
  AOA: 910, CDF: 2850, BIF: 2950, CVE: 101, KMF: 450, DJF: 178, ERN: 15,
  GMD: 71, GNF: 8650, LRD: 185, LYD: 5.4, MGA: 4500, MRU: 40, MUR: 46,
  STN: 22.5, SCR: 14, SLE: 23, SOS: 571, SSP: 4500, SDG: 600,
};

// Currencies Flutterwave can charge in. Anything else is charged in USD.
export const FLUTTERWAVE_CURRENCIES = new Set([
  "NGN", "GHS", "KES", "UGX", "TZS", "RWF", "ZAR", "ZMW", "XAF", "XOF",
  "EGP", "MWK", "ETB", "USD", "GBP", "EUR", "CAD",
]);

export type Rates = Record<string, number>;

export async function getRates(): Promise<Rates> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 60 * 60 * 12 },
    });
    if (!res.ok) throw new Error(`rates ${res.status}`);
    const json = (await res.json()) as { result?: string; rates?: Rates };
    if (json.result !== "success" || !json.rates) throw new Error("bad rates");
    return { ...FALLBACK_RATES, ...json.rates };
  } catch {
    return FALLBACK_RATES;
  }
}

export function rateFor(currency: string, rates: Rates): number {
  return rates[currency] ?? FALLBACK_RATES[currency] ?? 1;
}

// Round converted prices to friendly numbers (e.g. 15,050 not 15,037.42).
function niceRound(x: number): number {
  if (x <= 0) return 0;
  if (x >= 10000) return Math.ceil(x / 100) * 100;
  if (x >= 1000) return Math.ceil(x / 50) * 50;
  if (x >= 100) return Math.ceil(x / 5) * 5;
  if (x >= 10) return Math.ceil(x);
  return Math.ceil(x * 2) / 2;
}

/** Price of a course in another currency. Same function is used for display and for charging. */
export function convertPrice(
  amount: number,
  from: string,
  to: string,
  rates: Rates,
): number {
  if (amount <= 0) return 0;
  if (from === to) return amount;
  const usd = amount / rateFor(from, rates);
  return niceRound(usd * rateFor(to, rates));
}

export function toUsd(amount: number, currency: string, rates: Rates): number {
  return Math.round((amount / rateFor(currency, rates)) * 100) / 100;
}

export function chargeCurrency(viewerCurrency: string): string {
  return FLUTTERWAVE_CURRENCIES.has(viewerCurrency) ? viewerCurrency : "USD";
}

export function formatMoney(amount: number, currency: string): string {
  if (amount <= 0) return "Free";
  return formatCash(amount, currency);
}

/** Like formatMoney, but shows 0 as an amount instead of "Free". */
export function formatCash(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en")}`;
  }
}
