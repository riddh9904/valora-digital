import Link from "next/link";
import { site } from "@/config/site";

/**
 * Signal mark: a flat-cut V knocked out of a chamfered tile. `tone` names the
 * background it sits on: light gets an ink tile, dark gets a white tile.
 */
export function LogoMark({
  className = "size-7",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <path d="M11 2h42l9 9v42l-9 9H11l-9-9V11z" fill={dark ? "#FFFFFF" : "var(--brand-ink)"} />
      <path d="M15 16h9l8 17.9L40 16h9L36 45h-8z" fill={dark ? "var(--brand-ink)" : "#FFFFFF"} />
    </svg>
  );
}

export function Wordmark({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label={`${site.name}, home`}
    >
      <LogoMark tone={tone} className="size-6" />
      <span
        className={`text-[1.35rem] leading-none font-semibold tracking-[-0.035em] ${
          tone === "dark" ? "text-white" : "text-ink-900"
        }`}
      >
        valora
      </span>
    </Link>
  );
}
