import type { ReactNode } from "react";

/** Long-form typography for articles and legal pages. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="text-[1.0625rem] leading-[1.8] text-slate-700 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-[1.6rem] [&_h2]:leading-tight [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink-900 [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-ink-900 [&_li]:pl-1 [&_p]:mt-5 [&_strong]:font-semibold [&_strong]:text-ink-900 [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:marker:text-accent">
      {children}
    </div>
  );
}
