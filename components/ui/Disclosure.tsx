import type { ReactNode } from "react";

/**
 * Native <details> disclosure: keyboard-operable by default, with a +/− indicator.
 * Keep `summary` to phrasing content (spans): no headings, paragraphs or divs.
 * `affordance` adds a visual "open / close" word before the indicator from 768px;
 * it is aria-hidden because <details> already exposes its expanded state. With an
 * affordance, the summary content is 9rem + 1.5rem (md:w-36 + gap-6) narrower from 768px.
 */
export function Disclosure({
  summary,
  children,
  id,
  className = "",
  panelClassName = "pb-6 text-graphite",
  summaryClassName = "py-5",
  affordance,
}: {
  summary: ReactNode;
  children: ReactNode;
  id: string;
  className?: string;
  panelClassName?: string;
  /** Vertical padding of the summary row (the hit target). */
  summaryClassName?: string;
  affordance?: { closed: string; open: string };
}) {
  return (
    <details id={id} className={`group border-b border-line ${className}`}>
      <summary
        className={`flex cursor-pointer list-none justify-between gap-6 text-left font-medium text-ink-900 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal [&::-webkit-details-marker]:hidden ${summaryClassName} ${
          affordance ? "items-start" : "items-center"
        }`}
      >
        <span>{summary}</span>
        {affordance ? (
          // Fixed width from 768px so "Close" and "See the method" don't shift the summary's columns.
          <span className="mt-2 flex shrink-0 items-center justify-end gap-3 whitespace-nowrap md:w-36">
            <span aria-hidden className="hidden text-[0.85rem] font-medium md:inline">
              <span className="group-open:hidden">{affordance.closed}</span>
              <span className="hidden group-open:inline">{affordance.open}</span>
            </span>
            <Indicator />
          </span>
        ) : (
          <Indicator />
        )}
      </summary>
      <div className={panelClassName}>{children}</div>
    </details>
  );
}

function Indicator({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`relative size-3.5 shrink-0 ${className}`}>
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-opacity group-open:opacity-0" />
    </span>
  );
}
