"use client";

import Link from "next/link";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { fieldErrors, forgotSchema } from "@/lib/validation/schemas";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = forgotSchema.safeParse({ email });
    if (!parsed.success) return setError(fieldErrors(parsed.error).email ?? "Enter a valid email");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    setBusy(false);
    // Same message whether or not the account exists, so emails can't be discovered.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <MailCheck className="mx-auto h-12 w-12" strokeWidth={1.4} />
        <p className="mt-4 text-title font-semibold">Check your email</p>
        <p className="mt-2 text-ui text-ink-soft">If an account exists for {email}, we've sent a link to reset your password. It expires in 30 minutes.</p>
        <Button href="/login" variant="dark" className="mt-8">Back to log in</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <p className="text-ui text-ink-soft">Enter your email and we'll send you a link to reset your password.</p>
      <TextField label="Email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} error={error} />
      <Button type="submit" block size="lg" loading={busy}>Send reset link</Button>
      <p className="text-center text-body"><Link href="/login" className="font-semibold underline underline-offset-4">Back to log in</Link></p>
    </form>
  );
}
