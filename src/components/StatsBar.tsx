"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref  = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString("en-IN")}{suffix}</span>;
}

const stats = [
  { value: 12847, suffix: "+",  prefix: "",  label: "PROFILES ANALYZED" },
  { value: 94,    suffix: "%",  prefix: "",  label: "ACCURACY RATE" },
  { value: 7,     suffix: "",   prefix: "",  label: "AI AGENTS ACTIVE" },
  { value: 1176,  suffix: "",   prefix: "",  label: "DAYS FUEL REMAINING" },
];

export default function StatsBar() {
  return (
    <section className="py-16 px-6 border-y border-violet-500/15 bg-deep/30">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center space-y-1"
          >
            <p className="font-display font-black text-ink"
               style={{ fontSize: "clamp(36px,5vw,64px)" }}>
              <Counter end={s.value} suffix={s.suffix} prefix={s.prefix} />
            </p>
            <p className="font-mono text-[10px] tracking-[0.2em] text-dim">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
