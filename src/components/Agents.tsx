"use client";
import { motion } from "framer-motion";

const agents = [
  { id: "NODE_01", name: "PULSE DISCOVERY", desc: "Scans the open web for scattered digital fragments, mapping the initial footprint." },
  { id: "NODE_02", name: "IDENTITY RESOLUTION", desc: "Cross-references disparate accounts to verify true identity and eliminate noise." },
  { id: "NODE_03", name: "CONTEXT MAPPING", desc: "Places isolated digital actions into their proper situational and temporal context." },
  { id: "NODE_04", name: "LINGUISTIC DECODING", desc: "Analyzes vocabulary and syntax to reveal unspoken cognitive baselines." },
  { id: "NODE_05", name: "BEHAVIORAL EXTRAPOLATION", desc: "Translates historical online actions into highly predictable behavioral models." },
  { id: "NODE_06", name: "MOTIVE EXTRACTION", desc: "Uncovers the hidden personal and professional incentives driving their decisions." },
  { id: "NODE_07", name: "RISK CALIBRATION", desc: "Flags inconsistencies, potential volatility, or hidden behavioral blind spots." },
  { id: "NODE_08", name: "INSIGHT SYNTHESIS", desc: "Weaves fragmented data points into a single cohesive psychological portrait." },
  { id: "NODE_09", name: "CONFIDENCE SCORING", desc: "Assigns a strict statistical reliability metric to every generated insight." },
];

export default function Agents() {
  return (
    <section id="agents" className="py-24 px-6 bg-deep/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 space-y-6"
        >
          <span className="badge bg-violet-500/10 border border-violet-500/30 text-violet-200">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse2" />
            OUR TECHNOLOGY ENGINE
          </span>
          <h2 className="font-display font-black text-4xl md:text-6xl text-ink tracking-tight">
            POWERED BY<br />
            <span className="text-gradient-violet">ADVANCED AI.</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse2" />
            <span className="font-mono text-[11px] tracking-[0.18em] text-success">
              STATUS: ENGINE OPTIMIZING
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
                initial={{ opacity: 0, x: -40, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 1.2, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
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