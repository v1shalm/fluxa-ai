import type { Config } from "tailwindcss";

// Modular type scale: 1.25 ratio (major third), tuned around 16px base
// Spacing scale: 4pt-aligned, semantic names

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0A0A",
          surface: "#121212",
          border: "#1F1F1F",
          subtle: "#161616",
          line: "#262626",
        },
        text: {
          primary: "#F5F5F5",
          secondary: "#A8A8A8",
          tertiary: "#6B6B6B",
        },
        flux: {
          cyan: "#22D3EE",
          green: "#00FF66",
          lime: "#A3FF12",
          yellow: "#FFD400",
          pink: "#FF4DCC",
          purple: "#A855F7",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      // Modular type scale — 1.25 ratio. Smaller, systematic.
      fontSize: {
        // Display tier (fluid for marketing headlines)
        "d1":   ["clamp(44px, 6vw, 88px)",  { lineHeight: "0.96", letterSpacing: "-0.035em" }],
        "d2":   ["clamp(32px, 4.2vw, 56px)",{ lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "d3":   ["clamp(24px, 3vw, 40px)",  { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        // UI tier (fixed)
        "h1":   ["1.5rem",   { lineHeight: "1.2",  letterSpacing: "-0.02em" }],   // 24
        "h2":   ["1.25rem",  { lineHeight: "1.3",  letterSpacing: "-0.015em" }],  // 20
        "h3":   ["1.0625rem",{ lineHeight: "1.4",  letterSpacing: "-0.005em" }],  // 17
        "lg":   ["1.0625rem",{ lineHeight: "1.55" }],                              // 17 — body large
        "base": ["1rem",     { lineHeight: "1.6" }],                               // 16
        "sm":   ["0.875rem", { lineHeight: "1.55" }],                              // 14
        "xs":   ["0.8125rem",{ lineHeight: "1.5" }],                               // 13
        "2xs":  ["0.75rem",  { lineHeight: "1.4" }],                               // 12
      },
      // 4pt-aligned semantic spacing
      spacing: {
        "4xs": "2px",
        "3xs": "4px",
        "2xs": "8px",
        "xs":  "12px",
        "sm":  "16px",
        "md":  "24px",
        "lg":  "32px",
        "xl":  "48px",
        "2xl": "64px",
        "3xl": "96px",
        "4xl": "128px",
        "5xl": "160px",
        "section":    "clamp(96px, 12vw, 168px)",
        "section-sm": "clamp(64px, 8vw, 112px)",
      },
      borderRadius: {
        "block": "10px",
        "block-lg": "14px",
        "card": "16px",
        "card-lg": "22px",
      },
      boxShadow: {
        "inset-line": "inset 0 1px 0 0 rgba(255,255,255,0.04)",
        "card": "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 48px -24px rgba(0,0,0,0.6)",
        "lift": "0 24px 64px -24px rgba(0,0,0,0.7), 0 1px 0 0 rgba(255,255,255,0.05) inset",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)",
        "out-expo":  "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
