import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { LeadForm } from "./LeadForm";

const nextSteps = [
  { title: "We review your enquiry", text: "We look at your goals, market and current marketing activity." },
  { title: "A focused conversation", text: "We discuss your funnel, your data, and where the biggest opportunities may lie." },
  { title: "A clear recommendation", text: "You get our view on what to prioritize first, and whether we're the right fit." },
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="dark-surface section-pad relative isolate overflow-hidden bg-ink-950 text-white"
    >
      <div aria-hidden className="bg-grid-dark mask-fade-b absolute inset-0 -z-10 opacity-60" />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-40 -z-10 h-[520px] w-[620px] rounded-full opacity-[0.18] blur-[120px]"
        style={{ background: "radial-gradient(closest-side, var(--brand-accent), transparent)" }}
      />
      <div className="container-site grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-16 xl:gap-24">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)] lg:self-start">
          <p className="eyebrow text-accent-soft">Start a conversation</p>
          <h2 id="contact-title" className="display-lg mt-5">
            Let’s find your next growth opportunity
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300">
            Tell us about your business, your marketing goals, and the challenges you want to
            solve. We’ll discuss where the biggest opportunities may lie.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={site.bookingUrl ?? "#enquiry"} size="lg">
              {site.cta.primary}
            </ButtonLink>
            <ButtonLink href="#enquiry" variant="secondary" size="lg" icon="none">
              {site.cta.form}
            </ButtonLink>
          </div>

          <ol className="mt-14 space-y-6 border-t border-white/[0.08] pt-10">
            {nextSteps.map((s, i) => (
              <li key={s.title} className="flex gap-5">
                <span className="font-mono text-xs text-slate-500 tabular">0{i + 1}</span>
                <span>
                  <span className="block font-medium text-white">{s.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-400">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div
          id="enquiry"
          className="scroll-mt-[calc(var(--header-h)+24px)] rounded-[var(--radius-xl)] border border-white/[0.09] bg-ink-850/80 p-6 shadow-[var(--shadow-panel)] backdrop-blur sm:p-9"
        >
          <h3 className="font-display text-xl font-semibold tracking-tight">{site.cta.form}</h3>
          <p className="mt-1.5 mb-7 text-sm text-slate-400">It takes about two minutes.</p>
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
