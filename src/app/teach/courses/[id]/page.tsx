import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { EditCourseView } from "@/components/teach/EditCourseView";

export const metadata = { title: "Edit course", robots: { index: false } };

export default function EditCoursePage({ params }: { params: { id: string } }) {
  return (
    <Suspense>
      <RequireAuth roles={["teacher", "admin"]}>
        <Container><EditCourseView id={params.id.slice(0, 64)} /></Container>
      </RequireAuth>
    </Suspense>
  );
}
