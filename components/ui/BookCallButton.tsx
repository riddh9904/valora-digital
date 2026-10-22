import { site } from "@/config/site";
import { ButtonLink } from "./Button";

/**
 * "Book a strategy call". Opens the configured booking URL, or falls back to
 * the on-page enquiry form when no scheduler has been set up yet.
 */
export function BookCallButton({
  variant = "primary",
  size = "md",
  className,
  label = site.cta.primary,
}: {
  variant?: "primary" | "secondary" | "ghost" | "light";
  size?: "md" | "lg";
  className?: string;
  label?: string;
}) {
  return (
    <ButtonLink
      href={site.bookingUrl ?? "/#contact"}
      variant={variant}
      size={size}
      className={className}
    >
      {label}
    </ButtonLink>
  );
}
