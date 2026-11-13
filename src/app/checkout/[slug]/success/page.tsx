import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { SuccessView } from "@/components/checkout/SuccessView";
import { getCourseBySlug } from "@/lib/catalog/repository";

export const metadata = { title: "You're enrolled", robots: { index: false, follow: false } };

export default function SuccessPage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();
  return (
    <Suspense>
      <RequireAuth>
        <Container><SuccessView course={course} /></Container>
      </RequireAuth>
    </Suspense>
  );
}
