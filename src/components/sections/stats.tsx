"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const stats = [
  {
    value: "47×",
    label: "faster prototype-to-production",
    accent: "#22D3EE", // cyan
  },
  {
    value: "99.99%",
    label: "runtime uptime SLA",
    accent: "#00FF66", // green
  },
  {
    value: "12k+",
    label: "teams shipping with Fluxa",
    accent: "#FF4DCC", // pink
  },
];

export function Stats() {
  return (
    <section className="py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease }}
          className="font-display font-semibold tracking-[-0.025em] leading-[1.05] text-balance text-d3 max-w-[720px] mb-2xl text-center mx-auto"
        >
          Measurable results <span className="text-text-tertiary">from day one.</span>
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
                {s.value}
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
