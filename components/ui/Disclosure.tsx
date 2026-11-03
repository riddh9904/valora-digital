import type { ReactNode } from "react";

/** Native <details> disclosure: keyboard-operable by default, with a +/− indicator. */
export function Disclosure({
  summary,
  children,
  id,
}: {
  summary: ReactNode;
  children: ReactNode;
  id: string;
}) {
  return (
    <details id={id} className="group border-b border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-medium text-ink-900 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <span aria-hidden className="relative size-3.5 shrink-0">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-opacity group-open:opacity-0" />
        </span>
      </summary>
      <div className="pb-6 text-graphite">{children}</div>
    </details>
  );
}
