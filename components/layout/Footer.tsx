import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navItems, site } from "@/config/site";
import { CopyrightYear } from "@/components/ui/CopyrightYear";
import { ContactChannels } from "@/components/ui/ContactChannels";
import { Wordmark } from "./Wordmark";

const BUILD_YEAR = Number(process.env.NEXT_PUBLIC_BUILD_YEAR) || 2026;

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="kicker text-white/55">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

const linkCls = "link-underline text-white/70 transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="surface-ink bg-ink-950 text-white">
      <div className="container-site pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Wordmark tone="dark" />
            <p className="mt-6 text-sm leading-relaxed text-white/70">{site.description}</p>
          </div>

          <Column title="Company">
            <ul className="space-y-3 text-[0.95rem]">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkCls}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>

          <Column title="Contact">
            <ContactChannels tone="dark" />
            {site.social.linkedin && (
              <p className="mt-3 text-[0.95rem]">
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkCls} inline-flex items-center gap-1`}
                >
                  LinkedIn <ArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </p>
            )}
          </Column>

          <Column title="Legal">
            <ul className="space-y-3 text-[0.95rem]">
              <li>
                <Link href="/privacy" className={linkCls}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={linkCls}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </Column>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-xs text-white/55">
          <p>
            © <CopyrightYear fallback={BUILD_YEAR} /> Valora Digital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
