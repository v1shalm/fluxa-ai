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
    "bg-flux-green text-black hover:brightness-110 hover:shadow-[0_8px_32px_-8px_rgba(0,255,102,0.45)]",
  secondary:
    "bg-transparent text-text-primary border border-ink-line hover:border-text-secondary hover:bg-white/[0.03]",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-[14px]",
  lg: "h-12 px-5 text-[15px]",
};

export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, Props>(
  function Button({ variant = "primary", size = "md", className, children, href, type = "button", ...motionProps }, ref) {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium tracking-[-0.005em]",
      "transition-[background-color,color,box-shadow,filter,scale] duration-200 ease-out-quart",
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
