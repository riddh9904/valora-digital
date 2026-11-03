import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { InsightList } from "@/components/sections/InsightList";

export const metadata: Metadata = {
  title: "Insights",
  description: "Practical perspectives on lead quality, measurement and conversion tracking for performance marketing.",
  alternates: { canonical: "/insights" },
};

export default function InsightsIndex() {
  return (
    <>
      <PageHeader
        kicker="Insights"
        title="Notes on measurement."
        intro="Short, practical pieces on lead quality, tracking and acquisition costs, for the people who sign off ad budgets."
      />
      <section className="bg-white pb-24">
        <div className="container-site max-w-4xl">
          <InsightList headingLevel={2} />
        </div>
      </section>
    </>
  );
}
