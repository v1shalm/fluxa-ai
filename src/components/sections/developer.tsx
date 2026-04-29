"use client";

import { motion } from "framer-motion";
import { GitHubIcon, TerminalIcon, CheckIcon } from "@/components/primitives/icons";

const features = [
  "TypeScript SDK, Python client, REST API",
  "Workflows are .ts files — diff, review, revert in Git",
  "Every block exports as a callable function",
  "Self-host the runtime in your VPC",
  "Webhooks, cron, and queue triggers built in",
  "Export and walk away — no lock-in, ever",
];

function CodeBlock() {
  return (
    <div className="relative rounded-[16px] border border-ink-line bg-ink-surface overflow-hidden shadow-card">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-ink-line">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-text-tertiary" />
          <span className="caption text-text-tertiary">workflow.ts</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-flux-green animate-status" />
          <span className="caption text-text-tertiary">type-checked</span>
        </div>
      </div>
      <pre className="p-5 text-[13px] leading-[1.7] font-mono overflow-x-auto scrollbar-none">
        <code className="text-text-secondary">
          <span className="text-text-tertiary">{`// auto-generated from canvas`}</span>
          {"\n"}
          <span className="text-flux-pink">import</span>
          {" { "}
          <span className="text-text-primary">flow, llm, tool</span>
          {" } "}
          <span className="text-flux-pink">from</span>
          {" "}
          <span className="text-flux-lime">{`"@fluxa/sdk"`}</span>
          {";"}
          {"\n\n"}
          <span className="text-flux-pink">export const</span>
          {" "}
          <span className="text-flux-cyan">pricingAgent</span>
          {" = "}
          <span className="text-flux-cyan">flow</span>
          {"({"}
          {"\n"}
          {"  "}
          <span className="text-text-primary">input</span>
          {": z.object({ query: z."}
          <span className="text-flux-yellow">string</span>
          {"() }),"}
          {"\n"}
          {"  "}
          <span className="text-text-primary">steps</span>
          {": ["}
          {"\n"}
          {"    "}
          <span className="text-flux-cyan">llm</span>
          {"({ model: "}
          <span className="text-flux-lime">{`"claude-sonnet-4-6"`}</span>
          {", role: "}
          <span className="text-flux-lime">{`"classifier"`}</span>
          {" }),"}
          {"\n"}
          {"    "}
          <span className="text-flux-cyan">tool</span>
          {"("}
          <span className="text-flux-lime">{`"fetch_pricing"`}</span>
          {"),"}
          {"\n"}
          {"    "}
          <span className="text-flux-cyan">llm</span>
          {"({ model: "}
          <span className="text-flux-lime">{`"claude-opus-4-7"`}</span>
          {", role: "}
          <span className="text-flux-lime">{`"reasoner"`}</span>
          {" }),"}
          {"\n"}
          {"  ],"}
          {"\n"}
          {"});"}
          {"\n\n"}
          <span className="text-text-tertiary">$ </span>
          <span className="text-flux-green">fluxa deploy</span>
          <span className="text-text-tertiary">{` --env=prod`}</span>
          {"\n"}
          <span className="text-text-tertiary">{`→ deployed in 2.4s · v2.4.1`}</span>
        </code>
      </pre>
    </div>
  );
}

export function Developer() {
  return (
    <section id="docs" className="relative py-section">
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[400px] -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(0,255,102,0.06), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="mx-auto max-w-[1200px] px-6 grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-start">
        <div className="flex flex-col">
          {/* Eyebrow — small anchor that establishes the section's start. */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 self-start"
          >
            <span className="size-1.5 rounded-full bg-flux-green animate-status" />
            <span className="caption text-flux-green tracking-wider uppercase">developer experience</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-md text-display font-semibold text-balance"
          >
            Built for engineers,{" "}
            <span className="text-flux-green">not against them.</span>
          </motion.h2>
          <p className="mt-sm text-[16px] leading-[1.6] text-text-secondary text-pretty max-w-[480px]">
            The canvas is one view of the truth. The other is a typed .ts file
            you check into Git, review in PRs, and deploy through the same
            pipeline as the rest of your code.
          </p>

          {/* Generous gap before the list — tells the eye a new beat starts here. */}
          <ul className="mt-xl grid grid-cols-1 sm:grid-cols-2 gap-x-lg gap-y-sm">
            {features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3 text-[14.5px] leading-[1.5] text-text-secondary"
              >
                <span className="mt-[3px] inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-flux-green/15 text-flux-green">
                  <CheckIcon size={11} />
                </span>
                {f}
              </motion.li>
            ))}
          </ul>

          {/* CTAs — generous gap above (different beat from the list). */}
          <div className="mt-xl flex items-center gap-3">
            <a
              href="#docs"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] bg-ink-surface border border-ink-line hover:border-text-secondary transition-colors text-[14px]"
            >
              <TerminalIcon size={14} />
              Read the docs
            </a>
            <a
              href="#github"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] hover:bg-white/[0.03] transition-colors text-[14px] text-text-secondary hover:text-text-primary"
            >
              <GitHubIcon size={14} />
              github.com/fluxa
            </a>
          </div>

          {/* Stats strip — anchors the bottom of the column with real info,
              fills the height that the tall code block creates on the right.
              Hairline separator + tight spacing within strip = tight beat to close. */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2xl pt-md border-t border-ink-line flex flex-wrap items-baseline gap-x-xl gap-y-xs"
          >
            <div>
              <div className="caption text-text-tertiary">stars</div>
              <div className="mt-1 text-[20px] font-display font-semibold text-text-primary num-tabular tracking-[-0.02em]">
                12,481 <span className="text-flux-green">★</span>
              </div>
            </div>
            <div>
              <div className="caption text-text-tertiary">latest</div>
              <div className="mt-1 text-[20px] font-display font-semibold text-text-primary num-tabular tracking-[-0.02em]">
                v2.4.1
              </div>
            </div>
            <div>
              <div className="caption text-text-tertiary">license</div>
              <div className="mt-1 text-[20px] font-display font-semibold text-text-primary tracking-[-0.02em]">
                MIT
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <CodeBlock />
        </motion.div>
      </div>
    </section>
  );
}
