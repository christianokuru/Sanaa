import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase sends people here from the confirmation email.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next") ?? "/my-learning";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/my-learning";
  if (code) {
    const { error } = await createClient().auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(new URL("/login", url.origin));
}
