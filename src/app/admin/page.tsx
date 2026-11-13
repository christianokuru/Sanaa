import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AdminView } from "@/components/admin/AdminView";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <Suspense>
      <RequireAuth roles={["admin"]}>
        <Container><AdminView /></Container>
      </RequireAuth>
    </Suspense>
  );
}
