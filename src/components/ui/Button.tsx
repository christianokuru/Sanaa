import Link from "next/link";
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "dark" | "outline" | "ghost" | "white" | "link";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ember text-white hover:bg-ember-hover active:scale-[.98]",
  dark: "bg-ink text-white hover:bg-black active:scale-[.98]",
  outline: "border border-ink text-ink hover:bg-canvas active:scale-[.98]",
  ghost: "text-ink hover:bg-canvas",
  white: "bg-white text-ink hover:bg-canvas active:scale-[.98]",
  link: "text-ink underline underline-offset-4 hover:text-ink-soft px-0",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-body rounded-lg",
  md: "h-12 px-6 text-ui rounded-xl",
  lg: "h-14 px-8 text-ui rounded-xl",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & { href: string; prefetch?: boolean; target?: string; rel?: string; "aria-label"?: string };

export function buttonClasses({ variant = "primary", size = "md", block, className }: Pick<CommonProps, "variant" | "size" | "block" | "className">) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-semibold transition duration-150 disabled:pointer-events-none disabled:opacity-40",
    VARIANTS[variant],
    variant !== "link" && SIZES[size],
    block && "w-full",
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps | LinkProps>(function Button(props, ref) {
  const { variant, size, block, loading, className, children, ...rest } = props;
  const classes = buttonClasses({ variant, size, block, className });
  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as LinkProps;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }
  const { type = "button", disabled, ...buttonRest } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={classes} {...buttonRest}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});
