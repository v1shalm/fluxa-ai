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
          "p-2 rounded-[18px]",
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
            className="hidden md:block fixed left-0 right-0 mx-auto max-w-[960px] px-4 top-[68px] z-50"
            role="menu"
          >
            <div className="rounded-[22px] border border-ink-line bg-ink/95 backdrop-blur-xl p-2 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.7)]">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 lg:col-span-8">
                  <div className="px-3 pt-2 pb-2 flex items-center justify-between">
                    <span className="text-2xs text-text-tertiary font-medium">Product</span>
                    <span className="text-2xs text-text-tertiary num-tabular">{productItems.length} modules</span>
                  </div>
                  <ul className="grid grid-cols-2 gap-1">
                    {productItems.map((item, i) => (
                      <motion.li
                        key={item.title}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.04 * i, ease }}
                      >
                        <a
                          href={item.href}
                          role="menuitem"
                          className={cn(
                            "group flex items-start gap-3 p-3 rounded-[14px]",
                            "transition-[background-color] duration-150",
                            "hover:bg-white/[0.04]"
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 size-9 inline-flex items-center justify-center rounded-[8px] shrink-0",
                              accentBg[item.accent],
                              "transition-transform duration-200 ease-out-quart",
                              "group-hover:scale-105"
                            )}
                          >
                            <item.Icon size={17} />
                          </span>
                          <div className="min-w-0 pt-0.5">
                            <div className="text-sm font-medium text-text-primary tracking-[-0.005em] flex items-center gap-1.5">
                              {item.title}
                              <span className="inline-flex opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-text-tertiary">
                                <ArrowRight size={11} />
                              </span>
                            </div>
                            <div className="mt-0.5 text-xs text-text-tertiary leading-[1.4]">
                              {item.desc}
                            </div>
                          </div>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-2">
                  <motion.a
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.18, ease }}
                    href="#demo"
                    role="menuitem"
                    className="group relative flex-1 rounded-[14px] bg-ink-surface border border-ink-line p-4 overflow-hidden hover:border-text-tertiary transition-colors duration-200"
                  >
                    <div className="absolute right-3 bottom-3 grid grid-cols-3 gap-1 opacity-90" aria-hidden>
                      <div className="size-3 rounded-[2px] bg-flux-cyan" />
                      <div className="size-3 rounded-[2px] bg-flux-green" />
                      <div className="size-3 rounded-[2px] bg-flux-lime" />
                      <div className="size-3 rounded-[2px] bg-flux-yellow" />
                      <div className="size-3 rounded-[2px] bg-flux-pink" />
                      <div className="size-3 rounded-[2px] bg-flux-purple" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-flux-green animate-status" />
                      <span className="text-2xs text-flux-green font-medium">live</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-text-primary">Try Live demo</span>
                      <ArrowRight size={11} className="text-text-tertiary group-hover:text-text-primary transition-colors" />
                    </div>
                    <p className="mt-1 text-xs text-text-tertiary leading-[1.4]">
                      Run a real workflow in your browser
                    </p>
                  </motion.a>

                  <motion.a
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.24, ease }}
                    href="#changelog"
                    role="menuitem"
                    className="group relative flex-1 rounded-[14px] bg-ink-surface border border-ink-line p-4 overflow-hidden hover:border-text-tertiary transition-colors duration-200"
                  >
                    <div
                      className="absolute right-3 bottom-3 h-1.5 w-[80px] rounded-full opacity-90"
                      style={{ background: "linear-gradient(90deg, #00FF66, #A3FF12)" }}
                      aria-hidden
                    />
                    <span className="text-2xs text-text-tertiary num-tabular">v2.4.2</span>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-text-primary">Changelog</span>
                      <ArrowRight size={11} className="text-text-tertiary group-hover:text-text-primary transition-colors" />
                    </div>
                    <p className="mt-1 text-xs text-text-tertiary leading-[1.4]">
                      What shipped this week
                    </p>
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
