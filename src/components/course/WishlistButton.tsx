"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toggleWishlist } from "@/lib/services/library";
import { toast } from "@/lib/services/toast";
import { useAppStore } from "@/lib/store/app-store";
import { useIsSaved } from "@/lib/hooks/use-store";
import { cn } from "@/lib/utils/cn";

export function WishlistButton({ courseId, title, variant = "overlay", className }: { courseId: string; title: string; variant?: "overlay" | "inline"; className?: string }) {
  const saved = useIsSaved(courseId);
  const hydrated = useAppStore((s) => s.hydrated);
  const [pop, setPop] = useState(false);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const userId = useAppStore.getState().sessionUserId;
    const nowSaved = toggleWishlist(userId, courseId);
    setPop(nowSaved);
    toast(nowSaved ? "Saved to your wishlist" : "Removed from your wishlist", {
      tone: nowSaved ? "success" : "default",
      action: nowSaved ? { label: "View", href: "/wishlist" } : undefined,
    });
  }

  const label = saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`;

  if (variant === "inline") {
    return (
      <button type="button" onClick={onClick} aria-pressed={saved} aria-label={label} disabled={!hydrated}
        className={cn("inline-flex h-10 items-center gap-2 rounded-lg px-3 text-body font-semibold underline-offset-4 hover:bg-canvas", className)}>
        <Heart className={cn("h-4 w-4", saved ? "fill-ember-bright text-ember-bright" : "text-ink", pop && "animate-pop")} strokeWidth={2} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-pressed={saved} aria-label={label} disabled={!hydrated}
      className={cn("flex h-12 w-12 items-center justify-center transition active:scale-90", className)}>
      <Heart
        className={cn("h-6 w-6 drop-shadow-[0_1px_2px_rgba(0,0,0,.4)]", saved ? "fill-ember-bright text-white" : "fill-black/40 text-white", pop && "animate-pop")}
        strokeWidth={2}
      />
    </button>
  );
}
