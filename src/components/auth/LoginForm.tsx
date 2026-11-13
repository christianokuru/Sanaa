"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { DEMO_ACCOUNTS, DEMO_PASSWORD, signIn } from "@/lib/services/auth";
import { safeRedirect } from "@/lib/security/safe-redirect";
import { toast } from "@/lib/services/toast";

export function LoginForm() {
  const router = useRouter();
  const next = safeRedirect(useSearchParams().get("next"), "/");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setFormError("");
    const res = await signIn({ email, password });
    setBusy(false);
    if (!res.ok) {
      setErrors(res.fields ?? {});
      setFormError(res.fields ? "" : res.error);
      return;
    }
    toast(`Welcome back, ${res.data.name.split(" ")[0]}`, { tone: "success" });
    router.replace(next);
  }

  return (
    <>
      <form onSubmit={submit} noValidate className="space-y-4">
        <TextField label="Email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
        <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} required />
        {formError && <p role="alert" className="rounded-xl bg-ember-tint px-4 py-3 text-body font-medium text-ember">{formError}</p>}
        <Button type="submit" block size="lg" loading={busy}>Log in</Button>
      </form>
      <div className="mt-6 flex items-center justify-between text-body">
        <Link href="/forgot-password" className="font-semibold underline underline-offset-4">Forgot password?</Link>
        <Link href={`/signup${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold underline underline-offset-4">Create account</Link>
      </div>

      <div className="mt-8 rounded-2xl bg-canvas p-4">
        <p className="text-body font-semibold">Demo accounts</p>
        <p className="mt-1 text-caption text-ink-soft">For testing before the backend is connected. Password: {DEMO_PASSWORD}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button key={a.email} type="button" onClick={() => { setEmail(a.email); setPassword(DEMO_PASSWORD); }} className="rounded-full border border-line-strong bg-white px-3 py-1.5 text-caption font-semibold hover:border-ink">
              {a.role === "student" ? "Learner" : a.role === "teacher" ? "Teacher" : "Admin"}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
