"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/SubmitButton";
import { createCourse, updateCourse } from "@/lib/actions/teach";
import { CATEGORIES, LEVELS } from "@/lib/config";
import { ALL_COUNTRIES } from "@/lib/countries";
import type { Course } from "@/lib/types";

const CURRENCIES = Array.from(new Set(ALL_COUNTRIES.map((c) => c.currency))).sort();

export function CourseForm({
  course, defaultCurrency, feeRate,
}: { course?: Course; defaultCurrency: string; feeRate: number }) {
  const [state, action] = useFormState(course ? updateCourse : createCourse, null);
  const [price, setPrice] = useState(course ? String(course.price) : "");
  const [currency, setCurrency] = useState(course?.currency ?? defaultCurrency);
  const keep = Number(price) > 0 ? Math.floor(Number(price) * (1 - feeRate) * 100) / 100 : 0;

  return (
    <form action={action} className="space-y-5">
      {course && <input type="hidden" name="courseId" value={course.id} />}
      <div>
        <label className="label" htmlFor="title">Course title</label>
        <input id="title" name="title" required minLength={4} maxLength={120} defaultValue={course?.title} placeholder="e.g. Sew Your First Ankara Dress" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="subtitle">Short description</label>
        <input id="subtitle" name="subtitle" maxLength={160} defaultValue={course?.subtitle} placeholder="One line that sells your course" className="input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue={course?.category ?? "fashion"} className="input">
            {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="level">Level</label>
          <select id="level" name="level" defaultValue={course?.level ?? "beginner"} className="input capitalize">
            {LEVELS.map((l) => <option key={l} value={l}>{l[0].toUpperCase() + l.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="price">Price</label>
        <div className="flex gap-2">
          <select name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="input w-28" aria-label="Currency">
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input id="price" name="price" type="number" inputMode="decimal" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0 for free" className="input flex-1" />
        </div>
        <p className="mt-1.5 text-sm text-earth-soft">
          {keep > 0 ? <>You keep <b className="text-forest">{currency} {keep.toLocaleString("en")}</b> per student ({Math.round((1 - feeRate) * 100)}%). Learners see it in their own currency.</> : "Free courses help you get your first students and reviews."}
        </p>
      </div>
      <div>
        <label className="label" htmlFor="what_you_learn">What will students learn? (one per line)</label>
        <textarea id="what_you_learn" name="what_you_learn" rows={4} defaultValue={course?.what_you_learn.join("\n")} placeholder={"Take accurate measurements\nCut fabric without waste"} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="description">Full description</label>
        <textarea id="description" name="description" rows={6} defaultValue={course?.description} placeholder="Who is this course for? What will they need?" className="input" />
      </div>
      {state && <p className={`rounded-xl p-3 text-sm ${state.error ? "bg-terracotta-light text-terracotta-dark" : "bg-forest-light text-forest"}`}>{state.error ?? state.message}</p>}
      <SubmitButton pendingText="Saving...">{course ? "Save changes" : "Create course"}</SubmitButton>
    </form>
  );
}
