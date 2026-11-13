"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ShareButton } from "@/components/course/ShareButton";
import { WishlistButton } from "@/components/course/WishlistButton";

/** Floating back / share / save buttons over the cover on phones. */
export function CourseMobileTop({ courseId, title, path }: { courseId: string; title: string; path: string }) {
  const router = useRouter();
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 md:hidden" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
      <button
        type="button"
        onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
        aria-label="Go back"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-pill"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
      </button>
      <div className="flex gap-3">
        <ShareButton title={title} path={path} variant="overlay" />
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-pill">
          <WishlistButton courseId={courseId} title={title} className="h-10 w-10 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:fill-transparent [&_svg]:text-ink [&_svg]:drop-shadow-none [&[aria-pressed=true]_svg]:fill-ember-bright [&[aria-pressed=true]_svg]:text-ember-bright" />
        </span>
      </div>
    </div>
  );
}
