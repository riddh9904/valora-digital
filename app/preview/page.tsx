import type { Metadata } from "next";
import { Geist_Mono, Instrument_Sans } from "next/font/google";
import { PreviewShell } from "./_components/PreviewShell";
import { PreviewBar, PreviewHero, PreviewIndustries, PreviewPractices } from "./_components/Sections";
import "./preview.css";

const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

// Review-only page for the Signal direction. Kept out of search and the sitemap.
export const metadata: Metadata = {
  title: "Design preview",
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return (
    <PreviewShell className={`${instrument.variable} ${geistMono.variable}`}>
      <PreviewBar />
      <PreviewHero />
      <PreviewPractices />
      <PreviewIndustries />
    </PreviewShell>
  );
}
