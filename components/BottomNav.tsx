"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlayCircle, GraduationCap, User } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/courses", label: "Browse", icon: Search },
  { href: "/my-learning", label: "Learning", icon: PlayCircle },
  { href: "/teach", label: "Teach", icon: GraduationCap },
  { href: "/account", label: "Account", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/learn/")) return null;
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-earth/10 bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Main menu"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
                  active ? "text-terracotta" : "text-earth/60"
                }`}
              >
                <Icon className="h-6 w-6" strokeWidth={active ? 2.4 : 1.8} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
