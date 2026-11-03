import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsight, insights } from "@/content/insights";
import { PageHeader } from "@/components/layout/PageHeader";
import { Prose } from "@/components/layout/Prose";
import { TalkToUsButton } from "@/components/ui/TalkToUsButton";
import { formatLongDate } from "@/lib/format";
import { site } from "@/config/site";

export function generateStaticParams() {
  return insights.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.summary,
      url: `/insights/${article.slug}`,
      publishedTime: article.published,
    },
  };
}

// Unknown slugs must get a real 404 status, so notFound() has to run before any response
// is sent:
// - `params` is read at the top, outside any Suspense boundary.
// - `ensureStatic = "navigation"` makes a request for a slug missing from generateStaticParams
//   wait for the complete render instead of streaming the route's fallback App Shell (which
//   partial prefetching would otherwise send with a 200 before notFound() runs).
// - `instant = false` allows that blocking read and silences the dev-only
//   instant-shell-url-data insight.
export const ensureStatic = "navigation";
export const instant = false;

export default async function InsightPage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.published,
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/insights/${article.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHeader kicker={article.category} title={article.title} intro={<p>{article.summary}</p>}>
        <p className="mt-8 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-graphite">
          <time dateTime={article.published}>{formatLongDate(article.published)}</time>
          <span>{article.readingMinutes} min read</span>
        </p>
      </PageHeader>

      <div className="bg-white pb-24">
        <div className="container-site max-w-4xl">
          <Link href="/insights" className="link-underline text-sm text-graphite hover:text-ink-900">
            ← All insights
          </Link>
          <Prose>
            {article.sections.map((s, i) => (
              <section key={i}>
                {s.heading && <h2>{s.heading}</h2>}
                {s.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {s.list && (
                  <ul>
                    {s.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </Prose>

          <aside className="mt-16 max-w-[680px] border-t border-line pt-8">
            <p className="text-2xl font-medium tracking-tight text-ink-900">Want a second opinion on your funnel?</p>
            <p className="mt-3 text-graphite">
              Tell us about your campaigns and what you’re measuring today. We’ll share where we
              think the biggest opportunities may be.
            </p>
            <TalkToUsButton title={article.title} />
          </aside>
        </div>
      </div>
    </article>
  );
}
