import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/** Sanaa mark: a woven diamond (kente lattice) in ember. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden focusable="false">
      <rect width="32" height="32" rx="9" fill="#F0532B" />
      <path d="M16 5 27 16 16 27 5 16Z" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M16 10.5 21.5 16 16 21.5 10.5 16Z" fill="#fff" />
      <path d="M5 16h22" stroke="#F0532B" strokeWidth="2.2" />
    </svg>
  );
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" aria-label="Sanaa home" className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {!compact && <span className="text-[1.375rem] font-bold tracking-[-0.04em] text-ember-bright">sanaa</span>}
    </Link>
  );
}
