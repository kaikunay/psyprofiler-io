"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-t-2 border-violet-500 animate-spin mx-auto" />
          <p className="font-mono text-xs tracking-widest text-violet-400 animate-pulse">DECRYPTING SESSION...</p>
        </div>
      </div>
    );
  }

  if (!user) return null; // Will redirect

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
          <div>
            <span className="badge bg-gold/10 border border-gold/30 text-gold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse2" />
              INTELLIGENCE COMMAND CENTER
            </span>
            <h1 className="font-display font-black text-3xl md:text-5xl text-ink tracking-tight mt-2">
              WELCOME BACK, <span className="text-gradient-violet">OPERATIVE.</span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identity Widget */}
          <div className="glass p-6 border-l-2 border-l-violet-500">
            <h3 className="font-mono text-[10px] tracking-widest text-dim mb-4">ACTIVE PROFILE</h3>
            <div className="space-y-2">
              <p className="font-mono text-sm text-ink">{user.email}</p>
              <p className="font-mono text-xs text-muted">ID: {user.$id}</p>
              <p className="font-mono text-[10px] text-success mt-4">STATUS: SECURE CONNECTION</p>
            </div>
          </div>

          {/* Credits Widget */}
          <div className="glass p-6 border-l-2 border-l-gold">
            <h3 className="font-mono text-[10px] tracking-widest text-dim mb-4">INTELLIGENCE ASSETS</h3>
            <div className="space-y-1">
              <p className="font-display font-black text-4xl text-ink">0</p>
              <p className="font-mono text-xs text-muted">AVAILABLE SCANS</p>
            </div>
            <button className="mt-6 w-full px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 font-mono text-[10px] tracking-widest transition-colors">
              ACQUIRE CREDITS
            </button>
          </div>

          {/* New Scan Widget */}
          <div className="glass p-6 md:col-span-1 bg-violet-900/10 hover:bg-violet-900/20 transition-colors cursor-pointer group flex flex-col justify-center items-center text-center border-t-2 border-t-violet-400">
            <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-300">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-lg text-ink">NEW PSY-PROFILE</h3>
            <p className="font-mono text-[10px] text-muted tracking-widest mt-2">REQUIRES 1 CREDIT</p>
          </div>
        </div>

        {/* Previous Reports Placeholder */}
        <div className="pt-8">
          <h3 className="font-display font-bold text-xl text-ink mb-6">ARCHIVED INTELLIGENCE</h3>
          <div className="glass p-12 text-center border-dashed border-white/10">
            <p className="font-mono text-sm text-dim tracking-widest">NO PREVIOUS REPORTS DETECTED IN ARCHIVE.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
