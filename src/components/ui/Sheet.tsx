"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { IconButton } from "@/components/ui/IconButton";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** "sheet": bottom sheet on phones, centered dialog on larger screens. "full": full screen on phones. */
  variant?: "sheet" | "full";
  size?: "sm" | "md" | "lg";
};

const SIZES = { sm: "md:max-w-md", md: "md:max-w-xl", lg: "md:max-w-3xl" };

/** Accessible modal: traps focus, closes on Escape and backdrop, locks page scroll, restores focus. */
export function Sheet({ open, onClose, title, description, children, footer, variant = "sheet", size = "md" }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  // Keep the latest onClose without re-running the open/close effect on every parent render.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])') ?? []);
    const t = setTimeout(() => (panel.current?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[1] ?? panel.current)?.focus(), 30);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key === "Tab") {
        const els = focusables();
        if (els.length === 0) return;
        const first = els[0]!;
        const last = els[els.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6">
      <div className="absolute inset-0 animate-fade-in bg-black/50" onClick={() => onCloseRef.current()} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        tabIndex={-1}
        className={cn(
          "relative flex w-full flex-col bg-white shadow-modal outline-none animate-sheet-up md:animate-fade-in md:rounded-3xl",
          variant === "full" ? "h-[100dvh] md:h-auto md:max-h-[85vh]" : "max-h-[92dvh] rounded-t-3xl md:max-h-[85vh]",
          SIZES[size],
        )}
      >
        <header className="relative flex min-h-[64px] items-center justify-center border-b border-line px-14 py-4">
          <IconButton label="Close" variant="ghost" size="sm" onClick={onClose} className="absolute left-4 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4" strokeWidth={2.5} />
          </IconButton>
          <div className="text-center">
            <h2 id="sheet-title" className="text-ui font-semibold">{title}</h2>
            {description && <p className="mt-0.5 text-caption text-ink-soft">{description}</p>}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">{children}</div>
        {footer && <footer className="safe-bottom border-t border-line px-6 py-4">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
