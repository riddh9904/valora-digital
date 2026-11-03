import { locations, site } from "@/config/site";

/** Email, WhatsApp and locations. Null contact fields render nothing. */
export function ContactChannels({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const { email, whatsapp } = site.contact;
  const link = `link-underline ${dark ? "text-white" : "text-ink-900"}`;
  return (
    <ul className={`space-y-3 text-[0.95rem] ${dark ? "text-slate-300" : "text-graphite"}`}>
      {email && (
        <li>
          <a href={`mailto:${email}`} className={link}>
            {email}
          </a>
        </li>
      )}
      {whatsapp && (
        <li>
          <a
            href={`https://wa.me/${whatsapp.e164.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className={link}
          >
            WhatsApp {whatsapp.display}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      )}
      {locations.map((l) => (
        <li key={l.city}>
          {l.city} ({l.role.toLowerCase()})
        </li>
      ))}
    </ul>
  );
}
