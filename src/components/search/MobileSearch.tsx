"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Search } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/brand/CategoryIcon";
import { CATEGORIES } from "@/config/categories";
import { POPULAR_SEARCHES, coursesHref } from "@/lib/catalog/search-params";
import { addRecentSearch, clearRecentSearches } from "@/lib/services/library";
import { usePrefs } from "@/lib/hooks/use-store";

/** The "Start your search" capsule on phones. Opens a full-screen search. */
export function MobileSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { recentSearches } = usePrefs();
  const router = useRouter();

  function go(href: string, term?: string) {
    if (term) addRecentSearch(term);
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-14 w-full items-center gap-3 rounded-full border border-line bg-white px-5 text-left shadow-pill transition active:scale-[.99]"
      >
        <Search className="h-5 w-5 shrink-0" strokeWidth={2.5} />
        <span className="min-w-0">
          <span className="block text-body font-semibold">Start your search</span>
          <span className="block truncate text-caption text-ink-soft">Any craft · Any level · Your currency</span>
        </span>
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Search"
        variant="full"
        footer={
          <div className="flex items-center justify-between">
            <button type="button" className="text-ui font-semibold underline underline-offset-4" onClick={() => setQ("")}>Clear</button>
            <Button onClick={() => go(coursesHref({ q: q.trim() || undefined }), q)}>
              <Search className="h-4 w-4" strokeWidth={3} /> Search
            </Button>
          </div>
        }
      >
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            go(coursesHref({ q: q.trim() || undefined }), q);
          }}
          className="relative"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
          <input
            data-autofocus
            type="search"
            enterKeyHint="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            maxLength={80}
            placeholder="Braids, Ankara, Amapiano..."
            aria-label="Search skills or teachers"
            className="h-14 w-full rounded-2xl border border-line-strong bg-white pl-12 pr-4 text-ui placeholder:text-ink-soft focus:border-ink focus:outline-none"
          />
          {/* Lets the keyboard's Go / Enter key submit on every phone. */}
          <button type="submit" className="sr-only" tabIndex={-1}>Search</button>
        </form>

        {recentSearches.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold">Recent searches</h3>
              <button type="button" onClick={clearRecentSearches} className="text-caption font-semibold text-ink-soft underline">Clear all</button>
            </div>
            <ul className="mt-2">
              {recentSearches.map((term) => (
                <li key={term}>
                  <button type="button" onClick={() => go(coursesHref({ q: term }), term)} className="flex w-full items-center gap-4 py-3 text-left text-ui">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-canvas"><Clock className="h-5 w-5" /></span>
                    {term}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8">
          <h3 className="text-body font-semibold">Browse by craft</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => go(`/categories/${c.slug}`)}
                className="flex flex-col items-start gap-6 rounded-2xl border border-line p-4 text-left transition hover:border-ink"
              >
                <CategoryIcon slug={c.slug} className="h-7 w-7" />
                <span className="text-body font-semibold">{c.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-body font-semibold">Popular right now</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button key={term} type="button" onClick={() => go(coursesHref({ q: term }), term)} className="rounded-full border border-line-strong px-4 py-2 text-body font-medium hover:border-ink">
                {term}
              </button>
            ))}
          </div>
        </section>
      </Sheet>
    </>
  );
}
