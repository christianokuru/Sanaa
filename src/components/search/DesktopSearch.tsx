"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/config/categories";
import { CategoryIcon } from "@/components/brand/CategoryIcon";
import { coursesHref, parseCourseQuery } from "@/lib/catalog/search-params";
import { addRecentSearch } from "@/lib/services/library";
import type { CategorySlug } from "@/config/categories";
import type { Level } from "@/lib/catalog/types";
import { cn } from "@/lib/utils/cn";

type Panel = "category" | "level" | null;
const LEVELS: Array<{ value: Level | ""; label: string; hint: string }> = [
  { value: "", label: "Any level", hint: "Show everything" },
  { value: "beginner", label: "Beginner", hint: "Start from zero" },
  { value: "intermediate", label: "Intermediate", hint: "Level up your skill" },
  { value: "advanced", label: "Advanced", hint: "Master-level detail" },
];

/** Three-part search capsule: what, category, level. */
export function DesktopSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = parseCourseQuery(Object.fromEntries(params.entries()));
  const [q, setQ] = useState(initial.q ?? "");
  const [category, setCategory] = useState<CategorySlug | "">(initial.category ?? "");
  const [level, setLevel] = useState<Level | "">(initial.level ?? "");
  const [panel, setPanel] = useState<Panel>(null);
  const root = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!root.current?.contains(e.target as Node)) setPanel(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPanel(null);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setPanel(null);
    if (q.trim()) addRecentSearch(q);
    router.push(coursesHref({ ...initial, q: q.trim() || undefined, category: category || undefined, level: level || undefined }));
  }

  const segment = (active: boolean) =>
    cn("relative flex h-full flex-1 flex-col justify-center rounded-full px-7 text-left transition", active ? "bg-white shadow-float" : "hover:bg-line/60");

  return (
    <form ref={root} onSubmit={submit} role="search" className={cn("relative mx-auto flex h-16 w-full max-w-[850px] items-center rounded-full border border-line shadow-pill", panel ? "bg-canvas" : "bg-white")}>
      <label className={segment(false)}>
        <span className="text-caption font-semibold">What</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setPanel(null)}
          placeholder="Search skills or teachers"
          maxLength={80}
          className="w-full truncate bg-transparent text-body text-ink placeholder:text-ink-soft focus:outline-none"
        />
      </label>
      <span className="h-8 w-px bg-line-strong" aria-hidden />
      <button type="button" className={segment(panel === "category")} onClick={() => setPanel(panel === "category" ? null : "category")} aria-expanded={panel === "category"}>
        <span className="text-caption font-semibold">Category</span>
        <span className={cn("truncate text-body", category ? "text-ink" : "text-ink-soft")}>{CATEGORIES.find((c) => c.slug === category)?.name ?? "All crafts"}</span>
      </button>
      <span className="h-8 w-px bg-line-strong" aria-hidden />
      <div className={cn("relative flex h-full flex-1 items-center gap-2 rounded-full pl-7 pr-2 transition", panel === "level" ? "bg-white shadow-float" : "hover:bg-line/60")}>
        <button type="button" className="flex flex-1 flex-col text-left" onClick={() => setPanel(panel === "level" ? null : "level")} aria-expanded={panel === "level"}>
          <span className="text-caption font-semibold">Level</span>
          <span className={cn("text-body", level ? "text-ink" : "text-ink-soft")}>{LEVELS.find((l) => l.value === level)?.label ?? "Any level"}</span>
        </button>
        <button type="submit" className="flex h-12 items-center gap-2 rounded-full bg-ember-bright px-4 font-semibold text-white transition hover:bg-ember" aria-label="Search">
          <Search className="h-4 w-4" strokeWidth={3} />
          {panel && <span>Search</span>}
        </button>
      </div>

      {panel === "category" && (
        <div className="absolute left-1/4 top-[calc(100%+12px)] z-50 w-[420px] animate-fade-in rounded-[32px] bg-white p-6 shadow-modal">
          <p className="mb-3 text-body font-semibold">Choose a craft</p>
          <div className="grid grid-cols-2 gap-2">
            {[{ slug: "" as const, name: "All crafts" }, ...CATEGORIES].map((c) => (
              <button
                key={c.slug || "all"}
                type="button"
                onClick={() => { setCategory(c.slug); setPanel("level"); }}
                className={cn("flex items-center gap-3 rounded-2xl border p-3 text-left text-body font-medium transition hover:border-ink", category === c.slug ? "border-ink bg-canvas" : "border-line")}
              >
                <CategoryIcon slug={c.slug || "all"} />
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {panel === "level" && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[340px] animate-fade-in rounded-[32px] bg-white p-4 shadow-modal">
          {LEVELS.map((l) => (
            <button
              key={l.value || "any"}
              type="button"
              onClick={() => { setLevel(l.value); setPanel(null); }}
              className={cn("flex w-full flex-col rounded-2xl px-4 py-3 text-left transition hover:bg-canvas", level === l.value && "bg-canvas")}
            >
              <span className="text-ui font-semibold">{l.label}</span>
              <span className="text-body text-ink-soft">{l.hint}</span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
