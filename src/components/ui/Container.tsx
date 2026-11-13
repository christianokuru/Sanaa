import { cn } from "@/lib/utils/cn";

export function Container({ className, children, as: Tag = "div" }: { className?: string; children: React.ReactNode; as?: "div" | "section" | "header" | "footer" | "main" }) {
  return <Tag className={cn("mx-auto w-full max-w-page px-5 md:px-10 xl:px-20", className)}>{children}</Tag>;
}
