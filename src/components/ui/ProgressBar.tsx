import { cn } from "@/lib/utils/cn";

export function ProgressBar({ value, className, label }: { value: number; className?: string; label: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className={cn("h-1.5 overflow-hidden rounded-full bg-line", className)}>
      <div className="h-full rounded-full bg-ink transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}
