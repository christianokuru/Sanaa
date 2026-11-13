"use client";

import Link from "next/link";
import { AlertCircle, ChevronRight, Plus, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { CourseCover } from "@/components/course/CourseCover";
import { EarningsChart } from "@/components/teach/EarningsChart";
import { useRequiredUser } from "@/components/auth/RequireAuth";
import { useLocale } from "@/components/locale/LocaleProvider";
import { useTeacherStats } from "@/lib/hooks/use-teacher-stats";
import { useAppStore } from "@/lib/store/app-store";
import { findCountry, flagEmoji } from "@/lib/locale/countries";
import { formatCash, formatPrice, rateFor } from "@/lib/locale/currency";
import { formatCompact, formatDate } from "@/lib/utils/format";
import { useShallow } from "zustand/react/shallow";

const STATUS: Record<string, { label: string; tone: "canvas" | "saffron" | "malachite" | "ember" }> = {
  draft: { label: "Draft", tone: "canvas" },
  pending: { label: "In review", tone: "saffron" },
  published: { label: "Live", tone: "malachite" },
  rejected: { label: "Needs changes", tone: "ember" },
};

export function DashboardView() {
  const user = useRequiredUser();
  const stats = useTeacherStats(user);
  const { rates } = useLocale();
  const currency = findCountry(user.country)?.currency ?? "USD";
  const money = (usd: number) => formatCash(Math.floor(usd * rateFor(currency, rates)), currency);
  const drafts = useAppStore(useShallow((s) => s.drafts.filter((d) => d.ownerId === user.id)));
  const payoutAccount = useAppStore((s) => s.payoutAccounts[user.id]);

  return (
    <>
      <PageHeader
        title={`Hello, ${user.name.split(" ")[0]}`}
        subtitle="Here's how your teaching is doing."
        action={
          <div className="flex flex-wrap gap-3">
            <Button href="/teach/profile" variant="outline"><UserRound className="h-4 w-4" /> Edit profile</Button>
            <Button href="/teach/courses/new"><Plus className="h-4 w-4" /> New course</Button>
          </div>
        }
      />

      {!payoutAccount && (
        <Link href="/teach/payouts" className="mt-6 flex items-center gap-4 rounded-2xl bg-saffron-tint p-4">
          <AlertCircle className="h-6 w-6 shrink-0 text-[#8A5A00]" />
          <span className="flex-1 text-body"><b>Add your payout details</b> so we can send your earnings to mobile money or your bank.</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Ready to pay out" value={money(stats.balanceUsd)} sub={`$${stats.balanceUsd.toFixed(2)}`} tone="ink" />
        <StatTile label="Total earned (80%)" value={money(stats.earnedUsd)} sub="All time" />
        <StatTile label="Students" value={formatCompact(stats.students)} sub="Across all courses" />
        <StatTile label="Average rating" value={stats.rating ? stats.rating.toFixed(2) : "–"} sub="From learner reviews" />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-card border border-line p-6">
          <h2 className="text-title font-semibold">Earnings</h2>
          <p className="text-body text-ink-soft">Last six months, in {currency}</p>
          <div className="mt-6"><EarningsChart monthly={stats.monthly} currency={currency} /></div>
        </section>
        <section className="rounded-card border border-line p-6">
          <h2 className="text-title font-semibold">Recent sales</h2>
          <ul className="mt-4 divide-y divide-line">
            {stats.sales.length === 0 && <li className="py-6 text-body text-ink-soft">No sales yet. Share your course link to get your first students.</li>}
            {stats.sales.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3">
                <span className="text-lg">{s.country ? flagEmoji(s.country) : "🌍"}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body font-medium">{s.courseTitle}</span>
                  <span className="text-caption text-ink-soft">{s.buyer} · {formatDate(s.date, { day: "numeric", month: "short" })}</span>
                </span>
                <span className="text-body font-semibold text-malachite">+{money(s.earningUsd)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="text-section font-semibold">Your courses</h2>
          <Link href="/teach/payouts" className="text-body font-semibold underline underline-offset-4">Payouts</Link>
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {drafts.map((d) => (
            <li key={d.id}>
              <Link href={`/teach/courses/${d.id}`} className="flex gap-4 rounded-card border border-line p-3 transition hover:border-ink">
                <div className="w-24 shrink-0"><CourseCover id={d.id} category={d.category} /></div>
                <div className="min-w-0 flex-1 py-1">
                  <Badge tone={STATUS[d.status]!.tone}>{STATUS[d.status]!.label}</Badge>
                  <p className="mt-2 truncate text-ui font-semibold">{d.title}</p>
                  <p className="text-body text-ink-soft">{d.lessons.length} lessons · {formatPrice(d.price, d.currency)}</p>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0" />
              </Link>
            </li>
          ))}
          {stats.courses.map((c) => (
            <li key={c.id}>
              <Link href={`/courses/${c.slug}`} className="flex gap-4 rounded-card border border-line p-3 transition hover:border-ink">
                <div className="w-24 shrink-0"><CourseCover id={c.id} category={c.category} cover={c.cover} /></div>
                <div className="min-w-0 flex-1 py-1">
                  <Badge tone="malachite">Live</Badge>
                  <p className="mt-2 truncate text-ui font-semibold">{c.title}</p>
                  <p className="text-body text-ink-soft">{formatCompact(c.students)} students · ★ {c.rating} · {formatPrice(c.price, c.currency)}</p>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0" />
              </Link>
            </li>
          ))}
          {drafts.length + stats.courses.length === 0 && (
            <li className="rounded-card bg-canvas p-8 md:col-span-2">
              <p className="text-title font-semibold">Create your first course</p>
              <p className="mt-1 text-body text-ink-soft">Start with a title and price. You can add lessons and save as you go.</p>
              <Button href="/teach/courses/new" variant="dark" className="mt-5">Create a course</Button>
            </li>
          )}
        </ul>
      </section>
    </>
  );
}
