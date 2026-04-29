"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/primitives/button";
import { ArrowRight, PlayIcon } from "@/components/primitives/icons";

const ease = [0.16, 1, 0.3, 1] as const;

// ─── Stacked translucent panels — the hero centerpiece ───────────────────

type Panel = {
  color: string;
  glow: string;
};

const panels: Panel[] = [
  { color: "#22D3EE", glow: "rgba(34,211,238,0.35)" },   // cyan
  { color: "#00E5A8", glow: "rgba(0,229,168,0.30)" },    // teal
  { color: "#00FF66", glow: "rgba(0,255,102,0.30)" },     // green
  { color: "#A3FF12", glow: "rgba(163,255,18,0.30)" },   // lime
  { color: "#FFD400", glow: "rgba(255,212,0,0.28)" },    // yellow
  { color: "#FF6B2D", glow: "rgba(255,107,45,0.30)" },   // orange
  { color: "#FF4DCC", glow: "rgba(255,77,204,0.35)" },    // pink/magenta
  { color: "#A855F7", glow: "rgba(168,85,247,0.35)" },    // purple
];

// Pipeline lines — extending from both sides of the panels
// Each line has static endpoint dots and a traveling particle
type PipeLine = {
  y: number;       // y within viewBox
  color: string;
  dotColorLeft: string;
  dotColorRight: string;
  duration: number;
  delay: number;
};

const pipeLines: PipeLine[] = [
  { y: 72,  color: "#22D3EE", dotColorLeft: "#22D3EE", dotColorRight: "#FF4DCC", duration: 3.8, delay: 0    },
  { y: 132, color: "#00E5A8", dotColorLeft: "#00E5A8", dotColorRight: "#A855F7", duration: 4.4, delay: 0.5  },
  { y: 188, color: "#00FF66", dotColorLeft: "#00FF66", dotColorRight: "#FF4DCC", duration: 4.0, delay: 0.2  },
  { y: 248, color: "#A3FF12", dotColorLeft: "#22D3EE", dotColorRight: "#FF4DCC", duration: 4.6, delay: 0.8  },
  { y: 308, color: "#FF4DCC", dotColorLeft: "#00E5A8", dotColorRight: "#A855F7", duration: 3.6, delay: 0.3  },
  { y: 358, color: "#A855F7", dotColorLeft: "#22D3EE", dotColorRight: "#FF4DCC", duration: 4.2, delay: 0.6  },
];

function PipelineLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 420"
      preserveAspectRatio="none"
      aria-hidden
    >
      {pipeLines.map((line, i) => (
        <g key={i}>
          {/* Continuous horizontal track line */}
          <line
            x1="0"
            y1={line.y}
            x2="1200"
            y2={line.y}
            stroke={line.color}
            strokeWidth="1"
            strokeOpacity="0.08"
          />

          {/* Left-side static dots (staggered positions) */}
          <circle cx={40 + i * 18}  cy={line.y} r={4 - i * 0.3} fill={line.dotColorLeft}  opacity="0.7" />
          <circle cx={90 + i * 12}  cy={line.y} r={3}            fill={line.dotColorLeft}  opacity="0.5" />
          <circle cx={145 + i * 8}  cy={line.y} r={2.5}          fill={line.dotColorLeft}  opacity="0.35" />

          {/* Left-side connecting segments (brighter) */}
          <line
            x1={40 + i * 18}
            y1={line.y}
            x2={260}
            y2={line.y}
            stroke={line.dotColorLeft}
            strokeWidth="1.2"
            strokeOpacity="0.15"
          />

          {/* Right-side static dots (staggered positions) */}
          <circle cx={1160 - i * 18} cy={line.y} r={4 - i * 0.3} fill={line.dotColorRight} opacity="0.7" />
          <circle cx={1110 - i * 12} cy={line.y} r={3}            fill={line.dotColorRight} opacity="0.5" />
          <circle cx={1055 - i * 8}  cy={line.y} r={2.5}          fill={line.dotColorRight} opacity="0.35" />

          {/* Right-side connecting segments */}
          <line
            x1={940}
            y1={line.y}
            x2={1160 - i * 18}
            y2={line.y}
            stroke={line.dotColorRight}
            strokeWidth="1.2"
            strokeOpacity="0.15"
          />

          {/* Traveling particle — left to right */}
          <motion.circle
            r={3}
            cy={line.y}
            fill={line.color}
            style={{
              filter: `drop-shadow(0 0 6px ${line.color})`,
            }}
            animate={{ cx: [100, 1100] }}
            transition={{
              duration: line.duration,
              repeat: Infinity,
              ease: "linear",
              delay: line.delay,
            }}
          />
          {/* Traveling particle — right to left (opposite direction for some lines) */}
          {i % 2 === 1 && (
            <motion.circle
              r={2.5}
              cy={line.y}
              fill={line.dotColorRight}
              style={{
                filter: `drop-shadow(0 0 5px ${line.dotColorRight})`,
              }}
              animate={{ cx: [1100, 100] }}
              transition={{
                duration: line.duration + 1,
                repeat: Infinity,
                ease: "linear",
                delay: line.delay + 2,
              }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}

function StackedPanels() {
  const PANEL_W = 110;
  const PANEL_H = 300;
  const OVERLAP = 58;

  return (
    <div className="relative w-full h-[420px] flex items-center justify-center">
      {/* Pipeline lines spanning full width behind panels */}
      <PipelineLines />

      {/* Panels container */}
      <div
        className="relative flex items-center justify-center"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      >
        {panels.map((p, i) => {
          const center = (panels.length - 1) / 2;
          const rotY = (i - center) * 4.5;
          const yOffset = Math.abs(i - center) * 3;
          const zOffset = -Math.abs(i - center) * 8;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, rotateY: rotY * 2.5 }}
              animate={{
                opacity: 1,
                y: yOffset,
                rotateY: rotY,
              }}
              transition={{
                duration: 1.1,
                delay: 0.5 + i * 0.07,
                ease,
              }}
              style={{
                width: PANEL_W,
                height: PANEL_H,
                marginLeft: i === 0 ? 0 : -OVERLAP,
                borderRadius: 14,
                border: `1.5px solid ${p.color}`,
                background: `linear-gradient(180deg, ${p.color}22 0%, ${p.color}0A 40%, ${p.color}18 100%)`,
                boxShadow: `0 0 60px -6px ${p.glow}, 0 8px 28px -8px rgba(0,0,0,0.5), inset 0 1px 0 0 ${p.color}44, inset 0 -1px 0 0 ${p.color}22`,
                transformStyle: "preserve-3d",
                transform: `translateZ(${zOffset}px)`,
                backdropFilter: "blur(2px)",
                position: "relative",
                zIndex: panels.length - Math.abs(i - Math.floor(center)),
              }}
            >
              {/* Subtle breathing glow */}
              <motion.div
                className="absolute inset-0 rounded-[13px]"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 3.5 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.25,
                }}
                style={{
                  background: `radial-gradient(ellipse at 50% 50%, ${p.color}0F, transparent 70%)`,
                }}
                aria-hidden
              />
              {/* Inner vertical highlight */}
              <div
                className="absolute left-0 top-[10%] bottom-[10%] w-[1.5px] rounded-full"
                style={{
                  background: `linear-gradient(180deg, transparent, ${p.color}88, transparent)`,
                }}
                aria-hidden
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────

export function Hero() {
  return (
    <section
      id="top"
      className="relative pt-[140px] pb-2xl overflow-hidden"
    >
      {/* Atmosphere — single soft radial */}
      <div
        className="absolute inset-0 -z-10 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(34,211,238,0.05), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-[1280px] px-6">
        {/* Top row — H1 left, CTAs top-right */}
        <div className="grid lg:grid-cols-[1.4fr_auto] gap-md lg:gap-xl items-start">
          {/* Headline + sub */}
          <div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-display font-semibold leading-[0.96] tracking-[-0.035em] text-balance text-d1"
            >
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease }}
                className="block"
              >
                Build AI workflows
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28, ease }}
                className="block"
              >
                in <span className="text-flux-green">full color.</span>
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease }}
              className="mt-md max-w-[480px] text-lg text-text-secondary text-pretty"
            >
              A visual platform for designing, connecting, and deploying AI
              systems. From prototype to production without rewrites.
            </motion.p>
          </div>

          {/* CTAs — top right */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5, ease }}
            className="flex flex-wrap items-center gap-3 lg:mt-md"
          >
            <Button variant="primary" size="lg" href="#start">
              Start Building
              <ArrowRight size={15} />
            </Button>
            <Button variant="secondary" size="lg" href="#demo">
              <PlayIcon size={11} className="-ml-0.5 translate-x-[1px]" />
              View Demo
            </Button>
          </motion.div>
        </div>

        {/* Stacked panels visual — the centerpiece */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease }}
          className="mt-2xl"
        >
          <StackedPanels />
        </motion.div>

        {/* Trust strip — 3 stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-xl pt-md border-t border-ink-line grid grid-cols-3 gap-md max-w-[700px] mx-auto"
        >
          <div className="flex flex-col items-center text-center">
            <span className="text-2xs text-text-tertiary">teams</span>
            <span className="text-h1 font-display font-semibold text-text-primary num-tabular mt-1 inline-flex items-center gap-2">
              8.2k
              <span className="size-1.5 rounded-full bg-flux-green animate-status" />
            </span>
          </div>
          <div className="flex flex-col items-center text-center border-x border-ink-line">
            <span className="text-2xs text-text-tertiary">workflows</span>
            <span className="text-h1 font-display font-semibold text-text-primary num-tabular mt-1 inline-flex items-center gap-2">
              412k
              <span className="size-1.5 rounded-full bg-flux-cyan animate-status" />
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-2xs text-text-tertiary">runs / day</span>
            <span className="text-h1 font-display font-semibold text-text-primary num-tabular mt-1 inline-flex items-center gap-2">
              2.4M
              <span className="size-1.5 rounded-full bg-flux-pink animate-status" />
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
