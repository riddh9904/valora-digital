import { Info } from "lucide-react";

/** Visible disclosure attached to every piece of synthetic data on the site. */
export function SampleDataLabel({
  children = "Illustrative analytics view · Sample data",
  tone = "dark",
  className = "",
}: {
  children?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.68rem] tracking-wide ${
        tone === "dark"
          ? "border-white/12 bg-white/[0.04] text-slate-300"
          : "border-ink-900/12 bg-white text-slate-600"
      } ${className}`}
    >
      <Info aria-hidden className="size-3 shrink-0" />
      {children}
    </p>
  );
}
