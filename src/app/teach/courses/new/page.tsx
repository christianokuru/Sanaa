import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { NewCourseView } from "@/components/teach/NewCourseView";

export const metadata = { title: "New course", robots: { index: false } };

export default function NewCoursePage() {
  return (
    <Suspense>
      <RequireAuth roles={["teacher", "admin"]}>
        <Container><NewCourseView /></Container>
      </RequireAuth>
    </Suspense>
  );
}
