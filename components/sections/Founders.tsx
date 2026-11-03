import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { founders } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactChannels } from "@/components/ui/ContactChannels";

const strengths = [
  { title: "Technical & engineering", text: "Tracking, integrations and automation built properly, not patched together." },
  { title: "Data science & analytics", text: "Careful measurement, sound comparisons and honest interpretation of results." },
  { title: "Hands-on marketing projects", text: "Practical experience planning and running campaigns, and learning from the data." },
];

export function Founders() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad bg-white">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div>
            <SectionHeading
              id="about-title"
              kicker="About"
              title="Who you’ll work with."
              intro="Valora brings together performance marketing, engineering and data analysis. Headquartered in Dubai, with an office in Gurugram, we work with businesses in India, the UAE and beyond."
            />
            <div className="mt-10">
              <ContactChannels />
            </div>
          </div>

          <ul className="content-center border-t border-line">
            {strengths.map(({ title, text }) => (
              <li key={title} className="border-b border-line py-5">
                <span className="block font-medium text-ink-900">{title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-graphite">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Founder profiles render only once real, approved bios are added in config/site.ts */}
        {founders.length > 0 && (
          <ul className="mt-16 grid gap-x-8 gap-y-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {founders.map((f) => (
              <li key={f.name}>
                {f.photo && (
                  <Image src={f.photo} alt={`Portrait of ${f.name}`} width={96} height={96} className="size-16 rounded-full object-cover" />
                )}
                <p className="mt-4 text-lg font-medium text-ink-900">{f.name}</p>
                <p className="text-sm text-graphite">{f.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-900">{f.bio}</p>
                {f.linkedin && (
                  <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink-900">
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
