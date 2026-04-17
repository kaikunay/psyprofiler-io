'use client';

/**
 * ═══════════════════════════════════════════════════════════════
 * DARK TRIAD BAR CHART — Risk Visualization
 * ═══════════════════════════════════════════════════════════════
 */

import type { DarkTriadAssessment, RiskLevel } from '@/lib/agents/types';

interface DarkTriadBarsProps {
  darkTriad: DarkTriadAssessment;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: '#10b981',
  MODERATE: '#f59e0b',
  ELEVATED: '#f97316',
  HIGH: '#ef4444',
  CRITICAL: '#dc2626',
};

const RISK_GLOW: Record<RiskLevel, string> = {
  LOW: '0 0 12px rgba(16, 185, 129, 0.3)',
  MODERATE: '0 0 12px rgba(245, 158, 11, 0.3)',
  ELEVATED: '0 0 12px rgba(249, 115, 22, 0.3)',
  HIGH: '0 0 16px rgba(239, 68, 68, 0.4)',
  CRITICAL: '0 0 20px rgba(220, 38, 38, 0.5)',
};

export default function DarkTriadBars({ darkTriad }: DarkTriadBarsProps) {
  const dimensions = [
    { name: 'Machiavellianism', data: darkTriad.machiavellianism, icon: '♟️' },
    { name: 'Narcissism', data: darkTriad.narcissism, icon: '🪞' },
    { name: 'Psychopathy', data: darkTriad.psychopathy, icon: '🧊' },
  ];

  return (
    <div className="dt-container">
      <h3 className="chart-title">
        Dark Triad Assessment
        <span className="risk-badge" style={{
          color: RISK_COLORS[darkTriad.overallRiskLevel],
          borderColor: RISK_COLORS[darkTriad.overallRiskLevel],
        }}>
          {darkTriad.overallRiskLevel}
        </span>
      </h3>

      <div className="dimension-list">
        {dimensions.map(({ name, data, icon }) => (
          <div key={name} className="dimension-card">
            <div className="dim-header">
              <span className="dim-icon">{icon}</span>
              <span className="dim-name">{name}</span>
              <span className="dim-score" style={{ color: RISK_COLORS[data.riskLevel] }}>
                {data.score}/10
              </span>
            </div>

            <div className="dim-bar-bg">
              <div
                className="dim-bar-fill"
                style={{
                  width: `${(data.score / 10) * 100}%`,
                  background: `linear-gradient(90deg, ${RISK_COLORS[data.riskLevel]}88, ${RISK_COLORS[data.riskLevel]})`,
                  boxShadow: RISK_GLOW[data.riskLevel],
                }}
              />
            </div>

            <div className="dim-risk-label" style={{ color: RISK_COLORS[data.riskLevel] }}>
              Risk: {data.riskLevel}
            </div>

            {data.indicators.length > 0 && (
              <div className="dim-indicators">
                {data.indicators.slice(0, 3).map((indicator, i) => (
                  <span key={i} className="indicator-tag">
                    {indicator}
                  </span>
                ))}
              </div>
            )}

            <div className="dim-adversarial">
              <span className="adv-label">⚖️ Counter-check:</span> {data.adversarialCheck}
            </div>
          </div>
        ))}
      </div>

      {/* D-Factor */}
      <div className="dfactor-section">
        <div className="dfactor-header">
          <span>D-Factor (General Dark Core)</span>
          <span className="dfactor-score">{darkTriad.dFactor.score}/10</span>
        </div>
        <div className="dim-bar-bg">
          <div
            className="dim-bar-fill dfactor-bar"
            style={{ width: `${(darkTriad.dFactor.score / 10) * 100}%` }}
          />
        </div>
        <p className="dfactor-interp">{darkTriad.dFactor.interpretation}</p>
      </div>

      {/* Manipulation Vectors */}
      {darkTriad.manipulationVectors.length > 0 && (
        <div className="manipulation-section">
          <h4>⚠ Potential Manipulation Vectors</h4>
          <ul>
            {darkTriad.manipulationVectors.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="ethical-note">{darkTriad.ethicalDisclaimer}</p>

      <style jsx>{`
        .dt-container {
          background: rgba(15, 10, 30, 0.6);
          border: 1px solid rgba(239, 68, 68, 0.12);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(12px);
        }
        .chart-title {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #f87171;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .risk-badge {
          font-size: 11px;
          padding: 2px 10px;
          border: 1px solid;
          border-radius: 20px;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .dimension-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .dimension-card {
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .dim-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .dim-icon { font-size: 18px; }
        .dim-name {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
          flex: 1;
        }
        .dim-score {
          font-size: 18px;
          font-weight: 800;
          font-family: var(--font-mono, monospace);
        }
        .dim-bar-bg {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.08);
          border-radius: 3px;
          overflow: hidden;
        }
        .dim-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 1.2s ease-out;
        }
        .dim-risk-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          margin-top: 6px;
        }
        .dim-indicators {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }
        .indicator-tag {
          font-size: 11px;
          padding: 3px 10px;
          background: rgba(255,255,255,0.06);
          border-radius: 6px;
          color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .dim-adversarial {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          margin-top: 10px;
          font-style: italic;
          line-height: 1.5;
        }
        .adv-label {
          font-style: normal;
          color: rgba(255,255,255,0.6);
        }
        .dfactor-section {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .dfactor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 13px;
          color: #e2e8f0;
          font-weight: 500;
        }
        .dfactor-score {
          font-size: 16px;
          font-weight: 800;
          color: #f59e0b;
          font-family: var(--font-mono, monospace);
        }
        .dfactor-bar {
          background: linear-gradient(90deg, #f59e0b44, #f59e0b) !important;
        }
        .dfactor-interp {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-top: 8px;
          line-height: 1.5;
        }
        .manipulation-section {
          margin-top: 20px;
          padding: 16px;
          background: rgba(239, 68, 68, 0.06);
          border: 1px solid rgba(239, 68, 68, 0.15);
          border-radius: 12px;
        }
        .manipulation-section h4 {
          font-size: 13px;
          color: #f87171;
          margin-bottom: 10px;
        }
        .manipulation-section ul {
          list-style: none;
          padding: 0;
        }
        .manipulation-section li {
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          padding: 4px 0;
          padding-left: 16px;
          position: relative;
        }
        .manipulation-section li::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: #f87171;
        }
        .ethical-note {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          margin-top: 16px;
          line-height: 1.5;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
