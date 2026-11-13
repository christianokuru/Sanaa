import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { hasSupabase } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/lib/types";

export type SessionUser = { id: string; email: string; profile: Profile };

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  if (!hasSupabase) return null;
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, country, bio")
    .eq("id", data.user.id)
    .single();
  if (!profile) return null;
  return { id: data.user.id, email: data.user.email ?? "", profile: profile as Profile };
});

export async function requireUser(next: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireRole(roles: Role[], next: string): Promise<SessionUser> {
  const user = await requireUser(next);
  if (!roles.includes(user.profile.role)) redirect("/account?error=not-allowed");
  return user;
}
