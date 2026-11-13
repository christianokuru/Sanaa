"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { CATEGORIES } from "@/config/categories";
import { ALL_COUNTRIES } from "@/lib/locale/countries";
import { PLATFORM_FEE_RATE, formatCash } from "@/lib/locale/currency";
import type { DraftCourse } from "@/lib/store/schema";

const CURRENCIES = Array.from(new Set(ALL_COUNTRIES.map((c) => c.currency))).sort();

export type CourseDetailsValues = {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  currency: string;
  price: string;
  outcomes: string;
};

export function toFormValues(d: DraftCourse | undefined, currency: string): CourseDetailsValues {
  return {
    title: d?.title ?? "",
    subtitle: d?.subtitle ?? "",
    description: d?.description ?? "",
    category: d?.category ?? "fashion",
    level: d?.level ?? "beginner",
    currency: d?.currency ?? currency,
    price: d ? String(d.price) : "",
    outcomes: d?.outcomes.join("\n") ?? "",
  };
}

export function toPayload(v: CourseDetailsValues) {
  return { ...v, price: v.price === "" ? 0 : v.price, outcomes: v.outcomes.split("\n").map((s) => s.trim()).filter(Boolean) };
}

export function CourseDetailsForm({
  initial, submitLabel, onSubmit,
}: { initial: CourseDetailsValues; submitLabel: string; onSubmit: (v: CourseDetailsValues) => { ok: boolean; fields?: Record<string, string> } }) {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof CourseDetailsValues, value: string) => {
    setV((x) => ({ ...x, [k]: value }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };
  const keep = Math.floor((Number(v.price) || 0) * (1 - PLATFORM_FEE_RATE) * 100) / 100;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = onSubmit(v);
    if (!res.ok) setErrors(res.fields ?? {});
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <TextField label="Course title" placeholder="e.g. Sew Your First Ankara Dress" value={v.title} onChange={(e) => set("title", e.target.value)} error={errors.title} maxLength={120} />
      <TextField label="Short description" placeholder="One line that makes people want it" value={v.subtitle} onChange={(e) => set("subtitle", e.target.value)} error={errors.subtitle} maxLength={160} />
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField label="Category" value={v.category} onChange={(e) => set("category", e.target.value)} error={errors.category}>
          {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </SelectField>
        <SelectField label="Level" value={v.level} onChange={(e) => set("level", e.target.value)} error={errors.level}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </SelectField>
      </div>
      <div>
        <div className="grid grid-cols-[120px_1fr] gap-3">
          <SelectField label="Currency" value={v.currency} onChange={(e) => set("currency", e.target.value)}>
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </SelectField>
          <TextField label="Price" type="number" inputMode="decimal" min={0} placeholder="0 for free" value={v.price} onChange={(e) => set("price", e.target.value)} error={errors.price} />
        </div>
        <p className="mt-2 text-body text-ink-soft">
          {keep > 0 ? <>You keep <b className="text-malachite">{formatCash(keep, v.currency)}</b> per student. Learners see the price in their own currency.</> : "Free courses are a great way to get your first reviews."}
        </p>
      </div>
      <TextAreaField label="What will students learn?" hint="One per line. Aim for 3 to 6." rows={4} value={v.outcomes} onChange={(e) => set("outcomes", e.target.value)} error={errors.outcomes} placeholder={"Take accurate measurements\nCut fabric without waste"} />
      <TextAreaField label="Full description" rows={6} value={v.description} onChange={(e) => set("description", e.target.value)} error={errors.description} maxLength={5000} placeholder="Who is this for? What will they make? What do they need?" />
      <Button type="submit" variant="dark" size="lg">{submitLabel}</Button>
    </form>
  );
}
