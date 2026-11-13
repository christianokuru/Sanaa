import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Log in", robots: { index: false } };

export default function LoginPage() {
  return (
    <AuthCard title="Log in" subtitle="Welcome back to Sanaa">
      <Suspense><LoginForm /></Suspense>
    </AuthCard>
  );
}
