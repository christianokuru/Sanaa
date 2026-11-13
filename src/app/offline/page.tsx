import { WifiOff } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "You're offline", robots: { index: false } };

export default function OfflinePage() {
  return (
    <Container>
      <EmptyState icon={WifiOff} title="You're offline" action={<Button href="/">Try again</Button>}>
        Check your connection. Pages you opened before are still available.
      </EmptyState>
    </Container>
  );
}
