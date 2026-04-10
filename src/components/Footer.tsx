"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-violet-500/15 bg-void">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-violet-400 text-lg">●</span>
              <span className="font-display font-bold text-lg tracking-tight text-ink">
                PSYPROFILER
              </span>
            </Link>
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
            <h4 className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">
              LEGAL
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors"
                >
                  Refund & Cancellation
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">
              PRODUCT
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#intel"
                  className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#agents"
                  className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors"
                >
                  AI Agents
                </a>
              </li>
              <li>
                <a
                  href="#sachi"
                  className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors"
                >
                  Meet Sachi
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">
              CONNECT
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@psyprofiler.io"
                  className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors"
                >
                  support@psyprofiler.io
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@kunayalab.com"
                  className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors"
                >
                  contact@kunayalab.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-violet-500/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[11px] tracking-[0.15em] text-dim">
            © 2026 KUNAYA LAB — ALL RIGHTS RESERVED
          </span>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link href="/terms" className="font-mono text-[10px] tracking-[0.15em] text-dim hover:text-muted transition-colors">
                TERMS
              </Link>
              <Link href="/privacy" className="font-mono text-[10px] tracking-[0.15em] text-dim hover:text-muted transition-colors">
                PRIVACY
              </Link>
              <Link href="/refund" className="font-mono text-[10px] tracking-[0.15em] text-dim hover:text-muted transition-colors">
                REFUND
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse2" />
              <span className="font-mono text-[10px] tracking-[0.18em] text-success">
                SECURE_CHANNEL_ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}