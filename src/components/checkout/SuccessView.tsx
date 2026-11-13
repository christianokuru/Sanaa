"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CourseCover } from "@/components/course/CourseCover";
import { useAppStore } from "@/lib/store/app-store";
import { formatPrice } from "@/lib/locale/currency";
import { courseLessons } from "@/lib/catalog/repository";
import type { Course } from "@/lib/catalog/types";

export function SuccessView({ course }: { course: Course }) {
  const id = useSearchParams().get("enrollment");
  const router = useRouter();
  const enrollment = useAppStore((s) => s.enrollments.find((e) => e.id === id && e.userId === s.sessionUserId && e.courseId === course.id));

  useEffect(() => {
    if (!enrollment) router.replace(`/courses/${course.slug}`);
  }, [enrollment, router, course.slug]);
  if (!enrollment) return null;

  const first = courseLessons(course)[0];
  return (
    <div className="mx-auto max-w-lg py-10 text-center md:py-16">
      <CheckCircle2 className="mx-auto h-16 w-16 text-malachite" strokeWidth={1.4} />
      <h1 className="mt-5 text-[2rem] font-bold tracking-[-0.035em]">You're enrolled!</h1>
      <p className="mt-2 text-ui text-ink-soft">
        {enrollment.amount > 0 ? `Payment of ${formatPrice(enrollment.amount, enrollment.currency)} received.` : "This course is now in your library."} A receipt has been sent to your email.
      </p>
      <div className="mx-auto mt-8 w-56"><CourseCover id={course.id} category={course.category} cover={course.cover} /></div>
      <p className="mt-4 text-title font-semibold">{course.title}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href={`/learn/${course.slug}${first ? `?lesson=${first.id}` : ""}`} size="lg">Start learning</Button>
        <Button href="/my-learning" size="lg" variant="outline">Go to My learning</Button>
      </div>
    </div>
  );
}
