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
const PANEL_SLANT = 78;       // right-edge drop — gentler tilt matching reference
const PANEL_RADIUS = 16;      // corner rounding (tangent to each edge — no bumps)
const PANEL_STROKE = 3;       // outer stroke width
const PANEL_TOP_FULL = 35;    // top edge y of a full-size panel

// Shared horizontal axis — every panel's geometric center sits on this line
const AXIS_Y = PANEL_TOP_FULL + (PANEL_H + PANEL_SLANT) / 2;

// Per-panel size scale: small → grow → full (3,4,5) → shrink (panels 6 and 7 same size)
const PANEL_SCALES = [0.82, 0.92, 1.0, 1.0, 1.0, 0.94, 0.94];

// Per-panel vertical offset — last (purple) panel nudged up so it reads as
// recessed/floating above the stack rather than sitting flush on the axis.
const PANEL_Y_OFFSETS = [0, 0, 0, 0, 0, 0, -14];

// Variable spacing — gentle progression. Each tile overlaps only its immediate
// neighbour (~25-35% of panel width); tiles never stack 3-deep at the right.
// Center-to-center distance between the indexed panel and the next.
const PAIR_OFFSETS = [
  198, // 1→2: 18px GAP — first tile stands clear of the rest, like reference
  142, // 2→3: 38px overlap
  132, // 3→4: 48px overlap
  126, // 4→5: 54px overlap
  124, // 5→6: 56px overlap
  118, // 6→7: 62px overlap (still slightly tighter — panel 7 reads as "back")
];

// Cumulative panel centers, then re-centered horizontally in the viewBox
const panelCenters: number[] = (() => {
  const positions = [0];
  for (const step of PAIR_OFFSETS) positions.push(positions[positions.length - 1] + step);
  const span = positions[positions.length - 1];
  const offset = VB_W / 2 - span / 2;
  return positions.map((p) => p + offset);
})();

// Parallelogram path with TANGENT rounded corners — each curve starts/ends along
// its actual adjacent edge (not cardinal axes), so slanted edges flow smoothly into
// the corner curve. This eliminates the visible "bump" the cardinal-axis approach
// produced where the slanted top/bottom met the rounded vertical sides.
function panelPath(cx: number, scale: number, dy: number = 0) {
  const w = PANEL_W;
  const h = PANEL_H * scale;
  const slant = PANEL_SLANT * scale;
  const r = PANEL_RADIUS;

  const lX = cx - w / 2;
  const rX = cx + w / 2;
  const tlY = AXIS_Y - h / 2 - slant / 2 + dy;
  const trY = tlY + slant;
  const blY = tlY + h;
  const brY = trY + h;

  // Corners in clockwise order
  const C = [
    { x: lX, y: tlY }, // 0: TL
    { x: rX, y: trY }, // 1: TR
    { x: rX, y: brY }, // 2: BR
    { x: lX, y: blY }, // 3: BL
  ];

  // Unit vector from a→b
  const u = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len };
  };

  // For each corner: tangent points r away along each adjacent edge
  const n = C.length;
  const T = C.map((c, i) => {
    const prev = C[(i - 1 + n) % n];
    const next = C[(i + 1) % n];
    const inDir = u(c, prev);   // back-along-incoming
    const outDir = u(c, next);  // forward-along-outgoing
    return {
      start: { x: c.x + inDir.x * r, y: c.y + inDir.y * r },
      end:   { x: c.x + outDir.x * r, y: c.y + outDir.y * r },
      ctrl:  c,
    };
  });

  const parts: string[] = [];
  parts.push(`M ${T[0].end.x} ${T[0].end.y}`);
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    parts.push(`L ${T[next].start.x} ${T[next].start.y}`);
    parts.push(`Q ${T[next].ctrl.x} ${T[next].ctrl.y}, ${T[next].end.x} ${T[next].end.y}`);
  }
  parts.push("Z");
  return parts.join(" ");
}

// Every panel's center sits on AXIS_Y — flow line is straight horizontal through them
function panelCenterPoint(i: number) {
  return { cx: panelCenters[i], cy: AXIS_Y };
}

// Cluster bounds — leftmost panel left edge to rightmost panel right edge
const CLUSTER_LEFT = panelCenters[0] - PANEL_W / 2;
const CLUSTER_RIGHT = panelCenters[panels.length - 1] + PANEL_W / 2;

// Center line stretches edge-to-edge; mask fades both ends
const LINE_X1 = 0;
const LINE_X2 = VB_W;

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

          {/* Horizontal spectrum gradient — line spans full viewBox, gradient locked to panel cluster */}
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

          {/* Edge fade mask — fades line to 0 at left/right viewBox edges */}
          <linearGradient id="edgeFade" x1={LINE_X1} y1="0" x2={LINE_X2} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0"    stopColor="white" stopOpacity="0" />
            <stop offset="0.18" stopColor="white" stopOpacity="1" />
            <stop offset="0.82" stopColor="white" stopOpacity="1" />
            <stop offset="1"    stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="lineFadeMask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
            <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#edgeFade)" />
          </mask>

          {/* Soft glow for nodes */}
          <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Frosted noise — fine speckle for the glass-tile texture */}
          <filter id="frostGrain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" seed="3" />
            <feColorMatrix
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0.35 0"
            />
          </filter>
          <pattern id="frostPattern" x="0" y="0" width="220" height="220" patternUnits="userSpaceOnUse">
            <rect width="220" height="220" fill="black" filter="url(#frostGrain)" />
          </pattern>
        </defs>

        {/* ── CENTER FLOW LINE — full-width, fading to transparent on both edges ── */}
        <g mask="url(#lineFadeMask)">
          <motion.line
            x1={LINE_X1}
            y1={AXIS_Y}
            x2={LINE_X2}
            y2={AXIS_Y}
            stroke="url(#flowGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.2, ease }}
          />

          {/* Traveling pulse — bright dot sweeping left → right along the line */}
          <motion.circle
            r="5"
            cy={AXIS_Y}
            fill="white"
            initial={{ cx: LINE_X1, opacity: 0 }}
            animate={{ cx: LINE_X2, opacity: [0, 1, 1, 0] }}
            transition={{
              cx: { duration: 4.2, repeat: Infinity, ease: "linear", delay: 1.4 },
              opacity: { duration: 4.2, repeat: Infinity, ease: "linear", delay: 1.4, times: [0, 0.08, 0.92, 1] },
            }}
            style={{ filter: "drop-shadow(0 0 8px white)" }}
          />
        </g>

        {/* ── PANELS (drawn back-to-front: rightmost/purple is at the back of the stack,
             leftmost/cyan sits on top — pink overlaps purple, etc.) ── */}
        {panels.map((_, idx) => {
          const i = panels.length - 1 - idx; // reverse iteration → later in DOM = on top
          const p = panels[i];
          const d = panelPath(panelCenters[i], PANEL_SCALES[i], PANEL_Y_OFFSETS[i]);
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 + i * 0.07, ease }}
              style={{ filter: `drop-shadow(0 0 14px ${p.stroke}66)` }}
            >
              {/* Tinted glass body — full gradient alpha so colors stay saturated */}
              <path d={d} fill={`url(#panelGrad${i})`} />
              {/* Frosted grain — very subtle, just a sheen so it doesn't wash the colour */}
              <path
                d={d}
                fill="url(#frostPattern)"
                opacity={0.12}
                style={{ mixBlendMode: "screen" }}
                pointerEvents="none"
              />
              {/* Outer stroke last so it stays crisp on top of the texture */}
              <path
                d={d}
                fill="none"
                stroke={p.stroke}
                strokeWidth={PANEL_STROKE}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </motion.g>
          );
        })}

        {/* ── PER-PANEL CENTER NODES — pulse on the flow line ─────────── */}
        {panels.map((p, i) => {
          const { cx, cy } = panelCenterPoint(i);
          const stagger = i * 0.18;
          return (
            <g key={`node${i}`}>
              {/* Breathing halo */}
              <motion.circle
                cx={cx}
                cy={cy}
                fill={p.stroke}
                filter="url(#nodeGlow)"
                initial={{ r: 6, opacity: 0 }}
                animate={{ r: [10, 16, 10], opacity: [0.12, 0.28, 0.12] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 1 + stagger }}
              />
              {/* Solid core */}
              <motion.circle
                cx={cx}
                cy={cy}
                r="6"
                fill={p.stroke}
                filter="url(#nodeGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.07, ease }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
              {/* Bright center pip */}
              <circle cx={cx} cy={cy} r="2" fill="#FFFFFF" opacity="0.9" />
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
