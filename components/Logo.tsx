import Link from "next/link";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#C2502A" />
      <path d="M20 7 33 20 20 33 7 20Z" fill="none" stroke="#FBF5EA" strokeWidth="3" />
      <path d="M20 14 26 20 20 26 14 20Z" fill="#E2A529" />
      <circle cx="20" cy="20" r="2" fill="#2B1B12" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Sanaa home">
      <LogoMark />
      <span className="font-display text-2xl font-bold tracking-tight">Sanaa</span>
    </Link>
  );
}
