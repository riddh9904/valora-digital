import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries, services, site } from "@/config/site";
import { CopyrightYear } from "@/components/ui/CopyrightYear";
import { Wordmark } from "./Wordmark";

const BUILD_YEAR = Number(process.env.NEXT_PUBLIC_BUILD_YEAR) || 2026;

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow text-slate-400">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}

const linkCls = "text-slate-300 transition-colors hover:text-white";

export function Footer() {
  const { contact, social } = site;
  const hasDirectContact = Boolean(contact.email || contact.phone || contact.address);

  return (
    <footer className="dark-surface relative overflow-hidden bg-ink-950 text-white">
      <div className="container-site relative pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-6 text-sm leading-relaxed text-slate-400">
              Performance marketing for businesses that want to connect advertising spend with
              qualified leads, customers and revenue. Paid acquisition, conversion optimization
              and transparent measurement.
            </p>
          </div>

          <Column title="Services">
            {services.map((s) => (
              <li key={s.id}>
                <Link href="/#services" className={linkCls}>
                  {s.title}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Industries">
            {industries.map((i) => (
              <li key={i.id}>
                <Link href="/#industries" className={linkCls}>
                  {i.title}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Contact">
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className={linkCls}>
                  {contact.email}
                </a>
              </li>
            )}
            {contact.phone && (
              <li>
                <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className={linkCls}>
                  {contact.phone}
                </a>
              </li>
            )}
            {contact.address && <li className="text-slate-400">{contact.address}</li>}
            {!hasDirectContact && (
              <li>
                <Link href="/#contact" className={linkCls}>
                  Send an enquiry
                </Link>
              </li>
            )}
            {social.linkedin && (
              <li>
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkCls} inline-flex items-center gap-1`}
                >
                  LinkedIn <ArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
            <li>
              <Link href="/insights" className={linkCls}>
                Insights
              </Link>
            </li>
          </Column>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/[0.08] pt-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear fallback={BUILD_YEAR} /> {site.name}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.2em] select-none text-center font-display text-[clamp(4rem,17vw,15rem)] leading-none font-semibold tracking-[-0.05em] text-white/[0.035]"
      >
        {site.shortName}
      </p>
    </footer>
  );
}
