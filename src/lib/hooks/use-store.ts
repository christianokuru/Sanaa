"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/lib/store/app-store";
import { GUEST_KEY, type PublicUser } from "@/lib/store/schema";
import { toPublicUser } from "@/lib/services/auth";

const EMPTY: string[] = [];

export function useHydrated(): boolean {
  return useAppStore((s) => s.hydrated);
}

export function useCurrentUser(): PublicUser | null {
  const user = useAppStore((s) => s.users.find((u) => u.id === s.sessionUserId));
  return useMemo(() => (user ? toPublicUser(user) : null), [user]);
}

export function useWishlistIds(): string[] {
  return useAppStore((s) => s.wishlist[s.sessionUserId ?? GUEST_KEY] ?? EMPTY);
}

export function useIsSaved(courseId: string): boolean {
  return useAppStore((s) => (s.wishlist[s.sessionUserId ?? GUEST_KEY] ?? EMPTY).includes(courseId));
}

export function useEnrollment(courseId: string) {
  return useAppStore((s) => s.enrollments.find((e) => e.userId === s.sessionUserId && e.courseId === courseId));
}

export function useMyEnrollments() {
  return useAppStore(useShallow((s) => s.enrollments.filter((e) => e.userId === s.sessionUserId)));
}

export function useCompletedLessons(): Set<string> {
  const list = useAppStore((s) => (s.sessionUserId ? s.progress[s.sessionUserId] : undefined) ?? EMPTY);
  return useMemo(() => new Set(list), [list]);
}

export function usePrefs() {
  return useAppStore((s) => s.prefs);
}
