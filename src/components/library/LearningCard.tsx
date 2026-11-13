"use client";

import Link from "next/link";
import { Award, PlayCircle } from "lucide-react";
import { CourseCover } from "@/components/course/CourseCover";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getTeacherById } from "@/lib/catalog/repository";
import type { Course } from "@/lib/catalog/types";
import type { Enrollment } from "@/lib/store/schema";
import { useCourseProgress } from "@/lib/hooks/use-course-progress";

export function LearningCard({ course, enrollment }: { course: Course; enrollment: Enrollment }) {
  const { done, total, percent, nextLessonId } = useCourseProgress(course);
  const teacher = getTeacherById(course.teacherId);
  const href = `/learn/${course.slug}${nextLessonId ? `?lesson=${nextLessonId}` : ""}`;
  return (
    <article className="group">
      <Link href={href} className="relative block">
        <CourseCover id={course.id} category={course.category} cover={course.cover} />
        <span className="absolute inset-0 flex items-center justify-center rounded-card bg-black/0 transition group-hover:bg-black/20">
          <PlayCircle className="h-14 w-14 text-white opacity-0 drop-shadow transition group-hover:opacity-100" strokeWidth={1.2} />
        </span>
      </Link>
      <h3 className="mt-3 text-ui font-semibold leading-snug"><Link href={href}>{course.title}</Link></h3>
      <p className="text-body text-ink-soft">{teacher?.name}</p>
      <ProgressBar value={percent} className="mt-3" label={`${course.title} progress`} />
      <div className="mt-2 flex items-center justify-between text-caption">
        <span className="text-ink-soft">{percent === 100 ? "Completed" : `${done} of ${total} lessons`}</span>
        {enrollment.completedAt ? (
          <Link href={`/certificates/${enrollment.id}`} className="inline-flex items-center gap-1 font-semibold text-ember"><Award className="h-3.5 w-3.5" /> Certificate</Link>
        ) : (
          <Link href={href} className="font-semibold underline underline-offset-2">{done === 0 ? "Start" : "Continue"}</Link>
        )}
      </div>
    </article>
  );
}
