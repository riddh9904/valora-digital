import Image from "next/image";
import { ArrowUpRight, CodeXml, ChartLine, Megaphone } from "lucide-react";
import { founders } from "@/config/site";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const strengths = [
  { icon: CodeXml, title: "Technical & engineering", text: "Tracking, integrations and automation built properly, not patched together." },
  { icon: ChartLine, title: "Data science & analytics", text: "Careful measurement, sound comparisons and honest interpretation of results." },
  { icon: Megaphone, title: "Hands-on marketing projects", text: "Practical experience planning and running campaigns, and learning from the data." },
];

export function Founders() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad bg-white">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div>
            <Eyebrow>About us</Eyebrow>
            <h2 id="about-title" className="display-lg mt-5 text-ink-900">
              Built at the intersection of marketing and data
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-slate-700">
              <p>
                Effective marketing takes more than launching campaigns. It takes understanding
                how customers behave, measuring performance accurately, and steadily improving the
                path from first click to paying customer.
              </p>
              <p>
                We bring technical expertise, analytical thinking and hands-on marketing project
                experience to that work, helping businesses make better-informed growth decisions.
              </p>
              <p>
                Our focus is simple: transparent measurement, structured experimentation, and a
                clear understanding of what actually drives business outcomes.
              </p>
            </div>
          </div>

          <ul className="grid content-center gap-3">
            {strengths.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 0.08} className="flex gap-4 rounded-[var(--radius-md)] border border-ink-900/[0.08] bg-white p-5">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-paper text-accent">
                  <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block font-medium text-ink-900">{title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">{text}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Founder profiles render only once real, approved bios are added in config/site.ts */}
        {founders.length > 0 && (
          <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {founders.map((f) => (
              <li key={f.name} className="rounded-[var(--radius-lg)] border border-ink-900/[0.08] bg-white p-6">
                {f.photo && (
                  <Image src={f.photo} alt={`Portrait of ${f.name}`} width={96} height={96} className="size-16 rounded-full object-cover" />
                )}
                <p className="mt-4 font-display text-lg font-semibold text-ink-900">{f.name}</p>
                <p className="text-sm text-slate-500">{f.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{f.bio}</p>
                {f.linkedin && (
                  <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                    LinkedIn <ArrowUpRight aria-hidden className="size-3.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
