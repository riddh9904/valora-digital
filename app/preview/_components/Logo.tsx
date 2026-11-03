import Link from "next/link";

/** Signal mark: a flat-cut V knocked out of a chamfered tile. Colours follow the zone tokens. */
export function SignalMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <path d="M11 2h42l9 9v42l-9 9H11l-9-9V11z" fill="var(--tile)" />
      <path d="M15 16h9l8 17.9L40 16h9L36 45h-8z" fill="var(--tile-v)" />
    </svg>
  );
}

export function SignalWordmark() {
  return (
    <Link href="/preview" className="inline-flex items-center gap-2" aria-label="Valora, preview home">
      <SignalMark />
      <span className="text-[1.35rem] leading-none font-semibold tracking-[-0.035em]">valora</span>
    </Link>
  );
}
