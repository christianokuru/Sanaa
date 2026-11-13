import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { CATEGORIES } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mudcloth mt-16 text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="font-display text-2xl font-bold">Sanaa</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-cream/70">Learn the craft. Earn from it. African skills, taught by African teachers.</p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-gold">Learn</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            {CATEGORIES.map((c) => (
              <li key={c.slug}><Link href={`/courses?category=${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-gold">Teach</p>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li><Link href="/teach">Become a teacher</Link></li>
            <li><Link href="/teach/guide">Filming guide</Link></li>
          </ul>
        </div>
      </div>
      <div className="kente h-1.5" />
    </footer>
  );
}
