"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Sheet } from "@/components/ui/Sheet";
import { deleteAccount } from "@/lib/services/auth";
import { toast } from "@/lib/services/toast";

export function DeleteAccount({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function confirm() {
    setBusy(true);
    const res = await deleteAccount(userId, password);
    setBusy(false);
    if (!res.ok) return setError(res.fields?.password ?? res.error);
    toast("Your account has been deleted");
    router.replace("/");
  }

  return (
    <>
      <Button variant="link" className="text-ember" onClick={() => setOpen(true)}>Delete my account</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Delete account"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={confirm} loading={busy} disabled={!password}>Delete forever</Button>
          </div>
        }
      >
        <p className="text-ui">This removes your profile, courses, progress, certificates and reviews. It can't be undone.</p>
        <TextField label="Enter your password to confirm" type="password" autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} error={error} wrapperClassName="mt-6" data-autofocus />
      </Sheet>
    </>
  );
}
