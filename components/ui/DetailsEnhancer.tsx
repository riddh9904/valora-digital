"use client";

import { useEffect } from "react";

/** The URL fragment without "#", decoded; a malformed escape falls back to the raw text. */
function readHash() {
  const raw = window.location.hash.slice(1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/**
 * Progressive enhancement for a list of native <details>:
 * - a URL hash naming one of them (e.g. #service-conversion) opens it and scrolls to it;
 * - otherwise, when the URL has no hash and `openFirstQuery` matches, the first item is
 *   opened on load. Any other hash (#contact, #industries…) leaves every item closed, so
 *   the browser's scroll to that anchor isn't pushed off target by a panel opening above it.
 * Without JS every item simply starts closed.
 */
export function DetailsEnhancer({ containerId, openFirstQuery }: { containerId: string; openFirstQuery?: string }) {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const openFromHash = () => {
      const id = readHash();
      if (!id) return false;
      const target = document.getElementById(id);
      if (!(target instanceof HTMLDetailsElement) || !container.contains(target)) return false;
      target.open = true;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      return true;
    };

    if (!openFromHash() && !window.location.hash && openFirstQuery && window.matchMedia(openFirstQuery).matches) {
      const first = container.querySelector("details");
      if (first) first.open = true;
    }

    const onHashChange = () => {
      openFromHash();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [containerId, openFirstQuery]);

  return null;
}
