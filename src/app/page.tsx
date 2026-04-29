import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Concept } from "@/components/sections/concept";
import { Stats } from "@/components/sections/stats";
import { Showcase } from "@/components/sections/showcase";
import { HowItWorks } from "@/components/sections/how-it-works";
import { UseCases } from "@/components/sections/use-cases";
import { Developer } from "@/components/sections/developer";
import { LiveDemo } from "@/components/sections/live-demo";
import { Pricing } from "@/components/sections/pricing";
import { FinalCTA } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Concept />
        <Showcase />
        <UseCases />
        <Stats />
        <HowItWorks />
        <Developer />
        <LiveDemo />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
