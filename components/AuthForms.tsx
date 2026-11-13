"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/SubmitButton";
import { login, signup } from "@/lib/actions/auth";
import { ALL_COUNTRIES } from "@/lib/countries";

function Notice({ state }: { state: { error?: string; message?: string } | null }) {
  if (!state) return null;
  return (
    <p className={`rounded-xl p-3 text-sm ${state.error ? "bg-terracotta-light text-terracotta-dark" : "bg-forest-light text-forest"}`}>
      {state.error ?? state.message}
    </p>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useFormState(login, null);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
      </div>
      <Notice state={state} />
      <SubmitButton>Log in</SubmitButton>
      <p className="text-center text-sm">
        New to Sanaa? <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-terracotta">Create an account</Link>
      </p>
    </form>
  );
}

export function SignupForm({ next, defaultRole, defaultCountry }: { next?: string; defaultRole: "student" | "teacher"; defaultCountry?: string }) {
  const [state, action] = useFormState(signup, null);
  const [role, setRole] = useState(defaultRole);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      <input type="hidden" name="role" value={role} />
      <div className="grid grid-cols-2 gap-2 rounded-full bg-sand p-1">
        {(["student", "teacher"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`min-h-[44px] rounded-full text-sm font-semibold ${role === r ? "bg-white shadow-card" : "text-earth/60"}`}
          >
            {r === "student" ? "I want to learn" : "I want to teach"}
          </button>
        ))}
      </div>
      <div>
        <label className="label" htmlFor="full_name">Full name</label>
        <input id="full_name" name="full_name" autoComplete="name" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="country">Country</label>
        <select id="country" name="country" defaultValue={defaultCountry ?? ""} className="input">
          <option value="">Choose country</option>
          {ALL_COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="input" />
        <p className="mt-1 text-xs text-earth-soft">At least 8 characters.</p>
      </div>
      <Notice state={state} />
      <SubmitButton>Create account</SubmitButton>
      <p className="text-center text-sm">
        Already have an account? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-terracotta">Log in</Link>
      </p>
    </form>
  );
}
