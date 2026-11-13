"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckboxField, Segmented, SelectField, TextField } from "@/components/ui/Field";
import { useLocale } from "@/components/locale/LocaleProvider";
import { AFRICAN_COUNTRIES, DIASPORA_COUNTRIES } from "@/lib/locale/countries";
import { signUp } from "@/lib/services/auth";
import { safeRedirect } from "@/lib/security/safe-redirect";
import { toast } from "@/lib/services/toast";

export function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { country } = useLocale();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    country: country?.code ?? "",
    role: (params.get("role") === "teacher" ? "teacher" : "student") as "student" | "teacher",
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await signUp(form);
    setBusy(false);
    if (!res.ok) return setErrors(res.fields ?? { _form: res.error });
    toast(`Welcome to Sanaa, ${res.data.name.split(" ")[0]}!`, { tone: "success" });
    router.replace(form.role === "teacher" ? "/teach/dashboard" : safeRedirect(params.get("next"), "/"));
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <Segmented
        label="I want to"
        value={form.role}
        onChange={(v) => set("role", v)}
        options={[{ value: "student", label: "I want to learn" }, { value: "teacher", label: "I want to teach" }]}
      />
      <TextField label="Full name" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} maxLength={80} />
      <TextField label="Email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} maxLength={254} />
      <SelectField label="Country" value={form.country} onChange={(e) => set("country", e.target.value)} error={errors.country}>
        <option value="">Choose your country</option>
        <optgroup label="Africa">{AFRICAN_COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</optgroup>
        <optgroup label="Living abroad">{DIASPORA_COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</optgroup>
      </SelectField>
      <TextField label="Password" type="password" autoComplete="new-password" value={form.password} onChange={(e) => set("password", e.target.value)} error={errors.password} hint="At least 8 characters, with a letter and a number." maxLength={128} />
      <CheckboxField
        checked={form.terms}
        onChange={(e) => set("terms", e.target.checked)}
        error={errors.terms}
        label={<>I agree to the <Link href="/terms" target="_blank" className="font-semibold underline">Terms</Link> and <Link href="/privacy" target="_blank" className="font-semibold underline">Privacy Policy</Link>.</>}
      />
      {errors._form && <p role="alert" className="rounded-xl bg-ember-tint px-4 py-3 text-body font-medium text-ember">{errors._form}</p>}
      <Button type="submit" block size="lg" loading={busy}>Create account</Button>
      <p className="text-center text-body">
        Already have an account? <Link href={`/login${params.get("next") ? `?next=${encodeURIComponent(params.get("next")!)}` : ""}`} className="font-semibold underline underline-offset-4">Log in</Link>
      </p>
    </form>
  );
}
