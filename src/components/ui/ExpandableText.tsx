"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

export function ExpandableText({ text, lines = 5 }: { text: string; lines?: number }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 280;
  return (
    <div>
      <p className="whitespace-pre-line text-ui leading-relaxed text-ink" style={!open && long ? { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" } : undefined}>
        {text}
      </p>
      {long && (
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="mt-3 inline-flex items-center gap-1 text-ui font-semibold underline underline-offset-4">
          {open ? "Show less" : "Show more"} <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
