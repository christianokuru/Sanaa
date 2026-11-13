"use client";

import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container>
      <EmptyState icon={AlertTriangle} title="Something went wrong" action={<Button onClick={reset}>Try again</Button>}>
        Sorry about that. Please try again. If it keeps happening, contact hello@sanaa.africa.
      </EmptyState>
    </Container>
  );
}
