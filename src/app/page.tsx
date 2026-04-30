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
    <div className="relative min-h-screen bg-ink">
      {/* Global grain — tasteful, single-pass texture across the dark surface */}
      <div className="noise-overlay" aria-hidden />

      {/* Background grid — restrained, lets the panels do the talking */}
      <div className="fixed inset-0 bg-grid opacity-[0.4] pointer-events-none -z-20" aria-hidden />

      {/* Single, neutral top wash — replaces the AI-stack of three colored
          radial gradients. Just enough to separate the hero from the void. */}
      <div
        className="fixed top-0 inset-x-0 h-[60vh] -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(80% 100% at 50% -20%, rgba(255,255,255,0.035), transparent 70%)",
        }}
        aria-hidden
      />

      <Navbar />
      <main className="relative">
        <Hero />
        <Concept />
        <Showcase />
        <UseCases />
        <Stats />
        <HowItWorks />
        <Developer />
        <LiveDemo />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}

