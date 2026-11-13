import { Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container>
      <EmptyState icon={Compass} title="We can't find that page" action={<Button href="/">Back to home</Button>}>
        The link may be broken, or the page may have moved.
      </EmptyState>
    </Container>
  );
}
