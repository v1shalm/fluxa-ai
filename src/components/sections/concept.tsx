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
  // The pill's font-size is set in em so the entire badge — text, status dot,
  // progress dots, padding, gap — scales proportionally with whatever heading
  // size it's nested in. items-center vertically centers all three children.
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: 0.35, ease }}
      className="inline-flex items-center align-middle rounded-full bg-ink-surface border border-flux-green/40"
      style={{
        fontSize: "0.36em",
        gap: "0.5em",
        padding: "0.35em 0.8em",
        marginInline: "0.2em",
        verticalAlign: "0.12em",
      }}
    >
      {/* Status dot — sized in em so it tracks the badge's font-size */}
      <span
        className="relative inline-block shrink-0"
        style={{ width: "0.7em", height: "0.7em" }}
      >
        <span className="absolute inset-0 rounded-full bg-flux-green animate-status" />
        <span className="absolute inset-0 rounded-full bg-flux-green opacity-50 animate-ping" />
      </span>

      {/* Reading at 1em — i.e. the badge's font-size. */}
      <motion.span
        className="font-sans font-semibold text-flux-green num-tabular leading-none"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        2.4ms
      </motion.span>

      {/* Progress dots — also em-scaled, kept proportional to the text */}
      <span className="inline-flex shrink-0" style={{ gap: "0.18em" }} aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="rounded-full bg-flux-green"
            style={{ width: "0.32em", height: "0.32em" }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
          />
        ))}
      </span>
    </motion.span>
  );
}

// ─── Hex marker on the polygon path — clickable. No pulsing rings, no soft
//     glow. Active = larger filled hexagon plus a thin concentric outline a
//     bit further out (a discrete ring, not a halo). ─────────────────────

// Pointy-top regular hexagon vertices on a unit circle.
const HEX_POINTS = "0,-1 0.866,-0.5 0.866,0.5 0,1 -0.866,0.5 -0.866,-0.5";

function PathHex({
  card,
  isActive,
  onClick,
}: {
  card: Card;
  isActive: boolean;
  onClick: () => void;
}) {
  const size = isActive ? 22 : 14;
  return (
    <button
      onClick={onClick}
      aria-label={`Show ${card.title}`}
      aria-pressed={isActive}
      className="absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center size-10 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      style={{ left: `${card.circle.x}%`, top: `${card.circle.y}%` }}
    >
      <motion.svg
        viewBox="-1.4 -1.4 2.8 2.8"
        initial={false}
        animate={{
          width: size,
          height: size,
          opacity: isActive ? 1 : 0.6,
        }}
        transition={{ duration: 0.4, ease }}
        aria-hidden
      >
        {/* Filled hex — the dot itself */}
        <polygon
          points={HEX_POINTS}
          fill={card.hex}
          stroke={card.hex}
          strokeWidth={0.08}
          strokeLinejoin="round"
        />
        {/* Outline ring on active — discrete, not a glow */}
        {isActive && (
          <motion.polygon
            points={HEX_POINTS}
            fill="none"
            stroke={card.hex}
            strokeWidth={0.08}
            strokeLinejoin="round"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1.55, opacity: 0.45 }}
            transition={{ duration: 0.4, ease }}
            style={{ transformOrigin: "center" }}
          />
        )}
      </motion.svg>
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
          className="relative mt-2xl mx-auto max-w-[1040px] aspect-[1040/440]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <DashedFrame accentHex={card.hex} />

          {/* Path circles — each is a card's origin point + clickable indicator */}
          {cards.map((c, i) => (
            <PathHex
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
                className="rounded-[14px] border border-white/[0.08] bg-ink-surface/95 px-5 py-4 lg:px-6 lg:py-5 relative text-left"
                style={{
                  transformOrigin: "center center",
                  boxShadow:
                    "0 24px 56px -28px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                {/* Eyebrow — small mono index in the active accent */}
                <span
                  className="text-[10px] uppercase tracking-[0.2em] num-tabular"
                  style={{ color: card.hex }}
                >
                  {String(activeIdx + 1).padStart(2, "0")} / 06
                </span>

                <h3 className="mt-2 font-display font-semibold text-text-primary tracking-[-0.02em] leading-[1.18] text-balance text-[18px] lg:text-[19px]">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-[1.55] text-text-secondary text-pretty">
                  {card.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
