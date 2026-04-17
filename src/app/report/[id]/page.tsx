// src/app/report/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip 
} from 'recharts';
import { 
  ShieldAlert, BrainCircuit, Target, Network, Workflow, Download, Lock, Loader2 
} from 'lucide-react';
import { useParams } from 'next/navigation';
import type { ProfileReport } from '@/lib/agents/types';

const Section = ({ title, icon: Icon, children, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className="p-6 md:p-8 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300">
        <Icon size={18} />
      </div>
      <h2 className="text-lg font-mono font-medium tracking-widest uppercase text-white/90">
        {title}
      </h2>
    </div>
    <div className="relative z-10">{children}</div>
  </motion.div>
);

export default function ReportPage() {
  const params = useParams();
  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  
  const [mounted, setMounted] = useState(false);
  const [report, setReport] = useState<ProfileReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    document.body.style.backgroundColor = '#000000';

    if (!idParam) return;
    
    // Check if ID starts with DEMO to show mock data
    if (idParam.toString().startsWith('DEMO')) {
      // Mock data logic remains in place as a seamless fallback
      setTimeout(() => {
        setReport(null); // Indicates fallback data should be used
        setLoading(false);
      }, 1000);
      return;
    }

    async function fetchReport() {
      try {
        const response = await fetch(`/api/profiles/${idParam}`);
        const data = await response.json();
        
        if (data.success && data.report) {
          setReport(data.report);
        } else if (data.profile?.status === 'analyzing' || data.profile?.status === 'queued') {
          setError('Analysis is still in progress...');
        } else {
          setError(data.error || 'Failed to load report');
        }
      } catch (err: any) {
        setError('Connection error');
      } finally {
        setLoading(false);
      }
    }
    
    fetchReport();
  }, [idParam]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-neutral-500 font-mono">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="tracking-widest uppercase">Decrypting Intelligence Package...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-rose-500 font-mono">
        <ShieldAlert className="mb-4" size={48} />
        <p className="tracking-widest uppercase text-lg">{error}</p>
        <p className="text-sm mt-2 text-neutral-500">ID: {idParam}</p>
      </div>
    );
  }

  // Use real data, or fallback to Mock Data if requested
  const isMock = !report;
  
  const oceanData = isMock ? [
    { subject: 'Openness', A: 90, fullMark: 100 },
    { subject: 'Conscientiousness', A: 85, fullMark: 100 },
    { subject: 'Extraversion', A: 60, fullMark: 100 },
    { subject: 'Agreeableness', A: 40, fullMark: 100 },
    { subject: 'Neuroticism', A: 75, fullMark: 100 },
    { subject: 'Honesty-Humility', A: 30, fullMark: 100 },
  ] : [
    { subject: 'Openness', A: report.analysis.ocean.openness.score * 10, fullMark: 100 },
    { subject: 'Conscientiousness', A: report.analysis.ocean.conscientiousness.score * 10, fullMark: 100 },
    { subject: 'Extraversion', A: report.analysis.ocean.extraversion.score * 10, fullMark: 100 },
    { subject: 'Agreeableness', A: report.analysis.ocean.agreeableness.score * 10, fullMark: 100 },
    { subject: 'Neuroticism', A: report.analysis.ocean.neuroticism.score * 10, fullMark: 100 },
    { subject: 'Honesty', A: report.analysis.ocean.honestyHumility.score * 10, fullMark: 100 },
  ];

  const darkTriadData = isMock ? [
    { subject: 'Machiavellianism', A: 95, fullMark: 100 },
    { subject: 'Narcissism', A: 80, fullMark: 100 },
    { subject: 'Psychopathy', A: 65, fullMark: 100 },
    { subject: 'D-Factor', A: 85, fullMark: 100 },
  ] : [
    { subject: 'Machiavellianism', A: report.analysis.darkTriad.machiavellianism.score * 10, fullMark: 100 },
    { subject: 'Narcissism', A: report.analysis.darkTriad.narcissism.score * 10, fullMark: 100 },
    { subject: 'Psychopathy', A: report.analysis.darkTriad.psychopathy.score * 10, fullMark: 100 },
    { subject: 'D-Factor', A: report.analysis.darkTriad.dFactor.score * 10, fullMark: 100 },
  ];

  const targetName = isMock ? 'Unknown Target' : report.targetName;
  const executiveSummary = isMock ? "Target exhibits a highly calibrated Dark Triad cognitive profile..." : report.executiveSummary;
  const attachmentStyle = isMock ? "Dismissive-Avoidant" : report.analysis.attachment.primaryStyle.replace(/_/g, ' ');
  const vectors = isMock ? ['Information Control', 'Emotional Leverage'] : report.analysis.darkTriad.manipulationVectors;

  const asix = isMock ? { sattva: 15, rajas: 75, tamas: 10 } : report.analysis.asix;

  return (
    <div className="min-h-screen bg-black text-neutral-400 font-sans selection:bg-white/20 pb-24">
      {/* ── CINEMATIC HEADER ── */}
      <header className="relative w-full border-b border-white/10 bg-black/50 backdrop-blur-3xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ShieldAlert className="text-white animate-pulse" size={24} />
            <div>
              <h1 className="text-white font-mono text-xl md:text-2xl font-bold tracking-[0.2em] uppercase">
                CLASSIFIED DOSSIER
              </h1>
              <p className="font-mono text-xs text-neutral-500 mt-1 tracking-wider">
                SUBJECT: {targetName} // ID: {idParam} // LEVEL 5 CLEARANCE
              </p>
            </div>
          </div>
          <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-md border border-white/10 hover:bg-white/5 transition-colors font-mono text-sm text-white" onClick={() => window.print()}>
            <Download size={14} /> PRINT TO PDF
          </button>
        </div>
      </header>

      {/* ── MAIN GRID ── */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Top Intelligence Summary */}
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1 }}
          className="mb-12 p-8 rounded-2xl border border-rose-900/30 bg-gradient-to-br from-rose-950/10 to-black relative overflow-hidden flex flex-col md:flex-row gap-8 items-center"
        >
          <Lock className="absolute top-1/2 -translate-y-1/2 right-8 text-rose-500/10" size={160} strokeWidth={1} />
          
          {/* Avatar / Soul Sculpture Container */}
          <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-full border border-rose-500/30 bg-rose-950/20 overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.1)] z-10">
            {/* The Vertex AI Imagen generated "soul sculpture" goes here */}
            {report?.soulSculptureBase64 ? (
               <img 
                 src={`data:image/jpeg;base64,${report.soulSculptureBase64}`} 
                 alt="Soul Sculpture"
                 className="w-full h-full object-cover mix-blend-screen opacity-50"
                 onError={(e) => (e.currentTarget.style.display = 'none')}
               />
            ) : (
               <BrainCircuit size={48} className="text-rose-500/30" strokeWidth={1} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
            <div className="absolute bottom-4 left-0 right-0 text-center uppercase tracking-widest text-[10px] text-rose-300/70 font-mono">
              Soul Sculpture
            </div>
          </div>

          <div className="z-10 relative">
            <h2 className="text-rose-500 font-mono tracking-widest mb-4 flex items-center gap-3">
              <Target size={16} /> EXECUTIVE SYNTHESIS
            </h2>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
              "{executiveSummary}"
            </p>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* OCEAN / HEXACO */}
          <Section title="Cognitive Architecture (MAKISE)" icon={BrainCircuit} delay={0.2}>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={oceanData}>
                  <PolarGrid stroke="#333" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 11, fontFamily: 'monospace' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Cognitive Profile" dataKey="A" stroke="#fff" fill="#fff" fillOpacity={0.1} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          {/* DARK TRIAD */}
          <Section title="Operational Risk (MERUEM)" icon={Target} delay={0.4}>
            <div className="h-[350px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={darkTriadData}>
                  <PolarGrid stroke="#333" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 11, fontFamily: 'monospace' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Dark Triad" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.15} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #4c0519', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.05),transparent_70%)] pointer-events-none" />
            </div>
          </Section>

          {/* ATTACHMENT & VECTORS */}
          <Section title="Vulnerability Vectors (HANGE)" icon={Network} delay={0.6}>
            <div className="space-y-6">
               <div className="p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                  <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Primary Attachment Style</p>
                  <p className="text-lg text-white font-medium capitalize">{attachmentStyle.toLowerCase()}</p>
               </div>
               <div>
                 <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Identified Manipulation Vectors</p>
                 <div className="flex flex-wrap gap-2">
                   {vectors.map((vec, i) => (
                     <span key={i} className="px-3 py-1 text-sm border border-rose-900/50 bg-rose-950/20 text-rose-300 rounded font-mono">
                       {vec}
                     </span>
                   ))}
                 </div>
               </div>
            </div>
          </Section>

          {/* ASIX / VEDIC */}
          <Section title="ASIX Evolution (YOGI)" icon={Workflow} delay={0.8}>
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between p-4 border border-white/5 rounded-lg">
                <span className="font-mono text-xs tracking-wider text-neutral-400">SATTVA (Purity/Wisdom)</span>
                <span className="text-white font-mono">{asix.sattva}%</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-white/5 rounded-lg bg-white/[0.02]">
                <span className="font-mono text-xs tracking-wider text-neutral-400">RAJAS (Action/Passion)</span>
                <span className="text-white font-bold font-mono">{asix.rajas}%</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-white/5 rounded-lg">
                <span className="font-mono text-xs tracking-wider text-neutral-400">TAMAS (Inertia/Ignorance)</span>
                <span className="text-white font-mono">{asix.tamas}%</span>
              </div>
            </div>
          </Section>

        </div>
      </main>
      
      {/* CSS For Print PDF via Headless Browser */}
      <style jsx global>{`
        @media print {
          body { 
            background: black !important;
            color: white !important;
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
          }
          header button { display: none; }
          .min-h-screen { min-height: auto; padding-bottom: 0; }
          * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
