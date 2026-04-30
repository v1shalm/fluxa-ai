"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/primitives/button";

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

// ── Pulse choreography ────────────────────────────────────────────────
// One continuous loop. Within a cycle:
//   [0, DRAW_END]      — pulse moves L→R, line is *drawn behind it* (no
//                        line at rest). Each panel's center node flares
//                        and its stroke brightens the moment the pulse
//                        reaches it; brightness then settles to a glow
//                        until end of draw phase.
//   [DRAW_END, 1]      — line erases from the left (trailing edge sweeps
//                        in), brightenings fade out, ready to redraw.
const CYCLE_DURATION = 4.6;     // total cycle, seconds
const DRAW_END       = 0.62;    // fraction of cycle spent drawing (≈ 2.85s)
const PULSE_DELAY    = 0.8;     // intro silence before first sweep
const BRIGHT_WINDOW  = 0.035;   // half-width of the panel "flash" in cycle progress

// Normalized cycle-time at which the moving head is at panel i's center.
// Pulse traverses LINE_X1 → LINE_X2 over [0, DRAW_END] of the cycle.
const arrivalProgress = (i: number) => DRAW_END * (panelCenters[i] / VB_W);

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

          {/* Horizontal "swell" — the line is thin in general, but right at
              the comet position a horizontal lens-flare blur makes it appear
              thicker. stdDeviation x=42 / y=4 gives a wide, low oval glow. */}
          <filter id="cometSwell" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="42 4" />
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

        {/* ── INPUT / OUTPUT ANCHORS — sit just outside the cluster, off the line.
             Geometric port markers, no glow trickery. They breath in step with
             the wave: input flares at cycle start, output flares as the head arrives. */}
        {(() => {
          const inX  = CLUSTER_LEFT - 70;
          const outX = CLUSTER_RIGHT + 70;
          const firstStroke = panels[0].stroke;
          const lastStroke  = panels[panels.length - 1].stroke;
          return (
            <>
              {/* Input port */}
              <g>
                {/* short connector tail toward the cluster */}
                <line
                  x1={inX + 8}
                  y1={AXIS_Y}
                  x2={CLUSTER_LEFT}
                  y2={AXIS_Y}
                  stroke={firstStroke}
                  strokeWidth="1"
                  opacity="0.25"
                />
                {/* port square — open frame, no fill */}
                <rect
                  x={inX - 6}
                  y={AXIS_Y - 6}
                  width="12"
                  height="12"
                  rx="2"
                  fill="none"
                  stroke={firstStroke}
                  strokeWidth="1.25"
                  opacity="0.65"
                />
                {/* port arrival flare — pulses as the wave is "born" */}
                <motion.rect
                  x={inX - 6}
                  y={AXIS_Y - 6}
                  width="12"
                  height="12"
                  rx="2"
                  fill={firstStroke}
                  opacity="0"
                  animate={{ opacity: [0, 0, 0.9, 0.5, 0.5, 0] }}
                  transition={{
                    duration: CYCLE_DURATION,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: PULSE_DELAY,
                    times: [0, 0.001, 0.04, 0.08, DRAW_END * 0.97, 1],
                  }}
                  style={{ filter: `drop-shadow(0 0 10px ${firstStroke})` }}
                />
                {/* label */}
                <text
                  x={inX}
                  y={AXIS_Y + 28}
                  textAnchor="middle"
                  fontSize="11"
                  letterSpacing="0.18em"
                  fill="rgba(255,255,255,0.42)"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                >
                  INPUT
                </text>
              </g>

              {/* Output port */}
              <g>
                <line
                  x1={CLUSTER_RIGHT}
                  y1={AXIS_Y}
                  x2={outX - 8}
                  y2={AXIS_Y}
                  stroke={lastStroke}
                  strokeWidth="1"
                  opacity="0.25"
                />
                <rect
                  x={outX - 6}
                  y={AXIS_Y - 6}
                  width="12"
                  height="12"
                  rx="2"
                  fill="none"
                  stroke={lastStroke}
                  strokeWidth="1.25"
                  opacity="0.65"
                />
                {/* fires as the head arrives at the right edge */}
                <motion.rect
                  x={outX - 6}
                  y={AXIS_Y - 6}
                  width="12"
                  height="12"
                  rx="2"
                  fill={lastStroke}
                  opacity="0"
                  animate={{ opacity: [0, 0, 0.9, 0.4, 0] }}
                  transition={{
                    duration: CYCLE_DURATION,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: PULSE_DELAY,
                    times: [0, DRAW_END - 0.04, DRAW_END, DRAW_END + 0.06, 1],
                  }}
                  style={{ filter: `drop-shadow(0 0 10px ${lastStroke})` }}
                />
                <text
                  x={outX}
                  y={AXIS_Y + 28}
                  textAnchor="middle"
                  fontSize="11"
                  letterSpacing="0.18em"
                  fill="rgba(255,255,255,0.42)"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                >
                  OUTPUT
                </text>
              </g>
            </>
          );
        })()}

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

        {/* ── PER-PANEL BRIGHTEN — each card flares the moment the head passes
             its center, then settles to a steady mid-glow until end-of-draw,
             then fades during the erase phase. The result reads as the line
             "switching panels on" one by one as it threads through. ───── */}
        {panels.map((_, idx) => {
          const i = panels.length - 1 - idx;
          const p = panels[i];
          const d = panelPath(panelCenters[i], PANEL_SCALES[i], PANEL_Y_OFFSETS[i]);
          const ap = arrivalProgress(i);
          const t1 = Math.max(0.001, ap - BRIGHT_WINDOW);
          const t2 = Math.min(DRAW_END - 0.001, ap + BRIGHT_WINDOW);
          return (
            <motion.path
              key={`brighten${i}`}
              d={d}
              fill="none"
              stroke={p.stroke}
              strokeWidth={PANEL_STROKE + 1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 0.55, 0.55, 0] }}
              transition={{
                duration: CYCLE_DURATION,
                repeat: Infinity,
                ease: "easeOut",
                delay: PULSE_DELAY,
                times: [0, t1, ap, t2, DRAW_END * 0.97, 1],
              }}
              style={{ filter: `drop-shadow(0 0 18px ${p.stroke}) drop-shadow(0 0 36px ${p.stroke}aa)` }}
              pointerEvents="none"
            />
          );
        })}

        {/* ── CENTER FLOW LINE + COMET ─────────────────────────────────────
            Drawn AFTER the panels so the line visibly threads THROUGH each
            tile (rather than passing behind them). The line itself is a thin
            1.5px stroke; a horizontal swell layer + a bright core circle
            ride the comet's leading edge so the line *appears* thicker right
            where the comet is, thin everywhere else.

            One uninterrupted cycle:
              [0,    DRAW_END]  pathLength 0→1   line draws as comet sweeps L→R
              [DRAW_END, 1]     pathLength 1→0   line shrinks back from the right
        */}
        {(() => {
          // ALL three line-related animations share ONE timeline so a single
          // `repeat: Infinity` covers the whole loop. (Per-property transition
          // overrides — `transition.opacity = {...}` — silently DROP the parent
          // `repeat` in framer-motion, which is why the line vanished after
          // the first cycle. One unified `transition` avoids the whole class.)
          const SHARED_TIMES = [0, 0.04, DRAW_END, 1] as const;
          const SHARED = {
            duration: CYCLE_DURATION,
            repeat: Infinity,
            ease: "linear" as const,
            delay: PULSE_DELAY,
            times: SHARED_TIMES as unknown as number[],
          };
          // Approximate cx at t=0.04 along the linear comet path (0 → VB_W
          // over [0, DRAW_END]). Any small value works; exact-linear keeps
          // motion smooth across the keyframe at t=0.04.
          const CX_EARLY = LINE_X1 + (0.04 / DRAW_END) * (LINE_X2 - LINE_X1);
          return (
            <g mask="url(#lineFadeMask)">
              {/* Thin gradient base line. Draws 0→1 during draw phase, then
                  HOLDS at full length and fades out via opacity. Loop restarts
                  from pathLength=0 / opacity=0 — no reverse erase. */}
              <motion.path
                d={`M ${LINE_X1} ${AXIS_Y} L ${LINE_X2} ${AXIS_Y}`}
                fill="none"
                stroke="url(#flowGradient)"
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 0, 1, 1],
                  opacity:    [0, 1, 1, 0],
                }}
                transition={SHARED}
                style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.25))" }}
              />

              {/* Horizontal swell — small dot widely blurred into a horizontal
                  lens-flare via the cometSwell filter. Rides the leading edge
                  so the line looks dramatically thicker right at the comet,
                  and thin everywhere else. */}
              <motion.circle
                r={4}
                cy={AXIS_Y}
                fill="white"
                filter="url(#cometSwell)"
                initial={{ cx: LINE_X1, opacity: 0 }}
                animate={{
                  cx:      [LINE_X1, CX_EARLY, LINE_X2, LINE_X2],
                  opacity: [0, 0.75, 0.75, 0],
                }}
                transition={SHARED}
              />

              {/* Bright core — the visible head of the wave */}
              <motion.circle
                r={5}
                cy={AXIS_Y}
                fill="white"
                initial={{ cx: LINE_X1, opacity: 0 }}
                animate={{
                  cx:      [LINE_X1, CX_EARLY, LINE_X2, LINE_X2],
                  opacity: [0, 1, 1, 0],
                }}
                transition={SHARED}
                style={{ filter: "drop-shadow(0 0 10px white) drop-shadow(0 0 22px rgba(255,255,255,0.55))" }}
              />
            </g>
          );
        })()}

        {/* ── PER-PANEL CENTER NODES — pulse on the flow line ─────────── */}
        {panels.map((p, i) => {
          const { cx, cy } = panelCenterPoint(i);
          const stagger = i * 0.18;
          const ap = arrivalProgress(i);
          const t1 = Math.max(0.001, ap - BRIGHT_WINDOW);
          const t2 = Math.min(DRAW_END - 0.001, ap + BRIGHT_WINDOW);
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
              {/* Arrival flare — node bursts as the pulse threads through it,
                  then settles to an elevated glow for the rest of the draw. */}
              <motion.circle
                cx={cx}
                cy={cy}
                fill={p.stroke}
                filter="url(#nodeGlow)"
                initial={{ r: 6, opacity: 0 }}
                animate={{
                  r:       [6, 6, 16, 9, 9, 6],
                  opacity: [0, 0, 1, 0.55, 0.55, 0],
                }}
                transition={{
                  duration: CYCLE_DURATION,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: PULSE_DELAY,
                  times: [0, t1, ap, t2, DRAW_END * 0.97, 1],
                }}
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
      <div className="mx-auto w-full max-w-[2240px] px-6 md:px-10 lg:px-20 xl:px-[160px]">
        <div className="grid lg:grid-cols-[1fr_auto] items-start gap-md lg:gap-2xl">
          <div className="lg:max-w-[680px]">
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
                The visual canvas
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.28, ease }}
                className="block"
              >
                for <span className="text-flux-green">LLM workflows</span>
              </motion.span>
            </motion.h1>
          </div>

          <div className="flex flex-col gap-8 lg:mt-4 w-full lg:w-[400px]">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease }}
              className="text-lg text-text-secondary text-pretty"
            >
              Wire LLMs, tools, and data on a typed canvas. Deploy as an
              observable API from one workflow file — no notebooks, no rewrites.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.5, ease }}
              className="flex flex-wrap items-center gap-3"
            >
              <Button variant="primary" size="lg" href="#start">
                Start building
              </Button>
              <Button variant="secondary" size="lg" href="#demo" className="group">
                <span
                  className="relative inline-flex size-1.5 mr-1"
                  aria-hidden
                >
                  <span className="absolute inset-0 rounded-full bg-flux-green/40 animate-ping" />
                  <span className="relative size-1.5 rounded-full bg-flux-green" />
                </span>
                Watch the demo
              </Button>
            </motion.div>
          </div>
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
