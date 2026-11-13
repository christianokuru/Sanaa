"use server";

import { cookies } from "next/headers";
import { COUNTRY_COOKIE, findCountry } from "@/lib/locale/countries";

export async function setCountryAction(code: string): Promise<void> {
  const country = findCountry(typeof code === "string" ? code : "");
  if (!country) return;
  cookies().set(COUNTRY_COOKIE, country.code, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  });
}
