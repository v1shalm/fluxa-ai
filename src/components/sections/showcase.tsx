"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Block, Bar } from "@/components/primitives/block";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

type StepId = "design" | "connect" | "test" | "deploy";

const steps: {
  id: StepId;
  num: string;
  title: string;
  body: string;
  accent: "cyan" | "green" | "purple" | "pink";
}[] = [
  {
    id: "design",
    num: "01",
    title: "Design with primitives",
    body: "Drag inputs, models, tools, branches, and outputs onto a canvas. Every block has a typed contract.",
    accent: "cyan",
  },
  {
    id: "connect",
    num: "02",
    title: "Connect logic visually",
    body: "Wire data and decisions between blocks. Branch on output, retry on failure, loop on collections.",
    accent: "green",
  },
  {
    id: "test",
    num: "03",
    title: "Watch it run, live",
    body: "Token streams, traces, costs, and tool calls — observable in real time, not after the fact.",
    accent: "purple",
  },
  {
    id: "deploy",
    num: "04",
    title: "Ship with one command",
    body: "Promote to staging or production. Versioned, rollback-ready, callable as a typed API.",
    accent: "pink",
  },
];

const accentTextClass = {
  cyan:   "text-flux-cyan",
  green:  "text-flux-green",
  purple: "text-flux-purple",
  pink:   "text-flux-pink",
};

const accentHex: Record<StepId, string> = {
  design:  "#22D3EE",
  connect: "#00FF66",
  test:    "#A855F7",
  deploy:  "#FF4DCC",
};

function MockUI({ activeStep }: { activeStep: StepId }) {
  // Highlight different elements based on active step
  const isDesign = activeStep === "design";
  const isConnect = activeStep === "connect";
  const isTest = activeStep === "test";
  const isDeploy = activeStep === "deploy";

  const activeColor = accentHex[activeStep];

  return (
    <div className="relative rounded-card-lg border border-ink-line bg-ink-surface overflow-hidden shadow-2xl">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-md py-3 border-b border-ink-line bg-ink/50 backdrop-blur-sm z-20 relative">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-ink-line" />
            <div className="size-2.5 rounded-full bg-ink-line" />
            <div className="size-2.5 rounded-full bg-ink-line" />
          </div>
          <div className="ml-3 px-2 py-0.5 rounded-md bg-ink-surface border border-ink-line">
            <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider">pricing-agent.flow</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-flux-green/10 border border-flux-green/20">
          <span className="size-1.5 rounded-full bg-flux-green animate-status" />
          <span className="text-[10px] font-semibold text-flux-green uppercase tracking-tight">live</span>
        </div>
      </div>

      <div className="grid grid-cols-[160px_1fr] min-h-[440px] relative">
        {/* Step-specific global glow */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-10 blur-[80px] opacity-10"
          animate={{ background: `radial-gradient(circle at 50% 50%, ${activeColor}, transparent 70%)` }}
          transition={{ duration: 0.8 }}
        />

        {/* Block library */}
        <aside className="border-r border-ink-line p-4 space-y-4 bg-ink/30 relative z-20">
          <div>
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.1em] block mb-3">Nodes</span>
            <div className="space-y-1">
              {[
                { c: "cyan", l: "Input", active: isDesign },
                { c: "green", l: "LLM", active: isDesign },
                { c: "lime", l: "Tool", active: isDesign },
                { c: "yellow", l: "Branch", active: isDesign },
                { c: "pink", l: "Output", active: isDesign },
              ].map((it, i) => (
                <motion.div
                  key={it.l}
                  animate={it.active ? { x: 4, opacity: 1 } : { x: 0, opacity: 0.6 }}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2 rounded-lg transition-colors cursor-default",
                    it.active ? "bg-white/5 border border-white/10" : "border border-transparent"
                  )}
                >
                  <Block color={it.c as "cyan"} size={12} radius="block" glow={it.active} />
                  <span className="text-xs font-medium text-text-secondary">{it.l}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <div className="relative bg-[#0D0D0D] p-8 overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-dot opacity-20" />
          
          {/* Connector lines */}
          <svg className="absolute inset-0 size-full pointer-events-none z-10" aria-hidden>
            <defs>
              <linearGradient id="sc-g1" x1="0" x2="1">
                <stop offset="0" stopColor="#22D3EE" />
                <stop offset="1" stopColor="#00FF66" />
              </linearGradient>
              <linearGradient id="sc-g2" x1="0" x2="1">
                <stop offset="0" stopColor="#00FF66" />
                <stop offset="1" stopColor="#A855F7" />
              </linearGradient>
            </defs>

            {/* Edges */}
            <motion.path
              d="M 120 48 C 150 48, 150 48, 180 48"
              stroke="url(#sc-g1)"
              strokeWidth={isConnect ? 2.5 : 1.5}
              fill="none"
              animate={{ opacity: isConnect ? 1 : 0.3, pathLength: isConnect ? 1 : 0.8 }}
              initial={{ pathLength: 0.8 }}
              transition={{ duration: 0.6 }}
            />
            <motion.path
              d="M 120 48 C 150 48, 150 110, 180 110"
              stroke="url(#sc-g1)"
              strokeWidth={isConnect ? 2.5 : 1.5}
              fill="none"
              animate={{ opacity: isConnect ? 1 : 0.3, pathLength: isConnect ? 1 : 0.8 }}
              initial={{ pathLength: 0.8 }}
              transition={{ duration: 0.6 }}
            />
            <motion.path
              d="M 280 48 C 300 48, 300 80, 320 80"
              stroke="url(#sc-g2)"
              strokeWidth={isConnect ? 2.5 : 1.5}
              fill="none"
              animate={{ opacity: isConnect ? 1 : 0.3, pathLength: isConnect ? 1 : 0.8 }}
              initial={{ pathLength: 0.8 }}
              transition={{ duration: 0.6 }}
            />
            <motion.path
              d="M 280 110 C 300 110, 300 80, 320 80"
              stroke="url(#sc-g2)"
              strokeWidth={isConnect ? 2.5 : 1.5}
              fill="none"
              animate={{ opacity: isConnect ? 1 : 0.3, pathLength: isConnect ? 1 : 0.8 }}
              initial={{ pathLength: 0.8 }}
              transition={{ duration: 0.6 }}
            />

            {/* Pulses */}
            {(isConnect || isTest || isDeploy) && (
              <>
                <motion.circle r="3" fill="white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <animateMotion dur="1.8s" repeatCount="indefinite" path="M 120 48 C 150 48, 150 48, 180 48" />
                </motion.circle>
                <motion.circle r="3" fill="white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <animateMotion dur="1.8s" repeatCount="indefinite" begin="0.6s" path="M 280 48 C 300 48, 300 80, 320 80" />
                </motion.circle>
              </>
            )}
          </svg>

          {/* Workflow nodes */}
          <div className="relative z-20 h-full">
            <motion.div
              className="absolute left-0 top-8 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-ink-surface/80 backdrop-blur-md border border-white/10 shadow-lg"
              animate={isDesign ? { scale: 1.05, borderColor: "rgba(34,211,238,0.4)" } : { scale: 1, borderColor: "rgba(255,255,255,0.1)" }}
            >
              <Block color="cyan" size={14} glow={isDesign} />
              <span className="text-xs font-semibold text-text-primary tracking-tight">User Query</span>
            </motion.div>

            <motion.div
              className="absolute left-[180px] top-[10px] flex items-center gap-3 px-4 py-2.5 rounded-xl bg-ink-surface/80 backdrop-blur-md border border-white/10 shadow-lg"
              animate={isConnect ? { scale: 1.05, borderColor: "rgba(0,255,102,0.4)" } : { scale: 1, borderColor: "rgba(255,255,255,0.1)" }}
            >
              <Block color="green" size={14} glow={isConnect} />
              <span className="text-xs font-semibold text-text-primary tracking-tight">Classify</span>
            </motion.div>

            <motion.div
              className="absolute left-[180px] top-[80px] flex items-center gap-3 px-4 py-2.5 rounded-xl bg-ink-surface/80 backdrop-blur-md border border-white/10 shadow-lg"
              animate={isConnect ? { scale: 1.05, borderColor: "rgba(0,255,102,0.4)" } : { scale: 1, borderColor: "rgba(255,255,255,0.1)" }}
            >
              <Block color="lime" size={14} glow={isConnect} />
              <span className="text-xs font-semibold text-text-primary tracking-tight">Fetch Context</span>
            </motion.div>

            <motion.div
              className="absolute left-[330px] top-[45px] flex items-center gap-3 px-4 py-2.5 rounded-xl bg-ink-surface/80 backdrop-blur-md border border-white/10 shadow-lg"
              animate={isTest ? { scale: 1.05, borderColor: "rgba(168,85,247,0.4)" } : { scale: 1, borderColor: "rgba(255,255,255,0.1)" }}
            >
              <Block color="purple" size={14} glow={isTest} />
              <span className="text-xs font-semibold text-text-primary tracking-tight">Reason</span>
            </motion.div>

            <motion.div
              className="absolute right-0 bottom-4 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-ink-surface/80 backdrop-blur-md border border-white/10 shadow-lg"
              animate={isDeploy ? { 
                scale: 1.05, 
                borderColor: "rgba(255,77,204,0.6)",
                boxShadow: "0 0 30px rgba(255,77,204,0.1)"
              } : { scale: 1, borderColor: "rgba(255,255,255,0.1)" }}
            >
              <Block color="pink" size={14} glow={isDeploy} />
              <span className="text-xs font-semibold text-text-primary tracking-tight">Response</span>
            </motion.div>

            {/* Live readout */}
            <motion.div
              animate={{ opacity: isTest || isDeploy ? 1 : 0, y: isTest || isDeploy ? 0 : 20 }}
              transition={{ duration: 0.6, ease }}
              className="absolute left-[120px] bottom-4 right-[120px] rounded-xl bg-black/60 backdrop-blur-xl p-4 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Analytics</span>
                <span className="text-[10px] font-bold text-flux-green uppercase">Streaming</span>
              </div>
              <Bar width="100%" height={6} from="green" to="purple" flowing />
              <div className="mt-3 flex justify-between text-[11px] font-medium text-text-secondary num-tabular">
                <div className="flex gap-3">
                  <span>2.4ms latency</span>
                  <span className="text-text-tertiary">|</span>
                  <span>142 tokens</span>
                </div>
                <span className="text-flux-green">$0.00042</span>
              </div>
            </motion.div>

            {/* Deploy success toast */}
            <AnimatePresence>
              {isDeploy && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="px-6 py-3 rounded-2xl bg-flux-pink text-black font-bold text-sm shadow-[0_0_50px_rgba(255,77,204,0.4)] flex items-center gap-3">
                    <span className="size-2 rounded-full bg-black animate-ping" />
                    Production Deployed
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState<StepId>("design");
  const stepRefs = useRef<Record<StepId, HTMLElement | null>>({
    design: null, connect: null, test: null, deploy: null,
  });

  // Pick the step whose vertical center is closest to the viewport center on
  // every scroll. IntersectionObserver only fires on intersection-state
  // changes, so it would stick mid-section; a plain scroll listener tracks
  // continuously and never gets out of sync with the user's position.
  useEffect(() => {
    const update = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestId: StepId | null = null;
      let closestDist = Infinity;
      for (const id of Object.keys(stepRefs.current) as StepId[]) {
        const el = stepRefs.current[id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - viewportCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestId = id;
        }
      }
      if (closestId) setActiveStep(closestId);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section id="product" ref={sectionRef} className="relative py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease }}
          className="font-display font-semibold tracking-[-0.035em] leading-[0.95] text-balance max-w-[820px] text-d2 mb-3xl"
        >
          One canvas. <span className="text-text-tertiary">Whole lifecycle.</span>
        </motion.h2>

        {/* Sticky-scroll layout */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-xl lg:gap-2xl items-start">
          {/* Left: sticky canvas */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <MockUI activeStep={activeStep} />
              {/* Step indicator below the canvas */}
              <div className="mt-md flex items-center justify-center gap-2">
                {steps.map((s) => (
                  <span
                    key={s.id}
                    className={cn(
                      "h-1 rounded-full transition-[width,background-color] duration-500 ease-out-quart",
                      activeStep === s.id
                        ? "w-6"
                        : "w-1 bg-ink-line"
                    )}
                    style={{
                      backgroundColor: activeStep === s.id ? accentHex[s.id] : undefined,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile fallback — non-sticky canvas at top */}
          <div className="lg:hidden mb-xl">
            <MockUI activeStep={activeStep} />
          </div>

          {/* Right: scrolling steps */}
          <div className="flex flex-col gap-2xl lg:gap-3xl">
            {steps.map((step, i) => (
              <article
                key={step.id}
                data-step={step.id}
                ref={(el) => {
                  stepRefs.current[step.id] = el;
                }}
                className="lg:min-h-[60vh] flex flex-col justify-center"
              >
                <div className={cn("text-base font-medium num-tabular", accentTextClass[step.accent])}>
                  {step.num}
                </div>
                <h3 className="mt-3 font-display font-semibold tracking-[-0.025em] leading-[1.02] text-d3">
                  {step.title}
                </h3>
                <p className="mt-md text-lg text-text-secondary text-pretty max-w-[440px]">
                  {step.body}
                </p>
                {/* Small chip showing the active state */}
                <motion.div
                  className="mt-md inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full border"
                  animate={
                    activeStep === step.id
                      ? {
                          borderColor: accentHex[step.id] + "60",
                          backgroundColor: accentHex[step.id] + "10",
                        }
                      : {
                          borderColor: "#262626",
                          backgroundColor: "transparent",
                        }
                  }
                  transition={{ duration: 0.4, ease }}
                >
                  <motion.span
                    animate={{
                      backgroundColor: activeStep === step.id ? accentHex[step.id] : "#6B6B6B",
                    }}
                    transition={{ duration: 0.4 }}
                    className="size-1.5 rounded-full"
                  />
                  <span className="text-xs text-text-secondary num-tabular">
                    step {i + 1} / {steps.length}
                  </span>
                </motion.div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
