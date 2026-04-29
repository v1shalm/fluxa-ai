"use client";

import { motion } from "framer-motion";
import { GitHubIcon, TerminalIcon, CheckIcon } from "@/components/primitives/icons";

const features = [
  "TypeScript SDK + Python client",
  "API-first — every block is callable",
  "Git-native: workflows are versioned files",
  "Export workflows as code — no lock-in",
  "Self-host runtime in your VPC",
  "Webhooks, schedules, queue triggers",
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
      <div className="mx-auto max-w-[1200px] px-6 grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-display font-semibold text-balance"
          >
            Built for engineers,{" "}
            <span className="text-flux-green">not against them.</span>
          </motion.h2>
          <p className="mt-5 text-[16px] leading-[1.6] text-text-secondary text-pretty max-w-[480px]">
            The canvas is just one view. Every workflow is a typed file you can
            edit, review, and ship through your normal tooling.
          </p>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2.5 text-[14.5px] text-text-secondary"
              >
                <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-flux-green/15 text-flux-green">
                  <CheckIcon size={11} />
                </span>
                {f}
              </motion.li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-3">
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
              <span className="ml-1 caption text-text-tertiary num-tabular">12.4k ★</span>
            </a>
          </div>
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
