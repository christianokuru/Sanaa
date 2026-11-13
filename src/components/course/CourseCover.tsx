import { CourseArt } from "@/components/brand/CourseArt";
import { Badge } from "@/components/ui/Badge";
import { Photo } from "@/components/ui/Photo";
import { getCategory } from "@/config/categories";
import type { CourseBadge, CoverImage } from "@/lib/catalog/types";
import { cn } from "@/lib/utils/cn";

const BADGE_LABEL: Record<CourseBadge, string> = { bestseller: "Bestseller", "top-rated": "Top rated", new: "New" };

/** Course photo, or generated pattern art when the course has no photo yet. */
export function CourseCover({
  id, category, cover, badge, className, children, rounded = true, fill = false,
  sizes = "(min-width: 1280px) 16vw, (min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw", priority = false, decorative = false,
}: {
  id: string;
  category: string;
  cover?: CoverImage;
  badge?: CourseBadge;
  className?: string;
  children?: React.ReactNode;
  rounded?: boolean;
  /** Fill the parent instead of a square. */
  fill?: boolean;
  /** How wide the image shows, so the browser picks the right file. */
  sizes?: string;
  priority?: boolean;
  /** Hide the photo from screen readers (for repeated detail crops). */
  decorative?: boolean;
}) {
  const palette = getCategory(category)?.palette ?? ["#D93A16", "#F4A51C", "#191D57"];
  return (
    <div className={cn("relative w-full overflow-hidden bg-line", fill ? "h-full" : "aspect-square", rounded && "rounded-card", className)}>
      {cover ? (
        <Photo image={cover} sizes={sizes} priority={priority} decorative={decorative} className="transition duration-500 group-hover:scale-[1.03]" />
      ) : (
        <CourseArt seed={id} palette={palette} className="transition duration-500 group-hover:scale-[1.03]" />
      )}
      {badge && (
        <Badge tone="white" className="absolute left-3 top-3">
          {BADGE_LABEL[badge]}
        </Badge>
      )}
      {children}
    </div>
  );
}
