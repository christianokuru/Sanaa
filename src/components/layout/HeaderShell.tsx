"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

/** Routes that bring their own top bar on phones (course page, player, checkout). */
const IMMERSIVE = [/^\/courses\/[^/]+$/, /^\/learn\//, /^\/checkout\//, /^\/teach\/courses\//];

export function HeaderShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const immersive = IMMERSIVE.some((r) => r.test(pathname));
  return (
    <header className={cn("sticky top-0 z-40 border-b border-line bg-white", immersive && "hidden md:block")}>
      {children}
    </header>
  );
}
