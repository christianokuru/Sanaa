import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CategoryBar } from "@/components/layout/CategoryBar";
import { CourseGrid } from "@/components/course/CourseGrid";
import { CourseFilters } from "@/components/search/CourseFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { getCategory } from "@/config/categories";
import { parseCourseQuery } from "@/lib/catalog/search-params";
import { searchCourses } from "@/lib/catalog/repository";
import { getRates } from "@/lib/locale/locale.server";

type Props = { searchParams: Record<string, string | string[] | undefined> };

export function generateMetadata({ searchParams }: Props): Metadata {
  const query = parseCourseQuery(searchParams);
  const category = query.category ? getCategory(query.category)?.name : undefined;
  const title = query.q ? `“${query.q}” courses` : category ? `${category} courses` : "Browse all courses";
  const filtered = Boolean(query.q || query.level || query.price || query.sort);
  return {
    title,
    description: "Find courses in sewing, braiding, makeup, dance, drumming and beadwork, priced in your currency.",
    alternates: { canonical: query.category && !filtered ? `/categories/${query.category}` : "/courses" },
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

export default async function CoursesPage({ searchParams }: Props) {
  const query = parseCourseQuery(searchParams);
  const courses = searchCourses(query, await getRates());
  const category = query.category ? getCategory(query.category) : undefined;
  const heading = query.q ? `Results for “${query.q}”` : category ? category.name : "All courses";

  return (
    <>
      <Container className="sticky top-[var(--header-h)] z-30 hidden border-b border-line bg-white pt-4 md:block">
        <CategoryBar active={query.category ?? "all"} />
      </Container>
      <Container className="pt-3 md:hidden">
        <CategoryBar active={query.category ?? "all"} />
      </Container>
      <Container className="pt-6 md:pt-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[1.75rem] font-bold tracking-[-0.03em] md:text-[2rem]">{heading}</h1>
            <p className="mt-1 text-body text-ink-soft">{courses.length} course{courses.length === 1 ? "" : "s"} · prices in your currency</p>
          </div>
          <CourseFilters query={query} />
        </div>
        <div className="mt-8">
          {courses.length === 0 ? (
            <EmptyState icon={SearchX} title="No courses match" action={<Button href="/courses" variant="dark">See all courses</Button>}>
              Try a different word, or remove a filter.
            </EmptyState>
          ) : (
            <CourseGrid courses={courses} />
          )}
        </div>
      </Container>
    </>
  );
}
