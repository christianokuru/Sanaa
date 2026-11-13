import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/format";

export function Rating({ value, count, className, size = "sm" }: { value: number; count?: number; className?: string; size?: "sm" | "md" }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-ink", size === "md" ? "text-ui font-semibold" : "text-body", className)}>
      <Star className={cn("fill-ink text-ink", size === "md" ? "h-4 w-4" : "h-3 w-3")} aria-hidden />
      <span>{value.toFixed(2).replace(/0$/, "")}</span>
      {count !== undefined && <span className="text-ink-soft">({formatNumber(count)})</span>}
      <span className="sr-only">out of 5 stars</span>
    </span>
  );
}

export function StarInput({ value, onChange, error }: { value: number; onChange: (v: number) => void; error?: string }) {
  return (
    <div>
      <div role="radiogroup" aria-label="Your rating" className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            className="rounded-full p-1.5 transition hover:scale-110"
          >
            <Star className={cn("h-8 w-8", n <= value ? "fill-saffron text-saffron" : "text-line-strong")} strokeWidth={1.5} />
          </button>
        ))}
      </div>
      {error && <p role="alert" className="mt-1 text-caption font-medium text-ember">{error}</p>}
    </div>
  );
}
