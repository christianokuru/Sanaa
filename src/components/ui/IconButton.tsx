import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "canvas" | "white" | "ghost" | "overlay" | "outline";
const VARIANTS: Record<Variant, string> = {
  canvas: "bg-canvas text-ink hover:bg-line",
  white: "bg-white text-ink shadow-pill hover:scale-105",
  ghost: "text-ink hover:bg-canvas",
  overlay: "bg-white/90 text-ink backdrop-blur hover:bg-white",
  outline: "border border-line-strong bg-white text-ink hover:border-ink",
};
const SIZES = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" } as const;

type Props = {
  label: string;
  variant?: Variant;
  size?: keyof typeof SIZES;
  className?: string;
  children: React.ReactNode;
};

export const IconButton = forwardRef<HTMLButtonElement, Props & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">>(
  function IconButton({ label, variant = "canvas", size = "md", className, children, type = "button", ...rest }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={cn("inline-flex shrink-0 items-center justify-center rounded-full transition disabled:opacity-30", VARIANTS[variant], SIZES[size], className)}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export function IconLink({ href, label, variant = "canvas", size = "md", className, children }: Props & { href: string }) {
  return (
    <Link href={href} aria-label={label} title={label} className={cn("inline-flex shrink-0 items-center justify-center rounded-full transition", VARIANTS[variant], SIZES[size], className)}>
      {children}
    </Link>
  );
}
