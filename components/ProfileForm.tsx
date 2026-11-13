"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/SubmitButton";
import { updateProfile } from "@/lib/actions/auth";
import { ALL_COUNTRIES } from "@/lib/countries";
import type { Profile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action] = useFormState(updateProfile, null);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="full_name">Full name</label>
        <input id="full_name" name="full_name" defaultValue={profile.full_name} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="country">Country</label>
        <select id="country" name="country" defaultValue={profile.country ?? ""} className="input">
          <option value="">Choose country</option>
          {ALL_COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </div>
      {profile.role !== "student" && (
        <div>
          <label className="label" htmlFor="bio">About you (shown on your courses)</label>
          <textarea id="bio" name="bio" rows={4} defaultValue={profile.bio ?? ""} className="input" />
        </div>
      )}
      {state && <p className={`text-sm ${state.error ? "text-terracotta-dark" : "text-forest"}`}>{state.error ?? state.message}</p>}
      <SubmitButton className="btn-dark">Save</SubmitButton>
    </form>
  );
}
