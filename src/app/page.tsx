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
      {/* Global Grain/Noise */}
      <div className="noise-overlay" aria-hidden />

      {/* Persistent Background Grid */}
      <div className="fixed inset-0 bg-grid opacity-[0.4] pointer-events-none -z-20" aria-hidden />

      {/* Atmospheric Glows */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(34,211,238,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 40%, rgba(168,85,247,0.05) 0%, transparent 40%), radial-gradient(circle at 20% 70%, rgba(0,255,102,0.05) 0%, transparent 40%)"
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

