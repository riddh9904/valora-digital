import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { insights } from "@/content/insights";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { formatLongDate } from "@/lib/format";

export function Insights() {
  return (
    <section id="insights" aria-labelledby="insights-title" className="section-pad bg-paper">
      <div className="container-site">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="insights-title"
            eyebrow="Insights"
            title="Perspectives on performance and growth"
          />
          <Link href="/insights" className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 hover:text-accent">
            All articles
            <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {insights.map((a, i) => (
            <Reveal as="li" key={a.slug} delay={i * 0.06}>
              <article className="group relative flex h-full flex-col rounded-[var(--radius-lg)] border border-ink-900/[0.08] bg-white p-7 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-ink-900/15 hover:shadow-[var(--shadow-lift)]">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="eyebrow text-accent">{a.category}</span>
                  <span>{a.readingMinutes} min read</span>
                </div>
                <h3 className="mt-6 font-display text-[1.35rem] leading-snug font-semibold tracking-tight text-ink-900">
                  <Link href={`/insights/${a.slug}`} className="after:absolute after:inset-0 after:rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent">
                    {a.title}
                  </Link>
                </h3>
                <p className="mt-4 flex-1 leading-relaxed text-slate-600">{a.summary}</p>
                <div className="mt-8 flex items-center justify-between border-t border-ink-900/[0.07] pt-5 text-sm">
                  <time dateTime={a.published} className="text-slate-500">{formatLongDate(a.published)}</time>
                  <span aria-hidden className="inline-flex items-center gap-1 font-medium text-ink-900 group-hover:text-accent">
                    Read <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
