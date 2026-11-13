import Link from "next/link";
import { CourseThumb } from "@/components/CourseThumb";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/config";

export const metadata = { title: "My learning" };
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  completed_at: string | null;
  course: { id: string; slug: string; title: string; category: string; thumbnail_url: string | null; lessons: { id: string }[] } | null;
};

export default async function MyLearningPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <h1 className="font-display text-3xl font-bold">My learning</h1>
        <p className="mt-2 text-earth-soft">{hasSupabase ? "Log in to see your courses." : "Your courses show here once accounts are connected."}</p>
        <Link href={hasSupabase ? "/login?next=/my-learning" : "/courses"} className="btn-primary mt-6 w-full">
          {hasSupabase ? "Log in" : "Browse courses"}
        </Link>
      </div>
    );
  }

  const supabase = createClient();
  const { data } = await supabase
    .from("enrollments")
    .select("id, completed_at, course:courses(id, slug, title, category, thumbnail_url, lessons(id))")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });
  const rows = ((data ?? []) as unknown as Row[]).filter((r) => r.course);

  const lessonIds = rows.flatMap((r) => r.course!.lessons.map((l) => l.id));
  const { data: progress } = lessonIds.length
    ? await supabase.from("lesson_progress").select("lesson_id").eq("student_id", user.id).in("lesson_id", lessonIds)
    : { data: [] };
  const done = new Set((progress ?? []).map((p) => p.lesson_id as string));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="font-display text-3xl font-bold">My learning</h1>
      {rows.length === 0 ? (
        <div className="card mt-6 p-8 text-center">
          <p className="font-bold">No courses yet</p>
          <p className="mt-1 text-sm text-earth-soft">Find a skill you want to learn.</p>
          <Link href="/courses" className="btn-primary mt-4">Browse courses</Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => {
            const c = r.course!;
            const total = c.lessons.length;
            const finished = c.lessons.filter((l) => done.has(l.id)).length;
            const pct = total ? Math.round((finished / total) * 100) : 0;
            return (
              <div key={r.id} className="card overflow-hidden">
                <Link href={`/learn/${c.slug}`}>
                  <CourseThumb url={c.thumbnail_url} category={c.category} title={c.title} />
                </Link>
                <div className="p-4">
                  <Link href={`/learn/${c.slug}`} className="font-display text-lg font-bold">{c.title}</Link>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-sand">
                    <div className="h-full rounded-full bg-forest" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-earth-soft">{finished} of {total} lessons done</p>
                  {r.completed_at && (
                    <Link href={`/certificate/${r.id}`} className="mt-2 inline-block text-sm font-semibold text-terracotta">View certificate</Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
