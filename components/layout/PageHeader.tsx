import type { ReactNode } from "react";
import { Kicker } from "@/components/ui/SectionHeading";

export function PageHeader({
  kicker,
  title,
  intro,
  children,
}: {
  kicker?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="bg-white pt-[calc(var(--header-h)+56px)] pb-12 sm:pb-16">
      <div className="container-site max-w-4xl">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h1 className="display-lg mt-4 text-ink-900">{title}</h1>
        {intro && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">{intro}</div>}
        {children}
      </div>
    </header>
  );
}
