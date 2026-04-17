'use client';

/**
 * ═══════════════════════════════════════════════════════════════
 * REPORT VIEWER — Premium Intelligence Report Component
 * ═══════════════════════════════════════════════════════════════
 * 
 * The crown jewel. Renders the full psychological intelligence
 * report with visualizations, narrative sections, and tactical
 * recommendations.
 */

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { ProfileReport } from '@/lib/agents/types';

// Dynamic imports for chart components (avoid SSR issues with Recharts)
const OceanRadar = dynamic(() => import('@/components/charts/OceanRadar'), { ssr: false });
const DarkTriadBars = dynamic(() => import('@/components/charts/DarkTriadBars'), { ssr: false });
const ValuesRank = dynamic(() => import('@/components/charts/ValuesRank'), { ssr: false });
const DiscQuadrant = dynamic(() => import('@/components/charts/DiscQuadrant'), { ssr: false });

interface ReportViewerProps {
  report: ProfileReport;
}

type TabId = 'overview' | 'personality' | 'risk' | 'communication' | 'values' | 'tactical';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '📋' },
  { id: 'personality', label: 'Personality', icon: '🧬' },
  { id: 'risk', label: 'Risk Profile', icon: '⚠️' },
  { id: 'communication', label: 'Communication', icon: '💬' },
  { id: 'values', label: 'Values & ASIX', icon: '🕉️' },
  { id: 'tactical', label: 'Tactical', icon: '🎯' },
];

const REPORT_TYPE_LABELS: Record<string, string> = {
  hiring: '🏢 Hiring Intelligence',
  sales: '💼 Sales Intelligence',
  dating: '💝 Dating Intelligence',
  'self-discovery': '🔮 Self-Discovery',
};

export default function ReportViewer({ report }: ReportViewerProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const confidenceColors: Record<string, string> = {
    HIGH: '#10b981',
    MEDIUM: '#f59e0b',
    LOW: '#f97316',
    INSUFFICIENT: '#ef4444',
  };

  return (
    <div className="report-viewer">
      {/* Report Header */}
      <header className="report-header">
        <div className="header-top">
          <div className="report-badge">
            {REPORT_TYPE_LABELS[report.reportType] || report.reportType}
          </div>
          <div className="report-meta">
            <span className="report-id">{report.reportId}</span>
            <span className="report-date">
              {new Date(report.generatedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </span>
          </div>
        </div>

        <h1 className="target-name">{report.targetName}</h1>
        <p className="persona-snapshot">{report.personaSnapshot}</p>

        <div className="confidence-row">
          <div className="confidence-indicator">
            <span className="conf-dot" style={{ background: confidenceColors[report.analysis.overallConfidence] }} />
            <span className="conf-label">Confidence: {report.analysis.overallConfidence}</span>
          </div>
          <div className="data-stats">
            <span>{report.dataPointsAnalyzed} data points</span>
            <span>•</span>
            <span>{(report.processingTimeMs / 1000).toFixed(1)}s processing</span>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="report-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="tab-panel overview-panel">
            <div className="executive-summary">
              <h2>Executive Summary</h2>
              <p>{report.executiveSummary}</p>
            </div>

            <div className="confidence-statement">
              <p>{report.confidenceStatement}</p>
            </div>

            {report.sections.map((section, i) => (
              <div key={i} className="report-section">
                <div className="section-header">
                  <h3>{section.title}</h3>
                  <span
                    className="section-confidence"
                    style={{ color: confidenceColors[section.confidenceLevel] }}
                  >
                    {section.confidenceLevel}
                  </span>
                </div>
                <div className="section-content">
                  {section.content.split('\n').map((paragraph, j) => (
                    <p key={j}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Cross-Framework Insights */}
            {report.analysis.crossFrameworkInsights.length > 0 && (
              <div className="cross-insights">
                <h3>🔗 Cross-Framework Intelligence</h3>
                {report.analysis.crossFrameworkInsights.map((insight, i) => (
                  <div key={i} className="insight-card">
                    <p>{insight}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PERSONALITY TAB */}
        {activeTab === 'personality' && (
          <div className="tab-panel">
            <OceanRadar ocean={report.analysis.ocean} />
          </div>
        )}

        {/* RISK PROFILE TAB */}
        {activeTab === 'risk' && (
          <div className="tab-panel">
            <DarkTriadBars darkTriad={report.analysis.darkTriad} />
          </div>
        )}

        {/* COMMUNICATION TAB */}
        {activeTab === 'communication' && (
          <div className="tab-panel">
            <DiscQuadrant
              disc={report.analysis.disc}
              attachment={report.analysis.attachment}
            />
          </div>
        )}

        {/* VALUES & ASIX TAB */}
        {activeTab === 'values' && (
          <div className="tab-panel">
            <ValuesRank
              motivation={report.analysis.motivation}
              asix={report.analysis.asix}
            />
          </div>
        )}

        {/* TACTICAL TAB */}
        {activeTab === 'tactical' && (
          <div className="tab-panel tactical-panel">
            <div className="tactical-header">
              <h2>🎯 Tactical Recommendations</h2>
              <p className="tactical-context">
                Tailored for: {REPORT_TYPE_LABELS[report.reportType] || report.reportType}
              </p>
            </div>

            <div className="tactical-list">
              {report.tacticalRecommendations.map((rec, i) => (
                <div key={i} className="tactical-card">
                  <span className="tactical-num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{rec}</p>
                </div>
              ))}
            </div>

            <div className="risk-section">
              <h3>⚡ Risk Assessment</h3>
              <p>{report.riskAssessment}</p>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer Footer */}
      <footer className="report-footer">
        <p>{report.disclaimer}</p>
      </footer>

      <style jsx>{`
        .report-viewer {
          max-width: 900px;
          margin: 0 auto;
        }

        /* Header */
        .report-header {
          padding: 32px;
          background: linear-gradient(135deg, rgba(15, 10, 35, 0.9), rgba(30, 20, 60, 0.9));
          border: 1px solid rgba(168, 139, 250, 0.2);
          border-radius: 20px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .report-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #a78bfa, #c084fc, #a78bfa, #6366f1);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .report-badge {
          font-size: 13px;
          font-weight: 600;
          padding: 6px 16px;
          background: rgba(168, 139, 250, 0.1);
          border: 1px solid rgba(168, 139, 250, 0.2);
          border-radius: 20px;
          color: #c4b5fd;
        }
        .report-meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          font-family: var(--font-mono, monospace);
        }
        .target-name {
          font-size: 36px;
          font-weight: 800;
          color: #f1f5f9;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }
        .persona-snapshot {
          font-size: 16px;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .confidence-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .confidence-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .conf-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .conf-label {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          font-weight: 500;
        }
        .data-stats {
          display: flex;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          font-family: var(--font-mono, monospace);
        }

        /* Tabs */
        .report-tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: rgba(15, 10, 30, 0.5);
          border-radius: 14px;
          margin-bottom: 24px;
          overflow-x: auto;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .tab-btn {
          flex: 1;
          min-width: max-content;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 14px;
          border: none;
          background: transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          font-weight: 500;
        }
        .tab-btn:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.04); }
        .tab-btn.active {
          background: rgba(168, 139, 250, 0.12);
          color: #c4b5fd;
          box-shadow: 0 0 20px rgba(168, 139, 250, 0.1);
        }
        .tab-icon { font-size: 16px; }
        .tab-label { white-space: nowrap; }

        /* Tab Content */
        .tab-content { min-height: 400px; }
        .tab-panel { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Overview */
        .executive-summary {
          padding: 24px;
          background: rgba(15, 10, 30, 0.6);
          border: 1px solid rgba(168, 139, 250, 0.15);
          border-radius: 16px;
          margin-bottom: 16px;
        }
        .executive-summary h2 {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #a78bfa;
          margin-bottom: 12px;
        }
        .executive-summary p {
          font-size: 15px;
          color: rgba(255,255,255,0.75);
          line-height: 1.8;
        }
        .confidence-statement {
          padding: 16px 24px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          margin-bottom: 24px;
        }
        .confidence-statement p {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          font-style: italic;
        }
        .report-section {
          padding: 20px 24px;
          background: rgba(15, 10, 30, 0.4);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          margin-bottom: 12px;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .section-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #e2e8f0;
        }
        .section-confidence {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .section-content p {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          margin-bottom: 8px;
        }
        .cross-insights {
          margin-top: 24px;
          padding: 24px;
          background: rgba(99, 102, 241, 0.05);
          border: 1px solid rgba(99, 102, 241, 0.12);
          border-radius: 16px;
        }
        .cross-insights h3 {
          font-size: 14px;
          color: #818cf8;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .insight-card {
          padding: 14px 16px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          margin-bottom: 8px;
          border-left: 3px solid rgba(99, 102, 241, 0.3);
        }
        .insight-card p {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
        }

        /* Tactical */
        .tactical-header h2 {
          font-size: 18px;
          color: #e2e8f0;
          margin-bottom: 4px;
        }
        .tactical-context {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 20px;
        }
        .tactical-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }
        .tactical-card {
          display: flex;
          gap: 16px;
          padding: 16px 20px;
          background: rgba(15, 10, 30, 0.6);
          border: 1px solid rgba(168, 139, 250, 0.1);
          border-radius: 12px;
          align-items: flex-start;
        }
        .tactical-num {
          font-size: 20px;
          font-weight: 900;
          color: rgba(168, 139, 250, 0.3);
          font-family: var(--font-mono, monospace);
          min-width: 32px;
        }
        .tactical-card p {
          font-size: 14px;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
        }
        .risk-section {
          padding: 20px 24px;
          background: rgba(245, 158, 11, 0.05);
          border: 1px solid rgba(245, 158, 11, 0.12);
          border-radius: 14px;
        }
        .risk-section h3 {
          font-size: 14px;
          color: #f59e0b;
          margin-bottom: 10px;
        }
        .risk-section p {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
        }

        /* Footer */
        .report-footer {
          margin-top: 32px;
          padding: 20px 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .report-footer p {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          line-height: 1.6;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .target-name { font-size: 26px; }
          .tab-label { display: none; }
          .tab-btn { padding: 10px; }
          .tab-icon { font-size: 20px; }
          .playbook-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
