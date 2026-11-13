import "server-only";
import { cookies, headers } from "next/headers";
import { COUNTRY_COOKIE, findCountry, type Country } from "@/lib/countries";

/** The visitor's country: their own choice first, then what the host detected from their IP. */
export function getViewerCountry(): Country | undefined {
  const chosen = cookies().get(COUNTRY_COOKIE)?.value;
  const h = headers();
  const detected = h.get("x-vercel-ip-country") || h.get("cf-ipcountry");
  return findCountry(chosen) ?? findCountry(detected);
}

export function getViewerCurrency(): string {
  return getViewerCountry()?.currency ?? "USD";
}
