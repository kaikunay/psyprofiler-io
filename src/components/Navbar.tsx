"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-void/90 backdrop-blur-xl border-b border-violet-500/20"
          : "bg-transparent border-b border-violet-500/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="text-violet-400 text-lg">●</span>
          <span className="font-display font-bold text-lg tracking-tight text-ink">
            PSYPROFILER
          </span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {["INTEL", "AGENTS", "FOUNDRY", "PRICING"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="font-mono text-xs tracking-[0.15em] text-muted hover:text-ink transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="hidden md:block font-mono text-[10px] tracking-[0.18em] text-dim uppercase">
            CLEARANCE: PUBLIC
          </span>
          <a
            href="#founding"
            className="bg-gold text-void font-display font-bold text-xs tracking-wide px-4 py-2 hover:bg-gold-light transition-colors duration-200"
          >
            REQUEST ACCESS →
          </a>
        </div>
      </div>
    </motion.nav>
  );
}