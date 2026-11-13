"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, UserCircle2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useCurrentUser, useHydrated } from "@/lib/hooks/use-store";
import { signOutAndLeave } from "@/lib/services/auth";

type Item = { href: string; label: string; strong?: boolean } | "divider";

export function UserMenu() {
  const user = useCurrentUser();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items: Item[] = user
    ? [
        { href: "/wishlist", label: "Wishlist", strong: true },
        { href: "/my-learning", label: "My learning", strong: true },
        ...(user.role !== "student" ? [{ href: "/teach/dashboard", label: "Teacher dashboard", strong: true }] : []),
        ...(user.role === "admin" ? [{ href: "/admin", label: "Admin", strong: true }] : []),
        "divider",
        ...(user.role !== "student" ? [{ href: "/teach/profile", label: "Teacher profile" }] : []),
        { href: "/account", label: "Account" },
        ...(user.role === "student" ? [{ href: "/teach", label: "Teach on Sanaa" }] : []),
        { href: "/help", label: "Help Centre" },
      ]
    : [
        { href: "/signup", label: "Sign up", strong: true },
        { href: "/login", label: "Log in" },
        "divider",
        { href: "/teach", label: "Teach on Sanaa" },
        { href: "/help", label: "Help Centre" },
      ];

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open menu"
        className="flex h-12 items-center gap-3 rounded-full border border-line-strong bg-white pl-4 pr-1.5 transition hover:shadow-pill"
      >
        <Menu className="h-4 w-4" strokeWidth={2.5} />
        {hydrated && user ? <Avatar name={user.name} size="sm" /> : <UserCircle2 className="h-8 w-8 text-ink-soft" strokeWidth={1.4} aria-hidden />}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 animate-fade-in overflow-hidden rounded-2xl bg-white py-2 shadow-float ring-1 ring-black/5">
          {items.map((item, i) =>
            item === "divider" ? (
              <hr key={`d${i}`} className="my-2 border-line" />
            ) : (
              <Link key={item.href} role="menuitem" href={item.href} onClick={() => setOpen(false)} className={`block px-4 py-3 text-body hover:bg-canvas ${item.strong ? "font-semibold" : ""}`}>
                {item.label}
              </Link>
            ),
          )}
          {user && (
            <button
              role="menuitem"
              type="button"
              onClick={signOutAndLeave}
              className="block w-full px-4 py-3 text-left text-body hover:bg-canvas"
            >
              Log out
            </button>
          )}
        </div>
      )}
    </div>
  );
}
