"use client";

import { motion } from "framer-motion";
import { Block } from "@/components/primitives/block";

const ease = [0.16, 1, 0.3, 1] as const;

type Value = {
  num: string;
  bigStatement: string;
  body: string;
  accent: "cyan" | "green" | "pink";
  side: React.ReactNode;
};

const values: Value[] = [
  {
    num: "01",
    bigStatement: "The canvas is the source of truth.",
    body:
      "Workflows are designed visually, not described in YAML. Every block is inspectable, every edge is typed, every change is tracked.",
    accent: "cyan",
    side: <Side1 />,
  },
  {
    num: "02",
    bigStatement: "Modular all the way down.",
    body:
      "A model call is a block. A tool is a block. A whole agent is a block. Compose primitives into systems — then compose those systems into bigger ones.",
    accent: "green",
    side: <Side2 />,
  },
  {
    num: "03",
    bigStatement: "Built to leave the prototype behind.",
    body:
      "Ship to staging or production with one command. Versioned, typed, observable, and self-hostable. No rewrite required.",
    accent: "pink",
    side: <Side3 />,
  },
];

function Side1() {
  return (
    <div className="relative h-[120px] w-full">
      <div className="absolute right-2 top-2"><Block color="cyan" size={36} radius="block-lg" glow /></div>
      <div className="absolute right-[60px] top-6"><Block color="green" size={20} radius="block" /></div>
      <div className="absolute right-[100px] top-[44px]"><Block color="lime" size={16} radius="block" /></div>
      <div className="absolute right-2 top-[68px]">
        <div className="h-px w-[120px] animate-flow"
             style={{ background: "linear-gradient(90deg,transparent,#22D3EE,transparent)", backgroundSize: "200% 100%" }} />
      </div>
      <div className="absolute right-2 top-[80px]">
        <div className="h-1.5 w-[80px] rounded-full"
             style={{ background: "linear-gradient(90deg, #22D3EE, #00FF66)" }} />
      </div>
    </div>
  );
}

function Side2() {
  return (
    <div className="relative h-[120px] w-full">
      <div className="absolute right-0 top-2 grid grid-cols-4 gap-1.5">
        {[
          "green","green","lime","green",
          "lime","green","green","lime",
          "green","lime","lime","green",
        ].map((c, i) => (
          <Block key={i} color={c as "green"} size={16} radius="block" glow={i === 5} />
        ))}
      </div>
      <div className="absolute right-0 bottom-1">
        <div className="h-1 w-[140px] rounded-full"
             style={{ background: "linear-gradient(90deg, #00FF66, #A3FF12)" }} />
      </div>
    </div>
  );
}

function Side3() {
  return (
    <div className="relative h-[120px] w-full">
      <div className="absolute right-0 top-0 w-full max-w-[180px] ml-auto">
        <div className="rounded-[10px] border border-ink-line bg-ink-surface p-3">
          <div className="flex items-center justify-between">
            <span className="caption text-text-tertiary">deploy · prod</span>
            <span className="size-1.5 rounded-full bg-flux-green animate-status" />
          </div>
          <div className="mt-2 h-1 rounded-full bg-ink-line overflow-hidden">
            <motion.div
              initial={{ width: "10%" }}
              whileInView={{ width: "82%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.4, ease }}
              className="h-full"
              style={{ background: "linear-gradient(90deg, #FF4DCC, #A855F7)" }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between caption text-text-tertiary num-tabular">
            <span>v2.4.1 → v2.4.2</span>
            <span className="text-flux-green">2.4s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const accentLine: Record<Value["accent"], string> = {
  cyan:  "linear-gradient(90deg, transparent, #22D3EE, transparent)",
  green: "linear-gradient(90deg, transparent, #00FF66, transparent)",
  pink:  "linear-gradient(90deg, transparent, #FF4DCC, transparent)",
};

const accentText: Record<Value["accent"], string> = {
  cyan:  "text-flux-cyan",
  green: "text-flux-green",
  pink:  "text-flux-pink",
};

export function Values() {
  return (
    <section className="py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        <div>
          {values.map((v, i) => (
            <motion.article
              key={v.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease }}
              className="relative grid lg:grid-cols-[80px_1fr_280px] gap-6 lg:gap-12 items-start py-14 lg:py-20"
            >
              {/* Number column */}
              <div className="flex flex-col gap-2">
                <span className={`text-[40px] lg:text-[56px] font-semibold tracking-[-0.04em] leading-none num-tabular ${accentText[v.accent]}`}>
                  {v.num}
                </span>
                <span className="caption text-text-tertiary">principle</span>
              </div>

              {/* Statement column */}
              <div>
                <h3
                  className="font-semibold tracking-[-0.035em] leading-[0.96] text-balance"
                  style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}
                >
                  {v.bigStatement}
                </h3>
                <p className="mt-6 max-w-[520px] text-[16px] leading-[1.55] text-text-secondary text-pretty">
                  {v.body}
                </p>
              </div>

              {/* Visual column */}
              <div className="hidden lg:block pt-4">
                {v.side}
              </div>

              {/* Bottom flowing connector — except after last */}
              {i < values.length - 1 && (
                <div className="absolute left-0 right-0 -bottom-px h-px overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1.2, delay: 0.3, ease }}
                    className="h-px w-full origin-left"
                    style={{ background: accentLine[v.accent] }}
                  />
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
