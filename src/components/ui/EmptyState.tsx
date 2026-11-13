import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function EmptyState({
  icon: Icon, title, children, action, className,
}: { icon: LucideIcon; title: string; children?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-start py-10 md:py-16", className)}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas">
        <Icon className="h-7 w-7 text-ink" strokeWidth={1.5} />
      </span>
      <h2 className="mt-5 text-title font-semibold">{title}</h2>
      {children && <p className="mt-2 max-w-md text-ui text-ink-soft">{children}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
