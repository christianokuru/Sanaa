/**
 * Teacher earnings. Pure functions over the catalog and saved state, so the teacher
 * dashboard and the admin payouts screen always agree.
 * On the backend this becomes a database view (see legacy/supabase/schema.sql: teacher_balances).
 */
import { getCoursesByTeacher, getCourseById } from "@/lib/catalog/repository";
import type { Course } from "@/lib/catalog/types";
import { PLATFORM_FEE_RATE, rateFor, type Rates } from "@/lib/locale/currency";
import type { PersistedState, PublicUser } from "@/lib/store/schema";
import { hashString } from "@/lib/utils/slug";

const TEACHER_SHARE = 1 - PLATFORM_FEE_RATE;
/** Share of historical (seed) earnings already paid out before today. */
const HISTORIC_PAID_RATIO = 0.92;

export type Sale = { id: string; courseId: string; courseTitle: string; buyer: string; country: string; amountUsd: number; earningUsd: number; date: string };

export type TeacherStats = {
  courses: Course[];
  students: number;
  rating: number;
  earnedUsd: number;
  paidOutUsd: number;
  balanceUsd: number;
  monthly: Array<{ label: string; usd: number }>;
  sales: Sale[];
};

function priceUsd(c: Course, rates: Rates) {
  return c.price / rateFor(c.currency, rates);
}

const BUYERS: Array<[string, string]> = [["Chiamaka", "NG"], ["Esi", "GH"], ["Brian", "UG"], ["Zanele", "ZA"], ["Achieng", "KE"], ["Kemi", "GB"], ["Moussa", "SN"], ["Aisha", "TZ"]];

export function teacherStats(user: PublicUser, state: PersistedState, rates: Rates): TeacherStats {
  const catalog = user.teacherId ? getCoursesByTeacher(user.teacherId) : [];
  const courseIds = new Set(catalog.map((c) => c.id));

  // Historic earnings from the catalog numbers.
  const historicUsd = catalog.reduce((s, c) => s + c.students * priceUsd(c, rates) * TEACHER_SHARE * 0.35, 0);

  // Sales made in this app.
  const live: Sale[] = state.enrollments
    .filter((e) => courseIds.has(e.courseId) && e.amountUsd > 0)
    .map((e) => {
      const buyer = state.users.find((u) => u.id === e.userId);
      return {
        id: e.id,
        courseId: e.courseId,
        courseTitle: getCourseById(e.courseId)?.title ?? "",
        buyer: buyer?.name.split(" ")[0] ?? "Learner",
        country: buyer?.country ?? "",
        amountUsd: e.amountUsd,
        earningUsd: e.amountUsd * TEACHER_SHARE,
        date: e.createdAt,
      };
    });

  // A few recent historic sales so a new dashboard isn't empty.
  const historic: Sale[] = catalog.flatMap((c, ci) =>
    [0, 1].map((i) => {
      const h = hashString(`${c.id}-${i}`);
      const [buyer, country] = BUYERS[h % BUYERS.length]!;
      const usd = priceUsd(c, rates);
      return {
        id: `h-${c.id}-${i}`,
        courseId: c.id,
        courseTitle: c.title,
        buyer,
        country,
        amountUsd: usd,
        earningUsd: usd * TEACHER_SHARE,
        date: new Date(Date.UTC(2026, 9, 28 - ci * 3 - i * 5)).toISOString(),
      };
    }),
  ).filter((s) => s.amountUsd > 0);

  const liveUsd = live.reduce((s, x) => s + x.earningUsd, 0);
  const paidOutUsd = historicUsd * HISTORIC_PAID_RATIO + state.payouts.filter((p) => p.userId === user.id && p.status !== "failed").reduce((s, p) => s + p.amountUsd, 0);
  const earnedUsd = historicUsd + liveUsd;

  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
  const weights = [0.12, 0.14, 0.15, 0.17, 0.2, 0.22];
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  // Roughly a quarter of historic earnings came in the last six months, growing month on month.
  const monthly = months.map((label, i) => ({
    label,
    usd: (historicUsd * 0.25 * weights[i]!) / totalWeight + (i === months.length - 1 ? liveUsd : 0),
  }));

  const students = catalog.reduce((s, c) => s + c.students, 0) + live.length;
  const rated = catalog.filter((c) => c.ratingCount > 0);
  const rating = rated.reduce((s, c) => s + c.rating * c.ratingCount, 0) / Math.max(1, rated.reduce((s, c) => s + c.ratingCount, 0));

  return {
    courses: catalog,
    students,
    rating,
    earnedUsd,
    paidOutUsd,
    balanceUsd: Math.max(0, Math.floor((earnedUsd - paidOutUsd) * 100) / 100),
    monthly,
    sales: [...live, ...historic].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8),
  };
}

/** Platform totals for the admin overview. */
export function platformStats(state: PersistedState, rates: Rates, allCourses: Course[]) {
  const historicUsd = allCourses.reduce((s, c) => s + c.students * priceUsd(c, rates) * 0.35, 0);
  const liveUsd = state.enrollments.reduce((s, e) => s + e.amountUsd, 0);
  const grossUsd = historicUsd + liveUsd;
  return {
    grossUsd,
    platformUsd: grossUsd * PLATFORM_FEE_RATE,
    learners: allCourses.reduce((s, c) => s + c.students, 0) + state.enrollments.length,
    liveSales: state.enrollments.filter((e) => e.amountUsd > 0).length,
  };
}
