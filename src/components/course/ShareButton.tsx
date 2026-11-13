"use client";

import { Share } from "lucide-react";
import { toast } from "@/lib/services/toast";
import { cn } from "@/lib/utils/cn";

export function ShareButton({ title, path, variant = "inline", className }: { title: string; path: string; variant?: "inline" | "overlay"; className?: string }) {
  async function share() {
    const url = `${window.location.origin}${path}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast("Link copied", { tone: "success" });
    } catch {
      /* user closed the share sheet */
    }
  }
  if (variant === "overlay") {
    return (
      <button type="button" onClick={share} aria-label="Share" className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-pill", className)}>
        <Share className="h-4 w-4" />
      </button>
    );
  }
  return (
    <button type="button" onClick={share} className={cn("inline-flex h-10 items-center gap-2 rounded-lg px-3 text-body font-semibold hover:bg-canvas", className)}>
      <Share className="h-4 w-4" /> Share
    </button>
  );
}
