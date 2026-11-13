import { cn } from "@/lib/utils/cn";

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />;
}
