"use client";

import Link from "next/link";
import { ChevronRight, GraduationCap, Heart, LogOut, PlayCircle, Shield } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { CountryButton } from "@/components/locale/CountryPicker";
import { ProfileForm } from "@/components/account/ProfileForm";
import { PasswordForm } from "@/components/account/PasswordForm";
import { DeleteAccount } from "@/components/account/DeleteAccount";
import { useRequiredUser } from "@/components/auth/RequireAuth";
import { usePrefs } from "@/lib/hooks/use-store";
import { setDataSaver } from "@/lib/services/library";
import { signOutAndLeave } from "@/lib/services/auth";
import { toast } from "@/lib/services/toast";
import { formatDate } from "@/lib/utils/format";

function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-8 md:grid md:grid-cols-[260px_1fr] md:gap-12">
      <div className="mb-6 md:mb-0">
        <h2 className="text-title font-semibold">{title}</h2>
        {description && <p className="mt-1 text-body text-ink-soft">{description}</p>}
      </div>
      <div className="max-w-xl">{children}</div>
    </section>
  );
}

export function AccountView() {
  const user = useRequiredUser();
  const prefs = usePrefs();

  const links = [
    { href: "/my-learning", label: "My learning", text: "Your courses and progress", icon: PlayCircle },
    { href: "/wishlist", label: "Wishlist", text: "Courses you saved", icon: Heart },
    user.role === "student"
      ? { href: "/teach", label: "Become a teacher", text: "Teach your craft and keep 80%", icon: GraduationCap }
      : { href: "/teach/dashboard", label: "Teacher dashboard", text: "Courses, students and earnings", icon: GraduationCap },
    ...(user.role === "admin" ? [{ href: "/admin", label: "Admin", text: "Reviews, payouts and sales", icon: Shield }] : []),
  ];

  return (
    <>
      <header className="flex items-center gap-5">
        <Avatar name={user.name} size="xl" />
        <div>
          <h1 className="text-[1.75rem] font-bold tracking-[-0.03em]">{user.name}</h1>
          <p className="text-body text-ink-soft">{user.email}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge tone={user.role === "admin" ? "ink" : user.role === "teacher" ? "ember" : "canvas"} className="capitalize">{user.role === "student" ? "Learner" : user.role}</Badge>
            <span className="text-caption text-ink-soft">Joined {formatDate(user.createdAt, { month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </header>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {links.map(({ href, label, text, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="flex h-full items-center gap-4 rounded-2xl p-4 shadow-float ring-1 ring-black/5 transition hover:-translate-y-0.5 md:flex-col md:items-start">
              <Icon className="h-7 w-7 shrink-0" strokeWidth={1.5} />
              <span className="flex-1">
                <span className="block text-ui font-semibold">{label}</span>
                <span className="block text-body text-ink-soft">{text}</span>
              </span>
              <ChevronRight className="h-4 w-4 md:hidden" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Panel title="Personal info" description="How you appear on Sanaa.">
          <ProfileForm user={user} />
        </Panel>
        <Panel title="Preferences" description="Make Sanaa work for your phone and pocket.">
          <div className="space-y-6">
            <Switch label="Data saver" description="Play videos in lower quality to use less data." checked={prefs.dataSaver} onChange={(v) => { setDataSaver(v); toast(v ? "Data saver on" : "Data saver off"); }} />
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-ui font-medium">Country and currency</p>
                <p className="text-body text-ink-soft">Prices show in this currency.</p>
              </div>
              <CountryButton className="border border-line-strong" />
            </div>
          </div>
        </Panel>
        <Panel title="Login and security" description="Keep your account safe.">
          <PasswordForm userId={user.id} />
        </Panel>
        <Panel title="Account">
          <div className="flex flex-col items-start gap-4">
            <button
              type="button"
              onClick={signOutAndLeave}
              className="inline-flex items-center gap-2 text-ui font-semibold underline underline-offset-4"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
            <DeleteAccount userId={user.id} />
          </div>
        </Panel>
      </div>
    </>
  );
}
