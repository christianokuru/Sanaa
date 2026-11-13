"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Field";
import { coursesHref } from "@/lib/catalog/search-params";
import type { CourseQuery, CourseSort, Level } from "@/lib/catalog/types";
import { getCategory } from "@/config/categories";
import { cn } from "@/lib/utils/cn";

const SORTS: Array<{ value: CourseSort; label: string }> = [
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Highest rated" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];
const LEVELS: Array<{ value: Level; label: string }> = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

/** Filter button + sheet, sort menu and removable chips for active filters. */
export function CourseFilters({ query }: { query: CourseQuery }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CourseQuery>(query);
  const activeCount = [query.level, query.price].filter(Boolean).length;

  const apply = (next: CourseQuery) => router.push(coursesHref(next), { scroll: false });

  const chips = [
    query.q && { key: "q", label: `“${query.q}”` },
    query.category && { key: "category", label: getCategory(query.category)?.name ?? query.category },
    query.level && { key: "level", label: LEVELS.find((l) => l.value === query.level)?.label },
    query.price && { key: "price", label: query.price === "free" ? "Free" : "Paid" },
  ].filter(Boolean) as Array<{ key: keyof CourseQuery; label: string }>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => { setDraft(query); setOpen(true); }}
          className={cn("inline-flex h-10 items-center gap-2 rounded-full border px-4 text-body font-semibold transition hover:border-ink", activeCount ? "border-ink bg-canvas" : "border-line-strong")}
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {activeCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[11px] text-white">{activeCount}</span>}
        </button>
        <label className="relative">
          <span className="sr-only">Sort courses</span>
          <select
            value={query.sort ?? "popular"}
            onChange={(e) => apply({ ...query, sort: e.target.value as CourseSort })}
            className="h-10 appearance-none rounded-full border border-line-strong bg-white pl-4 pr-9 text-body font-semibold hover:border-ink focus:outline-none"
          >
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-caption">▾</span>
        </label>
      </div>

      {chips.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Active filters">
          {chips.map((c) => (
            <li key={c.key}>
              <button
                type="button"
                onClick={() => apply({ ...query, [c.key]: undefined })}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-3.5 text-body font-medium text-white"
                aria-label={`Remove filter ${c.label}`}
              >
                {c.label} <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
          <li>
            <button type="button" onClick={() => apply({})} className="h-9 px-2 text-body font-semibold underline underline-offset-4">Clear all</button>
          </li>
        </ul>
      )}

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Filters"
        footer={
          <div className="flex items-center justify-between">
            <button type="button" className="text-ui font-semibold underline underline-offset-4" onClick={() => setDraft({ q: query.q, category: query.category })}>
              Clear all
            </button>
            <Button variant="dark" onClick={() => { setOpen(false); apply(draft); }}>Show courses</Button>
          </div>
        }
      >
        <section>
          <h3 className="text-title font-semibold">Price</h3>
          <div className="mt-4">
            <Segmented
              label="Price"
              value={draft.price ?? "any"}
              onChange={(v) => setDraft({ ...draft, price: v === "any" ? undefined : v })}
              options={[{ value: "any", label: "Any" }, { value: "free", label: "Free" }, { value: "paid", label: "Paid" }]}
            />
          </div>
        </section>
        <hr className="my-8 border-line" />
        <section>
          <h3 className="text-title font-semibold">Level</h3>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                aria-pressed={draft.level === l.value}
                onClick={() => setDraft({ ...draft, level: draft.level === l.value ? undefined : l.value })}
                className={cn("h-12 rounded-xl border text-body font-semibold transition", draft.level === l.value ? "border-ink bg-canvas ring-1 ring-ink" : "border-line-strong hover:border-ink")}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>
        <hr className="my-8 border-line" />
        <section>
          <h3 className="text-title font-semibold">Sort by</h3>
          <div className="mt-2">
            {SORTS.map((s) => (
              <label key={s.value} className="flex cursor-pointer items-center justify-between py-3 text-ui">
                {s.label}
                <input type="radio" name="sort" className="h-5 w-5 accent-ink" checked={(draft.sort ?? "popular") === s.value} onChange={() => setDraft({ ...draft, sort: s.value })} />
              </label>
            ))}
          </div>
        </section>
      </Sheet>
    </div>
  );
}
