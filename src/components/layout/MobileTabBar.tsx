"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, PlayCircle, Search, UserCircle2 } from "lucide-react";
import { useCurrentUser, useHydrated } from "@/lib/hooks/use-store";
import { cn } from "@/lib/utils/cn";

const HIDDEN = [/^\/courses\/[^/]+$/, /^\/learn\//, /^\/checkout\//, /^\/teach\/courses\//];

export function MobileTabBar() {
  const pathname = usePathname();
  const user = useCurrentUser();
  const hydrated = useHydrated();
  if (HIDDEN.some((r) => r.test(pathname))) return null;

  const tabs = [
    { href: "/", label: "Explore", icon: Search, match: (p: string) => p === "/" || p.startsWith("/courses") || p.startsWith("/categories") },
    { href: "/wishlist", label: "Wishlist", icon: Heart, match: (p: string) => p.startsWith("/wishlist") },
    { href: "/my-learning", label: "Learning", icon: PlayCircle, match: (p: string) => p.startsWith("/my-learning") },
    hydrated && user
      ? { href: "/account", label: "Profile", icon: UserCircle2, match: (p: string) => p.startsWith("/account") || p.startsWith("/teach") || p.startsWith("/admin") }
      : { href: "/login", label: "Log in", icon: UserCircle2, match: (p: string) => p.startsWith("/login") || p.startsWith("/signup") },
  ];

  return (
    <nav aria-label="Main" className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white md:hidden">
      <ul className="mx-auto flex max-w-md justify-around">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={label}>
              <Link href={href} aria-current={active ? "page" : undefined} className={cn("flex h-16 w-20 flex-col items-center justify-center gap-1 text-[11px] font-medium", active ? "text-ember" : "text-ink-soft")}>
                <Icon className="h-6 w-6" strokeWidth={active ? 2.2 : 1.6} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
