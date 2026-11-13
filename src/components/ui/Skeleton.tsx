import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-card bg-line", className)} />;
}

export function CourseCardSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="mt-3 h-4 w-3/4 rounded-md" />
      <Skeleton className="mt-2 h-4 w-1/2 rounded-md" />
    </div>
  );
}
