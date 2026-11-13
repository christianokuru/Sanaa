"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { CourseCard } from "@/components/course/CourseCard";
import { CourseCardSkeleton } from "@/components/ui/Skeleton";
import { getCourseById, getTeacherById } from "@/lib/catalog/repository";
import { useCurrentUser, useHydrated, useWishlistIds } from "@/lib/hooks/use-store";
import type { Course } from "@/lib/catalog/types";

export function WishlistView() {
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const courses = useWishlistIds().map(getCourseById).filter(Boolean) as Course[];

  return (
    <>
      <PageHeader title="Wishlist" subtitle={hydrated ? `${courses.length} saved course${courses.length === 1 ? "" : "s"}` : " "} />
      {!hydrated ? (
        <div className="mt-8 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <CourseCardSkeleton key={i} />)}</div>
      ) : courses.length === 0 ? (
        <EmptyState icon={Heart} title="Save courses you love" action={<Button href="/courses" variant="dark">Start exploring</Button>}>
          Tap the heart on any course and it will wait for you here.
        </EmptyState>
      ) : (
        <>
          {!user && (
            <p className="mt-6 rounded-2xl bg-canvas px-5 py-4 text-body">
              <a href="/login?next=/wishlist" className="font-semibold underline">Log in</a> to keep your wishlist on all your devices.
            </p>
          )}
          <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {courses.map((c) => (
              <li key={c.id}><CourseCard course={c} teacher={getTeacherById(c.teacherId)} /></li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
