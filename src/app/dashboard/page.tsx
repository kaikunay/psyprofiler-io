"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { databases, ID } from "@/lib/appwrite";
import { Permission, Role, Query } from "appwrite";

interface ProfileDocument {
  $id: string;
  targetName: string;
  status: string;
  documentId?: string;
  fileId?: string;
  $createdAt: string;
}

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  
  const [profiles, setProfiles] = useState<ProfileDocument[]>([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [targetName, setTargetName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  const fetchProfiles = async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID || 'profiles',
        [Query.orderDesc("$createdAt")]
      );
      setProfiles(response.documents as unknown as ProfileDocument[]);
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    } finally {
      setDbLoading(false);
    }
  };

  const requestNewProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName || !user) return;
    setIsSubmitting(true);
    
    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROFILES_COLLECTION_ID || 'profiles',
        ID.unique(),
        {
          userId: user.$id,
          targetName: targetName,
          status: 'queued'
        },
        [
          // Document-Level Security: Only the user who created it can read it
          Permission.read(Role.user(user.$id))
        ]
      );
      
      setTargetName("");
      setIsScanModalOpen(false);
      fetchProfiles(); // Refresh the list
    } catch (error) {
      console.error("Failed to queue profile:", error);
      alert("Failed to queue intelligence report. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || (!user && !isLoading)) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-t-2 border-violet-500 animate-spin mx-auto" />
          <p className="font-mono text-xs tracking-widest text-violet-400 animate-pulse">DECRYPTING SESSION...</p>
        </div>
      </div>
    );
  }

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
              WELCOME BACK, <span className="text-gradient-violet uppercase">{user.email?.split('@')[0] || 'OPERATIVE'}</span>.
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identity Widget */}
          <div className="glass p-6 border-l-2 border-l-violet-500 relative overflow-hidden">
            <h3 className="font-mono text-[10px] tracking-widest text-dim mb-4">ACTIVE PROFILE</h3>
            <div className="space-y-2 relative z-10">
              <p className="font-mono text-sm text-ink">{user.email}</p>
              <p className="font-mono text-[10px] text-muted tracking-widest truncate">ID: {user.$id}</p>
              <p className="font-mono text-[10px] text-success mt-4 tracking-widest">● STATUS: SECURE CONNECTION</p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
          </div>

          {/* Credits Widget */}
          <div className="glass p-6 border-l-2 border-l-gold relative overflow-hidden">
            <h3 className="font-mono text-[10px] tracking-widest text-dim mb-4">INTELLIGENCE ASSETS</h3>
            <div className="space-y-1 relative z-10">
              <p className="font-display font-black text-4xl text-gold glow-text-gold">10</p>
              <p className="font-mono text-[10px] text-muted tracking-widest">AVAILABLE SCANS (EDUCATION PLAN)</p>
            </div>
            <button className="mt-6 w-full px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 font-mono text-[10px] tracking-widest transition-colors relative z-10">
              ACQUIRE MORE CREDITS
            </button>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-gold/5 rounded-full blur-2xl" />
          </div>

          {/* New Scan Widget */}
          <div 
            onClick={() => setIsScanModalOpen(true)}
            className="glass p-6 md:col-span-1 bg-violet-900/10 hover:bg-violet-900/20 transition-colors cursor-pointer group flex flex-col justify-center items-center text-center border-t-2 border-t-violet-400"
          >
            <div className="w-12 h-12 rounded-full bg-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-300">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-lg text-ink">QUEUE NEW TARGET</h3>
            <p className="font-mono text-[10px] text-muted tracking-widest mt-2 uppercase">1 CREDIT DEDUCTION</p>
          </div>
        </div>

        {/* Previous Reports */}
        <div className="pt-8">
          <h3 className="font-display font-bold text-xl text-ink mb-6 flex items-center gap-3">
            ARCHIVED INTELLIGENCE
            {dbLoading && <span className="w-3 h-3 border-t-2 border-violet-500 rounded-full animate-spin" />}
          </h3>
          
          {!dbLoading && profiles.length === 0 ? (
            <div className="glass p-12 text-center border-dashed border-white/10">
              <p className="font-mono text-sm text-dim tracking-widest">NO PREVIOUS REPORTS DETECTED IN ARCHIVE.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((p) => (
                <div key={p.$id} className="glass border border-white/5 p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="space-y-1">
                    <p className="font-mono text-sm tracking-widest text-ink uppercase">{p.targetName}</p>
                    <p className="font-mono text-[10px] text-muted">{new Date(p.$createdAt).toLocaleDateString()} — ID: {p.$id.slice(-6)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {p.status === 'queued' && <span className="font-mono text-[10px] tracking-widest text-gold animate-pulse">QUEUED</span>}
                    {p.status === 'processing' && <span className="font-mono text-[10px] tracking-widest text-violet-400 animate-pulse">SYNTHESIZING...</span>}
                    {p.status === 'completed' && <span className="font-mono text-[10px] tracking-widest text-success">COMPLETED</span>}
                    
                    <button 
                      disabled={p.status !== 'completed'} 
                      className="px-4 py-2 border border-white/10 text-[10px] font-mono tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-violet-500/20 transition-colors"
                    >
                      DOWNLOAD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* New Scan Modal */}
      <AnimatePresence>
        {isScanModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-surface border border-violet-500/30 p-8 glass"
            >
              <h2 className="font-display font-bold text-2xl text-ink mb-2">TARGET ACQUISITION</h2>
              <p className="font-mono text-[10px] tracking-widest text-dim mb-6">INPUT PUBLIC IDENTIFIER FOR AI RECONNAISSANCE.</p>
              
              <form onSubmit={requestNewProfile} className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] text-muted tracking-widest mb-1.5 uppercase">Target Identity (Social Handle, Name, DB ID)</label>
                  <input
                    type="text"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    required
                    className="w-full bg-void border border-violet-500/30 text-ink font-mono text-sm px-4 py-3 focus:outline-none focus:border-violet-400 transition-colors focus:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    placeholder="@target_profile"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsScanModalOpen(false)}
                    className="flex-1 border border-white/10 hover:bg-white/5 font-mono text-[10px] tracking-widest py-3 uppercase transition-colors"
                  >
                    ABORT
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-mono font-bold text-[10px] tracking-widest py-3 uppercase transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'UPLOADING...' : 'INITIATE RECON'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
