import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InsightList } from "@/components/sections/InsightList";

export function Insights() {
  return (
    <section id="insights" aria-labelledby="insights-title" className="section-pad bg-white">
      <div className="container-site">
        <SectionHeading id="insights-title" kicker="Insights" title="Notes on measurement." />
        <div className="mt-12">
          <InsightList />
        </div>
        <p className="mt-8">
          <Link href="/insights" className="link-underline font-medium text-ink-900">
            All articles →
          </Link>
        </p>
      </div>
    </section>
  );
}
