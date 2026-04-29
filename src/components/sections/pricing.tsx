"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/primitives/button";
import { ArrowRight, CheckIcon } from "@/components/primitives/icons";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

type Tier = {
  name: string;
  tagline: string;
  price: string;
  unit: string;
  features: string[];
  cta: string;
  highlight: boolean;
};

const tiers: Tier[] = [
  {
    name: "Starter",
    tagline: "Free until it's serious.",
    price: "0",
    unit: "free forever",
    features: [
      "3 active workflows",
      "10k runs / month",
      "All core blocks",
      "Community support",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    tagline: "Paid when it's scaling.",
    price: "49",
    unit: "per seat / month",
    features: [
      "Unlimited workflows",
      "1M runs / month",
      "Multi-environment deploys",
      "Priority support · 4h SLA",
      "Git-native collaboration",
      "Custom domains + SSO",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Scale",
    tagline: "Self-hosted when it must be.",
    price: "Custom",
    unit: "annual contracts",
    features: [
      "Self-host in your VPC",
      "Unlimited runs",
      "SSO + audit logs + SCIM",
      "Dedicated solutions architect",
      "99.99% uptime SLA",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-section">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header — left-aligned, manifesto */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-16">
          <div className="max-w-[680px]">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease }}
              className="font-display font-semibold tracking-[-0.035em] leading-[0.95] text-balance text-d2"
            >
              Pay for runs, <span className="text-text-tertiary">not seats you don&apos;t use.</span>
            </motion.h2>
          </div>
          <div className="hidden lg:block max-w-[280px] caption text-text-tertiary">
            Volume discounts begin at 10M runs/mo. Prices in USD.
          </div>
        </div>

        {/* Comparison strip — three columns, no card boxes, vertical hairlines as dividers */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="grid grid-cols-1 md:grid-cols-3 border-y border-ink-line"
        >
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={cn(
                "relative px-6 lg:px-10 py-10 lg:py-12",
                // Vertical dividers (full hairlines — not colored stripes)
                i > 0 && "md:border-l border-ink-line",
                // Tinted bg for Pro (no border-stripe)
                tier.highlight && "bg-ink-surface/60"
              )}
            >
              {/* Most popular tag — small mono, sits in flow */}
              {tier.highlight && (
                <span className="absolute right-6 top-6 inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-flux-green animate-status" />
                  <span className="caption text-flux-green">most picked</span>
                </span>
              )}

              {/* Tier name + tagline */}
              <div>
                <h3 className="text-[18px] font-semibold tracking-[-0.015em] text-text-primary">
                  {tier.name}
                </h3>
                <p className="mt-1.5 text-[13.5px] text-text-tertiary">
                  {tier.tagline}
                </p>
              </div>

              {/* Price */}
              <div className="mt-10">
                <div className="flex items-baseline gap-1.5">
                  {tier.price === "Custom" ? (
                    <span className="font-display font-semibold tracking-[-0.035em] num-tabular leading-none text-[clamp(32px,4vw,48px)]">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="text-base text-text-tertiary mt-2">$</span>
                      <span className="font-display font-semibold tracking-[-0.035em] num-tabular leading-none text-[clamp(40px,5vw,64px)]">
                        {tier.price}
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-2 caption text-text-tertiary">{tier.unit}</p>
              </div>

              {/* Features */}
              <ul className="mt-10 space-y-3">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-[14px] text-text-secondary"
                  >
                    <span className={cn(
                      "mt-[3px] inline-flex size-3.5 shrink-0 items-center justify-center rounded-[3px]",
                      tier.highlight
                        ? "bg-flux-green/20 text-flux-green"
                        : "bg-ink-line text-text-secondary",
                    )}>
                      <CheckIcon size={9} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA — full-width, sits at the bottom */}
              <div className="mt-12">
                <Button
                  variant={tier.highlight ? "primary" : "secondary"}
                  size="lg"
                  className="w-full"
                  href="#start"
                >
                  {tier.cta}
                  <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 caption text-text-tertiary">
          <span>all plans include · usage analytics · webhooks · sdk · audit logs</span>
          <a href="#compare" className="text-text-secondary hover:text-text-primary transition-colors">compare full feature matrix →</a>
        </div>
      </div>
    </section>
  );
}
