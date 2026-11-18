import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Industries } from "@/components/sections/Industries";
import { Measurement } from "@/components/sections/Measurement";
import { Methodology } from "@/components/sections/Methodology";
import { Projects } from "@/components/sections/Projects";
import { Founders } from "@/components/sections/Founders";
import { Insights } from "@/components/sections/Insights";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Industries />
      <Measurement />
      <Methodology />
      <Projects />
      <Founders />
      <Insights />
      <Contact />
    </>
  );
}
