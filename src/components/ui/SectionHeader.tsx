import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function SectionHeader({
  title, subtitle, href, action, className, as: Tag = "h2",
}: { title: string; subtitle?: string; href?: string; action?: React.ReactNode; className?: string; as?: "h1" | "h2" | "h3" }) {
  const heading = (
    <Tag className="flex items-center gap-1 text-section font-semibold text-ink">
      {title}
      {href && <ChevronRight className="h-5 w-5 transition group-hover:translate-x-0.5" strokeWidth={2.5} aria-hidden />}
    </Tag>
  );
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {href ? (
          <Link href={href} prefetch={false} className="group inline-block">
            {heading}
          </Link>
        ) : (
          heading
        )}
        {subtitle && <p className="mt-1 text-body text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
