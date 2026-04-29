"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

// ─── Shared Fluxa Icon ──────────────────────────────────────────────────────

function FluxaSparkIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 1.5,
      }}
    >
      <div className="rounded-[2px] bg-flux-cyan" />
      <div className="rounded-[2px] bg-flux-green" />
      <div className="rounded-[2px] bg-flux-purple" />
      <div className="rounded-[2px] bg-flux-pink" />
    </div>
  );
}

// ── Cell 1: AI Agents — Animated live-processing pipeline ─────────────────
// Shows an agent processing pipeline with animated data flowing through nodes
function AgentNotifications() {
  return (
    <div className="relative h-full min-h-[320px] w-full flex items-center justify-center">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 80% at 55% 50%, rgba(34,211,238,0.06), transparent 70%)",
        }}
        aria-hidden
      />

      {/* Pipeline visualization */}
      <div className="relative w-full max-w-[460px] px-4">
        {/* Connecting line with flowing animation */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 460 280" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
              <stop offset="30%" stopColor="#22D3EE" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#00FF66" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#A3FF12" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#A3FF12" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Flow paths connecting nodes */}
          <motion.path
            d="M 80 60 C 150 60, 170 140, 230 140 C 290 140, 310 220, 380 220"
            stroke="url(#flowGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          {/* Animated particle along the path */}
          <motion.circle
            r="3"
            fill="#22D3EE"
            filter="drop-shadow(0 0 6px rgba(34,211,238,0.8))"
            animate={{
              cx: [80, 120, 170, 230, 290, 340, 380],
              cy: [60, 60, 100, 140, 180, 210, 220],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            r="2"
            fill="#00FF66"
            filter="drop-shadow(0 0 4px rgba(0,255,102,0.6))"
            animate={{
              cx: [80, 120, 170, 230, 290, 340, 380],
              cy: [60, 60, 100, 140, 180, 210, 220],
            }}
            transition={{
              duration: 3,
              delay: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* Node 1: Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="absolute left-[6%] top-[8%] w-[140px]"
        >
          <div className="rounded-[14px] bg-ink-surface/90 backdrop-blur-sm border border-ink-line p-3 shadow-lift">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-2 rounded-full bg-flux-cyan animate-pulse" />
              <span className="text-2xs font-semibold text-flux-cyan uppercase tracking-wider">Incoming</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="size-1 rounded-full bg-text-tertiary" />
                customer_query
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="size-1 rounded-full bg-text-tertiary" />
                billing_event
              </div>
            </div>
          </div>
        </motion.div>

        {/* Node 2: Processing (center) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
          className="absolute left-[33%] top-[38%] w-[160px]"
        >
          <div className="rounded-[14px] bg-ink-surface border border-flux-cyan/30 p-3.5 shadow-[0_0_30px_-6px_rgba(34,211,238,0.25),0_8px_20px_-4px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="size-8 rounded-[8px] bg-ink inline-flex items-center justify-center border border-ink-line">
                <FluxaSparkIcon size={14} />
              </div>
              <div>
                <div className="text-xs font-semibold text-text-primary">Pricing Agent</div>
                <div className="text-2xs text-flux-green flex items-center gap-1">
                  <motion.span
                    className="inline-block size-1.5 rounded-full bg-flux-green"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  Processing
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div
                className="h-1 rounded-full bg-flux-cyan/60"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
                style={{ maxWidth: "100%" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Node 3: Output */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6, ease }}
          className="absolute right-[4%] bottom-[8%] w-[150px]"
        >
          <div className="rounded-[14px] bg-ink-surface/90 backdrop-blur-sm border border-ink-line p-3 shadow-lift">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-2 rounded-full bg-flux-green" />
              <span className="text-2xs font-semibold text-flux-green uppercase tracking-wider">Resolved</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Queries</span>
                <span className="text-text-primary font-medium num-tabular">12</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Accuracy</span>
                <span className="text-flux-green font-medium num-tabular">94%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Cell 2: Integrations — Orbiting logo ring ─────────────────────────────
// Animated ring of integrations orbiting around a central Fluxa icon
function IntegrationsMock() {
  const integrations = [
    { label: "Stripe", color: "#635BFF" },
    { label: "PD", color: "#25C281" },
    { label: "GH", color: "#F0F0F0" },
    { label: "Sage", color: "#00DC82" },
    { label: "QB", color: "#2CA01C" },
    { label: "Mail", color: "#EA4335" },
  ];

  return (
    <div className="relative h-full min-h-[240px] w-full flex items-center justify-center py-6">
      {/* Orbit ring (decorative) */}
      <motion.div
        className="absolute rounded-full border border-ink-line/30"
        style={{ width: 200, height: 200 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        aria-hidden
      />
      <motion.div
        className="absolute rounded-full border border-ink-line/15"
        style={{ width: 260, height: 260 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        aria-hidden
      />

      {/* Subtle radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 180,
          height: 180,
          background: "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)",
        }}
        aria-hidden
      />

      {/* Central Fluxa icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2, ease }}
        className="relative z-10 size-16 rounded-[16px] bg-ink-surface border border-flux-purple/40 inline-flex items-center justify-center shadow-[0_0_40px_-4px_rgba(168,85,247,0.4),0_8px_28px_-4px_rgba(0,0,0,0.5)]"
      >
        <FluxaSparkIcon size={24} />
      </motion.div>

      {/* Orbiting integration chips */}
      {integrations.map((int, i) => {
        const angle = (360 / integrations.length) * i;
        const radius = 110;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={int.label}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease }}
            className="absolute z-10"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <motion.div
              animate={{ y: [0, -4, 0, 4, 0] }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              className="size-11 rounded-[12px] bg-ink-surface border border-ink-line inline-flex items-center justify-center shadow-lift cursor-default"
            >
              <span
                className="text-[10px] font-bold"
                style={{ color: int.color }}
              >
                {int.label}
              </span>
            </motion.div>

            {/* Connection line to center */}
            <svg
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{
                width: Math.abs(x) + 20,
                height: Math.abs(y) + 20,
                transform: `translate(${x > 0 ? '-100%' : '0'}, ${y > 0 ? '-100%' : '0'})`,
                opacity: 0.15,
              }}
              aria-hidden
            >
              <line
                x1={x > 0 ? "100%" : "0"}
                y1={y > 0 ? "100%" : "0"}
                x2={x > 0 ? "0" : "100%"}
                y2={y > 0 ? "0" : "100%"}
                stroke={int.color}
                strokeWidth="0.5"
                strokeDasharray="4 4"
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Cell 3: Document parsing — Animated scan effect ───────────────────────
// Shows a document being scanned with a laser line extracting data fields
function ContractMock() {
  return (
    <div className="relative h-full min-h-[240px] w-full flex items-center justify-center py-4 px-4 overflow-hidden">
      {/* Background contract mockup */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="relative w-full max-w-[400px] rounded-[14px] bg-ink-surface/40 border border-ink-line/50 p-5 overflow-hidden"
      >
        {/* Animated scan line */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] pointer-events-none z-20"
          style={{
            background: "linear-gradient(90deg, transparent, #22D3EE 20%, #00FF66 50%, #22D3EE 80%, transparent)",
            boxShadow: "0 0 20px 4px rgba(34,211,238,0.3), 0 0 60px 8px rgba(34,211,238,0.1)",
          }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-hidden
        />

        {/* Document header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-[6px] bg-ink-line/60 inline-flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M4 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.2" className="text-text-tertiary" />
                <path d="M5 6h6M5 8.5h4M5 11h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-text-tertiary" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-text-secondary">Service Agreement</span>
          </div>
          <span className="text-2xs text-text-tertiary">.pdf</span>
        </div>

        {/* Fake document lines */}
        <div className="space-y-2.5 mb-5">
          <div className="h-[6px] w-[85%] rounded-full bg-ink-line/30" />
          <div className="h-[6px] w-[70%] rounded-full bg-ink-line/30" />
          <div className="h-[6px] w-[92%] rounded-full bg-ink-line/30" />
          <div className="h-[6px] w-[60%] rounded-full bg-ink-line/30" />
        </div>

        {/* Extracted fields — appear one by one */}
        <div className="space-y-2">
          {[
            { label: "Customer", value: "Fluxon Inc.", delay: 0.4 },
            { label: "Amount", value: "$24,500.00", delay: 0.7 },
            { label: "Term", value: "12 months", delay: 1.0 },
          ].map((field) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: field.delay, ease }}
              className="flex items-center justify-between px-3 py-2 rounded-[10px] bg-flux-cyan/5 border border-flux-cyan/20"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: field.delay }}
                >
                  <FluxaSparkIcon size={10} />
                </motion.div>
                <span className="text-2xs text-text-tertiary uppercase tracking-wider">{field.label}</span>
              </div>
              <span className="text-xs font-medium text-text-primary num-tabular">{field.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Bottom status */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.4, ease }}
          className="mt-3 flex items-center gap-2 text-2xs text-flux-green"
        >
          <motion.div
            className="size-1.5 rounded-full bg-flux-green"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          3 fields extracted · 99.2% confidence
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Cell config ───────────────────────────────────────────────────────────

type Cell = {
  Mock: React.FC;
  span: string;
  layout: "horizontal" | "vertical";
  title: string;
  body: string;
  cta: string;
};

const cells: Cell[] = [
  {
    Mock: AgentNotifications,
    span: "lg:col-span-12",
    layout: "horizontal",
    title: "Scale agents that don't sleep.",
    body: "Let Fluxa agents handle classification, tool calls, and follow-ups while your team focuses on higher-value work.",
    cta: "Explore AI Agents",
  },
  {
    Mock: IntegrationsMock,
    span: "lg:col-span-6",
    layout: "vertical",
    title: "Connect everything you already use.",
    body: "Fluxa wires into your stack — logs, queues, models, billing — so workflows reach the data they need.",
    cta: "Browse integrations",
  },
  {
    Mock: ContractMock,
    span: "lg:col-span-6",
    layout: "vertical",
    title: "Ingest documents automatically.",
    body: "Eliminate manual entry. Fluxa AI captures terms directly from your signed contracts to generate structured outputs.",
    cta: "AI document parsing",
  },
];

// ─── Section ───────────────────────────────────────────────────────────────

export function UseCases() {
  return (
    <section id="use-cases" className="py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease }}
          className="font-display font-semibold tracking-[-0.03em] leading-[1.02] text-balance max-w-[820px] text-d2 mb-2xl"
        >
          Five primitives. <span className="text-text-tertiary">Infinite shapes.</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {cells.map((cell, i) => (
            <motion.article
              key={cell.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className={`group relative rounded-card-lg border border-ink-line bg-[#0E0E0E] overflow-hidden ${cell.span}`}
            >
              {cell.layout === "horizontal" ? (
                // Featured wide cell — text left, mock right
                <div className="grid lg:grid-cols-[minmax(280px,1fr)_minmax(0,1.3fr)] gap-md p-6 lg:p-8 min-h-[400px]">
                  <div className="flex flex-col justify-between">
                    <h3 className="font-display font-semibold tracking-[-0.025em] leading-[1.05] text-text-primary text-d3 max-w-[360px]">
                      {cell.title}
                    </h3>
                    <div>
                      <p className="text-base text-text-secondary text-pretty max-w-[400px]">
                        {cell.body}
                      </p>
                      <a
                        href="#explore"
                        className="mt-md inline-flex items-center gap-2.5 group/cta"
                      >
                        <span className="size-7 rounded-full border border-ink-line inline-flex items-center justify-center text-text-secondary group-hover/cta:bg-flux-cyan/10 group-hover/cta:border-flux-cyan/40 group-hover/cta:text-flux-cyan transition-colors">
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6h7M6.5 2.5L10 6 6.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="text-sm font-medium text-text-primary">{cell.cta}</span>
                      </a>
                    </div>
                  </div>
                  <div className="relative lg:min-h-[320px]">
                    <cell.Mock />
                  </div>
                </div>
              ) : (
                // Standard cell — mock on top, text below
                <div className="flex flex-col h-full min-h-[420px]">
                  <div className="flex-1 min-h-0 relative">
                    <cell.Mock />
                  </div>
                  <div className="p-6 lg:p-7 border-t border-ink-line/50">
                    <h3 className="font-display font-semibold tracking-[-0.02em] leading-[1.1] text-text-primary text-h1 max-w-[400px]">
                      {cell.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary text-pretty max-w-[440px]">
                      {cell.body}
                    </p>
                    <a
                      href="#explore"
                      className="mt-md inline-flex items-center gap-2.5 group/cta"
                    >
                      <span className="size-7 rounded-full border border-ink-line inline-flex items-center justify-center text-text-secondary group-hover/cta:bg-flux-cyan/10 group-hover/cta:border-flux-cyan/40 group-hover/cta:text-flux-cyan transition-colors">
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6h7M6.5 2.5L10 6 6.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium text-text-primary">{cell.cta}</span>
                    </a>
                  </div>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
