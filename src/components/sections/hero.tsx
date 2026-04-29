"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/primitives/button";
import { ArrowRight, PlayIcon } from "@/components/primitives/icons";

const ease = [0.16, 1, 0.3, 1] as const;

// ─── Stacked translucent parallelogram panels — exactly 7, fixed order ────

type Panel = {
  stroke: string;       // 2px stroke color
  fillTop: string;      // gradient stop 0 (lighter, top-left)
  fillBottom: string;   // gradient stop 1 (darker, bottom-right)
};

const panels: Panel[] = [
  { stroke: "#22D3EE", fillTop: "#22D3EE40", fillBottom: "#0E5973" },
  { stroke: "#2DD4BF", fillTop: "#2DD4BF40", fillBottom: "#0F574F" },
  { stroke: "#22C55E", fillTop: "#22C55E40", fillBottom: "#0F4D26" },
  { stroke: "#A3E635", fillTop: "#A3E63540", fillBottom: "#3F540F" },
  { stroke: "#FACC15", fillTop: "#FACC1540", fillBottom: "#5C4708" },
  { stroke: "#FF4DCC", fillTop: "#FF4DCC40", fillBottom: "#601E48" },
  { stroke: "#A855F7", fillTop: "#A855F740", fillBottom: "#3D1A5C" },
];

const VB_W = 1400;
const VB_H = 480;
const PANEL_W = 140;
const PANEL_H = 340;
const PANEL_SLANT = 56;   // right edge sits this much LOWER than left edge — creates the parallelogram lean
const PANEL_OFFSET = 110; // center-to-center horizontal step
const PANEL_TOP = 56;     // top-edge y of leftmost panel

// Panel center X positions
const panelCenters = panels.map(
  (_, i) => VB_W / 2 + (i - (panels.length - 1) / 2) * PANEL_OFFSET
);

// Pure parallelogram path — sharp straight corners, no curves
function panelPath(cx: number) {
  const lX = cx - PANEL_W / 2;
  const rX = cx + PANEL_W / 2;
  const tlY = PANEL_TOP;                          // top-left
  const trY = PANEL_TOP + PANEL_SLANT;             // top-right (lower than top-left)
  const blY = PANEL_TOP + PANEL_H;                 // bottom-left
  const brY = PANEL_TOP + PANEL_SLANT + PANEL_H;   // bottom-right

  return [
    `M ${lX} ${tlY}`,
    `L ${rX} ${trY}`,
    `L ${rX} ${brY}`,
    `L ${lX} ${blY}`,
    "Z",
  ].join(" ");
}

// Each panel's geometric center (post-slant) — the flow line passes through these
function panelCenterPoint(i: number) {
  return {
    cx: panelCenters[i],
    cy: PANEL_TOP + PANEL_SLANT / 2 + PANEL_H / 2,
  };
}

// Cluster bounds (using panel 0 left edge and panel 6 right edge)
const CLUSTER_LEFT = panelCenters[0] - PANEL_W / 2;
const CLUSTER_RIGHT = panelCenters[panels.length - 1] + PANEL_W / 2;

// Flow line — slanted to match panel tilt
// Goes through panel 0 center → panel 6 center
const FLOW_X1 = panelCenterPoint(0).cx;
const FLOW_Y1 = panelCenterPoint(0).cy;
const FLOW_X2 = panelCenterPoint(panels.length - 1).cx;
const FLOW_Y2 = panelCenterPoint(panels.length - 1).cy;

// Trail lanes — straight horizontal, sit in margins on either side
type Lane = { y: number; color: string; len: number; dots: number };

const leftLanes: Lane[] = [
  { y: 110, color: "#22D3EE", len: 130, dots: 2 },
  { y: 170, color: "#2DD4BF", len: 220, dots: 3 },
  { y: 256, color: "#22D3EE", len: 280, dots: 3 }, // longest — meets the flow line entry
  { y: 350, color: "#22C55E", len: 200, dots: 3 },
];

const rightLanes: Lane[] = [
  { y: 130, color: "#FF4DCC", len: 100, dots: 2 },
  { y: 200, color: "#A855F7", len: 170, dots: 3 },
  { y: 296, color: "#FF4DCC", len: 240, dots: 3 }, // longest — flow line exit
  { y: 380, color: "#A855F7", len: 130, dots: 3 },
];

function PipelineCanvas() {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          {/* Per-panel gradient — diagonal from light top-left to deeper bottom-right */}
          {panels.map((p, i) => (
            <linearGradient
              key={`g${i}`}
              id={`panelGrad${i}`}
              x1="0" y1="0" x2="1" y2="1"
            >
              <stop offset="0"   stopColor={p.fillTop} />
              <stop offset="1"   stopColor={p.fillBottom} />
            </linearGradient>
          ))}

          {/* Spectrum gradient for the slanted center flow line */}
          <linearGradient id="flowGradient" gradientUnits="userSpaceOnUse"
            x1={FLOW_X1} y1={FLOW_Y1} x2={FLOW_X2} y2={FLOW_Y2}>
            <stop offset="0"    stopColor="#22D3EE" />
            <stop offset="0.16" stopColor="#2DD4BF" />
            <stop offset="0.33" stopColor="#22C55E" />
            <stop offset="0.50" stopColor="#A3E635" />
            <stop offset="0.66" stopColor="#FACC15" />
            <stop offset="0.83" stopColor="#FF4DCC" />
            <stop offset="1"    stopColor="#A855F7" />
          </linearGradient>

          {/* Soft glow for nodes */}
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── LEFT INPUT LINES (straight horizontal, with end-cap glow) ──── */}
        {leftLanes.map((lane, i) => {
          const lineEndX = CLUSTER_LEFT - 6;
          const lineStartX = lineEndX - lane.len;
          // Dots distributed: leftmost smallest/dimmest, rightmost (panel side) largest/brightest
          const dotXs = Array.from({ length: lane.dots }).map(
            (_, j) => lineStartX + 8 + j * ((lane.len - 12) / Math.max(1, lane.dots - 1))
          );
          return (
            <g key={`L${i}`}>
              <line
                x1={lineStartX}
                y1={lane.y}
                x2={lineEndX}
                y2={lane.y}
                stroke={lane.color}
                strokeWidth="1.25"
                strokeOpacity="0.65"
              />
              {dotXs.map((cx, j) => {
                const isLast = j === lane.dots - 1;
                return (
                  <circle
                    key={j}
                    cx={cx}
                    cy={lane.y}
                    r={isLast ? 4 : 3.2 - (lane.dots - 1 - j) * 0.4}
                    fill={lane.color}
                    filter="url(#nodeGlow)"
                    opacity={0.55 + j * 0.15}
                  />
                );
              })}
            </g>
          );
        })}

        {/* ── RIGHT OUTPUT LINES (mirror — bright dot at panel side) ────── */}
        {rightLanes.map((lane, i) => {
          const lineStartX = CLUSTER_RIGHT + 6;
          const lineEndX = lineStartX + lane.len;
          const dotXs = Array.from({ length: lane.dots }).map(
            (_, j) => lineStartX + 8 + j * ((lane.len - 12) / Math.max(1, lane.dots - 1))
          );
          return (
            <g key={`R${i}`}>
              <line
                x1={lineStartX}
                y1={lane.y}
                x2={lineEndX}
                y2={lane.y}
                stroke={lane.color}
                strokeWidth="1.25"
                strokeOpacity="0.65"
              />
              {dotXs.map((cx, j) => {
                const isFirst = j === 0;
                return (
                  <circle
                    key={j}
                    cx={cx}
                    cy={lane.y}
                    r={isFirst ? 4 : 3.2 - j * 0.4}
                    fill={lane.color}
                    filter="url(#nodeGlow)"
                    opacity={0.55 + (lane.dots - 1 - j) * 0.15}
                  />
                );
              })}
            </g>
          );
        })}

        {/* ── CENTER FLOW LINE (slanted, matches panel tilt) ──────────── */}
        {/* Extends past leftmost / rightmost panel by ~half a panel-width to feel "continuous" with the trails */}
        <line
          x1={FLOW_X1 - PANEL_W / 2 - 6}
          y1={FLOW_Y1 - PANEL_SLANT / (2 * (panels.length - 1))}
          x2={FLOW_X2 + PANEL_W / 2 + 6}
          y2={FLOW_Y2 + PANEL_SLANT / (2 * (panels.length - 1))}
          stroke="url(#flowGradient)"
          strokeWidth="2.5"
          strokeOpacity="0.9"
        />

        {/* ── PANELS (parallelograms) ─────────────────────────────────── */}
        {panels.map((p, i) => (
          <motion.path
            key={i}
            d={panelPath(panelCenters[i])}
            fill={`url(#panelGrad${i})`}
            stroke={p.stroke}
            strokeWidth="2"
            strokeMiterlimit="10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.4 + i * 0.06, ease }}
            style={{
              filter: `drop-shadow(0 0 12px ${p.stroke}55)`,
            }}
          />
        ))}

        {/* ── PER-PANEL CENTER NODES — sit on the slanted flow line ───── */}
        {panels.map((p, i) => {
          const { cx, cy } = panelCenterPoint(i);
          return (
            <g key={`node${i}`}>
              {/* Outer glow halo */}
              <circle
                cx={cx}
                cy={cy}
                r="12"
                fill={p.stroke}
                opacity="0.18"
                filter="url(#nodeGlow)"
              />
              {/* Solid core */}
              <circle
                cx={cx}
                cy={cy}
                r="6"
                fill={p.stroke}
                filter="url(#nodeGlow)"
              />
              {/* Bright center pip */}
              <circle
                cx={cx}
                cy={cy}
                r="2"
                fill="#FFFFFF"
                opacity="0.85"
              />
            </g>
          );
        })}
      </svg>
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease }}
          className="mt-2xl mx-auto"
        >
          <PipelineCanvas />
        </motion.div>

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
