"use client";

import { useMemo } from "react";
import { courseLessons } from "@/lib/catalog/repository";
import type { Course } from "@/lib/catalog/types";
import { useCompletedLessons } from "@/lib/hooks/use-store";

export function useCourseProgress(course: Course | undefined) {
  const completed = useCompletedLessons();
  return useMemo(() => {
    if (!course) return { done: 0, total: 0, percent: 0, nextLessonId: undefined as string | undefined };
    const lessons = courseLessons(course);
    const done = lessons.filter((l) => completed.has(l.id)).length;
    const next = lessons.find((l) => !completed.has(l.id));
    return { done, total: lessons.length, percent: lessons.length ? (done / lessons.length) * 100 : 0, nextLessonId: next?.id };
  }, [course, completed]);
}
