"use client";

import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

type Props = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
} & Omit<MotionProps, "children">;

const variants: Record<Variant, string> = {
  primary:
    // Layered chrome: inset top highlight → solid mint → ambient outer glow.
    // Hover deepens the glow and lifts the button 1px.
    [
      "bg-flux-green text-black",
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_-10px_rgba(0,255,102,0.55)]",
      "hover:brightness-[1.04]",
      "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.4),0_16px_36px_-10px_rgba(0,255,102,0.7)]",
      "hover:-translate-y-px",
    ].join(" "),
  secondary:
    [
      "bg-white/[0.025] text-text-primary border border-white/[0.08]",
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
      "hover:bg-white/[0.05] hover:border-white/[0.14]",
      "hover:-translate-y-px",
    ].join(" "),
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-[14px]",
  lg: "h-12 px-[22px] text-[15px]",
};

export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, Props>(
  function Button({ variant = "primary", size = "md", className, children, href, type = "button", ...motionProps }, ref) {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium tracking-[-0.005em] will-change-transform",
      "transition-[background-color,color,box-shadow,filter,transform,border-color] duration-200 ease-out-quart",
      "active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flux-cyan/50",
      variants[variant],
      sizes[size],
      className,
    );

    if (href) {
      return (
        <motion.a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...motionProps}
        >
          {children}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={classes}
        {...motionProps}
      >
        {children}
      </motion.button>
    );
  }
);
