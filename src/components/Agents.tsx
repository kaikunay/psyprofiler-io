"use client";
import { motion } from "framer-motion";

const agents = [
  { id: "AGENT_01", name: "PHANTOM", desc: "Primary data collection across all platforms. Maps every digital footprint." },
  { id: "AGENT_02", name: "SCOUT",   desc: "Cross-references identities across LinkedIn, Twitter, Instagram, Reddit simultaneously." },
  { id: "AGENT_03", name: "WEAVER",  desc: "Connects disparate digital identities into a single unified psychographic profile." },
  { id: "AGENT_04", name: "HERALD",  desc: "Deep behavioral pattern analysis. OCEAN scoring and linguistic fingerprinting." },
  { id: "AGENT_05", name: "FORGE",   desc: "Dark Triad and Schwartz Values framework mapping. Identifies hidden motivations." },
  { id: "AGENT_06", name: "LEDGER",  desc: "Synthesis engine. Produces confidence scores and reconciles conflicting signals." },
  { id: "AGENT_07", name: "AEGIS",   desc: "Quality control and security. Validates all outputs before report delivery." },
];

export default function Agents() {
  return (
    <section id="agents" className="py-24 px-6 bg-deep/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 space-y-6"
        >
          <span className="badge bg-violet-500/10 border border-violet-500/30 text-violet-200">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse2" />
            SYSTEM ARCHITECTURE — CLASSIFIED
          </span>
          <h2 className="font-display font-black text-4xl md:text-6xl text-ink tracking-tight">
            7 AGENTS.<br />
            <span className="text-gradient-violet">ONE TRUTH.</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse2" />
            <span className="font-mono text-[11px] tracking-[0.18em] text-success">
              STATUS: SYSTEM_WIDE_SCAN_ACTIVE
            </span>
          </div>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent" />

          <div className="space-y-2">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-6 group"
              >
                {/* Node */}
                <div className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-violet-500 group-hover:bg-violet-200 transition-colors ring-4 ring-violet-500/20" />
                </div>

                {/* Content */}
                <div className="flex-1 glass p-4 hover:border-violet-400/40 transition-all duration-200 group-hover:glow-violet">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-[10px] text-dim tracking-widest">{agent.id}</span>
                    <span className="font-display font-bold text-ink text-base tracking-wide">
                      {agent.name}
                    </span>
                  </div>
                  <p className="text-muted text-sm leading-relaxed">{agent.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}