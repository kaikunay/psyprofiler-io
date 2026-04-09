"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const tiers = [
  {
    level: "LEVEL_01",
    name: "OPERATIVE",
    price: "₹4,999",
    usd: "$60",
    features: [
      "15 DEEP ANALYSES / MONTH",
      "OCEAN + DARK TRIAD PROFILING",
      "PDF REPORT DELIVERY",
      "EMAIL SUPPORT",
    ],
    cta: "INITIATE SESSION →",
    ctaStyle: "border border-violet-500 text-violet-200 hover:bg-violet-500/20",
    recommended: false,
  },
  {
    level: "LEVEL_02",
    name: "INTELLIGENCE FIRM",
    price: "₹9,999",
    usd: "$120",
    features: [
      "60 ANALYSES / MONTH",
      "TEAM DASHBOARD ACCESS",
      "API + WEBHOOK INTEGRATION",
      "PRIORITY SUPPORT (24H)",
    ],
    cta: "ACQUIRE CLEARANCE →",
    ctaStyle: "bg-gold hover:bg-gold-light text-void",
    recommended: true,
  },
  {
    level: "LEVEL_03",
    name: "CLASSIFIED PARTNER",
    price: "₹59,999",
    usd: "$720",
    features: [
      "250 ANALYSES / MONTH",
      "WHITE-LABEL OPTION",
      "DEDICATED ACCOUNT MANAGER",
      "ON-PREMISE AVAILABLE",
    ],
    cta: "REQUEST BRIEFING →",
    ctaStyle: "border border-violet-500 text-violet-200 hover:bg-violet-500/20",
    recommended: false,
  },
];

const faqs = [
  "HOW IS DATA ENCRYPTION HANDLED?",
  "CAN I TRANSITION BETWEEN CLEARANCE LEVELS?",
  "WHAT IS THE 'DEDICATED ACCOUNT MANAGER' SERVICE?",
  "DO YOU OFFER VOLUME DISCOUNTS FOR ENTERPRISES?",
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <span className="badge bg-violet-500/10 border border-violet-500/30 text-violet-200">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse2" />
            PRICING ARCHITECTURE — AUTHORIZED PERSONNEL
          </span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-ink tracking-tight">
            CHOOSE YOUR{" "}
            <span className="text-gradient-violet">INTELLIGENCE CLEARANCE</span>
          </h2>
          <p className="text-muted max-w-lg">
            One report changes a hiring decision.<br />
            One profile saves a ₹50 lakh partnership.<br />
            Choose how many truths you need per month.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="badge bg-gold/10 border border-gold/30 text-gold">
              PRICES IN ₹ INR
            </span>
            <span className="font-mono text-[10px] tracking-[0.12em] text-dim">
              ALL PRICES INCLUSIVE OF 18% GST
            </span>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.level}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative glass p-6 space-y-6 ${
                tier.recommended ? "glow-gold border-gold/30" : "hover:border-violet-400/30"
              } transition-all`}
            >
              {tier.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-void font-mono text-[10px] tracking-widest px-3 py-1 font-bold">
                  RECOMMENDED
                </span>
              )}
              <div>
                <span className="font-mono text-[10px] tracking-[0.18em] text-dim">{tier.level}</span>
                <h3 className="font-display font-black text-xl text-ink mt-1 tracking-tight">
                  {tier.name}
                </h3>
              </div>
              <div>
                <span className="font-display font-black text-4xl text-ink">{tier.price}</span>
                <span className="text-muted text-sm">/MO</span>
                <span className="block font-mono text-[11px] text-dim mt-0.5">{tier.usd}/MO</span>
              </div>
              <ul className="space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={14} className="text-violet-400 mt-0.5 flex-shrink-0" />
                    <span className="font-mono text-[11px] tracking-wide text-muted">{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full font-display font-bold text-sm py-3 tracking-wide transition-colors ${tier.ctaStyle}`}>
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Ad-hoc */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <p className="font-mono text-[11px] tracking-[0.18em] text-dim">NEED A SINGLE SCAN?</p>
          <p className="font-display font-bold text-ink text-lg">
            AD-HOC INTELLIGENCE REPORT —{" "}
            <span className="text-gold">₹750</span>
            <span className="text-muted text-sm font-normal ml-2">($9 USD)</span>
          </p>
          <button className="border border-violet-500/40 text-violet-200 font-mono text-xs tracking-widest px-6 py-2 hover:bg-violet-500/10 transition-colors">
            PURCHASE SINGLE REPORT →
          </button>
        </motion.div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto space-y-2">
          <h3 className="font-display font-bold text-xl text-ink mb-6">TECHNICAL INQUIRIES</h3>
          {faqs.map((q) => (
            <details
              key={q}
              className="group glass border-violet-500/20 hover:border-violet-500/40 transition-colors"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer font-mono text-[11px] tracking-[0.12em] text-muted hover:text-ink transition-colors list-none">
                {q}
                <span className="text-violet-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-4 text-muted text-sm leading-relaxed">
                Contact our team at intel@psyprofiler.io for detailed information about this topic.
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}