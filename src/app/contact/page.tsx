"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone, Shield, Clock, Building2, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be connected to Appwrite/n8n when backend is ready
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-void">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-void/90 backdrop-blur-xl border-b border-violet-500/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-violet-400 text-lg">●</span>
            <span className="font-display font-bold text-lg tracking-tight text-ink">PSYPROFILER</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 font-mono text-xs tracking-[0.15em] text-muted hover:text-ink transition-colors">
            <ArrowLeft size={14} />
            RETURN TO BASE
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-28 pb-12 px-6 border-b border-violet-500/15">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
            <span className="badge bg-gold/10 border border-gold/30 text-gold">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse2" />
              SECURE COMMUNICATION CHANNEL
            </span>
            <h1 className="font-display font-black text-4xl md:text-5xl text-ink tracking-tight">
              CONTACT <span className="text-gradient-violet">HEADQUARTERS</span>
            </h1>
            <p className="text-muted max-w-lg font-body">
              Reach out through our secure channels. Our intelligence team responds within 24 hours.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Info */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-8">
            {/* Company Details */}
            <div className="glass p-6 space-y-6">
              <h2 className="font-display font-bold text-xl text-ink tracking-tight flex items-center gap-3">
                <Building2 size={20} className="text-violet-400" />
                KUNAYA LABS
              </h2>
              <p className="font-mono text-[10px] tracking-[0.15em] text-gold">
                MSME CERTIFIED ENTERPRISE — GOVERNMENT OF INDIA
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-violet-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] text-dim mb-1">REGISTERED ADDRESS</p>
                    <p className="text-ink text-sm leading-relaxed">
                      Kunaya Labs<br />
                      Bhandara, Maharashtra 441904<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail size={18} className="text-violet-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] text-dim mb-1">PRIMARY CHANNELS</p>
                    <div className="space-y-1">
                      <a href="mailto:support@psyprofiler.io" className="block text-sm text-violet-200 hover:text-ink transition-colors">
                        support@psyprofiler.io
                      </a>
                      <a href="mailto:contact@kunayalab.com" className="block text-sm text-violet-200 hover:text-ink transition-colors">
                        contact@kunayalab.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone size={18} className="text-violet-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] text-dim mb-1">COMMUNICATION LINE</p>
                    <p className="text-ink text-sm">+91 9172082331</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock size={18} className="text-violet-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] text-dim mb-1">OPERATIONAL HOURS</p>
                    <p className="text-ink text-sm">Monday – Saturday: 10:00 – 20:00 IST</p>
                    <p className="text-muted text-xs">Response within 24 hours on business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Channels */}
            <div className="glass p-6 space-y-4">
              <h3 className="font-mono text-[10px] tracking-[0.18em] text-gold">DEPARTMENT CHANNELS</h3>
              <div className="space-y-3">
                {[
                  { dept: "GENERAL INQUIRIES", email: "support@psyprofiler.io", icon: Mail },
                  { dept: "BILLING & REFUNDS", email: "billing@psyprofiler.io", icon: Mail },
                  { dept: "PRIVACY & DATA", email: "privacy@psyprofiler.io", icon: Shield },
                  { dept: "GRIEVANCE OFFICER", email: "grievance@psyprofiler.io", icon: Shield },
                ].map((item) => (
                  <div key={item.dept} className="flex items-center justify-between py-2 border-b border-violet-500/10 last:border-0">
                    <div className="flex items-center gap-2">
                      <item.icon size={12} className="text-dim" />
                      <span className="font-mono text-[10px] tracking-[0.12em] text-muted">{item.dept}</span>
                    </div>
                    <a href={`mailto:${item.email}`} className="font-mono text-[11px] text-violet-200 hover:text-ink transition-colors">
                      {item.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Grievance Officer Card */}
            <div className="glass border-gold/20 bg-gold/5 p-6 space-y-3">
              <h3 className="font-mono text-[10px] tracking-[0.18em] text-gold">
                GRIEVANCE OFFICER — DPDPA 2023 COMPLIANCE
              </h3>
              <p className="text-ink text-sm"><strong>Name:</strong> Kunal Shahare</p>
              <p className="text-ink text-sm"><strong>Designation:</strong> Founder & Grievance Officer</p>
              <p className="text-ink text-sm"><strong>Email:</strong>{" "}
                <a href="mailto:grievance@psyprofiler.io" className="text-violet-400 hover:text-violet-200">
                  grievance@psyprofiler.io
                </a>
              </p>
              <p className="text-muted text-xs mt-2">
                As required under the Information Technology (Intermediary Guidelines) Rules, 2021
                and the Digital Personal Data Protection Act, 2023.
              </p>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="glass p-8 space-y-6 terminal-scanline">
              <div className="flex items-center justify-between border-b border-violet-500/20 pb-4">
                <h2 className="font-display font-bold text-xl text-ink tracking-tight">
                  SEND TRANSMISSION
                </h2>
                <span className="font-mono text-[10px] text-dim">ENCRYPTED_CHANNEL</span>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center space-y-4"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-success/20 border border-success/40 flex items-center justify-center">
                    <span className="text-success text-2xl">✓</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-ink">TRANSMISSION RECEIVED</h3>
                  <p className="text-muted text-sm max-w-sm mx-auto">
                    Our intelligence team has received your message. Expect a response within 24 hours on business days.
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.18em] text-dim">
                    REF: PSY-{Date.now().toString(36).toUpperCase()}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.18em] text-dim mb-2">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-void/80 border border-violet-500/30 text-ink font-body text-sm px-4 py-3 placeholder:text-dim focus:outline-none focus:border-violet-400 transition-colors"
                      placeholder="Enter your name..."
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.18em] text-dim mb-2">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-void/80 border border-violet-500/30 text-ink font-body text-sm px-4 py-3 placeholder:text-dim focus:outline-none focus:border-violet-400 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.18em] text-dim mb-2">
                      SUBJECT *
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-void/80 border border-violet-500/30 text-ink font-body text-sm px-4 py-3 focus:outline-none focus:border-violet-400 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-void text-dim">Select subject...</option>
                      <option value="general" className="bg-void">General Inquiry</option>
                      <option value="support" className="bg-void">Technical Support</option>
                      <option value="billing" className="bg-void">Billing & Payments</option>
                      <option value="refund" className="bg-void">Refund Request</option>
                      <option value="privacy" className="bg-void">Privacy & Data</option>
                      <option value="partnership" className="bg-void">Partnership / Enterprise</option>
                      <option value="grievance" className="bg-void">Grievance / Complaint</option>
                      <option value="other" className="bg-void">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] tracking-[0.18em] text-dim mb-2">
                      MESSAGE *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-void/80 border border-violet-500/30 text-ink font-body text-sm px-4 py-3 placeholder:text-dim focus:outline-none focus:border-violet-400 transition-colors resize-none"
                      placeholder="Describe your inquiry in detail..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gold hover:bg-gold-light text-void font-display font-bold text-sm py-3.5 tracking-wide transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    TRANSMIT MESSAGE
                  </button>
                  <p className="font-mono text-[10px] text-dim text-center">
                    Your data is encrypted and protected under our{" "}
                    <Link href="/privacy" className="text-violet-400 hover:text-violet-200">Privacy Policy</Link>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer - Same as legal pages */}
      <footer className="border-t border-violet-500/15 bg-void">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-violet-400 text-lg">●</span>
                <span className="font-display font-bold text-lg tracking-tight text-ink">PSYPROFILER</span>
              </div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-dim leading-relaxed">
                AI-POWERED PSYCHOLOGICAL<br />INTELLIGENCE PLATFORM<br />BY KUNAYA LABS
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">LEGAL</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">PRODUCT</h4>
              <ul className="space-y-2">
                <li><Link href="/#intel" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">How It Works</Link></li>
                <li><Link href="/#pricing" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">Pricing</Link></li>
                <li><Link href="/#agents" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">AI Agents</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">CONNECT</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">Contact Us</Link></li>
                <li><a href="mailto:support@psyprofiler.io" className="font-mono text-[11px] tracking-wide text-muted hover:text-ink transition-colors">support@psyprofiler.io</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-violet-500/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[11px] tracking-[0.15em] text-dim">© 2026 KUNAYA LABS — ALL RIGHTS RESERVED</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse2" />
              <span className="font-mono text-[10px] tracking-[0.18em] text-success">SECURE_CHANNEL_ACTIVE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
