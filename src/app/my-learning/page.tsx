import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { MyLearningView } from "@/components/library/MyLearningView";

export const metadata = { title: "My learning", robots: { index: false } };

export default function MyLearningPage() {
  return (
    <Suspense>
      <RequireAuth>
        <Container className="pt-8 md:pt-12">
          <MyLearningView />
        </Container>
      </RequireAuth>
    </Suspense>
  );
}
