"use client";

/**
 * Lets contextual CTAs (e.g. an industry module) pre-fill the enquiry form
 * without coupling those components to the form's internal state.
 */
export const PREFILL_EVENT = "site:prefill-enquiry";

export interface PrefillDetail {
  industry?: string;
  challenge?: string;
}

export function prefillEnquiry(detail: PrefillDetail) {
  window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail }));
  const target = document.getElementById("contact");
  if (target) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", "#contact");
  }
}
