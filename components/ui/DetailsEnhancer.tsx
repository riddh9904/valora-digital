"use client";

import { useEffect } from "react";

/**
 * Progressive enhancement for a list of native <details>:
 * - a URL hash naming one of them (e.g. #service-conversion) opens it and scrolls to it;
 * - otherwise, when `openFirstQuery` matches, the first item is opened on load.
 * Without JS every item simply starts closed.
 */
export function DetailsEnhancer({ containerId, openFirstQuery }: { containerId: string; openFirstQuery?: string }) {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return false;
      const target = document.getElementById(id);
      if (!(target instanceof HTMLDetailsElement) || !container.contains(target)) return false;
      target.open = true;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      return true;
    };

    if (!openFromHash() && openFirstQuery && window.matchMedia(openFirstQuery).matches) {
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
