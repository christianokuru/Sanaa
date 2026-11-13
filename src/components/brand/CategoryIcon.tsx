import type { CategorySlug } from "@/config/categories";
import { cn } from "@/lib/utils/cn";

/** Hand-drawn line icons for each craft. 24px grid, stroke inherits currentColor. */
const PATHS: Record<CategorySlug | "all", React.ReactNode> = {
  all: (
    <>
      <path d="M12 3 21 12 12 21 3 12Z" />
      <path d="M12 8 16 12 12 16 8 12Z" />
    </>
  ),
  fashion: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M7.8 16.3 17 4M16.2 16.3 7 4" />
      <path d="M12 10.3v0" strokeWidth="2.4" />
    </>
  ),
  hair: (
    <>
      <path d="M4 9h16v3H4z" />
      <path d="M6 12v7M9 12v7M12 12v7M15 12v7M18 12v7" />
      <path d="M8 9c0-2.5 1.8-5 4-5s4 2.5 4 5" />
    </>
  ),
  beauty: (
    <>
      <path d="M9 21h6v-8H9z" />
      <path d="M10 13V8.5L14 5v8" />
      <path d="M8 21h8" />
    </>
  ),
  dance: (
    <>
      <circle cx="13" cy="4.5" r="2" />
      <path d="M13 7.5 11 13l3 3 1 5M11 13l-4 2-1 5M12 9l5 2 2-3M12 9 7 8 5 5" />
    </>
  ),
  music: (
    <>
      <path d="M6 5c0 1.7 2.7 3 6 3s6-1.3 6-3-2.7-3-6-3-6 1.3-6 3Z" />
      <path d="M6 5c0 3 2 5 3 7l-1 9h8l-1-9c1-2 3-4 3-7" />
      <path d="M9 12h6" />
    </>
  ),
  crafts: (
    <>
      <path d="M4 6c2 7 5 11 8 11s6-4 8-11" />
      <circle cx="6.5" cy="11" r="1.4" />
      <circle cx="9.5" cy="14.6" r="1.4" />
      <circle cx="14.5" cy="14.6" r="1.4" />
      <circle cx="17.5" cy="11" r="1.4" />
      <path d="M12 17v3" />
      <path d="M10.5 21.5 12 20l1.5 1.5L12 23Z" />
    </>
  ),
};

export function CategoryIcon({ slug, className }: { slug: CategorySlug | "all"; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      aria-hidden
      focusable="false"
    >
      {PATHS[slug]}
    </svg>
  );
}
