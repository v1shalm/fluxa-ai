"use client";

import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type BlockColor = "cyan" | "green" | "lime" | "yellow" | "pink" | "purple" | "neutral";

const colorMap: Record<BlockColor, { bg: string; ring: string }> = {
  cyan:    { bg: "bg-flux-cyan",   ring: "shadow-[0_0_24px_-4px_rgba(34,211,238,0.55)]" },
  green:   { bg: "bg-flux-green",  ring: "shadow-[0_0_24px_-4px_rgba(0,255,102,0.55)]" },
  lime:    { bg: "bg-flux-lime",   ring: "shadow-[0_0_24px_-4px_rgba(163,255,18,0.55)]" },
  yellow:  { bg: "bg-flux-yellow", ring: "shadow-[0_0_24px_-4px_rgba(255,212,0,0.55)]" },
  pink:    { bg: "bg-flux-pink",   ring: "shadow-[0_0_24px_-4px_rgba(255,77,204,0.55)]" },
  purple:  { bg: "bg-flux-purple", ring: "shadow-[0_0_24px_-4px_rgba(168,85,247,0.55)]" },
  neutral: { bg: "bg-ink-line",    ring: "" },
};

type BlockProps = {
  color?: BlockColor;
  size?: number; // in px
  radius?: "block" | "block-lg" | "card";
  glow?: boolean;
  className?: string;
} & MotionProps;

export function Block({
  color = "cyan",
  size = 24,
  radius = "block",
  glow = false,
  className,
  ...motionProps
}: BlockProps) {
  const { bg, ring } = colorMap[color];
  const radiusClass = {
    block: "rounded-[6px]",
    "block-lg": "rounded-[10px]",
    card: "rounded-[14px]",
  }[radius];

  return (
    <motion.div
      className={cn(bg, radiusClass, glow && ring, className)}
      style={{ width: size, height: size }}
      {...motionProps}
    />
  );
}

type BarProps = {
  width?: number | string;
  height?: number;
  from?: BlockColor;
  to?: BlockColor;
  flowing?: boolean;
  className?: string;
} & MotionProps;

const hexMap: Record<BlockColor, string> = {
  cyan: "#22D3EE",
  green: "#00FF66",
  lime: "#A3FF12",
  yellow: "#FFD400",
  pink: "#FF4DCC",
  purple: "#A855F7",
  neutral: "#2A2A2A",
};

export function Bar({
  width = 120,
  height = 10,
  from = "cyan",
  to = "purple",
  flowing = false,
  className,
  ...motionProps
}: BarProps) {
  const gradient = `linear-gradient(90deg, ${hexMap[from]} 0%, ${hexMap[to]} 100%)`;
  const flowGradient = `linear-gradient(90deg, ${hexMap[from]} 0%, ${hexMap[to]} 50%, ${hexMap[from]} 100%)`;

  return (
    <motion.div
      className={cn("rounded-full", flowing && "animate-flow", className)}
      style={{
        width,
        height,
        background: flowing ? flowGradient : gradient,
        backgroundSize: flowing ? "200% 100%" : undefined,
      }}
      {...motionProps}
    />
  );
}

type ConnectorProps = {
  width?: number;
  color?: BlockColor;
  flowing?: boolean;
  className?: string;
};

export function Connector({ width = 64, color = "cyan", flowing = false, className }: ConnectorProps) {
  const c = hexMap[color];
  return (
    <div
      className={cn("h-px", flowing && "animate-flow", className)}
      style={{
        width,
        background: flowing
          ? `linear-gradient(90deg, transparent 0%, ${c} 50%, transparent 100%)`
          : `linear-gradient(90deg, transparent 0%, ${c} 50%, transparent 100%)`,
        backgroundSize: flowing ? "200% 100%" : undefined,
      }}
    />
  );
}
