"use client";

import { industries } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Disclosure } from "@/components/ui/Disclosure";
import { prefillEnquiry } from "@/lib/prefill";
import type { Industry } from "@/types";

const CTA_NAME: Record<string, string> = {
  "real-estate": "real estate",
  education: "education",
  ecommerce: "e-commerce",
  services: "professional services",
};

function Journey({ ind }: { ind: Industry }) {
  return (
    <ol aria-label={`${ind.label} journey we measure`} className="mt-6 space-y-1.5 font-mono text-[0.75rem] text-ink-900">
      {ind.funnel.map((stage, i) => (
        <li key={stage} className="flex items-center gap-2">
          <span aria-hidden className="text-graphite">
            {i === 0 ? "○" : "→"}
          </span>
          {stage}
        </li>
      ))}
    </ol>
  );
}

// A text link rather than a filled button: four ink blocks in a row were heavy, and
// "professional services" wrapped inside a fixed-height button at 1024–1440px.
function Cta({ ind, className = "" }: { ind: Industry; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => prefillEnquiry({ industry: ind.id })}
      className={`inline-flex min-h-11 cursor-pointer items-center text-left text-[0.92rem] sm:min-h-0 sm:inline sm:items-baseline font-medium text-ink-900 hover:text-signal ${className}`}
    >
      <span className="link-underline">Talk to us about {CTA_NAME[ind.id] ?? "your sector"}</span>
      {/* No-break space keeps the arrow with the last word when the label wraps. */}
      <span aria-hidden>{"\u00a0→"}</span>
    </button>
  );
}

export function Industries() {
  return (
    <section id="industries" aria-labelledby="industries-title" className="section-pad border-t border-line bg-white">
      <div className="container-site">
        <SectionHeading
          id="industries-title"
          layout="split"
          kicker="Industries"
          title="For businesses where the sale happens after the click."
          intro="A site visit, an admission, an appointment, a first order. We judge campaigns by the step that pays."
        />

        {/* 640px and up: columns */}
        <ul className="mt-14 hidden border-t border-ink-900 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind) => (
            <li
              key={ind.id}
              className="flex flex-col border-b border-line py-8 sm:odd:pr-6 sm:even:border-l sm:even:pl-6 lg:border-b-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <h3 className="text-[1.3rem] font-medium tracking-[-0.025em] text-ink-900">{ind.label}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-graphite">{ind.summary}</p>
              <Journey ind={ind} />
              <div className="mt-auto pt-7">
                <Cta ind={ind} />
              </div>
            </li>
          ))}
        </ul>

        {/* Below 640px: disclosures */}
        <div className="mt-10 border-t border-ink-900 sm:hidden">
          {industries.map((ind) => (
            <Disclosure
              key={ind.id}
              id={`industry-${ind.id}`}
              summary={
                <>
                  <span className="block text-[1.15rem] font-medium tracking-[-0.025em]">{ind.label}</span>
                  <span className="mt-1 block text-[0.92rem] font-normal leading-snug text-graphite">{ind.summary}</span>
                </>
              }
            >
              <Journey ind={ind} />
              <ul className="mt-6 space-y-1.5 text-[0.92rem]">
                {ind.focus.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Cta ind={ind} className="mt-7" />
            </Disclosure>
          ))}
        </div>

        <p className="mt-8 text-sm text-graphite">The sectors we focus on.</p>
      </div>
    </section>
  );
}
