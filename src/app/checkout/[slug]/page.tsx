import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { courseLessons, getCourseBySlug, getTeacherById } from "@/lib/catalog/repository";

export const metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();
  return (
    <Suspense>
      <RequireAuth>
        <Container>
          <CheckoutView course={course} teacherName={getTeacherById(course.teacherId)?.name ?? ""} lessonCount={courseLessons(course).length} />
        </Container>
      </RequireAuth>
    </Suspense>
  );
}
