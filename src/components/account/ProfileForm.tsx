"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { AFRICAN_COUNTRIES, DIASPORA_COUNTRIES } from "@/lib/locale/countries";
import { updateProfile } from "@/lib/services/auth";
import { toast } from "@/lib/services/toast";
import type { PublicUser } from "@/lib/store/schema";

/** `bioFallback` pre-fills "About you" with the bio already shown on the teacher's public page. */
export function ProfileForm({ user, bioFallback }: { user: PublicUser; bioFallback?: string }) {
  const [form, setForm] = useState({ name: user.name, country: user.country, bio: user.bio || bioFallback || "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = updateProfile(user.id, form);
    if (!res.ok) return setErrors(res.fields ?? {});
    setErrors({});
    toast("Profile saved", { tone: "success" });
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <TextField label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} maxLength={80} autoComplete="name" />
      <TextField label="Email" value={user.email} disabled hint="Contact support to change your email." />
      <SelectField label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} error={errors.country}>
        <optgroup label="Africa">{AFRICAN_COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</optgroup>
        <optgroup label="Living abroad">{DIASPORA_COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</optgroup>
      </SelectField>
      {user.role !== "student" && (
        <TextAreaField label="About you" hint="Shown on your teacher profile." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} error={errors.bio} maxLength={600} />
      )}
      <Button type="submit" variant="dark">Save changes</Button>
    </form>
  );
}
