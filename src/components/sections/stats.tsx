"use client";

import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

function Counter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Extract number and suffix if not provided
  const numMatch = value.match(/[\d.]+/);
  const num = numMatch ? parseFloat(numMatch[0]) : 0;
  const detectedSuffix = suffix || value.replace(numMatch ? numMatch[0] : "", "");
  
  const spring = useSpring(0, {
    stiffness: 40,
    damping: 20,
    restDelta: 0.001
  });
  
  const display = useTransform(spring, (current) => {
    if (num % 1 === 0) return Math.floor(current).toLocaleString();
    return current.toFixed(2);
  });

  useEffect(() => {
    if (isInView) {
      spring.set(num);
    }
  }, [isInView, num, spring]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>
      {detectedSuffix}
    </span>
  );
}

const stats = [
  {
    value: "5min",
    label: "median time from blank canvas to deployed workflow",
    accent: "#22D3EE", // cyan
  },
  {
    value: "99.99%",
    label: "runtime uptime, last 12 months",
    accent: "#00FF66", // green
  },
  {
    value: "8247",
    label: "production teams running Fluxa today",
    accent: "#FF4DCC", // pink
  },
];

export function Stats() {
  return (
    <section className="py-section">
      <div className="mx-auto w-full max-w-[2240px] px-6 md:px-10 lg:px-20 xl:px-[160px]">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease }}
          className="font-display font-semibold tracking-[-0.025em] leading-[1.05] text-balance text-d3 max-w-[720px] mb-2xl text-center mx-auto"
        >
          Numbers we&apos;d show <span className="text-text-tertiary">a CTO.</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-md gap-y-xl border-t border-ink-line pt-xl">
          {stats.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease }}
              className="flex flex-col items-center text-center"
            >
              {/* Color square indicator */}
              <div
                className="size-2.5 rounded-[2px] mb-4"
                style={{ backgroundColor: s.accent }}
              />

              <div className="font-display font-semibold tracking-[-0.04em] leading-[0.9] text-text-primary num-tabular text-[clamp(40px,5.5vw,72px)]">
                <Counter value={s.value} />
              </div>
              <p className="mt-3 text-base text-text-secondary text-pretty max-w-[220px]">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

