"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AuroraBeams from "@/components/effects/AuroraBeams";
import { useAuth } from "@/context/AuthContext";

const TERMINAL_LINES = [
  "> DECRYPTING NEURAL PATHWAY 7... SUCCESS",
  "> CORRELATING CROSS-PLATFORM HANDLES... 14 FOUND",
  "> MAPPING LINGUISTIC FINGERPRINT... MATCH CONFIRMED",
  "> INITIATING PSY-PROFILE SYNTHESIS...",
];

function TerminalPanel() {
  const [lines, setLines] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (current >= TERMINAL_LINES.length) return;
    const line = TERMINAL_LINES[current];
    if (charIdx < line.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLines(prev => [...prev, line]);
        setCurrent(c => c + 1);
        setCharIdx(0);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [current, charIdx]);

  const metrics = [
    { label: "OPENNESS SCORE",   value: "91.4%", pct: 91, color: "bg-violet-500" },
    { label: "DARK TRIAD RISK",  value: "ELEVATED", pct: 78, color: "bg-danger" },
    { label: "BEHAVIORAL MATCH", value: "94.2% CONF.", pct: 94, color: "bg-gold" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass glow-violet rounded-sm p-6 space-y-4 terminal-scanline"
    >
      <div className="flex items-center justify-between border-b border-violet-500/20 pb-3">
        <span className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">
          ACTIVE ANALYSIS — SUBJECT: [REDACTED]
        </span>
        <span className="font-mono text-[10px] text-dim">ID: 9X-214-5</span>
      </div>

      <div className="space-y-3">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="flex justify-between mb-1">
              <span className="font-mono text-[10px] tracking-widest text-muted">{m.label}</span>
              <span className="font-mono text-[10px] text-ink">{m.value}</span>
            </div>
            <div className="h-1 bg-elevated rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.pct}%` }}
                transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
                className={`h-full ${m.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse2" />
        <span className="font-mono text-[10px] text-success tracking-widest">
          REPORT STATUS: READY_FOR_DELIVERY
        </span>
      </div>

      <div className="bg-void/80 rounded-sm p-3 space-y-1 min-h-[100px]">
        {lines.map((line, i) => (
          <p key={i} className="font-mono text-[11px] text-success/80 glow-text-success">{line}</p>
        ))}
        {current < TERMINAL_LINES.length && (
          <p className="font-mono text-[11px] text-success/80 glow-text-success">
            {TERMINAL_LINES[current].slice(0, charIdx)}
            <span className="animate-blink">█</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const { user, openAuthModal } = useAuth();

  return (
    <section id="intel" className="relative min-h-screen pt-24 pb-20 px-6 flex items-center overflow-hidden">
      <AuroraBeams />
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="badge bg-gold/10 border border-gold/30 text-gold">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse2" />
              ACCESS LEVEL — OMEGA
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 48, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display font-black leading-[0.92] tracking-[-0.03em] glow-text-violet"
                style={{ fontSize: "clamp(42px, 6.5vw, 92px)" }}>
              <span className="block text-ink">PEOPLE ARE BEAUTIFUL</span>
              <span className="block text-ink">MYSTERIES. WE JUST HOLD</span>
              <span className="block text-gradient-violet">THE ANSWER KEY.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="font-display font-semibold text-xl md:text-2xl text-violet-200 tracking-tight"
          >
            SKIP THE SMALL TALK.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="text-ink text-lg leading-relaxed max-w-md"
          >
            People are beautifully complex, but their digital habits always leave a trail. Our AI gently decodes their public footprint—giving you a deep, empathetic, and scarily accurate roadmap to their mind.
          </motion.p>

          {user ? (
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              href="/dashboard"
              className="inline-block text-center w-full max-w-sm bg-gold hover:bg-gold-light text-void font-display font-bold text-sm px-6 py-4 transition-colors"
            >
              ACCESS COMMAND CENTER
            </motion.a>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              onClick={openAuthModal}
              className="w-full max-w-sm bg-violet-600 hover:bg-violet-500 text-white font-display font-bold text-sm px-6 py-4 transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center gap-3"
            >
              INITIALIZE SECURE ACCESS
            </motion.button>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="font-mono text-[11px] tracking-[0.15em] text-dim"
          >
            1,247 CLEARED FOR ACCESS
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-muted text-sm leading-relaxed"
          >
            The ultimate human "cheat code" for founders, recruiters,<br />
            and curious minds who want to truly understand someone<br />
            before taking the leap.
          </motion.p>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <TerminalPanel />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="font-mono text-[11px] text-muted text-center"
          >
            Advanced AI profiling based on public data.<br />
            Fast. Accurate. Unbiased.<br />
            The ultimate insight tool.
          </motion.p>
        </div>
      </div>
    </section>
  );
}