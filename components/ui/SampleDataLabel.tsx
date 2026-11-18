import type { ReactNode } from "react";
import { Stamp } from "./Stamp";

/** Visible disclosure attached to every piece of synthetic data on the site. */
export function SampleDataLabel({ children = "Live demo · Sample data" }: { children?: ReactNode }) {
  return <Stamp live>{children}</Stamp>;
}
