"use client";

import { getStore, setStore } from "@/lib/store/app-store";
import { GUEST_KEY, type Enrollment } from "@/lib/store/schema";
import { randomId } from "@/lib/security/password";
import { fieldErrors, reviewSchema } from "@/lib/validation/schemas";
import { fail, ok, type Result } from "@/lib/services/result";

/** Wishlist, enrollments, lesson progress and reviews. */

export function toggleWishlist(userId: string | null, courseId: string): boolean {
  const key = userId ?? GUEST_KEY;
  let saved = false;
  setStore((s) => {
    const list = s.wishlist[key] ?? [];
    saved = !list.includes(courseId);
    return { wishlist: { ...s.wishlist, [key]: saved ? [courseId, ...list] : list.filter((id) => id !== courseId) } };
  });
  return saved;
}

export function enroll(input: Omit<Enrollment, "id" | "createdAt">): Enrollment {
  const existing = getStore().enrollments.find((e) => e.userId === input.userId && e.courseId === input.courseId);
  if (existing) return existing;
  const enrollment: Enrollment = { ...input, id: `e-${randomId(8)}`, createdAt: new Date().toISOString() };
  setStore((s) => ({ enrollments: [enrollment, ...s.enrollments] }));
  return enrollment;
}

export function setLessonComplete(userId: string, lessonId: string, done: boolean) {
  setStore((s) => {
    const list = s.progress[userId] ?? [];
    const next = done ? Array.from(new Set([...list, lessonId])) : list.filter((id) => id !== lessonId);
    return { progress: { ...s.progress, [userId]: next } };
  });
}

/** Marks the enrollment complete once every lesson is done. Returns true when the course is finished. */
export function syncCompletion(userId: string, courseId: string, lessonIds: string[]): boolean {
  const done = new Set(getStore().progress[userId] ?? []);
  const finished = lessonIds.length > 0 && lessonIds.every((id) => done.has(id));
  setStore((s) => ({
    enrollments: s.enrollments.map((e) =>
      e.userId === userId && e.courseId === courseId
        ? { ...e, completedAt: finished ? e.completedAt ?? new Date().toISOString() : undefined }
        : e,
    ),
  }));
  return finished;
}

export function saveReview(user: { id: string; name: string; country: string }, courseId: string, input: unknown): Result {
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error));
  const enrolled = getStore().enrollments.some((e) => e.userId === user.id && e.courseId === courseId);
  if (!enrolled) return fail("Only students of this course can review it.");
  setStore((s) => {
    const others = s.reviews.filter((r) => !(r.userId === user.id && r.courseId === courseId));
    return {
      reviews: [
        {
          id: `r-${randomId(8)}`,
          userId: user.id,
          courseId,
          author: user.name.split(" ")[0] ?? user.name,
          country: user.country,
          rating: parsed.data.rating,
          body: parsed.data.body,
          createdAt: new Date().toISOString(),
        },
        ...others,
      ],
    };
  });
  return ok(undefined);
}

export function addRecentSearch(q: string) {
  const term = q.trim().slice(0, 80);
  if (!term) return;
  setStore((s) => ({
    prefs: { ...s.prefs, recentSearches: [term, ...s.prefs.recentSearches.filter((x) => x !== term)].slice(0, 6) },
  }));
}

export function clearRecentSearches() {
  setStore((s) => ({ prefs: { ...s.prefs, recentSearches: [] } }));
}

export function setDataSaver(on: boolean) {
  setStore((s) => ({ prefs: { ...s.prefs, dataSaver: on } }));
}
