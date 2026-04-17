'use client';

/**
 * ═══════════════════════════════════════════════════════════════
 * PROFILE DETAIL PAGE — /dashboard/profile/[id]
 * ═══════════════════════════════════════════════════════════════
 * 
 * Shows the intelligence report for a specific profile analysis.
 * Handles loading states and status polling for in-progress analyses.
 */

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { ProfileReport, AnalysisStatus } from '@/lib/agents/types';

const ReportViewer = dynamic(() => import('@/components/report/ReportViewer'), { ssr: false });

interface ProfileData {
  id: string;
  targetName: string;
  status: AnalysisStatus;
  createdAt: string;
}

const STATUS_MESSAGES: Record<AnalysisStatus, { label: string; icon: string; color: string }> = {
  queued: { label: 'Queued for analysis', icon: '⏳', color: '#94a3b8' },
  intake: { label: 'Collecting intelligence...', icon: '🔍', color: '#818cf8' },
  analyzing: { label: 'Agent council analyzing...', icon: '🧠', color: '#a78bfa' },
  synthesizing: { label: 'Synthesizing report...', icon: '🔮', color: '#c084fc' },
  completed: { label: 'Intelligence report ready', icon: '✅', color: '#10b981' },
  failed: { label: 'Analysis failed', icon: '❌', color: '#ef4444' },
};

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params?.id as string;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [report, setReport] = useState<ProfileReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!profileId) return;
    
    try {
      const res = await fetch(`/api/profiles/${profileId}`);
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Failed to load profile');
        setLoading(false);
        return;
      }

      setProfile(data.profile);
      if (data.report) {
        setReport(data.report);
      }
      setLoading(false);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }, [profileId]);

  // Initial fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Poll for status updates if analysis is in progress
  useEffect(() => {
    if (!profile) return;
    if (profile.status === 'completed' || profile.status === 'failed') return;

    const interval = setInterval(fetchProfile, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [profile, fetchProfile]);

  // Loading state
  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading intelligence briefing...</p>
        </div>
        <style jsx>{`
          .profile-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a12; }
          .loading-container { text-align: center; }
          .loading-spinner { width: 48px; height: 48px; border: 3px solid rgba(168,139,250,0.15); border-top-color: #a78bfa; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .loading-container p { color: rgba(255,255,255,0.5); font-size: 14px; }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <span className="error-icon">❌</span>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => router.push('/dashboard')}>← Back to Dashboard</button>
        </div>
        <style jsx>{`
          .profile-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a12; }
          .error-container { text-align: center; max-width: 400px; }
          .error-icon { font-size: 48px; display: block; margin-bottom: 16px; }
          h2 { color: #ef4444; font-size: 20px; margin-bottom: 8px; }
          p { color: rgba(255,255,255,0.5); margin-bottom: 20px; }
          button { padding: 10px 24px; background: rgba(168,139,250,0.15); border: 1px solid rgba(168,139,250,0.3); border-radius: 8px; color: #c4b5fd; cursor: pointer; font-size: 14px; }
          button:hover { background: rgba(168,139,250,0.25); }
        `}</style>
      </div>
    );
  }

  // In-progress state
  if (profile && profile.status !== 'completed') {
    const statusInfo = STATUS_MESSAGES[profile.status] || STATUS_MESSAGES.queued;

    return (
      <div className="profile-page">
        <div className="progress-container">
          <button className="back-btn" onClick={() => router.push('/dashboard')}>
            ← Dashboard
          </button>

          <div className="progress-card">
            <div className="progress-header">
              <h2>{profile.targetName}</h2>
              <p className="profile-id">Profile: {profile.id.substring(0, 8)}...</p>
            </div>

            <div className="status-display">
              <span className="status-icon">{statusInfo.icon}</span>
              <span className="status-label" style={{ color: statusInfo.color }}>
                {statusInfo.label}
              </span>
            </div>

            {/* Pipeline Progress */}
            <div className="pipeline-steps">
              {(['intake', 'analyzing', 'synthesizing', 'completed'] as AnalysisStatus[]).map((step, i) => {
                const stepOrder = ['queued', 'intake', 'analyzing', 'synthesizing', 'completed'];
                const currentOrder = stepOrder.indexOf(profile.status);
                const stepIdx = stepOrder.indexOf(step);
                const isActive = stepIdx === currentOrder;
                const isDone = stepIdx < currentOrder;
                const stepLabels: Record<string, string> = {
                  intake: 'Data Collection',
                  analyzing: 'Agent Council',
                  synthesizing: 'Report Synthesis',
                  completed: 'Complete',
                };

                return (
                  <div key={step} className={`step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                    <div className="step-dot">
                      {isDone ? '✓' : isActive ? (i + 1) : (i + 1)}
                    </div>
                    <span className="step-label">{stepLabels[step]}</span>
                  </div>
                );
              })}
            </div>

            {profile.status === 'failed' && (
              <div className="error-note">
                <p>The analysis pipeline encountered an error. Please try again or contact support.</p>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .profile-page { min-height: 100vh; background: #0a0a12; padding: 40px 20px; }
          .progress-container { max-width: 600px; margin: 0 auto; }
          .back-btn { background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 14px; margin-bottom: 24px; padding: 0; }
          .back-btn:hover { color: rgba(255,255,255,0.7); }
          .progress-card {
            background: rgba(15, 10, 30, 0.8);
            border: 1px solid rgba(168, 139, 250, 0.15);
            border-radius: 20px;
            padding: 32px;
            backdrop-filter: blur(12px);
          }
          .progress-header { margin-bottom: 32px; }
          .progress-header h2 { font-size: 28px; font-weight: 700; color: #f1f5f9; margin-bottom: 4px; }
          .profile-id { font-size: 12px; color: rgba(255,255,255,0.3); font-family: var(--font-mono, monospace); }
          .status-display { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 12px; }
          .status-icon { font-size: 24px; }
          .status-label { font-size: 16px; font-weight: 600; }
          .pipeline-steps { display: flex; align-items: center; gap: 8px; }
          .step { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; opacity: 0.3; }
          .step.done { opacity: 1; }
          .step.active { opacity: 1; }
          .step-dot {
            width: 36px; height: 36px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 14px; font-weight: 700;
            background: rgba(255,255,255,0.06);
            color: rgba(255,255,255,0.4);
            border: 2px solid rgba(255,255,255,0.1);
          }
          .step.done .step-dot { background: rgba(16, 185, 129, 0.15); color: #10b981; border-color: rgba(16, 185, 129, 0.3); }
          .step.active .step-dot { background: rgba(168, 139, 250, 0.15); color: #a78bfa; border-color: rgba(168, 139, 250, 0.3); animation: pulse 2s ease-in-out infinite; }
          @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(168,139,250,0.3); } 50% { box-shadow: 0 0 0 8px rgba(168,139,250,0); } }
          .step-label { font-size: 11px; color: rgba(255,255,255,0.4); text-align: center; }
          .step.done .step-label { color: rgba(16, 185, 129, 0.7); }
          .step.active .step-label { color: #c4b5fd; }
          .error-note { margin-top: 24px; padding: 16px; background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: 12px; }
          .error-note p { font-size: 13px; color: rgba(255,255,255,0.5); }
        `}</style>
      </div>
    );
  }

  // Report ready — render the full viewer
  return (
    <div className="profile-page">
      <div className="report-container">
        <button className="back-btn" onClick={() => router.push('/dashboard')}>
          ← Dashboard
        </button>

        {report ? (
          <ReportViewer report={report} />
        ) : (
          <div className="no-report">
            <p>Report data is not available. Please contact support.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-page { min-height: 100vh; background: #0a0a12; padding: 40px 20px; }
        .report-container { max-width: 960px; margin: 0 auto; }
        .back-btn { background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 14px; margin-bottom: 24px; padding: 0; }
        .back-btn:hover { color: rgba(255,255,255,0.7); }
        .no-report { text-align: center; padding: 60px; color: rgba(255,255,255,0.4); }
      `}</style>
    </div>
  );
}
