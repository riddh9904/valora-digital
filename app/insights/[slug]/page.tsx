import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getInsight, insights } from "@/content/insights";
import { PageHeader } from "@/components/layout/PageHeader";
import { Prose } from "@/components/layout/Prose";
import { BookCallButton } from "@/components/ui/BookCallButton";
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
      <PageHeader eyebrow={article.category} title={article.title} intro={<p>{article.summary}</p>}>
        <p className="mt-8 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
          <time dateTime={article.published}>{formatLongDate(article.published)}</time>
          <span>{article.readingMinutes} min read</span>
        </p>
      </PageHeader>

      <div className="bg-white py-16 sm:py-20">
        <div className="container-site max-w-3xl">
          <Link href="/#insights" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-ink-900">
            <ArrowLeft aria-hidden className="size-4" /> Back to insights
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

          <aside className="dark-surface mt-16 rounded-[var(--radius-lg)] bg-ink-900 p-8 text-white sm:p-10">
            <p className="font-display text-2xl font-semibold tracking-tight">Want a second opinion on your funnel?</p>
            <p className="mt-3 max-w-lg text-slate-300">
              Tell us about your campaigns and what you’re measuring today. We’ll share where we
              think the biggest opportunities may be.
            </p>
            <BookCallButton className="mt-7" />
          </aside>
        </div>
      </div>
    </article>
  );
}
