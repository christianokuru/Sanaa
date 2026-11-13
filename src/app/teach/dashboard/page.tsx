import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardView } from "@/components/teach/DashboardView";

export const metadata = { title: "Teacher dashboard", robots: { index: false } };

export default function TeacherDashboardPage() {
  return (
    <Suspense>
      <RequireAuth roles={["teacher", "admin"]}>
        <Container className="pt-8 md:pt-12"><DashboardView /></Container>
      </RequireAuth>
    </Suspense>
  );
}
