import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = { title: "Reset your password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Reset password" subtitle="Forgot your password?">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
