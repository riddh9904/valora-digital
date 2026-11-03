"use client";

import { useEffect, useState, type ReactNode } from "react";

type Background = "white" | "split";

const OPTIONS: { value: Background; label: string }[] = [
  { value: "white", label: "White" },
  { value: "split", label: "Dark hero" },
];

/** Holds the background option and the floating switch. `#split` in the URL opens that option. */
export function PreviewShell({ className, children }: { className: string; children: ReactNode }) {
  const [bg, setBg] = useState<Background>("white");

  useEffect(() => {
    // Reading the hash only exists in the browser, so the first render is always "white".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.location.hash === "#split") setBg("split");
  }, []);

  const choose = (value: Background) => {
    setBg(value);
    history.replaceState(null, "", value === "split" ? "#split" : window.location.pathname);
  };

  return (
    <div data-bg={bg} className={`vp-root ${className}`}>
      {children}
      <div
        role="radiogroup"
        aria-label="Preview background"
        className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-black/10 bg-white/95 p-1 text-sm text-(--vp-ink) shadow-[0_12px_32px_-12px_rgb(0_0_0/0.35)] backdrop-blur"
      >
        <span className="vp-mono px-3 text-[0.68rem] tracking-[0.08em] text-(--vp-graphite) uppercase">Background</span>
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={bg === o.value}
            onClick={() => choose(o.value)}
            className={`rounded-full px-4 py-2 font-medium whitespace-nowrap transition-colors ${
              bg === o.value ? "bg-(--vp-ink) text-white" : "hover:bg-(--vp-mist)"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
