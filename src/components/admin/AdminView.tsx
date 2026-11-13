"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";
import { ReviewQueue } from "@/components/admin/ReviewQueue";
import { useRequiredUser } from "@/components/auth/RequireAuth";
import { useLocale } from "@/components/locale/LocaleProvider";
import { getAllCourses, getCourseById } from "@/lib/catalog/repository";
import { PLATFORM_FEE_RATE, formatCash, formatPrice, rateFor } from "@/lib/locale/currency";
import { flagEmoji } from "@/lib/locale/countries";
import { useAppStore } from "@/lib/store/app-store";
import { toPublicUser } from "@/lib/services/auth";
import { platformStats, teacherStats } from "@/lib/services/earnings";
import { sendPayout } from "@/lib/services/admin";
import { toast } from "@/lib/services/toast";
import { formatCompact, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type Tab = "overview" | "reviews" | "payouts" | "sales";
const usd = (n: number) => `$${n.toLocaleString("en", { maximumFractionDigits: 0 })}`;

export function AdminView() {
  const admin = useRequiredUser();
  const state = useAppStore();
  const { rates } = useLocale();
  const [tab, setTab] = useState<Tab>("overview");
  const pendingCount = state.drafts.filter((d) => d.status === "pending").length;
  const totals = useMemo(() => platformStats(state, rates, getAllCourses()), [state, rates]);

  const tabs: Array<{ id: Tab; label: string; count?: number }> = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: "Course reviews", count: pendingCount },
    { id: "payouts", label: "Teacher payouts" },
    { id: "sales", label: "Sales" },
  ];

  return (
    <div className="pb-12 pt-8 md:pt-12">
      <PageHeader title="Admin" subtitle="Approve courses, pay teachers and track sales." />
      <div role="tablist" aria-label="Admin sections" className="no-scrollbar mt-6 flex gap-6 overflow-x-auto border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn("-mb-px flex shrink-0 items-center gap-2 border-b-2 pb-3 text-body font-semibold", tab === t.id ? "border-ink" : "border-transparent text-ink-soft hover:text-ink")}
          >
            {t.label}
            {!!t.count && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1.5 text-[11px] text-white">{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "overview" && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Total sales" value={usd(totals.grossUsd)} sub="All time, in USD" />
            <StatTile label={`Your ${Math.round(PLATFORM_FEE_RATE * 100)}% revenue`} value={usd(totals.platformUsd)} sub="Platform commission" tone="ember" />
            <StatTile label="Learners" value={formatCompact(totals.learners)} />
            <StatTile label="Waiting for review" value={String(pendingCount)} sub="Courses" tone="ink" />
          </div>
        )}

        {tab === "reviews" && <ReviewQueue adminId={admin.id} />}

        {tab === "payouts" && (
          <ul className="divide-y divide-line rounded-card border border-line">
            {state.users
              .filter((u) => u.role === "teacher")
              .map((u) => {
                const stats = teacherStats(toPublicUser(u), state, rates);
                const account = state.payoutAccounts[u.id];
                return (
                  <li key={u.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <p className="text-ui font-semibold">{flagEmoji(u.country)} {u.name}</p>
                      <p className="text-body text-ink-soft">
                        {account ? `${account.provider} ···${account.accountNumber.slice(-4)} · ${account.currency}` : "No payout details yet"}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-ui font-semibold">
                        {account ? formatCash(Math.floor(stats.balanceUsd * rateFor(account.currency, rates)), account.currency) : usd(stats.balanceUsd)}
                      </p>
                      <p className="text-caption text-ink-soft">{usd(stats.balanceUsd)} owed</p>
                    </div>
                    <Button
                      size="sm"
                      variant="dark"
                      disabled={!account || stats.balanceUsd < 1}
                      onClick={async () => {
                        toast(`Sending payout to ${u.name}…`);
                        await sendPayout(admin.id, u.id, stats.balanceUsd, rates);
                        toast(`Payout to ${u.name} completed`, { tone: "success" });
                      }}
                    >
                      Send payout
                    </Button>
                  </li>
                );
              })}
          </ul>
        )}

        {tab === "sales" && <SalesTable />}
      </div>
    </div>
  );
}

function SalesTable() {
  const enrollments = useAppStore((s) => s.enrollments);
  const users = useAppStore((s) => s.users);
  const paid = enrollments.filter((e) => e.amountUsd > 0);
  return (
    <div className="overflow-x-auto rounded-card border border-line">
      <table className="w-full min-w-[640px] text-left text-body">
        <thead className="bg-canvas text-caption uppercase tracking-wider text-ink-soft">
          <tr>
            <th className="p-4">Date</th>
            <th className="p-4">Course</th>
            <th className="p-4">Learner</th>
            <th className="p-4 text-right">Paid</th>
            <th className="p-4 text-right">Sanaa 20%</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {paid.map((e) => (
            <tr key={e.id}>
              <td className="p-4">{formatDate(e.createdAt)}</td>
              <td className="p-4 font-medium">{getCourseById(e.courseId)?.title}</td>
              <td className="p-4">{users.find((u) => u.id === e.userId)?.name ?? "Deleted user"}</td>
              <td className="p-4 text-right">{formatPrice(e.amount, e.currency)}</td>
              <td className="p-4 text-right font-semibold text-malachite">${(e.amountUsd * PLATFORM_FEE_RATE).toFixed(2)}</td>
            </tr>
          ))}
          {paid.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-ink-soft">No sales in this app yet. Buy a course as a learner to see it here.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
