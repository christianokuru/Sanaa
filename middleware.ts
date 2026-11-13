import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { COUNTRY_COOKIE, findCountry } from "@/lib/countries";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Keep the login session fresh.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      },
    );
    await supabase.auth.getUser();
  }

  // Detect the visitor's country once (Vercel and Cloudflare send it as a header).
  if (!request.cookies.get(COUNTRY_COOKIE)) {
    const detected =
      request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry");
    if (detected && findCountry(detected)) {
      response.cookies.set(COUNTRY_COOKIE, detected.toUpperCase(), {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|manifest|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
