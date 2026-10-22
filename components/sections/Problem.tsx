import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const challenges = [
  {
    problem: "Campaigns generate leads, but lead quality is unclear.",
    approach: "Define what a qualified lead means for your business and report against it, not just volume.",
  },
  {
    problem: "Ad platforms report conversions, but actual sales may tell a different story.",
    approach: "Reconcile platform data with CRM and sales records so reported and real outcomes can be compared.",
  },
  {
    problem: "Prospects drop out between enquiry and purchase.",
    approach: "Map every step after the click to find where interest is lost, and why.",
  },
  {
    problem: "Teams make decisions using disconnected reports.",
    approach: "Bring acquisition, conversion and revenue data into one consistent view.",
  },
  {
    problem: "Campaigns keep spending without a clear optimization process.",
    approach: "Run a documented test-and-review cadence with explicit hypotheses and decision rules.",
  },
];

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="section-pad relative bg-paper">
      <div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)] lg:self-start">
          <SectionHeading
            id="problem-title"
            eyebrow="The problem we solve"
            title="Getting clicks is easy. Turning them into customers is hard"
            intro="Many businesses meet some version of these challenges as their advertising grows. None of them is solved by spending more. Each is solved by measuring and managing the full journey."
          />
        </div>

        <div>
          <div
            aria-hidden
            className="hidden grid-cols-[1fr_56px_1fr] pb-4 md:grid"
          >
            <span className="eyebrow text-slate-500">Common challenge</span>
            <span />
            <span className="eyebrow text-accent">How we approach it</span>
          </div>
          <ol className="relative border-t border-ink-900/10">
            {challenges.map((c, i) => (
              <Reveal
                as="li"
                key={c.problem}
                delay={i * 0.05}
                className="group grid gap-4 border-b border-ink-900/10 py-7 md:grid-cols-[1fr_56px_1fr] md:items-center md:gap-0"
              >
                <div className="flex gap-4">
                  <span className="font-mono text-xs text-slate-400 tabular">0{i + 1}</span>
                  <p className="font-display text-lg leading-snug font-medium tracking-tight text-ink-900">
                    <span className="sr-only">Challenge: </span>
                    {c.problem}
                  </p>
                </div>
                <div aria-hidden className="relative hidden h-full items-center md:flex">
                  <span className="h-px w-full bg-ink-900/15 transition-colors duration-300 group-hover:bg-accent/60" />
                  <span className="absolute right-0 size-2 rotate-45 border-t border-r border-ink-900/30 transition-colors duration-300 group-hover:border-accent" />
                </div>
                <p className="pl-8 text-[0.95rem] leading-relaxed text-slate-600 md:pl-6">
                  <span aria-hidden className="mb-1 block font-mono text-[0.68rem] tracking-wider text-accent uppercase md:hidden">
                    Our approach
                  </span>
                  <span className="sr-only">Our approach: </span>
                  {c.approach}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
