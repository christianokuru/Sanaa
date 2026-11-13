import { cn } from "@/lib/utils/cn";

export function PageHeader({ title, subtitle, action, className }: { title: string; subtitle?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.035em]">{title}</h1>
        {subtitle && <p className="mt-1 text-ui text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
