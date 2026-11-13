import "server-only";
import { hasSupabase } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { DEMO_COURSES, demoLessons, demoReviews } from "@/lib/demo-data";
import type { Course, CourseStats, CourseWithStats, Lesson, Review } from "@/lib/types";

const EMPTY_STATS: CourseStats = { student_count: 0, lesson_count: 0, total_seconds: 0, rating_avg: 0, rating_count: 0 };

const COURSE_SELECT = "*, teacher:profiles!courses_teacher_id_fkey(id, full_name, country, bio)";

async function attachStats(courses: Course[]): Promise<CourseWithStats[]> {
  if (courses.length === 0) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("course_stats")
    .select("*")
    .in("course_id", courses.map((c) => c.id));
  const byId = new Map((data ?? []).map((s) => [s.course_id as string, s as CourseStats]));
  return courses.map((c) => ({ ...c, price: Number(c.price), stats: byId.get(c.id) ?? EMPTY_STATS }));
}

export async function getPublishedCourses(opts: { category?: string; q?: string; limit?: number } = {}) {
  if (!hasSupabase) {
    let list = DEMO_COURSES;
    if (opts.category) list = list.filter((c) => c.category === opts.category);
    if (opts.q) {
      const q = opts.q.toLowerCase();
      list = list.filter((c) => `${c.title} ${c.subtitle} ${c.teacher?.full_name}`.toLowerCase().includes(q));
    }
    return list.slice(0, opts.limit ?? 100);
  }
  const supabase = createClient();
  let query = supabase
    .from("courses")
    .select(COURSE_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 100);
  if (opts.category) query = query.eq("category", opts.category);
  if (opts.q) {
    const safe = opts.q.replace(/[%,()]/g, " ").trim();
    if (safe) query = query.or(`title.ilike.%${safe}%,subtitle.ilike.%${safe}%`);
  }
  const { data } = await query;
  return attachStats((data ?? []) as Course[]);
}

/** Course by slug. Teachers and admins also see their unpublished courses (enforced by database rules). */
export async function getCourseBySlug(slug: string): Promise<CourseWithStats | null> {
  if (!hasSupabase) return DEMO_COURSES.find((c) => c.slug === slug) ?? null;
  const supabase = createClient();
  const { data } = await supabase.from("courses").select(COURSE_SELECT).eq("slug", slug).maybeSingle();
  if (!data) return null;
  const [withStats] = await attachStats([data as Course]);
  return withStats;
}

export async function getLessons(courseId: string): Promise<Lesson[]> {
  if (!hasSupabase) return demoLessons(courseId);
  const supabase = createClient();
  const { data } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .order("position", { ascending: true });
  return (data ?? []) as Lesson[];
}

export async function getReviews(courseId: string): Promise<Review[]> {
  if (!hasSupabase) return demoReviews(courseId);
  const supabase = createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, student:profiles!reviews_student_id_fkey(full_name, country)")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false })
    .limit(30);
  return (data ?? []) as Review[];
}

export async function isEnrolled(courseId: string, userId: string | undefined): Promise<boolean> {
  if (!hasSupabase || !userId) return false;
  const supabase = createClient();
  const { data } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("student_id", userId)
    .maybeSingle();
  return Boolean(data);
}

export async function getCompletedLessonIds(userId: string, lessonIds: string[]): Promise<Set<string>> {
  if (!hasSupabase || lessonIds.length === 0) return new Set();
  const supabase = createClient();
  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("student_id", userId)
    .in("lesson_id", lessonIds);
  return new Set((data ?? []).map((r) => r.lesson_id as string));
}

export function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m} min`;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}
