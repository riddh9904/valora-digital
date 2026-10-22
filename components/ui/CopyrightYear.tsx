"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Renders the current year on the client so the footer never goes stale between deploys. */
export function CopyrightYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => fallback,
  );
  return <>{year}</>;
}
