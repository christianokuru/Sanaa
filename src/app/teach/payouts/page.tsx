import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { PayoutsView } from "@/components/teach/PayoutsView";

export const metadata = { title: "Payouts", robots: { index: false } };

export default function PayoutsPage() {
  return (
    <Suspense>
      <RequireAuth roles={["teacher", "admin"]}>
        <Container><PayoutsView /></Container>
      </RequireAuth>
    </Suspense>
  );
}
