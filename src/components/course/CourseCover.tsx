import { CourseArt } from "@/components/brand/CourseArt";
import { Badge } from "@/components/ui/Badge";
import { getCategory } from "@/config/categories";
import type { CourseBadge } from "@/lib/catalog/types";
import { cn } from "@/lib/utils/cn";

const BADGE_LABEL: Record<CourseBadge, string> = { bestseller: "Bestseller", "top-rated": "Top rated", new: "New" };

export function CourseCover({
  id, category, coverUrl, badge, className, children, rounded = true, fill = false,
}: { id: string; category: string; coverUrl?: string; badge?: CourseBadge; className?: string; children?: React.ReactNode; rounded?: boolean; /** Fill the parent instead of a square. */ fill?: boolean }) {
  const palette = getCategory(category)?.palette ?? ["#D93A16", "#F4A51C", "#191D57"];
  return (
    <div className={cn("relative w-full overflow-hidden bg-line", fill ? "h-full" : "aspect-square", rounded && "rounded-card", className)}>
      {coverUrl ? (
        <img src={coverUrl} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
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
