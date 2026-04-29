"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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

  return (
    <div className="relative rounded-card-lg border border-ink-line bg-ink-surface overflow-hidden shadow-lift">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-md py-3 border-b border-ink-line">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-ink-line" />
          <div className="size-2.5 rounded-full bg-ink-line" />
          <div className="size-2.5 rounded-full bg-ink-line" />
        </div>
        <span className="text-xs text-text-tertiary">workflows / pricing-agent</span>
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-flux-green animate-status" />
          <span className="text-2xs text-text-tertiary">running</span>
        </div>
      </div>

      <div className="grid grid-cols-[140px_1fr] min-h-[420px]">
        {/* Block library — highlight when designing */}
        <aside
          className={cn(
            "border-r border-ink-line p-3 space-y-2 transition-colors duration-500",
            isDesign && "bg-flux-cyan/[0.04]"
          )}
        >
          <span className="text-2xs text-text-tertiary block px-1 mb-2">primitives</span>
          {[
            { c: "cyan", l: "Input" },
            { c: "green", l: "LLM" },
            { c: "lime", l: "Tool" },
            { c: "yellow", l: "Branch" },
            { c: "pink", l: "Output" },
            { c: "purple", l: "Memory" },
          ].map((it, i) => (
            <motion.div
              key={it.l}
              animate={isDesign ? { x: [0, 2, 0], opacity: [0.7, 1, 0.7] } : { x: 0, opacity: 1 }}
              transition={{ duration: 1.6, repeat: isDesign ? Infinity : 0, delay: i * 0.1 }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-grab"
            >
              <Block color={it.c as "cyan"} size={14} radius="block" />
              <span className="text-xs text-text-secondary">{it.l}</span>
            </motion.div>
          ))}
        </aside>

        {/* Canvas */}
        <div className="relative bg-ink bg-dot p-md">
          {/* Connector lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
            <defs>
              <linearGradient id="sc-g1" x1="0" x2="1">
                <stop offset="0" stopColor="#22D3EE" />
                <stop offset="1" stopColor="#00FF66" />
              </linearGradient>
              <linearGradient id="sc-g2" x1="0" x2="1">
                <stop offset="0" stopColor="#00FF66" />
                <stop offset="1" stopColor="#A855F7" />
              </linearGradient>
              <linearGradient id="sc-g3" x1="0" x2="1">
                <stop offset="0" stopColor="#A855F7" />
                <stop offset="1" stopColor="#FF4DCC" />
              </linearGradient>
            </defs>

            {/* Edges that highlight when "connect" is active */}
            <motion.path
              d="M 130 38 C 150 38, 150 38, 170 38"
              stroke="url(#sc-g1)"
              strokeWidth={isConnect ? 2 : 1.5}
              fill="none"
              animate={{ opacity: isConnect ? 1 : 0.7 }}
            />
            <motion.path
              d="M 130 38 C 150 38, 150 100, 170 100"
              stroke="url(#sc-g1)"
              strokeWidth={isConnect ? 2 : 1.5}
              fill="none"
              animate={{ opacity: isConnect ? 1 : 0.7 }}
            />
            <motion.path
              d="M 296 38 C 310 38, 310 70, 326 70"
              stroke="url(#sc-g2)"
              strokeWidth={isConnect ? 2 : 1.5}
              fill="none"
              animate={{ opacity: isConnect ? 1 : 0.7 }}
            />
            <motion.path
              d="M 296 100 C 310 100, 310 70, 326 70"
              stroke="url(#sc-g2)"
              strokeWidth={isConnect ? 2 : 1.5}
              fill="none"
              animate={{ opacity: isConnect ? 1 : 0.7 }}
            />

            {/* Traveling pulses appear when "connect" or "test" */}
            {(isConnect || isTest) && (
              <>
                <circle r="3" fill="white">
                  <animateMotion dur="2s" repeatCount="indefinite"
                    path="M 130 38 C 150 38, 150 38, 170 38" />
                </circle>
                <circle r="3" fill="white">
                  <animateMotion dur="2s" repeatCount="indefinite" begin="0.5s"
                    path="M 296 38 C 310 38, 310 70, 326 70" />
                </circle>
              </>
            )}
          </svg>

          {/* Workflow nodes */}
          <motion.div
            className="absolute left-md top-2xl flex items-center gap-2 px-3 py-2 rounded-block-lg bg-ink-surface border border-ink-line"
            animate={isDesign ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 1.5, repeat: isDesign ? Infinity : 0 }}
          >
            <Block color="cyan" size={14} />
            <span className="text-xs text-text-primary">user query</span>
          </motion.div>

          <div className="absolute left-[180px] top-[24px] flex items-center gap-2 px-3 py-2 rounded-block-lg bg-ink-surface border border-flux-green/30">
            <Block color="green" size={14} glow />
            <span className="text-xs text-text-primary">classify</span>
          </div>

          <div className="absolute left-[180px] top-[86px] flex items-center gap-2 px-3 py-2 rounded-block-lg bg-ink-surface border border-ink-line">
            <Block color="lime" size={14} />
            <span className="text-xs text-text-primary">fetch ctx</span>
          </div>

          <div className="absolute left-[336px] top-[56px] flex items-center gap-2 px-3 py-2 rounded-block-lg bg-ink-surface border border-flux-purple/30">
            <Block color="purple" size={14} />
            <span className="text-xs text-text-primary">reason</span>
          </div>

          <motion.div
            className="absolute right-md bottom-2xl flex items-center gap-2 px-3 py-2 rounded-block-lg bg-ink-surface border border-flux-pink/30"
            animate={isDeploy ? {
              boxShadow: [
                "0 0 0 0 rgba(255,77,204,0.0)",
                "0 0 0 6px rgba(255,77,204,0.3)",
                "0 0 0 0 rgba(255,77,204,0.0)",
              ]
            } : {}}
            transition={{ duration: 1.6, repeat: isDeploy ? Infinity : 0 }}
          >
            <Block color="pink" size={14} glow />
            <span className="text-xs text-text-primary">response</span>
          </motion.div>

          {/* Live readout — visible when testing */}
          <motion.div
            animate={{ opacity: isTest || isDeploy ? 1 : 0.4, y: isTest ? 0 : 4 }}
            transition={{ duration: 0.5, ease }}
            className="absolute left-[180px] bottom-3 right-[180px] rounded-[10px] bg-ink p-2.5 border border-ink-line"
          >
            <div className="text-2xs text-text-tertiary mb-1.5">live stream</div>
            <Bar width="100%" height={4} from="green" to="purple" flowing />
            <div className="mt-1.5 flex justify-between text-2xs text-text-tertiary num-tabular">
              <span>247 tok</span>
              <span>2.4ms · $0.0003</span>
            </div>
          </motion.div>

          {/* Deploy banner — only when "deploy" */}
          {isDeploy && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease }}
              className="absolute right-3 top-3 flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] bg-flux-pink/10 border border-flux-pink/30"
            >
              <span className="size-1.5 rounded-full bg-flux-pink animate-status" />
              <span className="text-2xs text-flux-pink font-medium">deployed v2.4.2</span>
            </motion.div>
          )}
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

  // Use IntersectionObserver to detect which step is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry most centered in viewport
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const closest = visible.reduce((best, curr) => {
          const cBox = curr.boundingClientRect;
          const bBox = best.boundingClientRect;
          const cDist = Math.abs(cBox.top + cBox.height / 2 - window.innerHeight / 2);
          const bDist = Math.abs(bBox.top + bBox.height / 2 - window.innerHeight / 2);
          return cDist < bDist ? curr : best;
        });
        const id = closest.target.getAttribute("data-step") as StepId;
        if (id) setActiveStep(id);
      },
      {
        rootMargin: "-30% 0px -30% 0px",
        threshold: [0, 0.3, 0.6, 1],
      }
    );
    Object.values(stepRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
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
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-xl lg:gap-2xl">
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
