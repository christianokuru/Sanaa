"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { getLenis, setLenis } from "@/lib/scroll/lenis";

/** Gap left above a section reached from an in-page link, below the sticky header. */
const ANCHOR_GAP = 16;

/**
 * Smooth mouse-wheel and trackpad scrolling for the whole site.
 * Phones keep their own native scrolling, and people who ask for reduced motion get none.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      // Rows, menus and panels that scroll on their own keep doing so.
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });
    setLenis(lenis);

    // In-page links (#reviews, skip link): glide there, land below the header, and move focus.
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href^='#']");
      const hash = link?.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
      const skip = target.id === "main";
      lenis.scrollTo(target, { offset: skip ? 0 : -(header + ANCHOR_GAP), immediate: skip });
      history.pushState(null, "", hash);
      if (!target.hasAttribute("tabindex") && !target.matches("a,button,input,select,textarea")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // New page: page height changed, so measure again.
  useEffect(() => {
    getLenis()?.resize();
  }, [pathname]);

  return null;
}
