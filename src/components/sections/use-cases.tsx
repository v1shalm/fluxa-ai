"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

// ─── Shared Fluxa Icon ──────────────────────────────────────────────────────

function FluxaSparkIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 1.5,
      }}
    >
      <div className="rounded-[2px] bg-flux-cyan" />
      <div className="rounded-[2px] bg-flux-green" />
      <div className="rounded-[2px] bg-flux-purple" />
      <div className="rounded-[2px] bg-flux-pink" />
    </div>
  );
}

// ── Cell 1: AI Agents — Animated live-processing pipeline ─────────────────
// Shows an agent processing pipeline with animated data flowing through nodes
function AgentNotifications() {
  return (
    <div className="relative h-full min-h-[340px] w-full flex items-center justify-center p-6 overflow-hidden">
      {/* Background data pulses */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-grid" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-flux-cyan to-transparent h-1/2"
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 80% at 55% 50%, rgba(34,211,238,0.12), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative w-full max-w-[500px]">
        {/* Animated flow lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 300" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
              <stop offset="30%" stopColor="#22D3EE" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#00FF66" stopOpacity="1" />
              <stop offset="70%" stopColor="#A3FF12" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A3FF12" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <motion.path
            d="M 100 80 C 180 80, 200 150, 250 150 C 300 150, 320 220, 400 220"
            stroke="url(#flowGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            filter="url(#glow)"
          />
        </svg>

        {/* Node 1: Input Trigger */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="absolute left-[0%] top-[10%] z-20"
        >
          <div className="px-5 py-4 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-2 rounded-full bg-flux-cyan shadow-[0_0_10px_#22D3EE] animate-pulse" />
              <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">Live Input</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-[12px] font-medium text-text-secondary">
                <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-text-tertiary">POST</div>
                <span className="font-mono opacity-80">/api/v1/event</span>
              </div>
              <div className="flex items-center gap-3 text-[12px] font-medium text-text-secondary">
                <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-text-tertiary">BODY</div>
                <span className="font-mono opacity-80">&#123; user_id: "782" &#125;</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Node 2: Central Agent Processor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="absolute left-[31%] top-[30%] z-30"
        >
          <div className="group relative">
            {/* Animated outer ring */}
            <motion.div 
              className="absolute -inset-4 rounded-[2.5rem] border border-flux-cyan/20 opacity-20 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="relative p-[1px] rounded-[1.5rem] bg-gradient-to-br from-white/20 via-white/5 to-transparent">
              <div className="px-8 py-7 rounded-[1.5rem] bg-[#0A0A0A] border border-white/5 relative overflow-hidden shadow-2xl">
                {/* Internal scanning laser */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-flux-green/10 to-transparent h-1/2 z-0"
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                <div className="flex items-center gap-5 relative z-10">
                  <div className="size-14 rounded-2xl bg-black inline-flex items-center justify-center border border-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]">
                    <FluxaSparkIcon size={24} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-text-primary tracking-tight leading-none mb-1">Fluxa Core</div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex gap-0.5">
                        {[1,2,3].map(i => <div key={i} className="size-1 rounded-full bg-flux-green animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                      </span>
                      <span className="text-[11px] font-bold text-flux-green uppercase tracking-widest">Optimizing</span>
                    </div>
                  </div>
                </div>

                {/* Telemetry */}
                <div className="mt-7 space-y-3 relative z-10">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Inference Confidence</span>
                    <span className="text-xs font-bold text-text-primary num-tabular">99.82%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-flux-cyan to-flux-green"
                      initial={{ width: 0 }}
                      whileInView={{ width: "99.82%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Node 3: Result/Action */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="absolute right-[0%] bottom-[8%] z-20"
        >
          <div className="px-6 py-5 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-2.5 rounded-full bg-flux-green shadow-[0_0_12px_#00FF66]" />
              <span className="text-[11px] font-bold text-flux-green uppercase tracking-[0.2em]">Success</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-10">
                <span className="text-[11px] font-medium text-text-tertiary">RESOLUTION</span>
                <span className="text-[12px] font-bold text-text-primary tracking-tight">Priority Re-route</span>
              </div>
              <div className="flex items-center justify-between gap-10">
                <span className="text-[11px] font-medium text-text-tertiary">LATENCY</span>
                <span className="text-[12px] font-bold text-text-primary tracking-tight num-tabular">12.4ms</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Cell 2: Integrations — Orbiting logo ring ─────────────────────────────
// Animated ring of integrations orbiting around a central Fluxa icon
function IntegrationsMock() {
  const integrations = [
    { 
      name: "Stripe", 
      color: "#635BFF", 
      x: -110, y: -65, 
      delay: 0,
      Icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M13.962 8.185c0-1.077-.872-1.631-2.316-1.631-2.483 0-4.043 1.258-4.043 1.258L7 6c0 0 1.954-1.536 4.673-1.536 3.12 0 4.887 1.63 4.887 4.258 0 3.731-5.11 4.314-5.11 6.516 0 .565.418.89 1.13.89 2.052 0 3.864-1.121 3.864-1.121l.6 1.832s-1.87 1.66-4.636 1.66c-2.903 0-4.437-1.47-4.437-3.418 0-4.108 5.991-4.707 5.991-6.906z" />
        </svg>
      )
    },
    { 
      name: "Discord", 
      color: "#5865F2", 
      x: 110, y: -75, 
      delay: 0.2,
      Icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.666 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.006 14.006 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 0-1.872-.892.077.077 0 0 0-.081.014 10.174 10.174 0 0 1-.37.292.074.074 0 0 1-.077.01 16.14 16.14 0 0 0 10.226 0 .074.074 0 0 1-.076-.01 9.345 9.345 0 0 1-.37-.292.077.077 0 0 0-.082-.014c-.596.225-1.161.448-1.737.63a.076.076 0 0 0-.04.106c.36.756.772 1.433 1.226 1.994a.077.077 0 0 0 .084.028 19.83 19.83 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
        </svg>
      )
    },
    { 
      name: "GitHub", 
      color: "#FFFFFF", 
      x: -130, y: 35, 
      delay: 0.4,
      Icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      )
    },
    { 
      name: "Slack", 
      color: "#EC4899", 
      x: 135, y: 25, 
      delay: 0.1,
      Icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.527 2.527 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.958 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.527 2.527 0 0 1-2.52 2.521h-2.522v-2.521zM17.688 8.834a2.527 2.527 0 0 1-2.521 2.521 2.527 2.527 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.167 0a2.528 2.528 0 0 1 2.521 2.522v6.312zM15.167 18.958a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.167 24a2.527 2.527 0 0 1-2.522-2.52v-2.522h2.522zM15.167 17.688a2.527 2.527 0 0 1-2.522-2.521 2.527 2.527 0 0 1 2.522-2.521h6.313A2.528 2.528 0 0 1 24 15.167a2.528 2.528 0 0 1-2.52 2.521h-6.313z" />
        </svg>
      )
    },
    { 
      name: "Notion", 
      color: "#FFFFFF", 
      x: -75, y: 95, 
      delay: 0.5,
      Icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M4.459 4.211c.192-.128.448-.192.768-.192h14.209c.32 0 .576.064.768.192.192.128.288.352.288.672v13.568c0 .32-.096.544-.288.672-.192.128-.448.192-.768.192H5.227c-.32 0-.576-.064-.768-.192-.192-.128-.288-.352-.288-.672V4.883c0-.32.096-.544.288-.672zm1.632 12.384h11.818V5.651H6.091v10.944zm1.92-9.024h1.92v1.92H8.011V7.571zm3.84 0h1.92v1.92h-1.92V7.571zm3.84 0h1.92v1.92h-1.92V7.571zm-7.68 3.84h1.92v1.92H8.011v-1.92zm3.84 0h1.92v1.92h-1.92v-1.92zm3.84 0h1.92v1.92h-1.92v-1.92z" />
        </svg>
      )
    },
    { 
      name: "Airtable", 
      color: "#FF4500", 
      x: 75, y: 105, 
      delay: 0.3,
      Icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M12.44 2.19L3.42 6.7c-.55.27-.92.83-.92 1.46v9.02c0 .63.37 1.19.92 1.46l9.02 4.51c.28.14.58.21.88.21s.6-.07.88-.21l9.02-4.51c.55-.27.92-.83.92-1.46V8.16c0-.63-.37-1.19-.92-1.46l-9.02-4.51c-.56-.28-1.2-.28-1.76 0zm.56 2.01l7.1 3.55-7.1 3.55-7.1-3.55 7.1-3.55zm-8.1 5.92l7.1 3.55v7.1l-7.1-3.55v-7.1zm9.1 10.65v-7.1l7.1-3.55v7.1l-7.1 3.55z" />
        </svg>
      )
    },
  ];

  return (
    <div className="relative h-full min-h-[320px] w-full flex items-center justify-center p-8 overflow-hidden bg-[#0A0A0A]">
      {/* Background depth grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-100px)',
          maskImage: 'linear-gradient(to bottom, transparent, black, transparent)'
        }} 
      />

      {/* Central Hub with glowing aura */}
      <div className="relative z-20">
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 40px rgba(168,85,247,0.2)",
              "0 0 80px rgba(168,85,247,0.4)",
              "0 0 40px rgba(168,85,247,0.2)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="size-20 rounded-[2.5rem] bg-black border border-white/10 flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-flux-purple/20 to-flux-pink/20" />
          <FluxaSparkIcon size={32} className="relative z-10" />
        </motion.div>
        
        {/* Connection rays emanating from center */}
        {integrations.map((int, i) => (
          <motion.div
            key={`ray-${int.name}`}
            className="absolute top-1/2 left-1/2 origin-left pointer-events-none"
            style={{ 
              width: Math.sqrt(int.x * int.x + int.y * int.y),
              height: '1px',
              rotate: `${Math.atan2(int.y, int.x) * (180 / Math.PI)}deg`,
              background: `linear-gradient(90deg, ${int.color}40, transparent)`,
              opacity: 0.3
            }}
          />
        ))}
      </div>

      {/* Floating Nodes */}
      {integrations.map((int, i) => (
        <motion.div
          key={int.name}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          whileInView={{ opacity: 1, scale: 1, x: int.x, y: int.y }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring",
            damping: 20,
            stiffness: 80,
            delay: int.delay 
          }}
          className="absolute z-30 group"
        >
          {/* Animated connector path */}
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 pointer-events-none overflow-visible" aria-hidden>
            <motion.path
              d={`M 20 20 L ${-int.x + 20} ${-int.y + 20}`}
              stroke={int.color}
              strokeWidth="0.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.2 }}
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ 
                pathLength: { duration: 1, delay: int.delay },
                strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" }
              }}
            />
          </svg>

          <motion.div
            animate={{ y: [0, i % 2 === 0 ? -10 : 10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div 
              className="size-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-125 group-hover:border-white/30 group-hover:bg-black/60 overflow-hidden relative"
            >
              <div 
                className="absolute inset-0 opacity-10"
                style={{ backgroundColor: int.color }}
              />
              <div className="relative z-10 transition-transform group-hover:scale-110" style={{ color: int.color }}>
                <int.Icon />
              </div>
              
              {/* Pulse effect on node */}
              <motion.div 
                className="absolute inset-0 rounded-full pointer-events-none"
                animate={{ boxShadow: [`0 0 0 0px ${int.color}00`, `0 0 20px 2px ${int.color}20`, `0 0 0 0px ${int.color}00`] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              />
            </div>

            {/* Tooltip on hover */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover:translate-y-0">
              <div className="bg-black/90 px-3 py-1 rounded-lg border border-white/10 shadow-xl whitespace-nowrap">
                <span className="text-[11px] font-bold text-text-primary tracking-wide">{int.name}</span>
              </div>
              <div className="size-2 bg-black/90 rotate-45 border-r border-b border-white/10 mx-auto -mt-1" />
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Floating data particles */}
      {[1,2,3,4].map(i => (
        <motion.div
          key={`particle-${i}`}
          className="absolute size-1 rounded-full bg-white opacity-20 blur-[1px]"
          animate={{ 
            x: [Math.random() * 400 - 200, Math.random() * 400 - 200],
            y: [Math.random() * 300 - 150, Math.random() * 300 - 150],
            opacity: [0, 0.4, 0]
          }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// ── Cell 3: Document parsing — Animated scan effect ───────────────────────
// Shows a document being scanned with a laser line extracting data fields
function ContractMock() {
  return (
    <div className="relative h-full min-h-[240px] w-full flex items-center justify-center py-4 px-4 overflow-hidden">
      {/* Background contract mockup */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="relative w-full max-w-[400px] rounded-[14px] bg-ink-surface/40 border border-ink-line/50 p-5 overflow-hidden"
      >
        {/* Animated scan line */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] pointer-events-none z-20"
          style={{
            background: "linear-gradient(90deg, transparent, #22D3EE 20%, #00FF66 50%, #22D3EE 80%, transparent)",
            boxShadow: "0 0 20px 4px rgba(34,211,238,0.3), 0 0 60px 8px rgba(34,211,238,0.1)",
          }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-hidden
        />

        {/* Document header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-[6px] bg-ink-line/60 inline-flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M4 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.2" className="text-text-tertiary" />
                <path d="M5 6h6M5 8.5h4M5 11h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-text-tertiary" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-text-secondary">Service Agreement</span>
          </div>
          <span className="text-2xs text-text-tertiary">.pdf</span>
        </div>

        {/* Fake document lines */}
        <div className="space-y-2.5 mb-5">
          <div className="h-[6px] w-[85%] rounded-full bg-ink-line/30" />
          <div className="h-[6px] w-[70%] rounded-full bg-ink-line/30" />
          <div className="h-[6px] w-[92%] rounded-full bg-ink-line/30" />
          <div className="h-[6px] w-[60%] rounded-full bg-ink-line/30" />
        </div>

        {/* Extracted fields - appear one by one */}
        <div className="space-y-2">
          {[
            { label: "Customer", value: "Fluxon Inc.", delay: 0.4 },
            { label: "Amount", value: "$24,500.00", delay: 0.7 },
            { label: "Term", value: "12 months", delay: 1.0 },
          ].map((field) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: field.delay, ease }}
              className="flex items-center justify-between px-3 py-2 rounded-[10px] bg-flux-cyan/5 border border-flux-cyan/20"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: field.delay }}
                >
                  <FluxaSparkIcon size={10} />
                </motion.div>
                <span className="text-2xs text-text-tertiary uppercase tracking-wider">{field.label}</span>
              </div>
              <span className="text-xs font-medium text-text-primary num-tabular">{field.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Bottom status */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.4, ease }}
          className="mt-3 flex items-center gap-2 text-2xs text-flux-green"
        >
          <motion.div
            className="size-1.5 rounded-full bg-flux-green"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          3 fields extracted · 99.2% confidence
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Cell config ───────────────────────────────────────────────────────────

type Cell = {
  Mock: React.FC;
  span: string;
  layout: "horizontal" | "vertical";
  title: string;
  body: string;
  cta: string;
};

const cells: Cell[] = [
  {
    Mock: AgentNotifications,
    span: "lg:col-span-12",
    layout: "horizontal",
    title: "Support agents that triage, not just reply.",
    body: "Classify the ticket, pull the customer's plan from Stripe, fetch order history from Postgres, route the right cases to humans. Median time-to-first-response: 2.4 seconds.",
    cta: "See the support flow",
  },
  {
    Mock: IntegrationsMock,
    span: "lg:col-span-6",
    layout: "vertical",
    title: "Wire into the stack you already pay for.",
    body: "Stripe, Slack, GitHub, Notion, Airtable, Postgres, S3, Snowflake. Workflows reach the data without bespoke glue code.",
    cta: "Browse 60+ integrations",
  },
  {
    Mock: ContractMock,
    span: "lg:col-span-6",
    layout: "vertical",
    title: "Turn signed PDFs into structured rows.",
    body: "Service agreements, invoices, COIs. Extract named fields with confidence scores. 99.2% accuracy on the CUAD benchmark.",
    cta: "See document parsing",
  },
];

// ─── Section ───────────────────────────────────────────────────────────────

export function UseCases() {
  return (
    <section id="use-cases" className="py-section">
      <div className="mx-auto w-full max-w-[2240px] px-6 md:px-10 lg:px-20 xl:px-[160px]">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease }}
          className="font-display font-semibold tracking-[-0.03em] leading-[1.02] text-balance max-w-[820px] text-d2 mb-2xl"
        >
          What teams actually ship. <span className="text-text-tertiary">Not toy demos.</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {cells.map((cell, i) => (
            <motion.article
              key={cell.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className={`group relative rounded-card-lg border border-ink-line bg-[#0E0E0E] overflow-hidden ${cell.span}`}
            >
              {cell.layout === "horizontal" ? (
                // Featured wide cell — text left, mock right
                <div className="grid lg:grid-cols-[minmax(280px,1fr)_minmax(0,1.3fr)] gap-md p-6 lg:p-8 md:min-h-[400px]">
                  <div className="flex flex-col justify-between">
                    <h3 className="font-display font-semibold tracking-[-0.025em] leading-[1.05] text-text-primary text-d3 max-w-[360px]">
                      {cell.title}
                    </h3>
                    <div>
                      <p className="text-base text-text-secondary text-pretty max-w-[400px]">
                        {cell.body}
                      </p>
                      <a
                        href="#explore"
                        className="mt-md inline-flex items-center gap-2.5 group/cta"
                      >
                        <span className="size-7 rounded-full border border-ink-line inline-flex items-center justify-center text-text-secondary group-hover/cta:bg-flux-cyan/10 group-hover/cta:border-flux-cyan/40 group-hover/cta:text-flux-cyan transition-colors">
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6h7M6.5 2.5L10 6 6.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="text-sm font-medium text-text-primary">{cell.cta}</span>
                      </a>
                    </div>
                  </div>
                  <div className="relative lg:min-h-[320px]">
                    <cell.Mock />
                  </div>
                </div>
              ) : (
                // Standard cell — mock on top, text below
                <div className="flex flex-col h-full min-h-[420px]">
                  <div className="flex-1 min-h-0 relative">
                    <cell.Mock />
                  </div>
                  <div className="p-6 lg:p-7 border-t border-ink-line/50">
                    <h3 className="font-display font-semibold tracking-[-0.02em] leading-[1.1] text-text-primary text-h1 max-w-[400px]">
                      {cell.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary text-pretty max-w-[440px]">
                      {cell.body}
                    </p>
                    <a
                      href="#explore"
                      className="mt-md inline-flex items-center gap-2.5 group/cta"
                    >
                      <span className="size-7 rounded-full border border-ink-line inline-flex items-center justify-center text-text-secondary group-hover/cta:bg-flux-cyan/10 group-hover/cta:border-flux-cyan/40 group-hover/cta:text-flux-cyan transition-colors">
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6h7M6.5 2.5L10 6 6.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium text-text-primary">{cell.cta}</span>
                    </a>
                  </div>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
