"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Building, GraduationCap, ShoppingBag, Wrench, type LucideIcon } from "lucide-react";
import { industries } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClasses } from "@/components/ui/Button";
import { prefillEnquiry } from "@/lib/prefill";
import type { Industry } from "@/types";

const ICONS: Record<string, LucideIcon> = {
  "real-estate": Building,
  education: GraduationCap,
  ecommerce: ShoppingBag,
  services: Wrench,
};

/** Stylised journey for each market. Labels only; no figures. */
function JourneyIllustration({ industry }: { industry: Industry }) {
  const Icon = ICONS[industry.id] ?? Building;
  const widths = [100, 78, 56, 36];
  return (
    <div className="dark-surface relative h-full overflow-hidden rounded-[var(--radius-lg)] bg-ink-900 p-6 text-white sm:p-8">
      <div aria-hidden className="bg-grid-dark mask-fade-radial absolute inset-0 opacity-60" />
      <div className="relative flex items-center justify-between">
        <span className="inline-flex size-11 items-center justify-center rounded-[12px] border border-white/10 bg-white/[0.04] text-accent-soft">
          <Icon aria-hidden className="size-5" strokeWidth={1.75} />
        </span>
        <span className="font-mono text-[0.68rem] text-slate-400">Customer journey we measure</span>
      </div>
      <ol className="relative mt-8 space-y-2.5" aria-label={`${industry.title} customer journey stages`}>
        {industry.funnel.map((stage, i) => (
          <motion.li
            key={stage}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <span className="w-5 font-mono text-[0.68rem] text-slate-500">0{i + 1}</span>
            <span
              className="flex h-11 items-center rounded-[10px] border border-white/[0.08] px-4 text-sm text-white"
              style={{
                width: `${widths[i]}%`,
                background: `linear-gradient(90deg, rgb(91 132 255 / ${0.28 - i * 0.04}), rgb(124 92 255 / ${0.14 + i * 0.05}))`,
              }}
            >
              {stage}
            </span>
          </motion.li>
        ))}
      </ol>
      <p className="relative mt-8 text-xs leading-relaxed text-slate-400">
        We track each step, not just the first, so campaigns can be judged on the outcome
        that matters to the business.
      </p>
    </div>
  );
}

export function Industries() {
  const [active, setActive] = useState(industries[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = industries.find((i) => i.id === active) ?? industries[0];

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = industries.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(industries[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="industries" aria-labelledby="industries-title" className="section-pad bg-white">
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="industries-title"
            eyebrow="Industries"
            title="Growth strategies built around your business"
            intro="Every market has its own buying journey. These are the sectors we are building our practice around, and how we would approach each."
          />
          <p className="max-w-xs text-sm text-slate-500 lg:text-right">
            Target markets. These are not a list of existing clients.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Industries"
          className="mt-14 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
        >
          {industries.map((ind, i) => {
            const selected = ind.id === active;
            const Icon = ICONS[ind.id] ?? Building;
            return (
              <button
                key={ind.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`tab-${ind.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`panel-${ind.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(ind.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  selected
                    ? "border-ink-900 bg-ink-900 text-white"
                    : "border-ink-900/12 text-slate-600 hover:border-ink-900/30 hover:text-ink-900"
                }`}
              >
                <Icon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
                {ind.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            id={`panel-${current.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${current.id}`}
            tabIndex={0}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid gap-6 rounded-[var(--radius-xl)] border border-ink-900/[0.08] bg-paper/60 p-4 sm:p-6 lg:grid-cols-[1.2fr_1fr] lg:gap-10 lg:p-8"
          >
            <div className="p-2 sm:p-2 lg:py-4">
              <h3 className="display-md text-ink-900">{current.title}</h3>

              <p className="text-xs font-semibold mt-8 text-slate-500">The business problem</p>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-slate-700">{current.problem}</p>

              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Where we would focus</p>
                  <ul className="mt-4 space-y-2.5">
                    {current.focus.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm text-ink-900">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Relevant services</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {current.services.map((s) => (
                      <li key={s} className="rounded-full border border-ink-900/10 bg-white px-3 py-1.5 text-xs text-slate-700">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => prefillEnquiry({ industry: current.id })}
                className={buttonClasses("primary", "md", "mt-10")}
              >
                Talk to us about {current.label.charAt(0).toLowerCase() + current.label.slice(1)}
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
            <JourneyIllustration industry={current} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
