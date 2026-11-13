import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { reviewCourse, sendPayout } from "@/lib/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";
import { categoryName } from "@/lib/config";
import { formatCash, formatMoney, getRates, rateFor } from "@/lib/currency";
import { flagEmoji } from "@/lib/countries";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

const TABS = [
  { id: "review", label: "Course reviews" },
  { id: "payouts", label: "Teacher payouts" },
  { id: "sales", label: "Sales" },
];

export default async function AdminPage({ searchParams }: { searchParams: { tab?: string } }) {
  await requireRole(["admin"], "/admin");
  const tab = TABS.some((t) => t.id === searchParams.tab) ? searchParams.tab! : "review";
  const db = createAdminClient();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="font-display text-3xl font-bold">Admin</h1>
      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        {TABS.map((t) => (
          <Link key={t.id} href={`/admin?tab=${t.id}`}
            className={`chip min-h-[40px] whitespace-nowrap px-4 text-sm ${tab === t.id ? "bg-earth text-cream" : "bg-white shadow-card"}`}>
            {t.label}
          </Link>
        ))}
      </div>
      <div className="mt-6">
        {tab === "review" && <ReviewTab db={db} />}
        {tab === "payouts" && <PayoutsTab db={db} />}
        {tab === "sales" && <SalesTab db={db} />}
      </div>
    </div>
  );
}

type DB = ReturnType<typeof createAdminClient>;

async function ReviewTab({ db }: { db: DB }) {
  const { data } = await db
    .from("courses")
    .select("id, slug, title, category, price, currency, created_at, teacher:profiles!courses_teacher_id_fkey(full_name, country), lessons(id)")
    .eq("status", "pending")
    .order("updated_at", { ascending: true });
  const courses = (data ?? []) as unknown as {
    id: string; slug: string; title: string; category: string; price: number; currency: string;
    teacher: { full_name: string; country: string | null } | null; lessons: { id: string }[];
  }[];

  if (courses.length === 0) return <p className="card p-6 text-earth-soft">No courses waiting for review.</p>;
  return (
    <ul className="space-y-3">
      {courses.map((c) => (
        <li key={c.id} className="card p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <Link href={`/courses/${c.slug}`} className="font-display text-lg font-bold hover:text-terracotta">{c.title}</Link>
              <p className="text-sm text-earth-soft">
                {c.teacher?.country && flagEmoji(c.teacher.country)} {c.teacher?.full_name} · {categoryName(c.category)} · {c.lessons.length} lessons · {formatMoney(Number(c.price), c.currency)}
              </p>
            </div>
            <Link href={`/learn/${c.slug}`} className="text-sm font-semibold text-terracotta">Watch lessons →</Link>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-[auto_1fr]">
            <form action={reviewCourse}>
              <input type="hidden" name="courseId" value={c.id} />
              <input type="hidden" name="decision" value="approve" />
              <SubmitButton className="btn bg-forest px-5 text-white">Approve</SubmitButton>
            </form>
            <form action={reviewCourse} className="flex gap-2">
              <input type="hidden" name="courseId" value={c.id} />
              <input type="hidden" name="decision" value="reject" />
              <input name="reason" placeholder="What should the teacher fix?" className="input" />
              <SubmitButton className="btn-outline px-5">Reject</SubmitButton>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}

async function PayoutsTab({ db }: { db: DB }) {
  const [{ data: balances }, { data: accounts }, { data: profiles }, { data: recent }, rates] = await Promise.all([
    db.from("teacher_balances").select("*"),
    db.from("payout_accounts").select("*"),
    db.from("profiles").select("id, full_name, country").in("role", ["teacher", "admin"]),
    db.from("payouts").select("id, teacher_id, amount, currency, status, note, created_at").order("created_at", { ascending: false }).limit(30),
    getRates(),
  ]);
  const acc = new Map((accounts ?? []).map((a) => [a.teacher_id, a]));
  const names = new Map((profiles ?? []).map((p) => [p.id, p]));
  const owed = (balances ?? [])
    .map((b) => ({ id: b.teacher_id as string, usd: Math.max(0, Number(b.earned_usd) - Number(b.paid_out_usd)) }))
    .filter((b) => b.usd >= 1)
    .sort((a, b) => b.usd - a.usd);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-xl font-bold">Teachers to pay</h2>
        {owed.length === 0 ? <p className="card mt-3 p-6 text-earth-soft">Nobody is owed money right now.</p> : (
          <ul className="mt-3 space-y-3">
            {owed.map((b) => {
              const a = acc.get(b.id);
              const p = names.get(b.id);
              return (
                <li key={b.id} className="card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-bold">{p?.country && flagEmoji(p.country)} {p?.full_name}</p>
                      <p className="text-sm text-earth-soft">
                        Owed ${b.usd.toFixed(2)}
                        {a && <> ≈ {formatCash(Math.floor(b.usd * rateFor(a.currency, rates)), a.currency)} to {a.provider_name ?? a.provider_code} ···{a.account_number.slice(-4)}</>}
                      </p>
                    </div>
                    {a ? (
                      <div className="flex gap-2">
                        <form action={sendPayout}>
                          <input type="hidden" name="teacherId" value={b.id} />
                          <SubmitButton className="btn-primary px-5" pendingText="Sending...">Send now</SubmitButton>
                        </form>
                        <form action={sendPayout}>
                          <input type="hidden" name="teacherId" value={b.id} />
                          <input type="hidden" name="manual" value="1" />
                          <SubmitButton className="btn-outline px-4 text-sm">Mark paid</SubmitButton>
                        </form>
                      </div>
                    ) : <span className="chip bg-gold-light">No payout details yet</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <section>
        <h2 className="font-display text-xl font-bold">Recent payouts</h2>
        <ul className="card mt-3 divide-y divide-earth/10">
          {(recent ?? []).map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <span>{names.get(r.teacher_id)?.full_name}</span>
              <span className="font-bold">{formatCash(Number(r.amount), r.currency)}</span>
              <span className={`chip ${r.status === "paid" ? "bg-forest-light text-forest" : r.status === "failed" ? "bg-terracotta-light text-terracotta-dark" : "bg-gold-light"}`}>{r.status}</span>
              {r.note && <span className="w-full text-xs text-earth-soft">{r.note}</span>}
            </li>
          ))}
          {(recent ?? []).length === 0 && <li className="p-4 text-sm text-earth-soft">No payouts yet.</li>}
        </ul>
      </section>
    </div>
  );
}

async function SalesTab({ db }: { db: DB }) {
  const { data } = await db
    .from("payments")
    .select("id, amount, currency, amount_usd, platform_fee_usd, paid_at, course:courses(title)")
    .eq("status", "successful")
    .order("paid_at", { ascending: false })
    .limit(500);
  const rows = (data ?? []) as unknown as { id: string; amount: number; currency: string; amount_usd: number; platform_fee_usd: number; paid_at: string; course: { title: string } | null }[];
  const total = rows.reduce((s, r) => s + Number(r.amount_usd), 0);
  const fees = rows.reduce((s, r) => s + Number(r.platform_fee_usd), 0);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="card p-4"><p className="text-xs text-earth-soft">Sales</p><p className="text-2xl font-extrabold">{rows.length}</p></div>
        <div className="card p-4"><p className="text-xs text-earth-soft">Total sold</p><p className="text-2xl font-extrabold">${total.toFixed(2)}</p></div>
        <div className="rounded-2xl bg-forest p-4 text-white"><p className="text-xs text-white/80">Your 20% earnings</p><p className="text-2xl font-extrabold">${fees.toFixed(2)}</p></div>
      </div>
      <p className="mt-2 text-xs text-earth-soft">Last 500 sales, shown in US dollars at the rate on the day of each sale.</p>
      <ul className="card mt-4 divide-y divide-earth/10">
        {rows.slice(0, 50).map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
            <span className="min-w-0 flex-1 truncate">{r.course?.title}</span>
            <span className="font-bold">{formatCash(Number(r.amount), r.currency)}</span>
            <span className="text-forest">+${Number(r.platform_fee_usd).toFixed(2)}</span>
          </li>
        ))}
        {rows.length === 0 && <li className="p-4 text-sm text-earth-soft">No sales yet.</li>}
      </ul>
    </div>
  );
}
