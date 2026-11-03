import { caseStudies } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stamp } from "@/components/ui/Stamp";
import { Disclosure } from "@/components/ui/Disclosure";
import type { CaseStudy } from "@/types";

const KIND: Record<CaseStudy["kind"], { label: string; tone: "signal" | "soft" | "quiet" }> = {
  verified: { label: "Verified project", tone: "signal" },
  illustrative: { label: "Illustrative scenario · Not an actual client engagement", tone: "quiet" },
  methodology: { label: "Methodology example · Not an actual client engagement", tone: "soft" },
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5 border-t border-line py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
      <dt className="kicker text-graphite">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink-900">{children}</dd>
    </div>
  );
}

export function CaseStudyRow({ study }: { study: CaseStudy }) {
  const kind = KIND[study.kind];
  // Outcomes are only ever shown for verified, permission-approved projects.
  const showOutcomes =
    study.kind === "verified" && study.publicationApproved && (study.outcomes?.length ?? 0) > 0;

  return (
    <Disclosure
      id={`example-${study.id}`}
      summary={
        <span className="block">
          <span className="kicker block text-graphite">{study.category}</span>
          <span className="mt-2 block text-xl font-medium tracking-tight">{study.title}</span>
          <span className="mt-3 block">
            <Stamp tone={kind.tone}>{kind.label}</Stamp>
          </span>
        </span>
      }
    >
      <dl>
        <Row label="Context">{study.context}</Row>
        <Row label="Objective">{study.objective}</Row>
        <Row label="Work">
          <ul className="space-y-1.5">
            {study.work.map((w) => (
              <li key={w} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-graphite" />
                {w}
              </li>
            ))}
          </ul>
        </Row>
        <Row label="Tools & methods">
          <span className="font-mono text-xs">{study.tools.join(" · ")}</span>
        </Row>
        {showOutcomes && (
          <Row label="Verified outcomes">
            <ul className="space-y-2">
              {study.outcomes!.map((o) => (
                <li key={o.metric}>
                  <span className="font-medium text-ink-900">{o.metric}: {o.value}</span>
                  <span className="block text-xs text-graphite">Source: {o.source}</span>
                </li>
              ))}
            </ul>
          </Row>
        )}
        {study.measurementPeriod && <Row label="Period">{study.measurementPeriod}</Row>}
        {study.dataSource && <Row label="Data source">{study.dataSource}</Row>}
        {study.attribution && <Row label="Who did what">{study.attribution}</Row>}
        {study.limitations && <Row label="Limitations">{study.limitations}</Row>}
      </dl>
    </Disclosure>
  );
}

export function Projects() {
  const items = caseStudies.filter((c) => c.kind !== "verified" || c.publicationApproved);
  if (items.length === 0) return null;

  return (
    <section id="examples" aria-labelledby="examples-title" className="section-pad bg-mist">
      <div className="container-site">
        <SectionHeading
          id="examples-title"
          kicker="Working examples"
          title="How we approach three common problems."
          intro="We're a new agency, so there are no client logos here yet. These examples show how we work. Verified results will appear here once clients approve them."
          layout="split"
        />
        <div className="mt-14 border-t border-line">
          {items.map((s) => (
            <CaseStudyRow key={s.id} study={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
