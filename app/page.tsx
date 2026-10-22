import { Hero } from "@/components/sections/Hero";
import { CredibilityStrip } from "@/components/sections/CredibilityStrip";
import { Problem } from "@/components/sections/Problem";
import { Services } from "@/components/sections/Services";
import { FullFunnel } from "@/components/sections/FullFunnel";
import { AnalyticsShowcase } from "@/components/sections/AnalyticsShowcase";
import { BeyondClick } from "@/components/sections/BeyondClick";
import { Industries } from "@/components/sections/Industries";
import { Methodology } from "@/components/sections/Methodology";
import { Projects } from "@/components/sections/Projects";
import { Founders } from "@/components/sections/Founders";
import { Principles } from "@/components/sections/Principles";
import { Insights } from "@/components/sections/Insights";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredibilityStrip />
      <Problem />
      <Services />
      <FullFunnel />
      <AnalyticsShowcase />
      <BeyondClick />
      <Industries />
      <Methodology />
      <Projects />
      <Founders />
      <Principles />
      <Insights />
      <Contact />
    </>
  );
}
