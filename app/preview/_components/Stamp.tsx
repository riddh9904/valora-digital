import type { ReactNode } from "react";

const tones = {
  ink: "bg-(--vp-ink) text-white",
  light: "bg-white text-(--vp-ink)",
  soft: "bg-[#e3f1eb] text-(--vp-signal)",
};

/** Chamfered disclosure label. `live` adds the pulsing dot used on sample data. */
export function Stamp({
  children,
  tone = "ink",
  live = false,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  live?: boolean;
}) {
  return (
    <span
      className={`vp-stamp vp-mono inline-flex items-center gap-2 px-2.5 py-1.5 text-[0.68rem] leading-none tracking-[0.08em] uppercase ${tones[tone]}`}
    >
      {live && <span aria-hidden className="vp-live-dot size-1.5 rounded-full bg-(--vp-signal-bright)" />}
      {children}
    </span>
  );
}
