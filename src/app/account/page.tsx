import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AccountView } from "@/components/account/AccountView";

export const metadata = { title: "Account", robots: { index: false } };

export default function AccountPage() {
  return (
    <Suspense>
      <RequireAuth>
        <Container className="pt-8 md:pt-12">
          <AccountView />
        </Container>
      </RequireAuth>
    </Suspense>
  );
}
