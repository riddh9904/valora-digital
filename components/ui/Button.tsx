import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type Variant = "primary" | "ink" | "ghost" | "light" | "text";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-200 ease-[var(--ease-out-quint)] active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-signal text-white hover:bg-[#096a4d]",
  ink: "bg-ink-900 text-white hover:bg-ink-700",
  ghost: "border border-line text-ink-900 hover:border-ink-900/40 hover:bg-mist",
  light: "bg-white text-ink-900 hover:bg-mist",
  text: "text-ink-900 underline underline-offset-4 decoration-1 hover:decoration-2",
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
