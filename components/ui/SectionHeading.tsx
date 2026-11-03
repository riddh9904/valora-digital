import type { ReactNode } from "react";

export function Kicker({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p className={`kicker ${tone === "dark" ? "text-signal-bright" : "text-signal"} ${className}`}>
      {children}
    </p>
  );
}

/**
 * `layout` is the Signal API: "stacked" (default) or "split" (title left, intro
 * right on wide screens). `align` is legacy, kept until every section is rewritten.
 */
export function SectionHeading({
  kicker,
  title,
  intro,
  tone = "light",
  layout = "stacked",
  align = "left",
  id,
  className = "",
}: {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  layout?: "split" | "stacked";
  align?: "left" | "center";
  id?: string;
  className?: string;
}) {
  const dark = tone === "dark";
  const split = layout === "split";
  const center = align === "center" && !split;
  const introEl = intro && (
    <p
      className={`text-lg leading-relaxed ${center ? "mx-auto" : ""} ${split ? "" : "mt-6 max-w-2xl"} ${
        dark ? "text-slate-300" : "text-graphite"
      }`}
    >
      {intro}
    </p>
  );
  return (
    <div
      className={`${
        split ? "grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16" : `max-w-3xl ${center ? "mx-auto text-center" : ""}`
      } ${className}`}
    >
      <div>
        {kicker && <Kicker tone={tone}>{kicker}</Kicker>}
        <h2 id={id} className={`display-lg ${kicker ? "mt-4" : ""} ${dark ? "text-white" : "text-ink-900"}`}>
          {title}
        </h2>
      </div>
      {introEl}
    </div>
  );
}
