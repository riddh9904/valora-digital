import type { ReactNode } from "react";

export function Eyebrow({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={`eyebrow inline-flex items-center gap-2.5 ${
        tone === "dark" ? "text-accent-soft" : "text-accent"
      } ${className}`}
    >
      <span
        aria-hidden
        className={`h-px w-6 ${tone === "dark" ? "bg-accent-soft/60" : "bg-accent/60"}`}
      />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "left",
  id,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  id?: string;
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className={`display-lg mt-5 ${tone === "dark" ? "text-white" : "text-ink-900"}`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-6 text-lg leading-relaxed ${center ? "mx-auto" : ""} max-w-2xl ${
            tone === "dark" ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
