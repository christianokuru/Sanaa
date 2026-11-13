"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { changePassword } from "@/lib/services/auth";
import { toast } from "@/lib/services/toast";

export function PasswordForm({ userId }: { userId: string }) {
  const empty = { current: "", next: "", confirm: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await changePassword(userId, form);
    setBusy(false);
    if (!res.ok) return setErrors(res.fields ?? {});
    setErrors({});
    setForm(empty);
    toast("Password updated", { tone: "success" });
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <TextField label="Current password" type="password" autoComplete="current-password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} error={errors.current} />
      <TextField label="New password" type="password" autoComplete="new-password" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} error={errors.next} hint="At least 8 characters, with a letter and a number." />
      <TextField label="Confirm new password" type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} error={errors.confirm} />
      <Button type="submit" variant="dark" loading={busy}>Update password</Button>
    </form>
  );
}
