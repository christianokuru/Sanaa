"use client";

import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { dismissToast, useToasts } from "@/lib/services/toast";
import { cn } from "@/lib/utils/cn";

export function Toaster() {
  const toasts = useToasts((s) => s.toasts);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(88px+env(safe-area-inset-bottom))] z-[70] flex flex-col items-center gap-2 px-4 md:bottom-8">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn("pointer-events-auto flex w-full max-w-sm animate-sheet-up items-center gap-3 rounded-2xl bg-ink px-4 py-3.5 text-body text-white shadow-modal")}
          role="status"
        >
          {t.tone === "success" && <CheckCircle2 className="h-5 w-5 shrink-0 text-[#4ADE80]" />}
          {t.tone === "error" && <AlertCircle className="h-5 w-5 shrink-0 text-ember-bright" />}
          <span className="flex-1">{t.message}</span>
          {t.action && (
            <Link href={t.action.href} onClick={() => dismissToast(t.id)} className="font-semibold underline underline-offset-4">
              {t.action.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
