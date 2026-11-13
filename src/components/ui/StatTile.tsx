import { cn } from "@/lib/utils/cn";

export function StatTile({ label, value, sub, tone = "default" }: { label: string; value: string; sub?: string; tone?: "default" | "ink" | "ember" }) {
  return (
    <div className={cn("rounded-card p-5", tone === "ink" ? "bg-ink text-white" : tone === "ember" ? "bg-ember text-white" : "bg-canvas")}>
      <p className={cn("text-body", tone === "default" ? "text-ink-soft" : "text-white/70")}>{label}</p>
      <p className="mt-2 text-[1.625rem] font-bold leading-none tracking-[-0.03em]">{value}</p>
      {sub && <p className={cn("mt-2 text-caption", tone === "default" ? "text-ink-soft" : "text-white/60")}>{sub}</p>}
    </div>
  );
}
