import Link from "next/link";
import { insights } from "@/content/insights";
import { formatLongDate } from "@/lib/format";

/** Editorial list of articles, shared by the homepage and /insights. */
export function InsightList({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <ul className="border-t border-line">
      {insights.map((a) => (
        <li key={a.slug} className="border-b border-line">
          <article className="group relative grid gap-3 py-8 md:grid-cols-[200px_1fr] md:gap-10">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-graphite md:flex-col md:items-start md:gap-1.5">
              <time dateTime={a.published}>{formatLongDate(a.published)}</time>
              <span className="text-signal">{a.category}</span>
              <span>{a.readingMinutes} min read</span>
            </div>
            <div>
              <H className="text-[1.35rem] leading-snug font-medium tracking-tight text-ink-900">
                <Link
                  href={`/insights/${a.slug}`}
                  className="link-underline after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-signal"
                >
                  {a.title}
                </Link>
              </H>
              <p className="mt-3 line-clamp-2 max-w-2xl leading-relaxed text-graphite">{a.summary}</p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
