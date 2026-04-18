"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";

export default function AuthModal() {
  const { isModalOpen, closeAuthModal } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  if (!isModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setStatus("loading");
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-surface border border-violet-500/20 rounded-md p-8 shadow-2xl glass"
        >
          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-dim hover:text-ink transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-8">
            <span className="badge bg-violet-500/10 border border-violet-500/30 text-violet-300 mb-4">
              INTELLIGENCE PLATFORM
            </span>
            <h2 className="font-display font-bold text-2xl mt-4 text-ink">
              ACCESS YOUR COMMAND CENTER
            </h2>
            <p className="font-mono text-[10px] tracking-widest text-dim mt-2">
              SIGN IN TO QUEUE INTELLIGENCE OPERATIONS
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={status === "loading"}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-ink font-display font-bold py-4 transition-colors border border-white/10 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {status === "loading" ? "CONNECTING..." : "CONTINUE WITH GOOGLE"}
          </button>

          <p className="font-mono text-[9px] text-dim text-center mt-6 tracking-wider">
            SECURE · FIRST-PARTY · NO THIRD-PARTY COOKIES
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
