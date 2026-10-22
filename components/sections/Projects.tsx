import { CircleAlert, FlaskConical, ShieldCheck, type LucideIcon } from "lucide-react";
import { caseStudies } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { CaseStudy } from "@/types";

const KIND: Record<CaseStudy["kind"], { label: string; icon: LucideIcon; cls: string }> = {
  verified: {
    label: "Verified project",
    icon: ShieldCheck,
    cls: "border-emerald-700/20 bg-emerald-50 text-emerald-800",
  },
  illustrative: {
    label: "Illustrative scenario · Not an actual client engagement",
    icon: CircleAlert,
    cls: "border-ink-900/10 bg-paper-2/70 text-slate-600",
  },
  methodology: {
    label: "Methodology example · Not an actual client engagement",
    icon: FlaskConical,
    cls: "border-ink-900/10 bg-paper-2/70 text-slate-600",
  },
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5 border-t border-ink-900/[0.07] py-4">
      <dt className="text-xs font-semibold text-slate-500">{label}</dt>
      <dd className="text-sm leading-relaxed text-slate-700">{children}</dd>
    </div>
  );
}

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const kind = KIND[study.kind];
  const KindIcon = kind.icon;
  // Outcomes are only ever shown for verified, permission-approved projects.
  const showOutcomes =
    study.kind === "verified" && study.publicationApproved && (study.outcomes?.length ?? 0) > 0;

  return (
    <article className="flex h-full flex-col rounded-[var(--radius-lg)] border border-ink-900/[0.08] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      <p className={`inline-flex w-fit items-start gap-1.5 rounded-[8px] border px-2.5 py-1.5 text-[0.7rem] leading-snug font-medium ${kind.cls}`}>
        <KindIcon aria-hidden className="mt-px size-3.5 shrink-0" />
        {kind.label}
      </p>
      <p className="eyebrow mt-6 text-slate-500">{study.category}</p>
      <h3 className="mt-2 font-display text-[1.35rem] leading-snug font-semibold tracking-tight text-ink-900">
        {study.title}
      </h3>

      <dl className="mt-6 flex-1">
        <Row label="Context">{study.context}</Row>
        <Row label="Objective">{study.objective}</Row>
        <Row label="Work">
          <ul className="space-y-1.5">
            {study.work.map((w) => (
              <li key={w} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-slate-400" />
                {w}
              </li>
            ))}
          </ul>
        </Row>
        <Row label="Tools & methods">
          <ul className="flex flex-wrap gap-1.5">
            {study.tools.map((t) => (
              <li key={t} className="rounded-full bg-paper-2 px-2.5 py-1 text-xs text-slate-700">
                {t}
              </li>
            ))}
          </ul>
        </Row>
        {showOutcomes && (
          <Row label="Verified outcomes">
            <ul className="space-y-2">
              {study.outcomes!.map((o) => (
                <li key={o.metric}>
                  <span className="font-medium text-ink-900">{o.metric}: {o.value}</span>
                  <span className="block text-xs text-slate-500">Source: {o.source}</span>
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
    </article>
  );
}

export function Projects() {
  const items = caseStudies.filter((c) => c.kind !== "verified" || c.publicationApproved);
  if (items.length === 0) return null;

  return (
    <section id="projects" aria-labelledby="projects-title" className="section-pad bg-paper">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <SectionHeading
            id="projects-title"
            eyebrow="Work"
            title="Selected projects and demonstrations"
            intro="How we approach common growth problems: the context, the work and the methods. Verified project results will be added here, with their data sources and limitations, as engagements are completed and approved for publication."
          />
          <p className="text-sm leading-relaxed text-slate-500 lg:pb-2">
            We do not publish client names, figures or outcomes without permission and a
            verifiable source. Scenarios below are clearly labelled and contain no performance
            claims.
          </p>
        </div>
        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {items.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 0.06}>
              <CaseStudyCard study={s} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
