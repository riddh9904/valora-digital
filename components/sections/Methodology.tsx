"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    title: "Discover",
    text: "Understand business goals, customer economics, current marketing activity, and conversion challenges.",
    outputs: ["Goals and target unit economics", "Tracking and data audit", "Funnel baseline"],
  },
  {
    title: "Strategize",
    text: "Define campaign objectives, measurement requirements, target audiences, and an execution plan.",
    outputs: ["Channel and budget plan", "Measurement plan with KPIs", "First test hypotheses"],
  },
  {
    title: "Execute",
    text: "Launch campaigns, implement tracking, and test creatives and landing pages.",
    outputs: ["Live campaigns", "Verified conversion tracking", "Creative and landing-page tests"],
  },
  {
    title: "Optimize",
    text: "Review performance, identify opportunities, and improve the strategy based on evidence.",
    outputs: ["Regular performance reviews", "Documented test results", "Updated priorities"],
  },
];

export function Methodology() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="dark-surface section-pad relative overflow-hidden bg-ink-900 text-white"
    >
      <div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.3fr] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)] lg:self-start">
          <SectionHeading
            id="process-title"
            tone="dark"
            eyebrow="Methodology"
            title="A clear process, continuously improved"
            intro="Four stages, repeated. Each cycle ends with documented results and a clear decision about what to do next."
          />
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 font-mono text-[0.7rem] text-slate-400">
            <span aria-hidden className="size-1.5 rounded-full bg-accent-bright" />
            Optimize feeds the next Discover
          </p>
        </div>

        <ol ref={listRef} className="relative">
          <span aria-hidden className="absolute top-3 bottom-3 left-[27px] w-px bg-white/10 sm:left-[35px]" />
          <motion.span
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute top-3 bottom-3 left-[27px] w-px origin-top bg-gradient-to-b from-accent-bright to-violet sm:left-[35px]"
          />
          {steps.map((s, i) => (
            <li key={s.title} className="relative grid grid-cols-[56px_1fr] gap-5 pb-14 last:pb-0 sm:grid-cols-[72px_1fr] sm:gap-8">
              <span className="relative z-10 flex size-14 items-center justify-center rounded-full border border-white/15 bg-ink-900 font-mono text-sm text-white sm:size-[72px] sm:text-base">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-2 sm:pt-4">
                <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">{s.title}</h3>
                <p className="mt-3 max-w-xl leading-relaxed text-slate-300">{s.text}</p>
                <ul aria-label={`${s.title} outputs`} className="mt-5 flex flex-wrap gap-2">
                  {s.outputs.map((o) => (
                    <li key={o} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300">
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
