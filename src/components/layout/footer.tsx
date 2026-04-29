"use client";

import { motion } from "framer-motion";
import { GitHubIcon, ArrowRight } from "@/components/primitives/icons";
import { Block } from "@/components/primitives/block";
import { Button } from "@/components/primitives/button";

const ease = [0.16, 1, 0.3, 1] as const;

const cols = [
  {
    label: "Product",
    items: ["Features", "Use Cases", "Pricing", "Changelog", "Roadmap"],
  },
  {
    label: "Resources",
    items: ["Documentation", "API Reference", "Examples", "Community", "Status"],
  },
  {
    label: "Company",
    items: ["About", "Customers", "Blog", "Careers", "Press kit"],
  },
  {
    label: "Legal",
    items: ["Privacy", "Terms", "Security", "DPA", "Subprocessors"],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Top rail — the system bus that closes the page */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.4, ease }}
        className="origin-left h-[6px] w-full"
        style={{
          background:
            "linear-gradient(90deg, #22D3EE 0%, #00FF66 22%, #A3FF12 42%, #FFD400 60%, #FF4DCC 80%, #A855F7 100%)",
        }}
        aria-hidden
      />

      {/* TOP — Bold tagline section */}
      <section className="relative">
        {/* Atmosphere */}
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0,255,102,0.05), transparent 60%)",
          }}
          aria-hidden
        />

        {/* Scattered decorative blocks — float subtly */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ left: "8%", top: "30%" }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <Block color="cyan" size={14} />
        </motion.div>
        <motion.div
          className="absolute pointer-events-none hidden md:block"
          style={{ right: "12%", top: "20%" }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          aria-hidden
        >
          <Block color="green" size={20} radius="block-lg" glow />
        </motion.div>
        <motion.div
          className="absolute pointer-events-none hidden md:block"
          style={{ left: "20%", bottom: "20%" }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          aria-hidden
        >
          <Block color="purple" size={16} />
        </motion.div>
        <motion.div
          className="absolute pointer-events-none"
          style={{ right: "8%", bottom: "30%" }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          aria-hidden
        >
          <Block color="pink" size={18} radius="block-lg" />
        </motion.div>

        <div className="mx-auto max-w-[1200px] px-6 pt-3xl pb-2xl">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-xl lg:gap-2xl items-end">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
              className="font-display font-semibold tracking-[-0.04em] leading-[0.96] text-balance text-d1"
            >
              Build in <span className="text-flux-green">color</span>.
              <br />
              Ship with <span className="text-flux-cyan">clarity</span>.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15, ease }}
              className="flex flex-col gap-md max-w-[400px]"
            >
              <p className="text-base text-text-secondary text-pretty">
                The visual canvas for production AI workflows.
                Free until you&apos;re shipping. Self-hostable when compliance asks.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="lg" href="#start">
                  Start Building
                  <ArrowRight size={14} />
                </Button>
                <Button variant="secondary" size="lg" href="#docs">
                  Read the docs
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MID — Link columns + brand */}
      <section className="border-t border-ink-line">
        <div className="mx-auto max-w-[1200px] px-6 py-2xl grid lg:grid-cols-[1.4fr_3fr] gap-xl lg:gap-2xl">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid grid-cols-2 gap-[2.5px]" aria-hidden>
                <div className="size-2.5 rounded-[2px] bg-flux-cyan" />
                <div className="size-2.5 rounded-[2px] bg-flux-green" />
                <div className="size-2.5 rounded-[2px] bg-flux-purple" />
                <div className="size-2.5 rounded-[2px] bg-flux-pink" />
              </div>
              <span className="text-h3 font-display font-semibold tracking-[-0.02em] text-text-primary">fluxa</span>
            </div>
            <p className="mt-md text-sm text-text-secondary leading-[1.55] max-w-[280px]">
              Visual canvas. Typed runtime. The shortest path from prototype to production AI.
            </p>

            {/* Status row */}
            <div className="mt-md flex items-center gap-3">
              <a
                href="#github"
                className="size-10 inline-flex items-center justify-center rounded-[10px] border border-ink-line text-text-secondary hover:text-text-primary hover:border-text-tertiary transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon size={15} />
              </a>
              <div className="flex items-center gap-2 px-3 h-10 rounded-[10px] bg-ink-surface border border-ink-line">
                <span className="size-1.5 rounded-full bg-flux-green animate-status" />
                <span className="text-2xs text-text-secondary">all systems normal</span>
              </div>
            </div>

            <div className="mt-md text-2xs text-text-tertiary num-tabular">
              v1.0 · build 2481 · 2026
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
            {cols.map((col) => (
              <div key={col.label}>
                <span className="text-2xs font-semibold text-text-secondary uppercase tracking-[0.06em]">
                  {col.label}
                </span>
                <ul className="mt-md space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM — bold filled wordmark + meta row */}
      <section className="relative border-t border-ink-line">
        <div className="mx-auto max-w-[1200px] px-6 pt-md pb-2xs flex flex-wrap items-center justify-between gap-md">
          <p className="text-xs text-text-tertiary">
            © 2026 Fluxa, Inc.
          </p>
          <div className="flex items-center gap-md text-xs text-text-tertiary">
            <a href="#privacy" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#cookies" className="hover:text-text-primary transition-colors">Cookies</a>
          </div>
        </div>

        {/* GIANT solid wordmark with a flowing gradient bar UNDER it (gradient on shape, NOT text) */}
        <div className="relative mt-md select-none pointer-events-none" aria-hidden>
          {/* Animated flowing gradient bar behind/under the wordmark */}
          <div
            className="absolute left-0 right-0 overflow-hidden"
            style={{
              top: "62%",
              height: "6px",
              maskImage: "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: "300%",
                backgroundImage:
                  "linear-gradient(90deg, #22D3EE, #00FF66, #A3FF12, #FFD400, #FF4DCC, #A855F7, #22D3EE, #00FF66, #A3FF12, #FFD400, #FF4DCC, #A855F7, #22D3EE)",
                backgroundSize: "33.333% 100%",
                animation: "footerBarScroll 6s linear infinite",
                opacity: 0.95,
              }}
            />
          </div>
          <style>{`
            @keyframes footerBarScroll {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
          `}</style>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease }}
            className="relative font-display font-semibold tracking-[-0.06em] leading-[0.82] text-center text-text-primary"
            style={{
              fontSize: "clamp(96px, 22vw, 320px)",
              paddingBottom: "0.05em",
            }}
          >
            fluxa
          </motion.div>
        </div>
      </section>
    </footer>
  );
}
