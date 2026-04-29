"use client";

import { motion } from "framer-motion";
import { Block } from "@/components/primitives/block";

const ease = [0.16, 1, 0.3, 1] as const;

type NodeDef = {
  id: string;
  x: number;
  y: number;
  size: number;
  color: "cyan" | "green" | "lime" | "yellow" | "pink" | "purple" | "neutral";
  glow?: boolean;
  label?: string;
};

// Spread nodes across full canvas width (1400×460) with intentional column spacing.
const nodes: NodeDef[] = [
  // Inputs (left edge)
  { id: "i1", x: 80,  y: 70,  size: 36, color: "cyan", label: "ingest" },
  { id: "i2", x: 80,  y: 200, size: 28, color: "cyan" },
  { id: "i3", x: 80,  y: 320, size: 32, color: "cyan", glow: true, label: "stream" },

  // Embed
  { id: "m1", x: 290, y: 110, size: 44, color: "green", glow: true, label: "embed" },
  { id: "m2", x: 290, y: 240, size: 32, color: "lime" },
  { id: "m3", x: 290, y: 350, size: 28, color: "lime" },

  // Router / Agent
  { id: "a1", x: 540, y: 70,  size: 40, color: "yellow", label: "router" },
  { id: "a2", x: 540, y: 200, size: 56, color: "green", glow: true, label: "agent" },
  { id: "a3", x: 540, y: 350, size: 32, color: "lime" },

  // Tools
  { id: "t1", x: 800, y: 110, size: 32, color: "yellow" },
  { id: "t2", x: 800, y: 240, size: 28, color: "lime" },
  { id: "t3", x: 800, y: 350, size: 36, color: "purple", label: "memory" },

  // Validate / post-process
  { id: "v1", x: 1020, y: 90,  size: 28, color: "yellow" },
  { id: "v2", x: 1020, y: 220, size: 36, color: "purple", label: "validate" },
  { id: "v3", x: 1020, y: 340, size: 24, color: "lime" },

  // Output
  { id: "o1", x: 1240, y: 90,  size: 44, color: "pink", glow: true, label: "respond" },
  { id: "o2", x: 1240, y: 220, size: 32, color: "pink" },
  { id: "o3", x: 1240, y: 340, size: 28, color: "purple" },

  // Background scatter — fills empty space subtly
  { id: "d1", x: 175, y: 405, size: 8,  color: "neutral" },
  { id: "d2", x: 380, y: 410, size: 10, color: "neutral" },
  { id: "d3", x: 660, y: 420, size: 8,  color: "neutral" },
  { id: "d4", x: 920, y: 415, size: 10, color: "neutral" },
  { id: "d5", x: 1140,y: 410, size: 8,  color: "neutral" },
  { id: "d6", x: 175, y: 30,  size: 6,  color: "neutral" },
  { id: "d7", x: 660, y: 25,  size: 6,  color: "neutral" },
  { id: "d8", x: 1140,y: 30,  size: 8,  color: "neutral" },
];

type Edge = { from: string; to: string; delay: number; color: string };

const edges: Edge[] = [
  { from: "i1", to: "m1", delay: 0,    color: "url(#edgeCyan)" },
  { from: "i2", to: "m2", delay: 0.2,  color: "url(#edgeCyan)" },
  { from: "i3", to: "m3", delay: 0.4,  color: "url(#edgeCyan)" },

  { from: "m1", to: "a1", delay: 0.5,  color: "url(#edgeGreen)" },
  { from: "m1", to: "a2", delay: 0.6,  color: "url(#edgeGreen)" },
  { from: "m2", to: "a2", delay: 0.7,  color: "url(#edgeGreen)" },
  { from: "m3", to: "a3", delay: 0.8,  color: "url(#edgeGreen)" },

  { from: "a1", to: "t1", delay: 0.9,  color: "url(#edgeYellow)" },
  { from: "a2", to: "t2", delay: 1.0,  color: "url(#edgeYellow)" },
  { from: "a2", to: "t3", delay: 1.1,  color: "url(#edgeYellow)" },
  { from: "a3", to: "t3", delay: 1.2,  color: "url(#edgeYellow)" },

  { from: "t1", to: "v1", delay: 1.3,  color: "url(#edgeMid)" },
  { from: "t2", to: "v2", delay: 1.4,  color: "url(#edgeMid)" },
  { from: "t3", to: "v2", delay: 1.5,  color: "url(#edgeMid)" },
  { from: "t3", to: "v3", delay: 1.6,  color: "url(#edgeMid)" },

  { from: "v1", to: "o1", delay: 1.7,  color: "url(#edgePink)" },
  { from: "v2", to: "o2", delay: 1.8,  color: "url(#edgePink)" },
  { from: "v2", to: "o1", delay: 1.85, color: "url(#edgePink)" },
  { from: "v3", to: "o3", delay: 1.9,  color: "url(#edgePink)" },
];

const nodeMap = new Map(nodes.map((n) => [n.id, n]));

function nodeCenter(n: NodeDef) {
  return { cx: n.x + n.size / 2, cy: n.y + n.size / 2 };
}

function edgePath(from: NodeDef, to: NodeDef) {
  const a = nodeCenter(from);
  const b = nodeCenter(to);
  const midX = (a.cx + b.cx) / 2;
  return `M ${a.cx} ${a.cy} C ${midX} ${a.cy}, ${midX} ${b.cy}, ${b.cx} ${b.cy}`;
}

// Lane labels — positioned at the y of each lane's main node, on the left edge
const lanes = [
  { y: 70,  label: "input",  color: "cyan" },
  { y: 200, label: "embed",  color: "green" },
  { y: 200, label: "agent",  color: "green" },
  { y: 320, label: "memory", color: "purple" },
];

// Mini event log entries — fill the right side of the canvas
const events = [
  { ts: "08.412", color: "#22D3EE", label: "ingest · stream open" },
  { ts: "08.520", color: "#00FF66", label: "embed · 2,481 vectors" },
  { ts: "08.687", color: "#FFD400", label: "agent · routed to tool" },
  { ts: "08.840", color: "#A855F7", label: "memory · cache hit" },
  { ts: "08.912", color: "#FF4DCC", label: "respond · 247 tok" },
];

export function LiveDemo() {
  return (
    <section id="demo" className="relative py-section overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(34,211,238,0.05), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-grid mask-fade-edges opacity-50" aria-hidden />

      <div className="mx-auto max-w-[1280px] px-6">
        <div className="text-center max-w-[640px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
            className="font-display font-semibold tracking-[-0.03em] leading-[1.02] text-balance text-d2"
          >
            Trace every run,{" "}
            <span className="text-flux-green">end to end.</span>
          </motion.h2>
          <p className="mt-md text-base text-text-secondary text-pretty">
            Token streams, tool calls, latency, cost — per block, per execution.
            Replay any run from any node.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease }}
          className="mt-2xl relative rounded-card-lg border border-ink-line bg-ink-surface/50 backdrop-blur-sm overflow-hidden"
        >
          {/* Top header strip */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-ink-line">
            <div className="flex items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-flux-green animate-status" />
              <span className="text-2xs text-text-secondary">runtime · us-east-1</span>
            </div>
            <div className="hidden sm:flex items-center gap-5 text-2xs text-text-tertiary num-tabular">
              <span>nodes <span className="text-text-primary">{nodes.filter((n) => !n.id.startsWith("d")).length}</span></span>
              <span>edges <span className="text-text-primary">{edges.length}</span></span>
              <span>throughput <span className="text-flux-green">2.4k/s</span></span>
              <span>p95 <span className="text-text-primary">28ms</span></span>
            </div>
          </div>

          {/* Main canvas with side panels */}
          <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_220px]">
            {/* Workflow canvas */}
            <div className="relative aspect-[1400/780] md:aspect-[1400/460] bg-dot md:border-r border-ink-line">
              {/* Lane separators — subtle horizontal dividers */}
              <div className="absolute inset-x-0 top-[33%] h-px bg-ink-line/40" aria-hidden />
              <div className="absolute inset-x-0 top-[66%] h-px bg-ink-line/40" aria-hidden />

              <svg
                viewBox="0 0 1400 460"
                className="absolute inset-0 size-full"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden
              >
                <defs>
                  <linearGradient id="edgeCyan" x1="0" x2="1">
                    <stop offset="0" stopColor="#22D3EE" stopOpacity="0.8" />
                    <stop offset="1" stopColor="#00FF66" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="edgeGreen" x1="0" x2="1">
                    <stop offset="0" stopColor="#00FF66" stopOpacity="0.7" />
                    <stop offset="1" stopColor="#A3FF12" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="edgeYellow" x1="0" x2="1">
                    <stop offset="0" stopColor="#A3FF12" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#FFD400" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="edgeMid" x1="0" x2="1">
                    <stop offset="0" stopColor="#FFD400" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#A855F7" stopOpacity="0.55" />
                  </linearGradient>
                  <linearGradient id="edgePink" x1="0" x2="1">
                    <stop offset="0" stopColor="#A855F7" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#FF4DCC" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {edges.map((e, i) => {
                  const from = nodeMap.get(e.from)!;
                  const to = nodeMap.get(e.to)!;
                  const d = edgePath(from, to);
                  return (
                    <g key={`${e.from}-${e.to}-${i}`}>
                      <motion.path
                        d={d}
                        stroke={e.color}
                        strokeWidth={1.4}
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 1.2, delay: 0.4 + e.delay * 0.3, ease }}
                      />
                      <circle r={2.5} fill="white">
                        <animateMotion dur="3s" repeatCount="indefinite" begin={`${1.6 + e.delay * 0.2}s`} path={d} />
                      </circle>
                    </g>
                  );
                })}

                {/* Column labels at the top of each layer (faint) */}
                {[
                  { x: 96, label: "INPUT" },
                  { x: 306, label: "EMBED" },
                  { x: 568, label: "ROUTE" },
                  { x: 816, label: "TOOLS" },
                  { x: 1038, label: "VALIDATE" },
                  { x: 1262, label: "OUTPUT" },
                ].map((c) => (
                  <text
                    key={c.label}
                    x={c.x}
                    y={20}
                    fill="rgba(255,255,255,0.18)"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="var(--font-sans)"
                    textAnchor="start"
                    letterSpacing="0.1em"
                  >
                    {c.label}
                  </text>
                ))}
              </svg>

              {/* Nodes */}
              {nodes.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.02, ease }}
                  className="absolute"
                  style={{ left: `${(n.x / 1400) * 100}%`, top: `${(n.y / 460) * 100}%` }}
                >
                  <Block color={n.color} size={n.size} radius="block-lg" glow={n.glow} />
                  {n.label && (
                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-[18px] text-[10px] font-medium text-text-tertiary whitespace-nowrap tracking-wider">
                      {n.label}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Side panel — mini event log + queue depth */}
            <aside className="hidden lg:flex flex-col bg-ink/30">
              {/* Live events */}
              <div className="flex-1 p-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xs font-semibold text-text-secondary">Live events</span>
                  <div className="flex items-center gap-1">
                    <span className="size-1 rounded-full bg-flux-green animate-status" />
                    <span className="text-2xs text-text-tertiary num-tabular">2.4k/s</span>
                  </div>
                </div>
                <ol className="space-y-2.5">
                  {events.map((e, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 1 + i * 0.15, ease }}
                      className="flex items-start gap-2"
                    >
                      <span
                        className="size-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: e.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-text-tertiary num-tabular">{e.ts}</div>
                        <div className="text-2xs text-text-secondary truncate">{e.label}</div>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>

              {/* Queue depth bars */}
              <div className="border-t border-ink-line p-md">
                <div className="text-2xs font-semibold text-text-secondary mb-2.5">Queue depth</div>
                <div className="space-y-2">
                  {[
                    { l: "ingest",   v: 84, color: "#22D3EE" },
                    { l: "embed",    v: 64, color: "#00FF66" },
                    { l: "agent",    v: 92, color: "#A3FF12" },
                    { l: "memory",   v: 38, color: "#A855F7" },
                  ].map((q) => (
                    <div key={q.l}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-text-tertiary">{q.l}</span>
                        <span className="text-[10px] text-text-secondary num-tabular">{q.v}%</span>
                      </div>
                      <div className="h-0.5 rounded-full bg-ink-line overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${q.v}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 1.5, ease }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: q.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-ink-line">
            <span className="text-2xs text-text-tertiary num-tabular">trace · 2026-04-29 14:22:08.412</span>
            <span className="text-2xs text-flux-green num-tabular">→ 2,481 events / sec</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
