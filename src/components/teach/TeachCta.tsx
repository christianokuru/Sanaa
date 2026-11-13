"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useCurrentUser, useHydrated } from "@/lib/hooks/use-store";
import { becomeTeacher } from "@/lib/services/auth";
import { toast } from "@/lib/services/toast";

export function TeachCta({ size = "lg" }: { size?: "md" | "lg" }) {
  const user = useCurrentUser();
  const hydrated = useHydrated();
  const router = useRouter();
  if (!hydrated) return <Button size={size} variant="white" disabled>Start teaching</Button>;
  if (!user) return <Button href="/signup?role=teacher" size={size} variant="white">Start teaching</Button>;
  if (user.role === "student") {
    return (
      <Button
        size={size}
        variant="white"
        onClick={() => {
          becomeTeacher(user.id);
          toast("You're now a teacher. Let's create your first course!", { tone: "success" });
          router.push("/teach/dashboard");
        }}
      >
        Become a teacher
      </Button>
    );
  }
  return <Button href="/teach/dashboard" size={size} variant="white">Go to your dashboard</Button>;
}
