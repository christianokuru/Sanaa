import Link from "next/link";
import { Search } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { CATEGORIES } from "@/lib/config";
import { getPublishedCourses } from "@/lib/data";
import { getPricer } from "@/lib/pricing";

export const metadata = { title: "Browse courses" };

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const category = CATEGORIES.some((c) => c.slug === searchParams.category) ? searchParams.category : undefined;
  const q = searchParams.q?.slice(0, 80);
  const [courses, price] = await Promise.all([getPublishedCourses({ category, q }), getPricer()]);

  const chip = (active: boolean) =>
    `chip min-h-[40px] whitespace-nowrap px-4 text-sm ${active ? "bg-earth text-cream" : "bg-white text-earth shadow-card"}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="font-display text-3xl font-bold">Browse courses</h1>

      <form className="relative mt-4" action="/courses">
        {category && <input type="hidden" name="category" value={category} />}
        <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-earth/40" />
        <input name="q" defaultValue={q} placeholder="Search: braids, Ankara, Amapiano..." className="input pl-12" />
      </form>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2">
        <Link href={q ? `/courses?q=${encodeURIComponent(q)}` : "/courses"} className={chip(!category)}>All</Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/courses?category=${c.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={chip(category === c.slug)}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {courses.length === 0 ? (
        <div className="card mt-6 p-8 text-center">
          <p className="font-bold">No courses found</p>
          <p className="mt-1 text-sm text-earth-soft">Try another word or category.</p>
        </div>
      ) : (
        <>
          <p className="mt-4 text-sm text-earth-soft">{courses.length} course{courses.length === 1 ? "" : "s"}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} price={price(c.price, c.currency)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
