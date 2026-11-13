"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils/cn";

/** Horizontal row that swipes on phones and shows arrow buttons on desktop. */
export function Scroller({ children, label, itemClassName }: { children: React.ReactNode[]; label: string; itemClassName?: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const move = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.9, behavior: "smooth" });

  return (
    <div className="relative">
      <div className="absolute -top-14 right-0 hidden gap-2 md:flex">
        <IconButton label={`Previous ${label}`} variant="outline" size="sm" onClick={() => move(-1)} disabled={edges.start}>
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        </IconButton>
        <IconButton label={`Next ${label}`} variant="outline" size="sm" onClick={() => move(1)} disabled={edges.end}>
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
        </IconButton>
      </div>
      <ul
        ref={track}
        aria-label={label}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 md:mx-0 md:scroll-px-0 md:px-0 md:gap-6"
      >
        {children.map((child, i) => (
          <li key={i} className={cn("w-[72%] shrink-0 snap-start sm:w-[44%] md:w-[calc((100%-48px)/3)] lg:w-[calc((100%-72px)/4)] xl:w-[calc((100%-120px)/6)]", itemClassName)}>
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
}
