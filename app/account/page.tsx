import Link from "next/link";
import { ChevronRight, GraduationCap, LogOut, Shield, PlayCircle } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { ProfileForm } from "@/components/ProfileForm";
import { logout } from "@/lib/actions/auth";
import { hasSupabase } from "@/lib/config";

export const metadata = { title: "Account" };

export default async function AccountPage({ searchParams }: { searchParams: { error?: string } }) {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <h1 className="font-display text-3xl font-bold">Your account</h1>
        <p className="mt-2 text-earth-soft">
          {hasSupabase ? "Log in or create an account to buy courses and track your progress." : "Accounts work once Supabase is connected."}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/login" className="btn-primary">Log in</Link>
          <Link href="/signup" className="btn-outline">Create account</Link>
        </div>
      </div>
    );
  }

  const links = [
    { href: "/my-learning", label: "My learning", icon: PlayCircle, show: true },
    { href: "/teach/dashboard", label: "Teacher dashboard", icon: GraduationCap, show: user.profile.role !== "student" },
    { href: "/teach", label: "Become a teacher", icon: GraduationCap, show: user.profile.role === "student" },
    { href: "/admin", label: "Admin", icon: Shield, show: user.profile.role === "admin" },
  ].filter((l) => l.show);

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Hi, {user.profile.full_name.split(" ")[0] || "there"}</h1>
      <p className="text-sm text-earth-soft">{user.email}</p>
      {searchParams.error === "not-allowed" && (
        <p className="mt-4 rounded-xl bg-terracotta-light p-3 text-sm">You don&apos;t have access to that page.</p>
      )}
      <ul className="card mt-6 divide-y divide-earth/10">
        {links.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="flex min-h-[56px] items-center gap-3 px-4">
              <Icon className="h-5 w-5 text-terracotta" /> <span className="flex-1 font-semibold">{label}</span>
              <ChevronRight className="h-4 w-4 text-earth/40" />
            </Link>
          </li>
        ))}
      </ul>
      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-bold">Profile</h2>
        <ProfileForm profile={user.profile} />
      </div>
      <form action={logout} className="mt-6">
        <button className="btn-outline w-full"><LogOut className="h-4 w-4" /> Log out</button>
      </form>
    </div>
  );
}
