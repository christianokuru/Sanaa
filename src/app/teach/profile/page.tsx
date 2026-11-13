import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { TeacherProfileView } from "@/components/teach/TeacherProfileView";

export const metadata = { title: "Your teacher profile", robots: { index: false } };

export default function TeacherProfilePage() {
  return (
    <Suspense>
      <RequireAuth roles={["teacher", "admin"]}>
        <Container className="pt-8 md:pt-12"><TeacherProfileView /></Container>
      </RequireAuth>
    </Suspense>
  );
}
