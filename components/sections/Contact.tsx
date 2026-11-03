import { site } from "@/config/site";
import { ContactChannels } from "@/components/ui/ContactChannels";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LeadForm } from "./LeadForm";

const nextSteps = [
  { title: "We review your enquiry", text: "We look at your goals, market and current marketing activity." },
  { title: "A focused conversation", text: "We discuss your funnel, your data, and where the biggest opportunities may lie." },
  { title: "A clear recommendation", text: "You get our view on what to prioritise first, and whether we're the right fit." },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad bg-mist">
      <div className="container-site grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-16 xl:gap-24">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)] lg:self-start">
          <SectionHeading
            id="contact-title"
            kicker="Start a conversation"
            title="Tell us what you're trying to grow."
            intro="We reply within one working day. Your first review of tracking and campaigns is free: you'll get our view on where to focus first, and whether we're the right fit."
          />

          <div className="mt-10">
            <ContactChannels />
          </div>

          <ol className="mt-12 space-y-6 border-t border-line pt-10">
            {nextSteps.map((s, i) => (
              <li key={s.title} className="flex gap-5">
                <span className="font-mono text-xs text-signal tabular">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-medium text-ink-900">{s.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-graphite">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div
          id="enquiry"
          className="min-w-0 scroll-mt-[calc(var(--header-h)+24px)] rounded-md border border-line bg-white p-6 sm:p-9 lg:self-start"
        >
          <h3 className="text-xl font-medium tracking-tight text-ink-900">{site.cta.form}</h3>
          <p className="mt-1.5 mb-7 text-sm text-graphite">It takes about two minutes.</p>
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
