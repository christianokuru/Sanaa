import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = { title: "Create your account", description: "Join Sanaa to learn or teach African crafts.", alternates: { canonical: "/signup" } };

export default function SignupPage() {
  return (
    <AuthCard title="Sign up" subtitle="Create your Sanaa account">
      <Suspense><SignupForm /></Suspense>
    </AuthCard>
  );
}
