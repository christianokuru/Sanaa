import type { CoverImage } from "@/lib/catalog/types";
import { cn } from "@/lib/utils/cn";

/** Widths every photo is exported at (see scripts/process-photos.py). */
const WIDTHS = [480, 1080, 1600] as const;

/**
 * Responsive, self-hosted photo. Lazy by default; pass `priority` for the
 * largest image above the fold so it loads first.
 */
export function Photo({
  image, sizes, priority = false, className, decorative = false,
}: { image: CoverImage; sizes: string; priority?: boolean; className?: string; /** Hide from screen readers when nearby text already says it. */ decorative?: boolean }) {
  return (
    <img
      src={`${image.src}-1080.webp`}
      srcSet={WIDTHS.map((w) => `${image.src}-${w}.webp ${w}w`).join(", ")}
      sizes={sizes}
      alt={decorative ? "" : image.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
