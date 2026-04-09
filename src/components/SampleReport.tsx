"use client";
import { motion } from "framer-motion";

const OCEAN = [
  { trait: "OPENNESS",          score: 91, color: "bg-violet-500" },
  { trait: "CONSCIENTIOUSNESS", score: 44, color: "bg-gold" },
  { trait: "EXTRAVERSION",      score: 28, color: "bg-violet-700" },
  { trait: "AGREEABLENESS",     score: 19, color: "bg-danger" },
  { trait: "NEUROTICISM",       score: 78, color: "bg-danger" },
];

export default function SampleReport() {
  return (
    <section className="py-24 px-6 bg-deep/40">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 space-y-3"
        >
          <span className="badge bg-danger/10 border border-danger/30 text-danger">
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse2" />
            SAMPLE INTELLIGENCE REPORT — REDACTED FOR PREVIEW
          </span>
          <p className="text-muted font-mono text-xs tracking-widest">
            THIS IS WHAT YOU RECEIVE. SUBJECT DATA CLASSIFIED.
          </p>
        </motion.div>

        {/* Report Card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.93 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* CLASSIFIED stamp */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div
              className="border-4 border-danger/70 px-8 py-3 rotate-[-15deg]"
              style={{ boxShadow: "0 0 40px rgba(255,51,102,0.3)" }}
            >
              <span className="font-display font-black text-danger/70 text-3xl tracking-[0.3em]">
                CLASSIFIED
              </span>
            </div>
          </div>

          {/* Report content — blurred */}
          <div
            className="glass glow-violet p-8 space-y-6"
            style={{ filter: "blur(3px)", userSelect: "none" }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-violet-500/20 pb-4">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-gold tracking-widest">
                  KUNAYA LAB // PSYPROFILER
                </span>
                <p className="font-display font-bold text-ink text-lg">
                  PSYCHOLOGICAL INTELLIGENCE REPORT
                </p>
                <p className="font-mono text-[10px] text-dim">
                  REPORT ID: PSY-2026-████ // CLEARANCE: OPERATOR
                </p>
              </div>
              <div className="text-right space-y-1">
                <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-500/40 flex items-center justify-center">
                  <span className="text-2xl text-muted">?</span>
                </div>
                <p className="font-mono text-[9px] text-dim">SUBJECT: [REDACTED]</p>
              </div>
            </div>

            {/* OCEAN scores */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] tracking-widest text-violet-200">
                OCEAN PSYCHOMETRIC PROFILE
              </span>
              {OCEAN.map((o) => (
                <div key={o.trait}>
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-[10px] text-muted">{o.trait}</span>
                    <span className="font-mono text-[10px] text-ink">{o.score}%</span>
                  </div>
                  <div className="h-1.5 bg-elevated rounded-full">
                    <div
                      className={`h-full ${o.color} rounded-full`}
                      style={{ width: `${o.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Dark Triad */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "NARCISSISM",    level: "HIGH",     color: "border-danger text-danger" },
                { name: "MACHIAVELLIANISM", level: "ELEVATED", color: "border-gold text-gold" },
                { name: "PSYCHOPATHY",   level: "MODERATE", color: "border-violet-400 text-violet-200" },
              ].map((d) => (
                <div key={d.name} className={`border ${d.color} p-3 text-center`}>
                  <p className="font-mono text-[9px] tracking-widest text-dim">{d.name}</p>
                  <p className={`font-display font-bold text-sm ${d.color.split(" ")[1]}`}>
                    {d.level}
                  </p>
                </div>
              ))}
            </div>

            {/* Summary row */}
            <div className="bg-void/60 p-4 border-l-2 border-danger">
              <span className="font-mono text-[10px] text-danger tracking-widest">
                ⚠ RISK ASSESSMENT: ELEVATED — REVIEW BEFORE ENGAGEMENT
              </span>
              <p className="text-muted text-xs mt-1 leading-relaxed">
                Subject demonstrates persistent patterns of self-serving behavior with
                above-average capacity for social manipulation. Cross-platform linguistic
                analysis confirms ████████████████████████████████.
              </p>
            </div>
          </div>

          {/* Unblur teaser at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 z-20"
            style={{ background: "linear-gradient(to bottom, transparent, #080816)" }}
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-10 space-y-3"
        >
          <p className="font-mono text-[11px] text-dim tracking-widest">
            YOUR REPORT WILL BE FULLY UNREDACTED
          </p>
          <a
            href="#intel"
            className="inline-block bg-gold hover:bg-gold-light text-void font-display font-black text-sm px-8 py-4 transition-colors shadow-lg shadow-gold/20 hover:shadow-gold/40"
          >
            JOIN WAITLIST FOR ACCESS →
          </a>
        </motion.div>

      </div>
    </section>
  );
}
