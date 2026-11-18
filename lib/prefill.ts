"use client";

/**
 * Lets contextual CTAs (e.g. an industry module) pre-fill the enquiry form
 * without coupling those components to the form's internal state.
 */
export const PREFILL_EVENT = "site:prefill-enquiry";

export interface PrefillDetail {
  industry?: string;
  challenge?: string;
  message?: string;
}

/** sessionStorage key used to hand a prefill to the homepage form from another page. */
export const PREFILL_STORAGE_KEY = "site:prefill";

export function prefillEnquiry(detail: PrefillDetail) {
  window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail }));
  const target = document.getElementById("contact");
  if (target) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", "#contact");
    return;
  }
  // Not on a page with the form: stash the prefill and go to the homepage form.
  try {
    sessionStorage.setItem(PREFILL_STORAGE_KEY, JSON.stringify(detail));
  } catch {
    // Storage unavailable; the navigation still lands on the form.
  }
  // Full navigation on purpose: the form reads the stored prefill when the homepage mounts.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign("/#contact");
}
