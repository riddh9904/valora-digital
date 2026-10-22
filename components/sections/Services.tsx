import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { services } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-pad bg-white">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="services-title"
            eyebrow="Services"
            title="Growth is more than getting clicks"
            intro="We connect acquisition, conversion, and measurement to help businesses make more of their marketing investment."
          />
        </div>

        <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal as="li" key={s.id} delay={(i % 3) * 0.06}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-ink-900/[0.08] bg-paper/60 p-7 transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/35 hover:bg-white hover:shadow-[var(--shadow-lift)] sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-11 items-center justify-center rounded-[12px] bg-ink-900 text-white transition-colors duration-300 group-hover:bg-accent">
                      <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                    </span>
                    <span className="font-mono text-xs text-slate-400 tabular">0{i + 1}</span>
                  </div>
                  <h3 className="mt-8 font-display text-[1.4rem] font-semibold tracking-tight text-ink-900">
                    {s.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{s.description}</p>
                  <div className="mt-auto pt-7">
                    <p className="border-t border-ink-900/[0.08] pt-5 text-sm leading-relaxed font-medium text-ink-900">
                      {s.benefit}
                    </p>
                    <ul aria-label={`${s.title} capabilities`} className="mt-4 flex flex-wrap gap-1.5">
                      {s.capabilities.map((c) => (
                        <li
                          key={c}
                          className="rounded-full border border-ink-900/[0.08] bg-white px-2.5 py-1 text-xs text-slate-600"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
          <Reveal as="li" delay={0.12} className="md:col-span-2 lg:col-span-3">
            <Link
              href="/#contact"
              className="group dark-surface relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-[var(--radius-lg)] bg-ink-900 p-7 text-white transition-colors duration-300 hover:bg-ink-800 sm:p-8 lg:flex-row lg:items-center lg:gap-12 lg:px-10"
            >
              <div aria-hidden className="bg-grid-dark mask-fade-radial absolute inset-0 opacity-60" />
              <div className="relative">
                <p className="eyebrow text-accent-soft">Not sure where to start?</p>
                <p className="mt-3 max-w-2xl font-display text-[1.4rem] leading-snug font-semibold tracking-tight">
                  Tell us what you’re trying to grow. We’ll suggest where to focus first.
                </p>
              </div>
              <span className="relative inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white">
                Start a conversation
                <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
