"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function useCountdown(targetDate: Date) {
  const calc = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
    return {
      days:  Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins:  Math.floor((diff % 3600000)  / 60000),
      secs:  Math.floor((diff % 60000)    / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

export default function FoundingMember() {
  const target = new Date(Date.now() + 2 * 86400000 + 14 * 3600000 + 59 * 60000 + 42000);
  const { days, hours, mins, secs } = useCountdown(target);

  const benefits = [
    'LIFETIME "OPERATOR" RANK IN FOUNDRY',
    "CUSTOM AGENT PARAMETER CONTROLS",
    "DIRECT-LINE INTELLIGENCE REPORTS",
    "CLASSIFIED BETA ACCESS (IMMEDIATE)",
  ];

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section id="founding" className="py-24 px-6 bg-deep/50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <span className="badge bg-gold/10 border border-gold/30 text-gold">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse2" />
            FOUNDING OPERATIVE — LIMITED ACCESS
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-ink tracking-tight">
            FOUNDING INTELLIGENCE MEMBER
          </h2>
          <p className="font-mono text-[11px] tracking-[0.18em] text-dim uppercase">
            Strictly Limited to 50 Seats in Alpha
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-gold glow-gold p-8 md:p-12 space-y-8"
        >
          {/* Price */}
          <div className="text-center">
            <span className="font-mono text-[11px] tracking-[0.18em] text-dim">ACCESS COST</span>
            <p className="font-display font-black text-gold mt-1"
               style={{ fontSize: "clamp(48px, 6vw, 72px)" }}>
              ₹2,499
            </p>
            <span className="font-mono text-sm text-dim">/ ONE-TIME LIFETIME</span>
          </div>

          {/* Countdown */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] text-dim text-center mb-4">
              ACCESS CLOSES IN
            </p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { val: pad(days),  label: "DAYS" },
                { val: pad(hours), label: "HRS" },
                { val: pad(mins),  label: "MIN" },
                { val: pad(secs),  label: "SEC" },
              ].map((unit) => (
                <div key={unit.label} className="bg-void border border-gold/20 p-3 text-center">
                  <p className="font-mono font-bold text-2xl text-gold">{unit.val}</p>
                  <p className="font-mono text-[9px] tracking-widest text-dim mt-1">{unit.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Seats */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-mono text-[10px] text-dim">47 OF 50 FOUNDING SEATS REMAINING</span>
              <span className="font-mono text-[10px] text-gold">94%</span>
            </div>
            <p className="font-mono text-[10px] text-dim mt-3 text-center">
              Alpha access closes permanently when 50 founding seats are claimed.
            </p>
            <div className="h-1.5 bg-void rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "94%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gold"
              />
            </div>
          </div>

          {/* Benefits */}
          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <span className="text-gold font-bold">✓</span>
                <span className="font-mono text-[11px] tracking-[0.12em] text-muted">{b}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button className="w-full bg-gold hover:bg-gold-light text-void font-display font-black text-base py-4 tracking-wide transition-colors">
            SECURE FOUNDING SEAT →
          </button>
        </motion.div>
      </div>
    </section>
  );
}