"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/primitives/button";
import { ArrowRight, PlayIcon } from "@/components/primitives/icons";

const ease = [0.16, 1, 0.3, 1] as const;

// ─── Stacked translucent panels — exactly 7, fixed color order ───────────

type Panel = { color: string };

const panels: Panel[] = [
  { color: "#22D3EE" }, // cyan
  { color: "#2DD4BF" }, // teal
  { color: "#22C55E" }, // green
  { color: "#A3E635" }, // lime
  { color: "#FACC15" }, // yellow
  { color: "#FF4DCC" }, // pink
  { color: "#A855F7" }, // purple
];

// Conceptual canvas — chosen so panels can be the spec size (200×340),
// gap-stacked with light overlap, AND leave 160px margins for trails.
const VB_W = 1700;
const VB_H = 440;

const PANEL_W = 200;
const PANEL_H = 340;
const PANEL_RADIUS = 22;
const PANEL_TILT = -8;          // uniform right tilt
const PANEL_OFFSET = 175;       // center-to-center (200 wide, 25px overlap = ~12%)
const PANEL_TOP = (VB_H - PANEL_H) / 2 + 8;

// Compute panel center X positions (in viewBox coords)
const panelCenters = panels.map(
  (_, i) => VB_W / 2 + (i - (panels.length - 1) / 2) * PANEL_OFFSET
);

const FLOW_Y = PANEL_TOP + PANEL_H / 2;

// Cluster bounds (left edge of leftmost panel, right edge of rightmost)
const CLUSTER_LEFT = panelCenters[0] - PANEL_W / 2;
const CLUSTER_RIGHT = panelCenters[panels.length - 1] + PANEL_W / 2;

// Trail line config — 4 lanes per side, sitting within the ~160px margin
type Lane = { y: number; color: string };

const leftLanes: Lane[] = [
  { y: 110, color: "#22D3EE" }, // cyan
  { y: 165, color: "#2DD4BF" }, // teal
  { y: 275, color: "#22C55E" }, // green
  { y: 330, color: "#22D3EE" }, // cyan
];

const rightLanes: Lane[] = [
  { y: 110, color: "#FF4DCC" }, // pink
  { y: 165, color: "#A855F7" }, // purple
  { y: 275, color: "#FF4DCC" }, // pink
  { y: 330, color: "#A855F7" }, // purple
];

const LINE_LEN = 140;        // length of each trail line
const LINE_INSET = 12;       // distance from panel cluster edge to line end

function PipelineCanvas() {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
      {/* SVG: trails + center flow line, sits BEHIND panels */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="absolute inset-0 size-full pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          {/* Full-spectrum gradient for the center flow line */}
          <linearGradient id="flowGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0"    stopColor="#22D3EE" />
            <stop offset="0.16" stopColor="#2DD4BF" />
            <stop offset="0.33" stopColor="#22C55E" />
            <stop offset="0.50" stopColor="#A3E635" />
            <stop offset="0.66" stopColor="#FACC15" />
            <stop offset="0.83" stopColor="#FF4DCC" />
            <stop offset="1"    stopColor="#A855F7" />
          </linearGradient>

          {/* Soft glow filter for nodes */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── LEFT INPUT LINES ─────────────────────────────────────────── */}
        {leftLanes.map((lane, i) => {
          const lineEndX = CLUSTER_LEFT - LINE_INSET;
          const lineStartX = lineEndX - LINE_LEN;
          const dotXs = [
            lineStartX + 14,
            lineStartX + 70,
            lineStartX + 126,
          ];
          return (
            <g key={`L${i}`}>
              <line
                x1={lineStartX}
                y1={lane.y}
                x2={lineEndX}
                y2={lane.y}
                stroke={lane.color}
                strokeWidth="1"
                strokeOpacity="0.55"
              />
              {dotXs.map((cx, j) => (
                <circle
                  key={j}
                  cx={cx}
                  cy={lane.y}
                  r={3.4 - j * 0.4}
                  fill={lane.color}
                  filter="url(#nodeGlow)"
                  opacity={0.5 + j * 0.16}
                />
              ))}
            </g>
          );
        })}

        {/* ── RIGHT OUTPUT LINES ───────────────────────────────────────── */}
        {rightLanes.map((lane, i) => {
          const lineStartX = CLUSTER_RIGHT + LINE_INSET;
          const lineEndX = lineStartX + LINE_LEN;
          const dotXs = [
            lineStartX + 14,
            lineStartX + 70,
            lineStartX + 126,
          ];
          return (
            <g key={`R${i}`}>
              <line
                x1={lineStartX}
                y1={lane.y}
                x2={lineEndX}
                y2={lane.y}
                stroke={lane.color}
                strokeWidth="1"
                strokeOpacity="0.55"
              />
              {dotXs.map((cx, j) => (
                <circle
                  key={j}
                  cx={cx}
                  cy={lane.y}
                  r={3.4 - (2 - j) * 0.4}
                  fill={lane.color}
                  filter="url(#nodeGlow)"
                  opacity={0.5 + (2 - j) * 0.16}
                />
              ))}
            </g>
          );
        })}

        {/* ── CENTER FLOW LINE ─────────────────────────────────────────── */}
        {/* Spectrum line passing through all panels (visible through translucent fills) */}
        <line
          x1={CLUSTER_LEFT - 6}
          y1={FLOW_Y}
          x2={CLUSTER_RIGHT + 6}
          y2={FLOW_Y}
          stroke="url(#flowGradient)"
          strokeWidth="2"
          strokeOpacity="0.75"
        />
      </svg>

      {/* ── PANELS — DOM elements positioned in % of container ─────────── */}
      <div
        className="absolute inset-0"
        style={{ perspective: "1800px" }}
      >
        <div
          className="relative size-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {panels.map((p, i) => {
            const center = (panels.length - 1) / 2;
            const distFromCenter = Math.abs(i - center);
            // Slight Z to give center panels prominence, edges recede
            const translateZ = -distFromCenter * 5;
            const zIndex = 10 + (panels.length - distFromCenter);

            const leftPct = (panelCenters[i] / VB_W) * 100;
            const topPct = (PANEL_TOP / VB_H) * 100;
            const widthPct = (PANEL_W / VB_W) * 100;
            const heightPct = (PANEL_H / VB_H) * 100;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.4 + i * 0.06,
                  ease,
                }}
                style={{
                  position: "absolute",
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: `${widthPct}%`,
                  height: `${heightPct}%`,
                  transform: `translateX(-50%) rotateY(${PANEL_TILT}deg) translateZ(${translateZ}px)`,
                  transformStyle: "preserve-3d",
                  zIndex,
                  borderRadius: PANEL_RADIUS,
                  border: `2px solid ${p.color}`,
                  background: `linear-gradient(180deg, ${p.color}24 0%, ${p.color}10 100%)`,
                  boxShadow: `0 0 22px -4px ${p.color}55, inset 0 0 0 1px ${p.color}20`,
                }}
              >
                {/* Center node — at panel's true center, rendered above flow line */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: p.color,
                    boxShadow: `0 0 16px ${p.color}, 0 0 6px ${p.color}`,
                  }}
                  aria-hidden
                />
              </motion.div>
            );
          })}
        </div>
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
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Top row — H1 left, CTAs top-right */}
        <div className="grid lg:grid-cols-[1.4fr_auto] gap-md lg:gap-xl items-start">
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

        {/* Pipeline — wider conceptual canvas (1700) maps to a slightly wider
            container than the page max-width to give panels their spec size + 160px margins */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease }}
          className="mt-2xl mx-auto"
        >
          <PipelineCanvas />
        </motion.div>

        {/* Trust strip */}
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
