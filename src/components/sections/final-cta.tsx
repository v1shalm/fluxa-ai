"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/primitives/button";
import { Block } from "@/components/primitives/block";

const ease = [0.16, 1, 0.3, 1] as const;

export function FinalCTA() {
  return (
    <section id="start" className="relative pt-32 pb-section overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid mask-fade-edges opacity-50" aria-hidden />

      {/* Two flowing horizontal bars passing through */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 0.85 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.4, ease }}
        className="absolute left-0 right-0 origin-left h-[10px] -z-10"
        style={{
          top: "30%",
          background:
            "linear-gradient(90deg, transparent 0%, #22D3EE 16%, #00FF66 42%, #A3FF12 60%, #FFD400 76%, #FF4DCC 90%, transparent 100%)",
        }}
        aria-hidden
      />
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 0.45 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.6, delay: 0.2, ease }}
        className="absolute left-0 right-0 origin-right h-[3px] -z-10"
        style={{
          top: "78%",
          background:
            "linear-gradient(90deg, transparent 0%, #A855F7 30%, #FF4DCC 60%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Decorative blocks scattered */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <div className="absolute" style={{ left: "8%", top: "22%" }}>
          <Block color="cyan" size={20} />
        </div>
        <div className="absolute" style={{ left: "92%", top: "20%", transform: "translateX(-100%)" }}>
          <Block color="pink" size={28} radius="block-lg" glow />
        </div>
        <div className="absolute" style={{ left: "12%", top: "70%" }}>
          <Block color="purple" size={16} />
        </div>
        <div className="absolute" style={{ left: "85%", top: "70%" }}>
          <Block color="green" size={20} />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[2240px] px-6 md:px-10 lg:px-20 xl:px-[160px]">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease }}
          className="mt-6 font-display font-semibold tracking-[-0.04em] leading-[0.96] text-balance max-w-[1000px] text-d1"
        >
          Build your first{" "}
          <span className="text-flux-green">workflow</span>{" "}
          <span className="text-text-tertiary">in the next</span>{" "}
          <span className="num-tabular">5 minutes.</span>
        </motion.h2>

        {/* CTAs + supporting line */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4"
        >
          <Button variant="primary" size="lg" href="#start">
            Start building
          </Button>
          <Button variant="ghost" size="lg" href="#docs">
            Read the docs →
          </Button>
          <div className="ml-auto hidden md:flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-flux-green animate-status" />
            <span className="caption text-text-tertiary">no credit card · self-serve in 30s</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
