import "server-only";
import { cookies, headers } from "next/headers";
import { COUNTRY_COOKIE, findCountry, type Country } from "@/lib/locale/countries";
import { FALLBACK_RATES, type Rates } from "@/lib/locale/currency";

export type ViewerLocale = { country: Country | null; currency: string };

/** The visitor's own choice first, then what the host detected from their IP. */
export function getViewerLocale(): ViewerLocale {
  const chosen = cookies().get(COUNTRY_COOKIE)?.value;
  const h = headers();
  const detected = h.get("x-vercel-ip-country") || h.get("cf-ipcountry");
  const country = findCountry(chosen) ?? findCountry(detected) ?? null;
  return { country, currency: country?.currency ?? "USD" };
}

export async function getRates(): Promise<Rates> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 60 * 60 * 12 } });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { result?: string; rates?: Rates };
    if (json.result !== "success" || !json.rates) throw new Error("bad payload");
    return { ...FALLBACK_RATES, ...json.rates };
  } catch {
    return FALLBACK_RATES;
  }
}
