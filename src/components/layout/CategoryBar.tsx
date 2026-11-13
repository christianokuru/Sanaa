import Link from "next/link";
import { CATEGORIES, type CategorySlug } from "@/config/categories";
import { CategoryIcon } from "@/components/brand/CategoryIcon";
import { cn } from "@/lib/utils/cn";

/** Icon tabs for each craft, with an underline on the active one. */
export function CategoryBar({ active }: { active?: CategorySlug | "all" }) {
  const items = [{ slug: "all" as const, short: "All", href: "/courses" }, ...CATEGORIES.map((c) => ({ slug: c.slug, short: c.short, href: `/categories/${c.slug}` }))];
  return (
    <nav aria-label="Crafts" className="no-scrollbar -mx-5 flex gap-7 overflow-x-auto px-5 md:mx-0 md:justify-center md:gap-10 md:px-0">
      {items.map((item) => {
        const isActive = active === item.slug;
        return (
          <Link
            key={item.slug}
            href={item.href}
            prefetch={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex shrink-0 flex-col items-center gap-2 border-b-2 pb-3 pt-1 text-caption font-semibold transition",
              isActive ? "border-ink text-ink" : "border-transparent text-ink-soft hover:border-line-strong hover:text-ink",
            )}
          >
            <CategoryIcon slug={item.slug} className={cn("h-7 w-7 transition", !isActive && "opacity-70 group-hover:opacity-100")} />
            {item.short}
          </Link>
        );
      })}
    </nav>
  );
}
