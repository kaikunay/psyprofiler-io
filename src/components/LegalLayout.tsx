"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText, Shield, RefreshCcw, Mail } from "lucide-react";

const legalLinks = [
  { href: "/terms", label: "TERMS & CONDITIONS", icon: FileText },
  { href: "/privacy", label: "PRIVACY POLICY", icon: Shield },
  { href: "/refund", label: "REFUND POLICY", icon: RefreshCcw },
  { href: "/contact", label: "CONTACT", icon: Mail },
];

interface TOCItem {
  id: string;
  label: string;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  toc: TOCItem[];
  children: React.ReactNode;
}

export default function LegalLayout({ title, subtitle, lastUpdated, toc, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-void">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-void/90 backdrop-blur-xl border-b border-violet-500/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-violet-400 text-lg">●</span>
            <span className="font-display font-bold text-lg tracking-tight text-ink">
              PSYPROFILER
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-xs tracking-[0.15em] text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} />
            RETURN TO BASE
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="pt-28 pb-12 px-6 border-b border-violet-500/15">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <span className="badge bg-violet-500/10 border border-violet-500/30 text-violet-200">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse2" />
              LEGAL DOCUMENTATION — CLASSIFIED
            </span>
            <h1 className="font-display font-black text-4xl md:text-5xl text-ink tracking-tight">
              {title}
            </h1>
            <p className="text-muted max-w-lg font-body">{subtitle}</p>
            <p className="font-mono text-[10px] tracking-[0.18em] text-dim">
              LAST UPDATED: {lastUpdated} // EFFECTIVE IMMEDIATELY
            </p>
          </motion.div>
        </div>
      </header>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        {/* Sidebar - TOC + Legal Nav */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block"
        >
          <div className="sticky top-24 space-y-8">
            {/* Table of Contents */}
            <div className="glass p-4 space-y-3">
              <h3 className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">
                TABLE OF CONTENTS
              </h3>
              <ul className="space-y-1">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block font-mono text-[11px] tracking-wide text-muted hover:text-ink hover:bg-violet-500/10 px-2 py-1.5 transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other Legal Pages */}
            <div className="glass p-4 space-y-3">
              <h3 className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">
                RELATED DOCUMENTS
              </h3>
              <ul className="space-y-1">
                {legalLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-muted hover:text-ink hover:bg-violet-500/10 px-2 py-1.5 transition-colors"
                      >
                        <Icon size={12} className="text-violet-400 flex-shrink-0" />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="legal-content min-w-0"
        >
          {children}
        </motion.main>
      </div>

      {/* Footer */}
      <footer className="border-t border-violet-500/15 bg-void">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-violet-400 text-lg">●</span>
                <span className="font-display font-bold text-lg tracking-tight text-ink">PSYPROFILER</span>
              </div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-dim leading-relaxed">
                AI-POWERED PSYCHOLOGICAL<br />
                INTELLIGENCE PLATFORM<br />
                BY KUNAYA LAB
              </p>
              <p className="font-mono text-[10px] tracking-[0.12em] text-dim">
                MSME CERTIFIED // BHANDARA, MH, INDIA
              </p>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">LEGAL</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">Refund Policy</Link></li>
              </ul>
            </div>

            {/* Product */}
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">PRODUCT</h4>
              <ul className="space-y-2">
                <li><Link href="/#intel" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">How It Works</Link></li>
                <li><Link href="/#pricing" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">Pricing</Link></li>
                <li><Link href="/#agents" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">AI Agents</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">CONNECT</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">Contact Us</Link></li>
                <li><a href="mailto:support@psyprofiler.io" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">support@psyprofiler.io</a></li>
                <li><a href="mailto:contact@kunayalab.com" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">contact@kunayalab.com</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-violet-500/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[11px] tracking-[0.15em] text-dim">
              © 2026 KUNAYA LAB — ALL RIGHTS RESERVED
            </span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse2" />
              <span className="font-mono text-[10px] tracking-[0.18em] text-success">
                SECURE_CHANNEL_ACTIVE
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
