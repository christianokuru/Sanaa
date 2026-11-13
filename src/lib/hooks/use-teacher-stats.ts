"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/locale/LocaleProvider";
import { useAppStore } from "@/lib/store/app-store";
import { teacherStats } from "@/lib/services/earnings";
import type { PublicUser } from "@/lib/store/schema";

export function useTeacherStats(user: PublicUser) {
  const { rates } = useLocale();
  const enrollments = useAppStore((s) => s.enrollments);
  const payouts = useAppStore((s) => s.payouts);
  const users = useAppStore((s) => s.users);
  return useMemo(
    () => teacherStats(user, { ...useAppStore.getState(), enrollments, payouts, users }, rates),
    [user, enrollments, payouts, users, rates],
  );
}
