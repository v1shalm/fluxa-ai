"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

// ─── Cards + their origin circles on the polygon path ─────────────────────

type Card = {
  id: string;
  Icon: React.FC<IconProps>;
  title: string;
  body: string;
  hex: string;
  bgClass: string;
  // Position of the originating circle, in % of the 800x360 container
  circle: { x: number; y: number };
  blockColor: "cyan" | "green" | "lime" | "yellow" | "pink" | "purple";
};

type IconProps = { size?: number };

const IconBlocks: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const IconShip: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 16l7-7 7 7" /><path d="M12 9v12" /><path d="M5 4h14" />
  </svg>
);
const IconConnect: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="9" width="6" height="6" rx="1.5" />
    <rect x="16" y="9" width="6" height="6" rx="1.5" />
    <path d="M8 12h8" />
  </svg>
);
const IconAgent: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="6" width="16" height="12" rx="3" />
    <circle cx="9" cy="12" r="1.25" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="1.25" fill="currentColor" stroke="none" />
    <path d="M12 2v4" />
  </svg>
);
const IconObserve: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
  </svg>
);
const IconShield: React.FC<IconProps> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

// 6 cards, 6 circles distributed around the polygon path.
// Polygon vertex coordinates (from the dashed path's `d` attribute, viewBox 800x360):
//  (80,60)  (220,30)  (380,50)  (540,25)  (720,70)  (760,180)
//  (700,290) (540,320) (380,305) (220,330) (70,290)  (40,180)
// Selected 6 well-distributed vertices for the circles.
const cards: Card[] = [
  {
    id: "canvas",
    Icon: IconBlocks,
    title: "A canvas, not a notebook.",
    body: "Wire blocks visually - but the artefact is a typed .ts file you can diff.",
    hex: "#22D3EE",
    bgClass: "bg-flux-cyan/15",
    circle: { x: 10, y: 16.7 }, // (80, 60)
    blockColor: "cyan",
  },
  {
    id: "deploy",
    Icon: IconShip,
    title: "Idea to production in 5 minutes.",
    body: "Not 5 weeks. fluxa deploy --env prod ships a versioned, observable API.",
    hex: "#00FF66",
    bgClass: "bg-flux-green/15",
    circle: { x: 90, y: 19.4 }, // (720, 70)
    blockColor: "green",
  },
  {
    id: "multimodel",
    Icon: IconConnect,
    title: "Three providers, one workflow.",
    body: "Anthropic, OpenAI, open-weights via vLLM. Swap models in a click - the contract holds.",
    hex: "#A3FF12",
    bgClass: "bg-flux-lime/15",
    circle: { x: 95, y: 50 }, // (760, 180)
    blockColor: "lime",
  },
  {
    id: "agents",
    Icon: IconAgent,
    title: "Agents that remember.",
    body: "Persistent memory, tool calls, multi-turn — no scaffolding to write.",
    hex: "#A855F7",
    bgClass: "bg-flux-purple/20",
    circle: { x: 87.5, y: 80.6 }, // (700, 290)
    blockColor: "purple",
  },
  {
    id: "observable",
    Icon: IconObserve,
    title: "Every run, replayable.",
    body: "Token streams, latency, cost — per block. Replay any execution from any node.",
    hex: "#FFD400",
    bgClass: "bg-flux-yellow/15",
    circle: { x: 8.75, y: 80.6 }, // (70, 290)
    blockColor: "yellow",
  },
  {
    id: "secure",
    Icon: IconShield,
    title: "Your VPC, your data, your rules.",
    body: "Self-host the runtime in AWS, GCP, or on-prem. SOC 2, HIPAA-ready.",
    hex: "#FF4DCC",
    bgClass: "bg-flux-pink/15",
    circle: { x: 5, y: 50 }, // (40, 180)
    blockColor: "pink",
  },
];

// Container is 800px × 360px at full size; center is (400, 180) → (50%, 50%)
// Per-card offset from card center to its circle (in container px @ full size).
function getOriginPx(circle: { x: number; y: number }) {
  // Convert from % (0-100) of 800x360 to px offset from center
  return {
    x: (circle.x / 100) * 800 - 400,
    y: (circle.y / 100) * 360 - 180,
  };
}

// ─── Dashed polygon — drawn once, then dashes march continuously ──────────

function DashedFrame({ accentHex }: { accentHex: string }) {
  return (
    <motion.svg
      className="absolute inset-0 size-full"
      viewBox="0 0 800 360"
      preserveAspectRatio="none"
      aria-hidden
      animate={{ rotate: [0, 0.4, 0, -0.4, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      style={{ originX: 0.5, originY: 0.5 }}
    >
      <motion.path
        d="M 80 60 L 220 30 L 380 50 L 540 25 L 720 70 L 760 180 L 700 290 L 540 320 L 380 305 L 220 330 L 70 290 L 40 180 Z"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1"
        strokeDasharray="4 6"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 2, ease }}
      />
      <motion.path
        d="M 80 60 L 220 30 L 380 50 L 540 25 L 720 70 L 760 180 L 700 290 L 540 320 L 380 305 L 220 330 L 70 290 L 40 180 Z"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1"
        strokeDasharray="4 6"
        fill="none"
        animate={{ strokeDashoffset: [0, -100] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner polygon — tints with the active card's accent */}
      <motion.path
        d="M 90 76 L 215 44 L 372 64 L 538 38 L 712 84 L 752 178 L 690 282 L 542 308 L 374 296 L 220 320 L 80 280 L 52 180 Z"
        strokeWidth="1"
        strokeDasharray="3 5"
        fill="none"
        opacity="0.55"
        animate={{ stroke: accentHex }}
        transition={{ duration: 0.6, ease }}
        style={{ stroke: accentHex }}
      />
      <motion.path
        d="M 90 76 L 215 44 L 372 64 L 538 38 L 712 84 L 752 178 L 690 282 L 542 308 L 374 296 L 220 320 L 80 280 L 52 180 Z"
        strokeWidth="1"
        strokeDasharray="3 5"
        fill="none"
        opacity="0.4"
        animate={{ strokeDashoffset: [0, 80], stroke: accentHex }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ stroke: accentHex }}
      />
    </motion.svg>
  );
}

// ─── Inline pill that sits inside the headline ────────────────────────────

function InlineLatencyBadge() {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: 0.35, ease }}
      style={{ verticalAlign: "0.05em" }}
      className="inline-flex items-baseline gap-2 align-middle px-3 py-1 rounded-full bg-ink-surface border border-flux-green/40 mx-1"
    >
      <span className="relative flex size-2">
        <span className="absolute inset-0 rounded-full bg-flux-green animate-status" />
        <span className="absolute inset-0 rounded-full bg-flux-green opacity-50 animate-ping" />
      </span>
      <motion.span
        className="font-sans font-semibold text-flux-green num-tabular tracking-normal"
        style={{ fontSize: "0.42em", lineHeight: 1 }}
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        2.4ms
      </motion.span>
      <span className="flex gap-0.5" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="size-1 rounded-full bg-flux-green"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
          />
        ))}
      </span>
    </motion.span>
  );
}

// ─── Circle marker on the polygon path — clickable, glows when active ─────

function PathCircle({
  card,
  isActive,
  onClick,
}: {
  card: Card;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Show ${card.title}`}
      className="absolute -translate-x-1/2 -translate-y-1/2 group inline-flex items-center justify-center size-10 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      style={{ left: `${card.circle.x}%`, top: `${card.circle.y}%` }}
    >
      {/* Active state — expanding ring pulse */}
      {isActive && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            style={{ backgroundColor: card.hex }}
          />
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: [1, 3.2, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
            style={{ backgroundColor: card.hex }}
          />
        </>
      )}

      {/* Circle itself — animated size + glow */}
      <motion.span
        className="block rounded-full relative"
        animate={{
          width: isActive ? 18 : 10,
          height: isActive ? 18 : 10,
          opacity: isActive ? 1 : 0.55,
          boxShadow: isActive
            ? `0 0 24px 4px ${card.hex}AA, 0 0 0 2px ${card.hex}40`
            : `0 0 0 0 ${card.hex}00`,
        }}
        transition={{ duration: 0.55, ease }}
        style={{ backgroundColor: card.hex }}
      />
    </button>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────

const ROTATE_INTERVAL = 3800;

export function Concept() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % cards.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  const card = cards[activeIdx];
  const origin = getOriginPx(card.circle);

  return (
    <section className="relative py-section overflow-hidden">
      <div className="relative mx-auto w-full max-w-[2240px] px-6 md:px-10 lg:px-20 xl:px-[160px] text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="font-display font-semibold tracking-[-0.04em] leading-[1.02] text-balance text-d2"
        >
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="block"
          >
            AI workflows <InlineLatencyBadge /> you can
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="block"
          >
            actually ship to production.
          </motion.span>
        </motion.h2>

        <div
          className="relative mt-2xl mx-auto max-w-[800px] aspect-[800/360]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <DashedFrame accentHex={card.hex} />

          {/* Path circles — each is a card's origin point + clickable indicator */}
          {cards.map((c, i) => (
            <PathCircle
              key={c.id}
              card={c}
              isActive={i === activeIdx}
              onClick={() => setActiveIdx(i)}
            />
          ))}

          {/* Animated connector line — from active circle to card center */}
          <svg
            className="absolute inset-0 size-full pointer-events-none"
            viewBox="0 0 800 360"
            preserveAspectRatio="none"
            aria-hidden
          >
            <motion.line
              key={`line-${activeIdx}`}
              x1={(card.circle.x / 100) * 800}
              y1={(card.circle.y / 100) * 360}
              x2={400}
              y2={180}
              stroke={card.hex}
              strokeWidth="1"
              strokeDasharray="2 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
            />
          </svg>

          {/* Card — emerges from the active circle's position, settles at center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(440px,calc(100%-80px))]">
            <AnimatePresence mode="wait">
              <motion.div
                key={card.id}
                initial={{
                  x: origin.x,
                  y: origin.y,
                  scale: 0,
                  opacity: 0,
                  filter: "blur(8px)",
                }}
                animate={{
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  scale: 0.4,
                  opacity: 0,
                  filter: "blur(6px)",
                  transition: { duration: 0.35, ease },
                }}
                transition={{ duration: 0.7, ease }}
                className="rounded-[20px] border border-white/10 bg-[#121212] p-4 shadow-2xl relative overflow-hidden"
                style={{ 
                  transformOrigin: "center center",
                  boxShadow: `0 0 40px -10px ${card.hex}20, 0 10px 25px -5px rgba(0,0,0,0.5)`
                }}
              >
                {/* Subtle accent glow */}
                <div 
                  className="absolute -top-10 -right-10 size-20 blur-[30px] opacity-20 pointer-events-none"
                  style={{ background: card.hex }}
                />

                <motion.div
                  animate={{ y: [-1, 1, -1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-4 text-left relative z-10"
                >
                  <div
                    className={`size-11 rounded-[12px] inline-flex items-center justify-center shrink-0 shadow-inner border border-white/5`}
                    style={{ 
                      backgroundColor: `${card.hex}15`,
                      color: card.hex 
                    }}
                  >
                    {(() => {
                      const Icon = card.Icon;
                      return <Icon size={20} />;
                    })()}
                  </div>
                  <div className="min-w-0 pr-2">
                    <div className="text-base font-bold text-text-primary tracking-tight leading-tight mb-0.5">
                      {card.title}
                    </div>
                    <div className="text-sm text-text-secondary leading-normal opacity-80">
                      {card.body}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
