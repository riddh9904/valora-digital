import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { insights } from "@/content/insights";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatLongDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Insights",
  description: "Practical perspectives on lead quality, measurement and conversion tracking for performance marketing.",
  alternates: { canonical: "/insights" },
};

export default function InsightsIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Perspectives on performance and growth"
        intro="Practical notes on measurement, lead quality and conversion, written for the people who make marketing decisions."
      />
      <section className="bg-paper py-20">
        <ul className="container-site grid max-w-4xl gap-4">
          {insights.map((a) => (
            <li key={a.slug}>
              <article className="group relative rounded-[var(--radius-lg)] border border-ink-900/[0.08] bg-white p-7 transition-[border-color,box-shadow] hover:border-ink-900/15 hover:shadow-[var(--shadow-lift)] sm:p-9">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="eyebrow text-accent">{a.category}</span>
                  <time dateTime={a.published}>{formatLongDate(a.published)}</time>
                  <span>{a.readingMinutes} min read</span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink-900">
                  <Link href={`/insights/${a.slug}`} className="after:absolute after:inset-0">
                    {a.title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">{a.summary}</p>
                <ArrowUpRight aria-hidden className="absolute top-8 right-8 hidden size-5 text-slate-400 transition-colors group-hover:text-accent sm:block" />
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
