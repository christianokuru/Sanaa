import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LearnView } from "@/components/learn/LearnView";
import { getCourseBySlug, getTeacherById } from "@/lib/catalog/repository";

export const metadata = { title: "Learning", robots: { index: false, follow: false } };

export default function LearnPage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();
  return (
    <Suspense>
      <LearnView course={course} teacherName={getTeacherById(course.teacherId)?.name ?? ""} />
    </Suspense>
  );
}
