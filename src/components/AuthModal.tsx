"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { account, ID } from "@/lib/appwrite";
import { OAuthProvider } from "appwrite";

export default function AuthModal() {
  const { isModalOpen, closeAuthModal, checkSession } = useAuth();
  const [view, setView] = useState<"login" | "signup" | "magic">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isModalOpen) return null;

  const handleOAuth = async (provider: OAuthProvider) => {
    try {
      account.createOAuth2Session(
        provider,
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/`
      );
    } catch (error: any) {
      setStatus("error");
      setErrorMsg(error.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      if (view === "magic") {
        await account.createMagicURLToken(
          ID.unique(),
          email,
          `${window.location.origin}/dashboard`
        );
        setStatus("success");
      } else if (view === "signup") {
        // Appwrite requires user creation then login
        await account.create(ID.unique(), email, password);
        await account.createEmailPasswordSession(email, password);
        await checkSession();
        closeAuthModal();
      } else {
        // Login
        await account.createEmailPasswordSession(email, password);
        await checkSession();
        closeAuthModal();
      }
    } catch (error: any) {
      setStatus("error");
      setErrorMsg(error.message || "Authentication failed. Please try again.");
    }
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
              SECURE CLEARANCE REQUIRED
            </span>
            <h2 className="font-display font-bold text-2xl mt-4 text-ink">
              {view === "magic" && "PASSWORDLESS LOGIN"}
              {view === "login" && "USER AUTHENTICATION"}
              {view === "signup" && "INITIALIZE PROFILE"}
            </h2>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] text-muted tracking-widest mb-1.5 uppercase">
                Secure Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-void border border-violet-500/30 text-ink font-mono text-sm px-4 py-3 placeholder:text-dim focus:outline-none focus:border-violet-400 transition-colors"
                placeholder="operative@domain.com"
              />
            </div>

            {view !== "magic" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="block font-mono text-[10px] text-muted tracking-widest mb-1.5 uppercase mt-4">
                  Passphrase
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-void border border-violet-500/30 text-ink font-mono text-sm px-4 py-3 placeholder:text-dim focus:outline-none focus:border-violet-400 transition-colors"
                  placeholder="••••••••••••"
                />
              </motion.div>
            )}

            {status === "error" && (
              <p className="font-mono text-[11px] text-danger mt-2">{errorMsg}</p>
            )}

            {status === "success" && (
              <p className="font-mono text-[11px] text-success mt-2">
                Magic link deployed to your inbox. Awaiting confirmation...
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-display font-bold py-3 mt-4 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "DECRYPTING..." : 
               view === "magic" ? "SEND MAGIC LINK" :
               view === "signup" ? "INITIALIZE ACCOUNT" : "AUTHENTICATE"}
            </button>
          </form>

          <div className="mt-6 border-t border-white/5 pt-6">
            <button
              onClick={() => handleOAuth(OAuthProvider.Google)}
              className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-ink font-display font-bold py-3 transition-colors border border-white/10"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              CONTINUE WITH GOOGLE
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2 font-mono text-[10px] tracking-wider text-muted text-center pt-2">
            <button onClick={() => setView("magic")} className={`hover:text-gold transition-colors ${view === 'magic' && 'text-gold'}`}>USE MAGIC LINK</button>
            <button onClick={() => setView("login")} className={`hover:text-gold transition-colors ${view === 'login' && 'text-gold'}`}>USE PASSPHRASE</button>
            {view === "login" && (
              <button onClick={() => setView("signup")} className="hover:text-gold transition-colors text-violet-400">CREATE PROFILE INSTEAD</button>
            )}
          </div>
          
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
