import type { ReactNode } from "react";

const tones = {
  ink: "bg-ink-900 text-white",
  soft: "bg-[#E3F1EB] text-signal",
  quiet: "bg-mist text-ink-900 outline outline-1 -outline-offset-1 outline-line",
  signal: "bg-signal text-white",
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
      className={`stamp tabular inline-flex items-center gap-2 px-2.5 py-1 font-mono text-[0.68rem] leading-[1.35] tracking-[0.08em] uppercase ${tones[tone]}`}
    >
      {live && <span aria-hidden className="live-dot size-1.5 rounded-full bg-signal-bright" />}
      {children}
    </span>
  );
}
