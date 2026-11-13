"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Award, ChevronRight, X, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { VideoPlayer } from "@/components/learn/VideoPlayer";
import { LessonList } from "@/components/learn/LessonList";
import { PriceTag } from "@/components/locale/PriceTag";
import { courseLessons } from "@/lib/catalog/repository";
import type { Course } from "@/lib/catalog/types";
import { useCompletedLessons, useCurrentUser, useEnrollment, useHydrated, usePrefs } from "@/lib/hooks/use-store";
import { setDataSaver, setLessonComplete, syncCompletion } from "@/lib/services/library";
import { toast } from "@/lib/services/toast";

export function LearnView({ course, teacherName }: { course: Course; teacherName: string }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const enrollment = useEnrollment(course.id);
  const completed = useCompletedLessons();
  const { dataSaver } = usePrefs();
  const lessons = useMemo(() => courseLessons(course), [course]);
  const requestedId = useSearchParams().get("lesson");

  const enrolled = Boolean(enrollment);
  const canOpen = (_id: string, preview: boolean) => enrolled || preview;
  const current = lessons.find((l) => l.id === requestedId) ?? (enrolled ? lessons.find((l) => !completed.has(l.id)) ?? lessons[0] : lessons.find((l) => l.preview));
  const index = current ? lessons.indexOf(current) : -1;
  const next = lessons.slice(index + 1).find((l) => canOpen(l.id, l.preview));
  const allowed = current && canOpen(current.id, current.preview);

  useEffect(() => {
    if (hydrated && !allowed) router.replace(`/courses/${course.slug}`);
  }, [hydrated, allowed, router, course.slug]);

  if (!hydrated || !current || !allowed) {
    return <div className="md:p-10"><Skeleton className="aspect-video w-full rounded-none md:rounded-card" /></div>;
  }

  const done = completed.has(current.id);
  const finishedCourse = Boolean(enrollment?.completedAt);

  function markDone(goNext: boolean) {
    if (user && enrolled && !done) {
      setLessonComplete(user.id, current!.id, true);
      if (syncCompletion(user.id, course.id, lessons.map((l) => l.id)) && !finishedCourse) {
        toast("Course complete! Your certificate is ready.", { tone: "success", action: { label: "View", href: "/my-learning" } });
      }
    }
    if (goNext && next) router.replace(`/learn/${course.slug}?lesson=${next.id}`, { scroll: false });
  }

  function undo() {
    if (!user) return;
    setLessonComplete(user.id, current!.id, false);
    syncCompletion(user.id, course.id, lessons.map((l) => l.id));
  }

  return (
    <div className="md:px-10 md:pb-10 md:pt-6 xl:px-20">
      {/* Phone top bar */}
      <div className="flex h-14 items-center gap-2 px-3 md:hidden">
        <Link href={`/courses/${course.slug}`} aria-label="Close player" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-canvas"><X className="h-5 w-5" /></Link>
        <p className="truncate text-body font-semibold">{course.title}</p>
      </div>
      <Link href={`/courses/${course.slug}`} className="mb-4 hidden items-center gap-1 text-body font-semibold text-ink-soft hover:text-ink md:inline-flex">
        {course.title} <ChevronRight className="h-4 w-4" />
      </Link>

      <div className="grid md:grid-cols-[1fr_340px] md:gap-8 lg:gap-12">
        <div className="min-w-0">
          <div className="sticky top-0 z-20 bg-white md:static md:overflow-hidden md:rounded-card">
            <VideoPlayer
              key={current.id}
              watermark={user?.email ?? "Sanaa preview"}
              dataSaver={dataSaver}
              onDataSaverChange={setDataSaver}
              onEnded={() => markDone(false)}
            />
          </div>

          <div className="px-5 pt-2 md:px-0 md:pt-4">
            <p className="text-caption font-semibold text-ink-soft">Lesson {index + 1} of {lessons.length} · {teacherName}</p>
            <h1 className="mt-1 text-[1.5rem] font-bold leading-tight tracking-[-0.03em]">{current.title}</h1>

            {enrolled ? (
              <div className="mt-5 flex flex-wrap gap-3">
                {done ? (
                  <Button variant="outline" onClick={undo}><CheckCircle2 className="h-4 w-4 text-malachite" /> Completed</Button>
                ) : (
                  <Button variant="outline" onClick={() => markDone(false)}><Circle className="h-4 w-4" /> Mark as complete</Button>
                )}
                {next && <Button variant="dark" onClick={() => markDone(true)}>Next lesson <ChevronRight className="h-4 w-4" /></Button>}
                {finishedCourse && <Button href={`/certificates/${enrollment!.id}`}><Award className="h-4 w-4" /> Get certificate</Button>}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-canvas p-5">
                <p className="text-ui font-semibold">You're watching a free preview</p>
                <p className="mt-1 text-body text-ink-soft">Unlock all {lessons.length} lessons for <PriceTag price={course.price} currency={course.currency} className="font-semibold text-ink" />.</p>
                <Button href={`/checkout/${course.slug}`} className="mt-4">Get full access</Button>
              </div>
            )}
          </div>
        </div>

        <aside className="mt-8 border-t border-line pt-6 md:mt-0 md:max-h-[calc(100dvh-var(--header-h)-48px)] md:overflow-y-auto md:rounded-card md:border md:p-3 md:pt-4">
          <h2 className="mb-4 px-5 text-title font-semibold md:px-3">Course content</h2>
          <LessonList course={course} currentId={current.id} completed={completed} canOpen={canOpen} />
        </aside>
      </div>
    </div>
  );
}
