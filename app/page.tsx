import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Services } from "@/components/sections/Services";
import { Measurement } from "@/components/sections/Measurement";
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
      <Problem />
      <Services />
      <Measurement />
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
