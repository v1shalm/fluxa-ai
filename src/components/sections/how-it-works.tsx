"use client";

import { motion } from "framer-motion";
import { Block } from "@/components/primitives/block";

const ease = [0.16, 1, 0.3, 1] as const;

const steps = [
  {
    n: "01",
    nodeColor: "cyan" as const,
    title: "Add blocks",
    body: "Drop primitives onto the canvas — inputs, models, tools, branches, outputs. Each block is typed and inspectable.",
  },
  {
    n: "02",
    nodeColor: "green" as const,
    title: "Connect logic",
    body: "Wire data and decisions between blocks. Branch on output, retry on failure, loop on collections — all visual.",
  },
  {
    n: "03",
    nodeColor: "pink" as const,
    title: "Run + deploy",
    body: "Test in real time, then ship to staging or production with one command. Versioned, observable, rollback-ready.",
  },
];

const colorHex = { cyan: "#22D3EE", green: "#00FF66", pink: "#FF4DCC" } as const;

export function HowItWorks() {
  return (
    <section className="py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Heading row — left-aligned, restrained. */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-20">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease }}
              className="font-display font-semibold tracking-[-0.035em] leading-[0.95] text-balance max-w-[820px] text-d2"
            >
              Three steps. <span className="text-text-tertiary">No glue code, no rewrites,</span> no surprises.
            </motion.h2>
          </div>
          <div className="hidden md:flex items-center gap-2 caption text-text-tertiary">
            <span>est. time</span>
            <span className="text-text-primary">02:04</span>
          </div>
        </div>

        {/* Workflow strip — single composition with three nodes connected by flowing lines. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="relative"
        >
          {/* Top: nodes + connectors row */}
          <div className="relative h-[120px] md:h-[140px]">
            {/* Connector lines (between nodes) */}
            <svg
              className="absolute inset-0 size-full pointer-events-none"
              viewBox="0 0 1000 140"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="conn1" x1="0" x2="1">
                  <stop offset="0" stopColor="#22D3EE" />
                  <stop offset="1" stopColor="#00FF66" />
                </linearGradient>
                <linearGradient id="conn2" x1="0" x2="1">
                  <stop offset="0" stopColor="#00FF66" />
                  <stop offset="1" stopColor="#FF4DCC" />
                </linearGradient>
              </defs>
              <motion.line
                x1="220" y1="70" x2="450" y2="70"
                stroke="url(#conn1)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.9, delay: 0.3, ease }}
              />
              <motion.line
                x1="550" y1="70" x2="780" y2="70"
                stroke="url(#conn2)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.9, delay: 0.55, ease }}
              />
              {/* Traveling dots */}
              <motion.circle r="3" fill="white">
                <animateMotion dur="2.6s" repeatCount="indefinite" begin="1.4s"
                  path="M 220 70 L 450 70" />
              </motion.circle>
              <motion.circle r="3" fill="white">
                <animateMotion dur="2.6s" repeatCount="indefinite" begin="1.6s"
                  path="M 550 70 L 780 70" />
              </motion.circle>
            </svg>

            {/* Three nodes */}
            <div className="absolute inset-0 grid grid-cols-3">
              {steps.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.55, delay: 0.15 + i * 0.18, ease }}
                  className="flex items-center justify-center"
                >
                  <div className="relative">
                    {/* Number above */}
                    <span
                      className="absolute -top-7 left-1/2 -translate-x-1/2 caption whitespace-nowrap"
                      style={{ color: colorHex[s.nodeColor] }}
                    >
                      step {s.n}
                    </span>
                    <Block color={s.nodeColor} size={64} radius="card" glow />
                    {/* Pulse ring */}
                    <motion.span
                      className="absolute inset-0 rounded-[14px] pointer-events-none"
                      style={{ boxShadow: `0 0 0 0 ${colorHex[s.nodeColor]}` }}
                      animate={{
                        boxShadow: [
                          `0 0 0 0 ${colorHex[s.nodeColor]}55`,
                          `0 0 0 14px ${colorHex[s.nodeColor]}00`,
                        ],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        delay: i * 0.7,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Below: descriptions row, aligned to nodes */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease }}
                className="md:text-center md:max-w-[280px] md:mx-auto"
              >
                <h3 className="text-[24px] md:text-[26px] font-semibold tracking-[-0.02em] text-balance">
                  {s.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.55] text-text-secondary text-pretty">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
