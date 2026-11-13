import { cn } from "@/lib/utils/cn";
import { initials } from "@/lib/utils/format";
import { hashString } from "@/lib/utils/slug";

const BACKGROUNDS = ["bg-ember", "bg-cobalt", "bg-malachite", "bg-indigo", "bg-rose", "bg-[#8A5A00]"];
const SIZES = { sm: "h-8 w-8 text-caption", md: "h-10 w-10 text-body", lg: "h-14 w-14 text-ui", xl: "h-24 w-24 text-[1.75rem]" } as const;

export function Avatar({ name, size = "md", className }: { name: string; size?: keyof typeof SIZES; className?: string }) {
  const bg = BACKGROUNDS[hashString(name) % BACKGROUNDS.length];
  return (
    <span aria-hidden className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight text-white", bg, SIZES[size], className)}>
      {initials(name)}
    </span>
  );
}
