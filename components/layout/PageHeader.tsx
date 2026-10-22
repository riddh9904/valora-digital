import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="dark-surface relative isolate overflow-hidden bg-ink-950 pt-[calc(var(--header-h)+64px)] pb-16 text-white sm:pb-20">
      <div aria-hidden className="bg-grid-dark mask-fade-b absolute inset-0 -z-10 opacity-60" />
      <div className="container-site max-w-4xl">
        {eyebrow && <p className="eyebrow text-accent-soft">{eyebrow}</p>}
        <h1 className="display-lg mt-5">{title}</h1>
        {intro && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">{intro}</div>}
        {children}
      </div>
    </header>
  );
}
