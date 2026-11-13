"use server";

import { cookies } from "next/headers";
import { COUNTRY_COOKIE, findCountry } from "@/lib/countries";

export async function setCountry(code: string) {
  const country = findCountry(code);
  if (!country) return;
  cookies().set(COUNTRY_COOKIE, country.code, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
