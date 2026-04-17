'use client';

/**
 * ═══════════════════════════════════════════════════════════════
 * VALUES RANK CHART — Schwartz Values + ASIX Visualization
 * ═══════════════════════════════════════════════════════════════
 */

import type { MotivationProfile, ASIXProfile } from '@/lib/agents/types';

interface ValuesRankProps {
  motivation: MotivationProfile;
  asix: ASIXProfile;
}

const VALUE_COLORS = [
  '#a78bfa', '#818cf8', '#6366f1', '#8b5cf6', '#7c3aed',
  '#6d28d9', '#5b21b6', '#4c1d95', '#4338ca', '#3730a3',
];

export default function ValuesRank({ motivation, asix }: ValuesRankProps) {
  const sortedValues = [...motivation.values].sort((a, b) => a.rank - b.rank).slice(0, 10);

  return (
    <div className="values-container">
      {/* Schwartz Values */}
      <div className="section">
        <h3 className="chart-title">Core Values Hierarchy</h3>
        <div className="values-list">
          {sortedValues.map((value, i) => (
            <div key={value.name} className="value-row">
              <div className="value-rank" style={{ color: VALUE_COLORS[i] || '#6366f1' }}>
                #{value.rank}
              </div>
              <div className="value-info">
                <div className="value-header">
                  <span className="value-name">{value.name}</span>
                  <span className="value-score">{value.score}/10</span>
                </div>
                <div className="value-bar-bg">
                  <div
                    className="value-bar-fill"
                    style={{
                      width: `${(value.score / 10) * 100}%`,
                      background: VALUE_COLORS[i] || '#6366f1',
                    }}
                  />
                </div>
                <p className="value-evidence">{value.evidence}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Holland Codes */}
      <div className="section holland-section">
        <h3 className="chart-title">Holland RIASEC Codes</h3>
        <div className="holland-codes">
          <div className="holland-primary">
            <span className="holland-letter">{motivation.hollandCodes.primary}</span>
            <span className="holland-label">Primary</span>
          </div>
          <div className="holland-divider">/</div>
          <div className="holland-secondary">
            <span className="holland-letter">{motivation.hollandCodes.secondary}</span>
            <span className="holland-label">Secondary</span>
          </div>
        </div>
        <p className="holland-interp">{motivation.hollandCodes.interpretation}</p>
      </div>

      {/* ASIX Triguna */}
      <div className="section asix-section">
        <h3 className="chart-title">
          ASIX v2.0 — Triguna Balance
          <span className="asix-badge">{asix.dominantGuna.replace('_', ' ')}</span>
        </h3>

        <div className="guna-bars">
          <div className="guna-row">
            <span className="guna-label">🕉️ Sattva</span>
            <div className="guna-bar-bg">
              <div className="guna-bar sattva" style={{ width: `${asix.sattva}%` }} />
            </div>
            <span className="guna-pct">{asix.sattva}%</span>
          </div>
          <div className="guna-row">
            <span className="guna-label">🔥 Rajas</span>
            <div className="guna-bar-bg">
              <div className="guna-bar rajas" style={{ width: `${asix.rajas}%` }} />
            </div>
            <span className="guna-pct">{asix.rajas}%</span>
          </div>
          <div className="guna-row">
            <span className="guna-label">🌑 Tamas</span>
            <div className="guna-bar-bg">
              <div className="guna-bar tamas" style={{ width: `${asix.tamas}%` }} />
            </div>
            <span className="guna-pct">{asix.tamas}%</span>
          </div>
        </div>

        <div className="asix-details">
          <div className="asix-detail-row">
            <span className="detail-label">Consciousness</span>
            <span className="detail-value">{asix.consciousnessState}</span>
          </div>
          <div className="asix-detail-row">
            <span className="detail-label">Evolution</span>
            <span className="detail-value">{asix.evolutionaryDirection}</span>
          </div>
          <div className="asix-detail-row">
            <span className="detail-label">Archetype</span>
            <span className="detail-value">{asix.vedanticArchetype}</span>
          </div>
        </div>

        <p className="asix-insight">{asix.keyInsight}</p>
      </div>

      <style jsx>{`
        .values-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .section {
          background: rgba(15, 10, 30, 0.6);
          border: 1px solid rgba(168, 139, 250, 0.12);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(12px);
        }
        .chart-title {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #a78bfa;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .values-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .value-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .value-rank {
          font-size: 16px;
          font-weight: 800;
          font-family: var(--font-mono, monospace);
          min-width: 32px;
          padding-top: 2px;
        }
        .value-info { flex: 1; }
        .value-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .value-name {
          font-size: 13px;
          font-weight: 600;
          color: #e2e8f0;
        }
        .value-score {
          font-size: 13px;
          font-weight: 700;
          color: #a78bfa;
          font-family: var(--font-mono, monospace);
        }
        .value-bar-bg {
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
        }
        .value-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 1s ease-out;
          opacity: 0.7;
        }
        .value-evidence {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          margin-top: 4px;
          line-height: 1.4;
        }
        .holland-section { border-color: rgba(99, 102, 241, 0.15); }
        .holland-codes {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 16px 0;
        }
        .holland-primary, .holland-secondary {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .holland-letter {
          font-size: 42px;
          font-weight: 900;
          color: #818cf8;
          font-family: var(--font-mono, monospace);
          line-height: 1;
        }
        .holland-label {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .holland-divider {
          font-size: 28px;
          color: rgba(255,255,255,0.2);
          font-weight: 300;
        }
        .holland-interp {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          text-align: center;
          line-height: 1.6;
        }
        .asix-section { border-color: rgba(245, 158, 11, 0.12); }
        .asix-badge {
          font-size: 10px;
          padding: 2px 10px;
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 20px;
          color: #f59e0b;
          font-weight: 700;
        }
        .guna-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        .guna-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .guna-label {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          min-width: 90px;
        }
        .guna-bar-bg {
          flex: 1;
          height: 8px;
          background: rgba(255,255,255,0.06);
          border-radius: 4px;
          overflow: hidden;
        }
        .guna-bar {
          height: 100%;
          border-radius: 4px;
          transition: width 1.2s ease-out;
        }
        .sattva { background: linear-gradient(90deg, #fbbf2444, #fbbf24); }
        .rajas { background: linear-gradient(90deg, #f9731644, #f97316); }
        .tamas { background: linear-gradient(90deg, #6b728044, #6b7280); }
        .guna-pct {
          font-size: 14px;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          font-family: var(--font-mono, monospace);
          min-width: 40px;
          text-align: right;
        }
        .asix-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          margin-bottom: 16px;
        }
        .asix-detail-row {
          display: flex;
          justify-content: space-between;
        }
        .detail-label {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .detail-value {
          font-size: 12px;
          color: #fbbf24;
          font-weight: 500;
          text-align: right;
          max-width: 60%;
        }
        .asix-insight {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
