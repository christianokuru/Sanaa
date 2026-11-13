/**
 * Catalog read API. Today it reads the seed data; when the backend is connected,
 * swap the bodies of these functions for database queries. Callers don't change.
 */
import { CATEGORIES, type CategorySlug } from "@/config/categories";
import { COURSES } from "@/lib/catalog/seed/courses";
import { REVIEWS } from "@/lib/catalog/seed/reviews";
import { TEACHERS, getTeacherById, getTeacherBySlug } from "@/lib/catalog/seed/teachers";
import type { Course, CourseQuery, Lesson, Review, Teacher } from "@/lib/catalog/types";
import { rateFor, type Rates } from "@/lib/locale/currency";

export { getTeacherById, getTeacherBySlug };

export function getAllCourses(): Course[] {
  return COURSES;
}

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getCourseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getCoursesByTeacher(teacherId: string): Course[] {
  return COURSES.filter((c) => c.teacherId === teacherId);
}

export function getCoursesByCategory(category: CategorySlug, limit?: number): Course[] {
  const list = COURSES.filter((c) => c.category === category).sort(byPopularity);
  return limit ? list.slice(0, limit) : list;
}

export function getPopularCourses(limit = 8): Course[] {
  return [...COURSES].sort(byPopularity).slice(0, limit);
}

export function getFreeCourses(limit = 8): Course[] {
  return COURSES.filter((c) => c.price === 0).sort(byPopularity).slice(0, limit);
}

export function getNewCourses(limit = 8): Course[] {
  return COURSES.filter((c) => c.badge === "new").slice(0, limit);
}

export function getRelatedCourses(course: Course, limit = 4): Course[] {
  return COURSES.filter((c) => c.id !== course.id && (c.category === course.category || c.teacherId === course.teacherId))
    .sort(byPopularity)
    .slice(0, limit);
}

export function getReviews(courseId: string): Review[] {
  return REVIEWS.filter((r) => r.courseId === courseId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getTeachers(): Teacher[] {
  return TEACHERS;
}

export function getCategoryCounts(): Record<CategorySlug, number> {
  return Object.fromEntries(CATEGORIES.map((c) => [c.slug, COURSES.filter((x) => x.category === c.slug).length])) as Record<
    CategorySlug,
    number
  >;
}

/** Search and filter. Price sorting compares in USD so mixed currencies sort correctly. */
export function searchCourses(query: CourseQuery, rates: Rates): Course[] {
  const q = query.q?.trim().toLowerCase();
  let list = COURSES.filter((c) => {
    if (query.category && c.category !== query.category) return false;
    if (query.level && c.level !== query.level) return false;
    if (query.price === "free" && c.price > 0) return false;
    if (query.price === "paid" && c.price === 0) return false;
    if (q) {
      const teacher = getTeacherById(c.teacherId);
      const haystack = `${c.title} ${c.subtitle} ${c.category} ${teacher?.name ?? ""}`.toLowerCase();
      if (!q.split(/\s+/).every((word) => haystack.includes(word))) return false;
    }
    return true;
  });

  const usd = (c: Course) => c.price / rateFor(c.currency, rates);
  switch (query.sort) {
    case "rating":
      list = list.sort((a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount);
      break;
    case "newest":
      list = list.sort((a, b) => Number(b.badge === "new") - Number(a.badge === "new"));
      break;
    case "price-low":
      list = list.sort((a, b) => usd(a) - usd(b));
      break;
    case "price-high":
      list = list.sort((a, b) => usd(b) - usd(a));
      break;
    default:
      list = list.sort(byPopularity);
  }
  return list;
}

// ---------- Derived helpers ----------

export function courseLessons(course: Course): Lesson[] {
  return course.sections.flatMap((s) => s.lessons);
}

export function courseDuration(course: Course): number {
  return courseLessons(course).reduce((sum, l) => sum + l.durationSec, 0);
}

export function lessonCount(course: Course): number {
  return courseLessons(course).length;
}

function byPopularity(a: Course, b: Course) {
  return b.students * b.rating - a.students * a.rating;
}
