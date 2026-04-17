'use client';

/**
 * ═══════════════════════════════════════════════════════════════
 * DISC QUADRANT CHART — Communication Style Visualization
 * ═══════════════════════════════════════════════════════════════
 */

import type { DISCProfile, AttachmentProfile } from '@/lib/agents/types';

interface DiscQuadrantProps {
  disc: DISCProfile;
  attachment: AttachmentProfile;
}

const ATTACHMENT_COLORS: Record<string, string> = {
  SECURE: '#10b981',
  ANXIOUS_PREOCCUPIED: '#f59e0b',
  DISMISSIVE_AVOIDANT: '#6366f1',
  FEARFUL_AVOIDANT: '#ef4444',
};

export default function DiscQuadrant({ disc, attachment }: DiscQuadrantProps) {
  const total = disc.dominance + disc.influence + disc.steadiness + disc.conscientiousness || 1;

  return (
    <div className="disc-attachment-container">
      {/* DISC Profile */}
      <div className="section disc-section">
        <h3 className="chart-title">DISC Communication Style</h3>
        <div className="disc-primary-display">
          <span className="disc-letter primary">{disc.primary}</span>
          <span className="disc-slash">/</span>
          <span className="disc-letter secondary">{disc.secondary}</span>
        </div>

        <div className="disc-quadrant">
          <div className="quad-row">
            <div className="quad-cell d" style={{ opacity: 0.3 + (disc.dominance / total) * 0.7 }}>
              <span className="quad-letter">D</span>
              <span className="quad-score">{disc.dominance.toFixed(1)}</span>
              <span className="quad-label">Dominance</span>
            </div>
            <div className="quad-cell i" style={{ opacity: 0.3 + (disc.influence / total) * 0.7 }}>
              <span className="quad-letter">I</span>
              <span className="quad-score">{disc.influence.toFixed(1)}</span>
              <span className="quad-label">Influence</span>
            </div>
          </div>
          <div className="quad-row">
            <div className="quad-cell s" style={{ opacity: 0.3 + (disc.steadiness / total) * 0.7 }}>
              <span className="quad-letter">S</span>
              <span className="quad-score">{disc.steadiness.toFixed(1)}</span>
              <span className="quad-label">Steadiness</span>
            </div>
            <div className="quad-cell c" style={{ opacity: 0.3 + (disc.conscientiousness / total) * 0.7 }}>
              <span className="quad-letter">C</span>
              <span className="quad-score">{disc.conscientiousness.toFixed(1)}</span>
              <span className="quad-label">Conscientiousness</span>
            </div>
          </div>
        </div>

        <p className="comm-style">{disc.communicationStyle}</p>

        {/* Tactical Playbook */}
        <div className="playbook">
          <h4 className="playbook-title">🎯 Tactical Playbook</h4>
          <div className="playbook-grid">
            <div className="playbook-col do">
              <span className="playbook-label">✅ Do this</span>
              <ul>
                {disc.tacticalPlaybook.doThis.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="playbook-col dont">
              <span className="playbook-label">❌ Don&apos;t do this</span>
              <ul>
                {disc.tacticalPlaybook.dontDoThis.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="playbook-extra">
            <div className="extra-item">
              <span className="extra-label">📧 Email Strategy</span>
              <p>{disc.tacticalPlaybook.emailTemplate}</p>
            </div>
            <div className="extra-item">
              <span className="extra-label">🤝 Meeting Strategy</span>
              <p>{disc.tacticalPlaybook.meetingStrategy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attachment Profile */}
      <div className="section attachment-section">
        <h3 className="chart-title">Attachment Profile</h3>

        <div className="attachment-display">
          <div
            className="attachment-badge"
            style={{
              borderColor: ATTACHMENT_COLORS[attachment.primaryStyle] || '#6366f1',
              color: ATTACHMENT_COLORS[attachment.primaryStyle] || '#6366f1',
            }}
          >
            {attachment.primaryStyle.replace('_', ' ')}
          </div>
          {attachment.secondaryStyle && (
            <div className="attachment-secondary">
              + {attachment.secondaryStyle.replace('_', ' ')}
            </div>
          )}
        </div>

        <div className="attachment-dims">
          <div className="dim-row">
            <span className="dim-label">Anxiety</span>
            <div className="dim-bar-bg">
              <div className="dim-bar anxiety" style={{ width: `${(attachment.anxietyDimension / 10) * 100}%` }} />
            </div>
            <span className="dim-val">{attachment.anxietyDimension}/10</span>
          </div>
          <div className="dim-row">
            <span className="dim-label">Avoidance</span>
            <div className="dim-bar-bg">
              <div className="dim-bar avoidance" style={{ width: `${(attachment.avoidanceDimension / 10) * 100}%` }} />
            </div>
            <span className="dim-val">{attachment.avoidanceDimension}/10</span>
          </div>
        </div>

        <div className="attachment-details">
          {attachment.interpersonalPatterns.length > 0 && (
            <div className="detail-section">
              <span className="detail-label">Interpersonal Patterns</span>
              <div className="detail-tags">
                {attachment.interpersonalPatterns.map((p, i) => (
                  <span key={i} className="detail-tag">{p}</span>
                ))}
              </div>
            </div>
          )}
          {attachment.conflictResponses.length > 0 && (
            <div className="detail-section">
              <span className="detail-label">Conflict Responses</span>
              <div className="detail-tags">
                {attachment.conflictResponses.map((r, i) => (
                  <span key={i} className="detail-tag conflict">{r}</span>
                ))}
              </div>
            </div>
          )}
          <div className="detail-section">
            <span className="detail-label">Trust Dynamics</span>
            <p className="trust-text">{attachment.trustDynamics}</p>
          </div>
        </div>

        <p className="attachment-insight">{attachment.keyInsight}</p>
      </div>

      <style jsx>{`
        .disc-attachment-container {
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
        }
        .disc-primary-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .disc-letter {
          font-size: 48px;
          font-weight: 900;
          font-family: var(--font-mono, monospace);
          line-height: 1;
        }
        .disc-letter.primary { color: #a78bfa; }
        .disc-letter.secondary { color: rgba(167, 139, 250, 0.5); font-size: 36px; }
        .disc-slash { font-size: 32px; color: rgba(255,255,255,0.2); }
        .disc-quadrant {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 20px;
        }
        .quad-row { display: flex; gap: 4px; }
        .quad-cell {
          flex: 1;
          padding: 16px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: opacity 0.3s ease;
        }
        .quad-cell.d { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); }
        .quad-cell.i { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); }
        .quad-cell.s { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); }
        .quad-cell.c { background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); }
        .quad-letter { font-size: 24px; font-weight: 900; color: rgba(255,255,255,0.8); }
        .quad-score { font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.6); font-family: var(--font-mono, monospace); }
        .quad-label { font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; }
        .comm-style {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          text-align: center;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .playbook {
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .playbook-title { font-size: 13px; color: #e2e8f0; margin-bottom: 12px; }
        .playbook-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .playbook-label { font-size: 12px; font-weight: 600; display: block; margin-bottom: 8px; }
        .playbook-col ul { list-style: none; padding: 0; }
        .playbook-col li { font-size: 12px; color: rgba(255,255,255,0.6); padding: 3px 0; line-height: 1.4; }
        .playbook-col.do .playbook-label { color: #10b981; }
        .playbook-col.dont .playbook-label { color: #ef4444; }
        .playbook-extra { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; }
        .extra-item .extra-label { font-size: 12px; font-weight: 600; color: #a78bfa; }
        .extra-item p { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px; line-height: 1.5; }
        .attachment-section { border-color: rgba(16, 185, 129, 0.12); }
        .attachment-display { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px; }
        .attachment-badge {
          font-size: 14px; font-weight: 700; padding: 8px 20px;
          border: 2px solid; border-radius: 24px;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .attachment-secondary { font-size: 12px; color: rgba(255,255,255,0.4); }
        .attachment-dims { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .dim-row { display: flex; align-items: center; gap: 12px; }
        .dim-label { font-size: 13px; color: rgba(255,255,255,0.6); min-width: 80px; }
        .dim-bar-bg { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
        .dim-bar { height: 100%; border-radius: 3px; transition: width 1s ease-out; }
        .dim-bar.anxiety { background: linear-gradient(90deg, #f59e0b44, #f59e0b); }
        .dim-bar.avoidance { background: linear-gradient(90deg, #6366f144, #6366f1); }
        .dim-val { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.6); font-family: var(--font-mono, monospace); min-width: 40px; }
        .attachment-details { display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px; }
        .detail-section .detail-label { font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px; }
        .detail-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .detail-tag { font-size: 11px; padding: 4px 10px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.15); border-radius: 6px; color: rgba(255,255,255,0.6); }
        .detail-tag.conflict { background: rgba(239, 68, 68, 0.08); border-color: rgba(239, 68, 68, 0.15); }
        .trust-text { font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.5; }
        .attachment-insight { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.6; font-style: italic; }
      `}</style>
    </div>
  );
}
