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
const PANEL_W = 180;
const PANEL_H = 340;          // full-size panel height
const PANEL_SLANT = 70;       // full-size right-edge drop — scales with panel height
const PANEL_RADIUS = 8;       // corner rounding
const PANEL_TOP_FULL = 35;    // top edge y of a full-size panel

// Shared horizontal axis — every panel's geometric center sits on this line
const AXIS_Y = PANEL_TOP_FULL + (PANEL_H + PANEL_SLANT) / 2;

// Per-panel size scale: small → grow → full (3,4,5) → shrink → smaller
const PANEL_SCALES = [0.82, 0.92, 1.0, 1.0, 1.0, 0.94, 0.86];

// Variable spacing — gap on the left, increasing overlap moving right.
// Each value is the center-to-center distance between the indexed panel and the next.
const PAIR_OFFSETS = [
  190, // 1→2: ~10px gap (panels just barely separated)
  155, // 2→3: 25px overlap
  130, // 3→4: 50px overlap
  110, // 4→5: 70px overlap
  95,  // 5→6: 85px overlap
  82,  // 6→7: 98px overlap (most compressed on the right)
];

// Cumulative panel centers, then re-centered horizontally in the viewBox
const panelCenters: number[] = (() => {
  const positions = [0];
  for (const step of PAIR_OFFSETS) positions.push(positions[positions.length - 1] + step);
  const span = positions[positions.length - 1];
  const offset = VB_W / 2 - span / 2;
  return positions.map((p) => p + offset);
})();

// Parallelogram path with rounded corners (8px) — straight edges, gentle corner curves
function panelPath(cx: number, scale: number) {
  const w = PANEL_W;
  const h = PANEL_H * scale;
  const slant = PANEL_SLANT * scale;
  const r = PANEL_RADIUS;

  const lX = cx - w / 2;
  const rX = cx + w / 2;
  // Center each panel vertically on AXIS_Y regardless of scale
  const tlY = AXIS_Y - h / 2 - slant / 2;
  const trY = tlY + slant;
  const blY = tlY + h;
  const brY = trY + h;

  return [
    `M ${lX + r} ${tlY}`,
    `L ${rX - r} ${trY}`,
    `Q ${rX} ${trY}, ${rX} ${trY + r}`,
    `L ${rX} ${brY - r}`,
    `Q ${rX} ${brY}, ${rX - r} ${brY}`,
    `L ${lX + r} ${blY}`,
    `Q ${lX} ${blY}, ${lX} ${blY - r}`,
    `L ${lX} ${tlY + r}`,
    `Q ${lX} ${tlY}, ${lX + r} ${tlY}`,
    "Z",
  ].join(" ");
}

// Every panel's center sits on AXIS_Y — flow line is straight horizontal through them
function panelCenterPoint(i: number) {
  return { cx: panelCenters[i], cy: AXIS_Y };
}

// Cluster bounds — leftmost panel left edge to rightmost panel right edge
const CLUSTER_LEFT = panelCenters[0] - PANEL_W / 2;
const CLUSTER_RIGHT = panelCenters[panels.length - 1] + PANEL_W / 2;

// Trail lanes — straight horizontal, sit in margins on either side
type Lane = { y: number; color: string; len: number; dots: number };

const leftLanes: Lane[] = [
  { y: 95,  color: "#22D3EE", len: 130, dots: 2 },
  { y: 160, color: "#2DD4BF", len: 220, dots: 3 },
  { y: AXIS_Y, color: "#22D3EE", len: 280, dots: 3 }, // longest — feeds the flow line
  { y: 360, color: "#22C55E", len: 200, dots: 3 },
];

const rightLanes: Lane[] = [
  { y: 115, color: "#FF4DCC", len: 100, dots: 2 },
  { y: 185, color: "#A855F7", len: 170, dots: 3 },
  { y: AXIS_Y, color: "#FF4DCC", len: 240, dots: 3 }, // longest — flow line exit
  { y: 375, color: "#A855F7", len: 130, dots: 3 },
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

          {/* Horizontal spectrum gradient — flow line is straight horizontal */}
          <linearGradient id="flowGradient" gradientUnits="userSpaceOnUse"
            x1={CLUSTER_LEFT} y1={AXIS_Y} x2={CLUSTER_RIGHT} y2={AXIS_Y}>
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

        {/* ── CENTER FLOW LINE (straight horizontal, all panel centers sit on AXIS_Y) ──── */}
        <line
          x1={CLUSTER_LEFT - 6}
          y1={AXIS_Y}
          x2={CLUSTER_RIGHT + 6}
          y2={AXIS_Y}
          stroke="url(#flowGradient)"
          strokeWidth="2.5"
          strokeOpacity="0.9"
        />

        {/* ── PANELS (parallelograms, per-panel scale) ────────────────── */}
        {panels.map((p, i) => (
          <motion.path
            key={i}
            d={panelPath(panelCenters[i], PANEL_SCALES[i])}
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
