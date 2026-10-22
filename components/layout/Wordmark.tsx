import Link from "next/link";
import { site } from "@/config/site";

/** Original monogram: three rising bars resolving into a forward stroke. */
export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false">
      <rect width="32" height="32" rx="8" fill="var(--brand-accent)" />
      <rect x="8" y="17" width="3.2" height="7" rx="1.2" fill="#fff" opacity="0.55" />
      <rect x="14.4" y="12.5" width="3.2" height="11.5" rx="1.2" fill="#fff" opacity="0.8" />
      <path d="M20.8 24V9.8a1.2 1.2 0 0 1 2.05-.85L25 11.1" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function Wordmark({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${site.name}, home`}
    >
      <LogoMark />
      <span
        className={`font-display text-[1.05rem] font-semibold whitespace-nowrap tracking-[-0.02em] ${
          tone === "dark" ? "text-white" : "text-ink-900"
        }`}
      >
        {site.name}
      </span>
    </Link>
  );
}
