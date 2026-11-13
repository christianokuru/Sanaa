import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Award, CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { LessonPlayer } from "@/components/LessonActions";
import { getCourseBySlug, getLessons, isEnrolled, getCompletedLessonIds, formatDuration } from "@/lib/data";
import { getSessionUser } from "@/lib/auth";
import { playbackUrl } from "@/lib/bunny";
import { hasSupabase } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LearnPage({
  params, searchParams,
}: { params: { slug: string }; searchParams: { lesson?: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();
  const [lessons, user] = await Promise.all([getLessons(course.id), getSessionUser()]);

  const enrolled = await isEnrolled(course.id, user?.id);
  const fullAccess = !hasSupabase || enrolled || user?.id === course.teacher_id || user?.profile.role === "admin";
  const canOpen = (l: (typeof lessons)[number]) => fullAccess || l.is_preview;

  const completed = user && enrolled ? await getCompletedLessonIds(user.id, lessons.map((l) => l.id)) : new Set<string>();
  const requested = lessons.find((l) => l.id === searchParams.lesson);
  if (requested && !canOpen(requested)) redirect(`/courses/${course.slug}`);
  const current =
    requested ?? lessons.find((l) => canOpen(l) && !completed.has(l.id)) ?? lessons.find(canOpen);
  if (!current) redirect(`/courses/${course.slug}`);

  const idx = lessons.findIndex((l) => l.id === current.id);
  const next = lessons.slice(idx + 1).find(canOpen);
  const allDone = enrolled && lessons.length > 0 && lessons.every((l) => completed.has(l.id));

  let enrollmentId: string | null = null;
  if (allDone && user) {
    const { data } = await createClient()
      .from("enrollments").select("id").eq("course_id", course.id).eq("student_id", user.id).single();
    enrollmentId = data?.id ?? null;
  }

  return (
    <div className="mx-auto max-w-6xl md:px-4 md:py-6">
      <div className="flex items-center gap-2 px-4 py-3 md:px-0">
        <Link href={`/courses/${course.slug}`} className="rounded-full p-2 hover:bg-sand" aria-label="Back to course">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="truncate font-display font-bold">{course.title}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div>
          <div className="sticky top-[70px] z-20 md:static">
            <LessonPlayer
              src={playbackUrl(current.video_id)}
              watermark={user?.email ?? "Sanaa preview"}
              lessonId={current.id}
              courseSlug={course.slug}
              canTrack={enrolled}
              done={completed.has(current.id)}
              nextHref={next ? `/learn/${course.slug}?lesson=${next.id}` : null}
            />
          </div>
          <div className="px-4 pt-4 md:px-0">
            <p className="text-sm text-earth-soft">Lesson {idx + 1} of {lessons.length}</p>
            <h1 className="font-display text-2xl font-bold">{current.title}</h1>
            {!fullAccess && (
              <div className="card mt-4 p-4">
                <p className="font-bold">Enjoying the preview?</p>
                <p className="text-sm text-earth-soft">Buy the course to unlock every lesson.</p>
                <Link href={`/courses/${course.slug}`} className="btn-primary mt-3">See price</Link>
              </div>
            )}
            {allDone && enrollmentId && (
              <Link href={`/certificate/${enrollmentId}`} className="card mt-4 flex items-center gap-3 bg-gold-light p-4">
                <Award className="h-8 w-8 text-terracotta" />
                <span><b>You finished the course!</b><br /><span className="text-sm">Get your certificate</span></span>
              </Link>
            )}
          </div>
        </div>

        <aside className="px-4 pb-8 md:px-0">
          <h2 className="font-bold">Lessons</h2>
          <ol className="card mt-2 divide-y divide-earth/10 overflow-hidden">
            {lessons.map((l, i) => {
              const open = canOpen(l);
              const active = l.id === current.id;
              const inner = (
                <>
                  {completed.has(l.id) ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-forest" />
                  ) : open ? (
                    <PlayCircle className={`h-5 w-5 shrink-0 ${active ? "text-terracotta" : "text-earth/40"}`} />
                  ) : (
                    <Lock className="h-4 w-4 shrink-0 text-earth/30" />
                  )}
                  <span className="flex-1 text-sm">{i + 1}. {l.title}</span>
                  {l.duration_seconds ? <span className="text-xs text-earth/50">{formatDuration(l.duration_seconds)}</span> : null}
                </>
              );
              return (
                <li key={l.id}>
                  {open ? (
                    <Link href={`/learn/${course.slug}?lesson=${l.id}`} className={`flex min-h-[52px] items-center gap-3 px-4 py-2 ${active ? "bg-terracotta-light" : "hover:bg-sand"}`}>
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex min-h-[52px] items-center gap-3 px-4 py-2 text-earth/50">{inner}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </div>
  );
}
