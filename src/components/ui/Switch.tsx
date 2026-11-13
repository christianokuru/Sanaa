"use client";

import { useId } from "react";
import { cn } from "@/lib/utils/cn";

export function Switch({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <label htmlFor={id} className="text-ui font-medium">{label}</label>
        {description && <p className="text-body text-ink-soft">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative h-8 w-[52px] shrink-0 rounded-full transition", checked ? "bg-ink" : "bg-line-strong")}
      >
        <span className={cn("absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all", checked ? "left-[24px]" : "left-1")} />
      </button>
    </div>
  );
}
