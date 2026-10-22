import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-[var(--ease-out-quint)] active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_1px_0_rgb(255_255_255/0.2)_inset,0_8px_24px_-10px_rgb(52_97_240/0.7)] hover:bg-[#2a55e0]",
  secondary:
    "border border-white/18 bg-white/[0.04] text-white hover:border-white/35 hover:bg-white/[0.08]",
  ghost: "border border-ink-900/15 text-ink-900 hover:border-ink-900/35 hover:bg-ink-900/[0.03]",
  light: "bg-white text-ink-900 hover:bg-paper",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.95rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: "arrow" | "external" | "none";
  children: ReactNode;
  className?: string;
};

function Icon({ kind }: { kind: Common["icon"] }) {
  if (kind === "none") return null;
  const Cmp = kind === "external" ? ArrowUpRight : ArrowRight;
  return (
    <Cmp
      aria-hidden
      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
      strokeWidth={2}
    />
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  icon = "arrow",
  children,
  className = "",
  ...rest
}: Common & Omit<ComponentPropsWithoutRef<"a">, "children" | "className">) {
  const external = /^https?:\/\//.test(href ?? "");
  const classes = buttonClasses(variant, size, className);
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <Icon kind={icon === "arrow" ? "external" : icon} />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href ?? "/"} className={classes} {...rest}>
      {children}
      <Icon kind={icon} />
    </Link>
  );
}
