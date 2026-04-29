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
  PlayIcon,
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
  { Icon: PlayIcon,     title: "Live Tracing",     desc: "Inspect every run, every token",      accent: "lime",   href: "#tracing" },
  { Icon: ChatIcon,     title: "Embedding",        desc: "Drop workflows into any app",         accent: "yellow", href: "#embedding" },
  { Icon: ConnectIcon,  title: "Integrations",     desc: "Connect to your existing stack",      accent: "pink",   href: "#integrations" },
  { Icon: TerminalIcon, title: "Fluxa CLI",        desc: "Ship workflows from your terminal",   accent: "purple", href: "#cli" },
];

const accentBg: Record<ProductItem["accent"], string> = {
  cyan:   "bg-flux-cyan/15 text-flux-cyan",
  green:  "bg-flux-green/15 text-flux-green",
  lime:   "bg-flux-lime/15 text-flux-lime",
  yellow: "bg-flux-yellow/15 text-flux-yellow",
  pink:   "bg-flux-pink/15 text-flux-pink",
  purple: "bg-flux-purple/20 text-flux-purple",
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
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };

  return (
    // Plain <header>, fixed. NO transform on this element so descendants with
    // `fixed`/`absolute` resolve relative to it (or the viewport) correctly.
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-3">
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className={cn(
          "relative mx-auto max-w-[1200px]",
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
            Start Building
            <ArrowRight size={14} />
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

            <div className="rounded-[24px] border border-ink-line bg-ink/90 backdrop-blur-3xl p-3 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)] relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute -top-24 -left-24 size-48 bg-flux-cyan/10 blur-[60px] pointer-events-none" />
              
              <div className="relative grid grid-cols-12 gap-3">
                {/* Left: Main Product Grid */}
                <div className="col-span-12 lg:col-span-8 bg-white/[0.02] rounded-[18px] p-1 border border-white/[0.03]">
                  <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-flux-cyan" />
                      <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Platform Core</span>
                    </div>
                    <span className="text-[10px] font-medium text-text-tertiary/60 uppercase tracking-widest">{productItems.length} Modules</span>
                  </div>
                  
                  <ul className="grid grid-cols-2 gap-1 pb-1">
                    {productItems.map((item, i) => (
                      <motion.li
                        key={item.title}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.03 * i, ease }}
                      >
                        <a
                          href={item.href}
                          role="menuitem"
                          className={cn(
                            "group flex items-start gap-4 p-3.5 rounded-[14px]",
                            "transition-all duration-200",
                            "hover:bg-white/[0.05] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 size-10 inline-flex items-center justify-center rounded-[10px] shrink-0",
                              accentBg[item.accent],
                              "transition-all duration-300 ease-out-quart",
                              "group-hover:scale-110 group-hover:shadow-[0_0_15px_-3px_currentColor]"
                            )}
                          >
                            <item.Icon size={20} />
                          </span>
                          <div className="min-w-0 pt-0.5">
                            <div className="text-[14px] font-semibold text-text-primary tracking-tight flex items-center gap-2">
                              {item.title}
                              <ArrowRight size={10} className="opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300 text-text-tertiary" />
                            </div>
                            <div className="mt-1 text-[12px] text-text-secondary/70 leading-[1.5] group-hover:text-text-secondary transition-colors">
                              {item.desc}
                            </div>
                          </div>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Right: Featured / Resources */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
                  <motion.a
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15, ease }}
                    href="#demo"
                    role="menuitem"
                    className="group relative flex-1 rounded-[18px] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.05] p-5 overflow-hidden hover:border-flux-cyan/30 transition-all duration-300"
                  >
                    <div className="absolute right-0 top-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className="grid grid-cols-3 gap-1.5" aria-hidden>
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="size-2.5 rounded-[1.5px] bg-white/40" />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        <div className="size-1 rounded-full bg-flux-green animate-pulse" />
                        <div className="size-1 rounded-full bg-flux-green animate-pulse delay-75" />
                        <div className="size-1 rounded-full bg-flux-green animate-pulse delay-150" />
                      </div>
                      <span className="text-[10px] font-bold text-flux-green uppercase tracking-widest">Environment Live</span>
                    </div>

                    <div className="mt-4">
                      <div className="text-base font-bold text-text-primary flex items-center gap-2">
                        Try Live Demo
                        <ArrowRight size={14} className="text-text-tertiary group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="mt-1.5 text-xs text-text-secondary leading-[1.6]">
                        Execute a real multi-step workflow directly in your browser. No account required.
                      </p>
                    </div>
                  </motion.a>

                  <motion.a
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.22, ease }}
                    href="#changelog"
                    role="menuitem"
                    className="group relative rounded-[18px] bg-white/[0.02] border border-white/[0.05] p-5 overflow-hidden hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-text-tertiary uppercase tracking-wider">Latest Update</span>
                      <span className="text-[10px] font-bold text-text-tertiary/40 num-tabular">v2.4.2</span>
                    </div>
                    
                    <div className="text-base font-bold text-text-primary flex items-center gap-2">
                      Changelog
                      <ArrowRight size={14} className="text-text-tertiary group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="mt-1.5 text-xs text-text-secondary leading-[1.6]">
                      What shipped this week: New vector primitives and gRPC support.
                    </p>

                    <div className="mt-4 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className="h-full w-2/3 rounded-full"
                        style={{ background: "linear-gradient(90deg, #00FF66, #22D3EE)" }}
                      />
                    </div>
                  </motion.a>
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
            className="md:hidden mx-4 mt-2 rounded-[18px] bg-ink/95 backdrop-blur-xl border border-ink-line p-2 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.5)]"
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
