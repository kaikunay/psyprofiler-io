"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, MouseEvent } from "react";

const modules = [
  { id: "MODULE_01", title: "BEHAVIORAL SIGNATURE",       icon: "◈", desc: "Detecting deep-layer psychological patterns across decentralized networks. We identify the 'who' before they even speak." },
  { id: "MODULE_02", title: "DARK TRIAD MAPPING",         icon: "◬", desc: "Advanced risk assessment of manipulative entities. Isolate malicious intent in market movements and social engineering." },
  { id: "MODULE_03", title: "CROSS-PLATFORM INTELLIGENCE",icon: "⬡", desc: "Unified intelligence gathering from high-noise environments. Data refined into actionable psychological profiles." },
];

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref  = useRef<HTMLDivElement>(null);
  const x    = useMotionValue(0);
  const y    = useMotionValue(0);
  const rx   = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]),  { stiffness: 300, damping: 30 });
  const ry   = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]),  { stiffness: 300, damping: 30 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width  - 0.5);
    y.set((e.clientY - rect.top)  / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="glass p-6 space-y-4 hover:border-violet-400/40 transition-colors cursor-default"
    >
      {children}
    </motion.div>
  );
}

export default function Capabilities() {
  return (
    <section id="foundry" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 space-y-6"
        >
          <span className="badge bg-violet-500/10 border border-violet-500/30 text-violet-200">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse2" />
            CAPABILITY OVERVIEW — RESTRICTED
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-ink tracking-tight max-w-2xl">
            YOU ALREADY FEEL IT.{" "}
            <span className="text-gradient-violet">NOW YOU CAN PROVE IT.</span>
          </h2>
          <p className="text-muted max-w-xl leading-relaxed">
            The invisible patterns of human behavior are now visible. Every digital shadow,
            every micro-transaction, every behavioral loop — mapped in real-time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: "1200px" }}>
          {modules.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 1.4, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-dim">{m.id}</span>
                  <span className="text-2xl text-violet-400">{m.icon}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-ink tracking-tight">{m.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{m.desc}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}