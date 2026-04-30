"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/primitives/button";
import {
  ArrowRight,
  MenuIcon,
  BlockIcon,
  AgentIcon,
  TraceIcon,
  ConnectIcon,
  ChatIcon,
  TerminalIcon,
} from "@/components/primitives/icons";

const ease = [0.16, 1, 0.3, 1] as const;

type ProductItem = {
  Icon: (p: { size?: number; className?: string }) => React.ReactElement;
  title: string;
  desc: string;
  accent: "cyan" | "green" | "lime" | "yellow" | "pink" | "purple";
  href: string;
};

const productItems: ProductItem[] = [
  { Icon: BlockIcon,    title: "Workflow Builder", desc: "Visual canvas for AI workflows",     accent: "cyan",   href: "#builder" },
  { Icon: AgentIcon,    title: "AI Agents",        desc: "Multi-step agents with memory",       accent: "green",  href: "#agents" },
  { Icon: TraceIcon,    title: "Live Tracing",     desc: "Inspect every run, every token",      accent: "lime",   href: "#tracing" },
  { Icon: ChatIcon,     title: "Embedding",        desc: "Drop workflows into any app",         accent: "yellow", href: "#embedding" },
  { Icon: ConnectIcon,  title: "Integrations",     desc: "Connect to your existing stack",      accent: "pink",   href: "#integrations" },
  { Icon: TerminalIcon, title: "Fluxa CLI",        desc: "Ship workflows from your terminal",   accent: "purple", href: "#cli" },
];

// Icon color class — the icon itself carries the accent. No tile, no rail.
const accentText: Record<ProductItem["accent"], string> = {
  cyan:   "text-flux-cyan",
  green:  "text-flux-green",
  lime:   "text-flux-lime",
  yellow: "text-flux-yellow",
  pink:   "text-flux-pink",
  purple: "text-flux-purple",
};

const links = [
  { label: "Product",   href: "#product",    hasMenu: true  },
  { label: "Use Cases", href: "#use-cases",  hasMenu: false },
  { label: "Docs",      href: "#docs",       hasMenu: false },
  { label: "Pricing",   href: "#pricing",    hasMenu: false },
];

function FluxaLogo() {
  return (
    <a href="#top" className="flex items-center gap-2 group h-10 px-2" aria-label="Fluxa home">
      <div className="grid grid-cols-2 gap-[2px]" aria-hidden>
        <div className="size-2 rounded-[2px] bg-flux-cyan transition-colors duration-300 group-hover:bg-flux-green" />
        <div className="size-2 rounded-[2px] bg-flux-green" />
        <div className="size-2 rounded-[2px] bg-flux-purple" />
        <div className="size-2 rounded-[2px] bg-flux-pink transition-colors duration-300 group-hover:bg-flux-yellow" />
      </div>
      <span className="text-h3 font-display font-semibold tracking-[-0.02em] text-text-primary">fluxa</span>
    </a>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleMegaEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => setMegaOpen(true), 80);
  };
  const handleMegaLeave = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => {
      setMegaOpen(false);
      setHoveredItem(null);
    }, 160);
  };

  return (
    // Plain <header>, fixed. NO transform on this element so descendants with
    // `fixed`/`absolute` resolve relative to it (or the viewport) correctly.
    <header className="fixed top-0 inset-x-0 z-50 pt-3 px-6 md:px-10 lg:px-20 xl:px-[160px]">
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className={cn(
          "relative mx-auto max-w-[2240px]",
          "flex items-center justify-between gap-2",
          "py-2 px-4 rounded-[18px]",
          "bg-ink/85 backdrop-blur-xl border border-ink-line",
          "shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]"
        )}
      >
        <FluxaLogo />

        <ul className="hidden md:flex items-center gap-0.5">
          {links.map((link) => {
            const isProduct = link.hasMenu;
            return (
              <li
                key={link.href}
                onMouseEnter={isProduct ? handleMegaEnter : undefined}
                onMouseLeave={isProduct ? handleMegaLeave : undefined}
              >
                <a
                  href={link.href}
                  aria-haspopup={isProduct || undefined}
                  aria-expanded={isProduct ? megaOpen : undefined}
                  className={cn(
                    "h-10 px-3 inline-flex items-center gap-1.5 rounded-[10px]",
                    "text-sm tracking-[-0.005em]",
                    "transition-[background-color,color] duration-150",
                    isProduct && megaOpen
                      ? "bg-white/[0.05] text-text-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/[0.03]"
                  )}
                >
                  {link.label}
                  {isProduct && (
                    <motion.svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      animate={{ rotate: megaOpen ? 180 : 0 }}
                      transition={{ duration: 0.2, ease }}
                      className="opacity-70"
                      aria-hidden
                    >
                      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <a
            href="#login"
            className="hidden sm:inline-flex h-10 px-3 items-center text-sm text-text-secondary hover:text-text-primary transition-colors rounded-[10px] hover:bg-white/[0.03]"
          >
            Login
          </a>
          <Button variant="primary" size="md" href="#start">
            Start building
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            className="md:hidden ml-1 size-10 inline-flex items-center justify-center rounded-[10px] text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
          >
            <MenuIcon size={18} />
          </button>
        </div>
      </motion.nav>

      {/*
        MEGA MENU — sibling of motion.nav (NOT child).
        Header has no transform, so `position: fixed` resolves relative to the viewport.
        `left-0 right-0 mx-auto max-w-[960px] px-4` reliably centers via auto-margins,
        with no dependence on translate or transform behavior.
      */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease }}
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMegaLeave}
            className="hidden md:block fixed left-0 right-0 mx-auto max-w-[1000px] px-4 top-[74px] z-50"
            role="menu"
          >
            {/* Invisible hover bridge to prevent menu from closing when moving mouse from nav to menu */}
            <div className="absolute -top-4 inset-x-0 h-4" />

            <div className="rounded-[24px] border border-white/[0.06] bg-ink/95 backdrop-blur-3xl p-5 shadow-[0_40px_96px_-20px_rgba(0,0,0,0.85)] relative overflow-hidden">
              {/* Layered ambient glows — subtle, not flashy */}
              <div className="absolute -top-32 -left-24 size-64 rounded-full bg-flux-cyan/[0.08] blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-32 right-0 size-72 rounded-full bg-flux-green/[0.05] blur-[80px] pointer-events-none" />
              {/* Top edge highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

              <div className="relative grid grid-cols-12 gap-5">
                {/* ─── Left: modules grid ───────────────────────────── */}
                <div className="col-span-12 lg:col-span-7" onMouseLeave={() => setHoveredItem(null)}>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-flux-cyan animate-status" />
                      <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.2em]">Platform</span>
                    </div>
                    <span className="text-[10px] text-text-tertiary/50 num-tabular tracking-wider">{productItems.length} modules</span>
                  </div>

                  <ul className="grid grid-cols-2 gap-0.5">
                    {productItems.map((item, i) => {
                      const isActive = hoveredItem === i;
                      return (
                        <motion.li
                          key={item.title}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.025 * i, ease }}
                        >
                          <a
                            href={item.href}
                            role="menuitem"
                            onMouseEnter={() => setHoveredItem(i)}
                            className={cn(
                              "group relative flex items-start gap-3.5 p-3 rounded-[10px]",
                              "transition-colors duration-150",
                              isActive ? "bg-white/[0.035]" : "hover:bg-white/[0.02]"
                            )}
                          >
                            {/* Naked icon, no tile. Accent color carried by the icon itself. */}
                            <span
                              className={cn(
                                "shrink-0 mt-0.5",
                                accentText[item.accent],
                                "transition-opacity duration-150",
                                isActive ? "opacity-100" : "opacity-90"
                              )}
                            >
                              <item.Icon size={20} />
                            </span>

                            <div className="min-w-0">
                              <div className="text-[13.5px] font-medium text-text-primary tracking-[-0.005em]">
                                {item.title}
                              </div>
                              <div className="mt-0.5 text-[12px] text-text-secondary/70 leading-[1.45]">
                                {item.desc}
                              </div>
                            </div>
                          </a>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>

                {/* ─── Right: hover-aware preview pane ──────────────── */}
                <div className="col-span-12 lg:col-span-5">
                  <div className="relative h-full min-h-[220px] rounded-[16px] border border-white/[0.06] bg-gradient-to-br from-white/[0.035] to-white/[0.005] p-5 overflow-hidden">
                    <AnimatePresence mode="wait">
                      {hoveredItem === null ? (
                        <motion.div
                          key="default"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2, ease }}
                          className="h-full flex flex-col"
                        >
                          {/* Live indicator */}
                          <div className="flex items-center gap-2">
                            <span className="relative inline-flex size-2">
                              <span className="absolute inset-0 rounded-full bg-flux-green/40 animate-ping" />
                              <span className="relative size-2 rounded-full bg-flux-green" />
                            </span>
                            <span className="text-[10px] font-semibold text-flux-green uppercase tracking-[0.2em]">Sandbox live</span>
                          </div>

                          <div className="mt-3 flex-1">
                            <h3 className="text-[17px] font-semibold text-text-primary tracking-[-0.015em] leading-[1.25]">
                              Run a workflow in your browser.
                            </h3>
                            <p className="mt-2 text-[12.5px] text-text-secondary leading-[1.55]">
                              No install. Trace every node, every token. Fork the example and ship it.
                            </p>
                          </div>

                          <a
                            href="#demo"
                            className="mt-4 inline-flex items-center gap-1.5 self-start text-[12.5px] font-medium text-flux-green hover:text-flux-green/80 transition-colors"
                          >
                            Open the playground
                            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                          </a>

                          {/* Decorative animated nodes — silent storytelling */}
                          <svg
                            viewBox="0 0 200 60"
                            className="absolute -bottom-2 right-2 w-[180px] opacity-40 pointer-events-none"
                            aria-hidden
                          >
                            <line x1="10" y1="30" x2="190" y2="30" stroke="url(#previewLine)" strokeWidth="1" />
                            <defs>
                              <linearGradient id="previewLine" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0" stopColor="#22D3EE" stopOpacity="0" />
                                <stop offset="0.3" stopColor="#22D3EE" stopOpacity="0.6" />
                                <stop offset="0.7" stopColor="#A855F7" stopOpacity="0.6" />
                                <stop offset="1" stopColor="#A855F7" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            {[30, 70, 110, 150].map((cx, idx) => (
                              <circle
                                key={cx}
                                cx={cx}
                                cy="30"
                                r="3"
                                fill={["#22D3EE", "#00FF66", "#FFD400", "#A855F7"][idx]}
                              />
                            ))}
                          </svg>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={hoveredItem}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.18, ease }}
                          className="h-full flex flex-col"
                        >
                          <span className={cn("inline-flex", accentText[productItems[hoveredItem].accent])}>
                            {(() => {
                              const Icon = productItems[hoveredItem].Icon;
                              return <Icon size={28} />;
                            })()}
                          </span>

                          <h3 className="mt-4 text-[17px] font-semibold text-text-primary tracking-[-0.015em]">
                            {productItems[hoveredItem].title}
                          </h3>
                          <p className="mt-1.5 text-[12.5px] text-text-secondary leading-[1.55] flex-1">
                            {productItems[hoveredItem].desc}.
                          </p>

                          <a
                            href={productItems[hoveredItem].href}
                            className="mt-4 inline-flex items-center gap-1.5 self-start text-[12.5px] font-medium text-text-primary hover:text-flux-green transition-colors"
                          >
                            Read the docs
                            <ArrowRight size={12} />
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* ─── Footer strip — secondary links + version ──────── */}
              <div className="relative mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-1">
                  {[
                    { label: "Docs", href: "#docs" },
                    { label: "Changelog", href: "#changelog" },
                    { label: "GitHub", href: "#github" },
                  ].map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      className="px-2.5 py-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-text-tertiary/70 num-tabular">
                  <span className="size-1.5 rounded-full bg-flux-green/80" />
                  v2.4.2 shipped 2d ago
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease }}
            className="md:hidden mt-2 rounded-[18px] bg-ink/95 backdrop-blur-xl border border-ink-line p-2 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.5)]"
          >
            <ul className="flex flex-col gap-0.5">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 h-11 inline-flex items-center text-sm text-text-secondary hover:text-text-primary rounded-[10px] hover:bg-white/[0.04] transition-colors w-full"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-1 mt-1 border-t border-ink-line">
                <a
                  href="#login"
                  onClick={() => setOpen(false)}
                  className="block px-3 h-11 inline-flex items-center text-sm text-text-secondary hover:text-text-primary rounded-[10px] hover:bg-white/[0.04] transition-colors w-full"
                >
                  Login
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
