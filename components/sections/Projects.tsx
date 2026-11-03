import { caseStudies } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stamp } from "@/components/ui/Stamp";
import type { CaseStudy } from "@/types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5 border-t border-line py-4 first:border-t-0 first:pt-0 sm:grid-cols-[9.5rem_1fr] sm:gap-6">
      <dt className="kicker pt-0.5 text-graphite">{label}</dt>
      <dd className="leading-relaxed text-ink-900">{children}</dd>
    </div>
  );
}

/** Only client work with written approval and a source on every outcome is publishable. */
const isPublishable = (c: CaseStudy) =>
  c.publicationApproved === true &&
  (c.outcomes?.length ?? 0) > 0 &&
  c.outcomes!.every((o) => o.source.trim().length > 0);

export function CaseStudyRow({ study }: { study: CaseStudy }) {
  return (
    <article
      aria-labelledby={`work-${study.id}-title`}
      className="grid gap-6 border-b border-line py-10 lg:grid-cols-12 lg:gap-10"
    >
      <header className="lg:col-span-4">
        <p className="kicker text-graphite">{study.category}</p>
        <h3 id={`work-${study.id}-title`} className="mt-3 text-2xl font-medium tracking-tight text-ink-900">
          {study.title}
        </h3>
        <p className="mt-4">
          <Stamp tone="signal">Verified project</Stamp>
        </p>
      </header>

      <dl className="lg:col-span-8">
        <Row label="Context">{study.context}</Row>
        <Row label="Objective">{study.objective}</Row>
        <Row label="What we did">
          <ol className="space-y-2">
            {study.work.map((w, i) => (
              <li key={w} className="flex gap-3">
                <span aria-hidden className="mt-0.5 font-mono text-xs text-signal tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {w}
              </li>
            ))}
          </ol>
        </Row>
        <Row label="Tools">
          <span className="font-mono text-xs text-graphite">{study.tools.join(" · ")}</span>
        </Row>
        <Row label="Verified outcomes">
          <ul className="space-y-2">
            {study.outcomes!.map((o) => (
              <li key={o.metric}>
                <span className="font-medium text-ink-900">
                  {o.metric}: {o.value}
                </span>
                <span className="block text-xs text-graphite">Source: {o.source}</span>
              </li>
            ))}
          </ul>
        </Row>
        {study.measurementPeriod && <Row label="Period">{study.measurementPeriod}</Row>}
        {study.dataSource && <Row label="Data source">{study.dataSource}</Row>}
        {study.attribution && <Row label="Who did what">{study.attribution}</Row>}
        {study.limitations && (
          <Row label="Limitations">
            <span className="text-graphite">{study.limitations}</span>
          </Row>
        )}
      </dl>
    </article>
  );
}

/** Client work. Renders nothing until an approved, sourced entry exists in config. */
export function Projects() {
  const items = caseStudies.filter(isPublishable);
  if (items.length === 0) return null;

  return (
    <section id="work" aria-labelledby="work-title" className="section-pad bg-mist">
      <div className="container-site">
        <SectionHeading
          id="work-title"
          layout="split"
          kicker="Client work"
          title="Published with permission."
          intro="Each project appears only with the client’s written approval, and every number names its source and measurement period."
        />
        <div className="mt-14 border-t border-ink-900">
          {items.map((s) => (
            <CaseStudyRow key={s.id} study={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
