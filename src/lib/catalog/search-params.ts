import { isCategorySlug } from "@/config/categories";
import type { CourseQuery, CourseSort, Level } from "@/lib/catalog/types";

const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];
const SORTS: CourseSort[] = ["popular", "rating", "newest", "price-low", "price-high"];

type Raw = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Parse untrusted URL params into a safe query. Unknown values are dropped. */
export function parseCourseQuery(raw: Raw): CourseQuery {
  const q = one(raw.q)?.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 80) || undefined;
  const category = one(raw.category);
  const level = one(raw.level) as Level | undefined;
  const price = one(raw.price);
  const sort = one(raw.sort) as CourseSort | undefined;
  return {
    q,
    category: isCategorySlug(category) ? category : undefined,
    level: level && LEVELS.includes(level) ? level : undefined,
    price: price === "free" || price === "paid" ? price : undefined,
    sort: sort && SORTS.includes(sort) ? sort : undefined,
  };
}

export function coursesHref(query: CourseQuery): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v) params.set(k, String(v));
  const s = params.toString();
  return s ? `/courses?${s}` : "/courses";
}

export const POPULAR_SEARCHES = ["Knotless braids", "Ankara dress", "Amapiano", "Bridal makeup", "Djembe", "Beadwork", "Wig making", "Gele"];
