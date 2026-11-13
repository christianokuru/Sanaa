import Link from "next/link";
import { Plus, Users, Wallet, BookOpen, AlertCircle } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CourseThumb } from "@/components/CourseThumb";
import { formatCash, formatMoney, getRates, rateFor } from "@/lib/currency";
import { findCountry } from "@/lib/countries";

export const metadata = { title: "Teacher dashboard" };
export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-sand text-earth",
  pending: "bg-gold-light text-earth",
  published: "bg-forest-light text-forest",
  rejected: "bg-terracotta-light text-terracotta-dark",
};
const STATUS_LABEL: Record<string, string> = {
  draft: "Draft", pending: "Waiting for review", published: "Live", rejected: "Needs changes",
};

export default async function TeacherDashboard() {
  const user = await requireRole(["teacher", "admin"], "/teach/dashboard");
  const supabase = createClient();

  const [{ data: courses }, { data: payments }, { data: payouts }, { data: account }, rates] = await Promise.all([
    supabase.from("courses").select("id, slug, title, category, thumbnail_url, status, price, currency").eq("teacher_id", user.id).order("created_at", { ascending: false }),
    supabase.from("payments").select("course_id, teacher_earning_usd").eq("teacher_id", user.id).eq("status", "successful"),
    supabase.from("payouts").select("id, amount, currency, amount_usd, status, created_at").eq("teacher_id", user.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("payout_accounts").select("method, provider_name, account_number").eq("teacher_id", user.id).maybeSingle(),
    getRates(),
  ]);

  const courseIds = (courses ?? []).map((c) => c.id);
  const { data: enrollments } = courseIds.length
    ? await supabase.from("enrollments").select("course_id").in("course_id", courseIds)
    : { data: [] };

  const studentsByCourse = new Map<string, number>();
  (enrollments ?? []).forEach((e) => studentsByCourse.set(e.course_id, (studentsByCourse.get(e.course_id) ?? 0) + 1));
  const totalStudents = (enrollments ?? []).length;

  const earnedUsd = (payments ?? []).reduce((s, p) => s + Number(p.teacher_earning_usd ?? 0), 0);
  const paidUsd = (payouts ?? []).filter((p) => p.status !== "failed").reduce((s, p) => s + Number(p.amount_usd), 0);
  const balanceUsd = Math.max(0, earnedUsd - paidUsd);
  const myCurrency = findCountry(user.profile.country)?.currency ?? "USD";
  const local = (usd: number) => formatCash(Math.floor(usd * rateFor(myCurrency, rates)), myCurrency);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Your teaching</h1>
        <Link href="/teach/courses/new" className="btn-primary px-4"><Plus className="h-5 w-5" /> <span className="hidden sm:inline">New course</span></Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={Users} label="Students" value={totalStudents.toLocaleString("en")} />
        <Stat icon={BookOpen} label="Courses" value={String(courses?.length ?? 0)} />
        <Stat icon={Wallet} label="Total earned (80%)" value={local(earnedUsd)} sub={`$${earnedUsd.toFixed(2)}`} />
        <Stat icon={Wallet} label="Balance to be paid" value={local(balanceUsd)} sub={`$${balanceUsd.toFixed(2)}`} highlight />
      </div>

      {!account && (
        <Link href="/teach/payout" className="mt-4 flex items-center gap-3 rounded-2xl bg-gold-light p-4">
          <AlertCircle className="h-6 w-6 shrink-0 text-terracotta" />
          <span className="text-sm"><b>Add your payout details</b> so we can send you your money (mobile money or bank).</span>
        </Link>
      )}

      <h2 className="mt-8 font-display text-xl font-bold">Your courses</h2>
      {(courses ?? []).length === 0 ? (
        <div className="card mt-3 p-8 text-center">
          <p className="font-bold">No courses yet</p>
          <p className="mt-1 text-sm text-earth-soft">Create your first course. You can save it as a draft and finish later.</p>
          <Link href="/teach/courses/new" className="btn-primary mt-4">Create a course</Link>
        </div>
      ) : (
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {courses!.map((c) => (
            <li key={c.id}>
              <Link href={`/teach/courses/${c.id}`} className="card flex gap-3 overflow-hidden p-3">
                <div className="w-28 shrink-0 overflow-hidden rounded-xl">
                  <CourseThumb url={c.thumbnail_url} category={c.category} title="" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{c.title}</p>
                  <span className={`chip mt-1 ${STATUS_STYLE[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                  <p className="mt-1 text-xs text-earth-soft">
                    {studentsByCourse.get(c.id) ?? 0} students · {formatMoney(Number(c.price), c.currency)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Payouts</h2>
        <Link href="/teach/payout" className="text-sm font-semibold text-terracotta">{account ? "Edit payout details" : "Add payout details"}</Link>
      </div>
      {account && (
        <p className="mt-1 text-sm text-earth-soft">
          Paid to {account.provider_name ?? (account.method === "bank" ? "bank" : "mobile money")} ending {account.account_number.slice(-4)}
        </p>
      )}
      <ul className="card mt-3 divide-y divide-earth/10">
        {(payouts ?? []).map((p) => (
          <li key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>{new Date(p.created_at).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span className="font-bold">{formatMoney(Number(p.amount), p.currency)}</span>
            <span className={`chip ${p.status === "paid" ? "bg-forest-light text-forest" : p.status === "failed" ? "bg-terracotta-light text-terracotta-dark" : "bg-gold-light"}`}>
              {p.status}
            </span>
          </li>
        ))}
        {(payouts ?? []).length === 0 && <li className="p-4 text-sm text-earth-soft">No payouts yet. Payouts are sent regularly once you have a balance.</li>}
      </ul>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, highlight }: { icon: typeof Users; label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${highlight ? "bg-forest text-white" : "card"}`}>
      <Icon className={`h-5 w-5 ${highlight ? "text-gold" : "text-terracotta"}`} />
      <p className={`mt-2 text-xs ${highlight ? "text-white/80" : "text-earth-soft"}`}>{label}</p>
      <p className="text-xl font-extrabold">{value}</p>
      {sub && <p className={`text-xs ${highlight ? "text-white/60" : "text-earth/40"}`}>{sub}</p>}
    </div>
  );
}
