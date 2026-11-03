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
];

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="section-pad bg-white">
      <div className="container-site">
        <SectionHeading
          id="problem-title"
          layout="split"
          kicker="The problem"
          title="Most ad accounts report activity. Few report customers."
        />

        <div className="mt-14">
          <div aria-hidden className="hidden grid-cols-2 gap-10 border-b border-ink-900 pb-3 md:grid">
            <span className="kicker text-graphite">Common challenge</span>
            <span className="kicker text-signal">How we approach it</span>
          </div>
          <ol className="border-t border-ink-900 md:border-t-0">
            {challenges.map((c, i) => (
              <Reveal
                as="li"
                key={c.problem}
                delay={i * 0.05}
                className="grid gap-3 border-b border-line py-7 md:grid-cols-2 md:gap-10"
              >
                <p className="text-lg leading-snug font-medium tracking-tight text-ink-900">
                  <span className="sr-only">Challenge: </span>
                  {c.problem}
                </p>
                <p className="text-[0.95rem] leading-relaxed text-graphite">
                  <span aria-hidden className="kicker mb-1 block text-signal md:hidden">
                    How we approach it
                  </span>
                  <span className="sr-only">How we approach it: </span>
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
