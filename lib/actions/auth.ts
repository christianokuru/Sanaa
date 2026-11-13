"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL, hasSupabase } from "@/lib/config";
import { findCountry } from "@/lib/countries";
import { requireUser } from "@/lib/auth";

type State = { error?: string; message?: string } | null;

function safeNext(next: FormDataEntryValue | null) {
  const n = String(next ?? "");
  return n.startsWith("/") && !n.startsWith("//") ? n : "/my-learning";
}

export async function login(_: State, formData: FormData): Promise<State> {
  if (!hasSupabase) return { error: "Demo mode: connect Supabase to enable accounts." };
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  if (error) return { error: "Wrong email or password." };
  redirect(safeNext(formData.get("next")));
}

export async function signup(_: State, formData: FormData): Promise<State> {
  if (!hasSupabase) return { error: "Demo mode: connect Supabase to enable accounts." };
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = formData.get("role") === "teacher" ? "teacher" : "student";
  const country = findCountry(String(formData.get("country") ?? ""))?.code ?? null;
  if (fullName.length < 2) return { error: "Please enter your name." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const next = role === "teacher" ? "/teach/dashboard" : safeNext(formData.get("next"));
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role, country },
      emailRedirectTo: `${SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) return { error: error.message };
  if (!data.session) return { message: "Check your email to confirm your account, then log in." };
  redirect(next);
}

export async function logout() {
  if (hasSupabase) await createClient().auth.signOut();
  redirect("/");
}

export async function updateProfile(_: State, formData: FormData): Promise<State> {
  const user = await requireUser("/account");
  const { error } = await createClient()
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") ?? "").trim().slice(0, 80),
      bio: String(formData.get("bio") ?? "").trim().slice(0, 600) || null,
      country: findCountry(String(formData.get("country") ?? ""))?.code ?? null,
    })
    .eq("id", user.id);
  if (error) return { error: "Could not save." };
  revalidatePath("/", "layout");
  return { message: "Saved." };
}

export async function becomeTeacher() {
  const user = await requireUser("/teach");
  if (user.profile.role === "student") {
    await createClient().from("profiles").update({ role: "teacher" }).eq("id", user.id);
  }
  redirect("/teach/dashboard");
}
