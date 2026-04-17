'use client';

/**
 * ═══════════════════════════════════════════════════════════════
 * OCEAN RADAR CHART — Personality Visualization
 * ═══════════════════════════════════════════════════════════════
 */

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { OCEANProfile } from '@/lib/agents/types';

interface OceanRadarProps {
  ocean: OCEANProfile;
}

export default function OceanRadar({ ocean }: OceanRadarProps) {
  const data = [
    { trait: 'Openness', value: ocean.openness.score, fullMark: 10 },
    { trait: 'Conscientiousness', value: ocean.conscientiousness.score, fullMark: 10 },
    { trait: 'Extraversion', value: ocean.extraversion.score, fullMark: 10 },
    { trait: 'Agreeableness', value: ocean.agreeableness.score, fullMark: 10 },
    { trait: 'Neuroticism', value: ocean.neuroticism.score, fullMark: 10 },
    { trait: 'Honesty-Humility', value: ocean.honestyHumility.score, fullMark: 10 },
  ];

  return (
    <div className="ocean-radar-container">
      <h3 className="chart-title">OCEAN / HEXACO Profile</h3>
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(168, 139, 250, 0.15)" />
          <PolarAngleAxis
            dataKey="trait"
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15, 10, 30, 0.95)',
              border: '1px solid rgba(168, 139, 250, 0.3)',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '13px',
            }}
            formatter={(value: any) => [`${value}/10`, 'Score']}
          />
          <Radar
            name="OCEAN"
            dataKey="value"
            stroke="#a78bfa"
            fill="url(#oceanGradient)"
            fillOpacity={0.35}
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="oceanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>

      {/* Trait Breakdown */}
      <div className="trait-list">
        {data.map((d) => {
          const traitKey = d.trait.toLowerCase().replace('-', '') as string;
          const trait = (ocean as any)[
            d.trait === 'Honesty-Humility' ? 'honestyHumility' :
            d.trait === 'Conscientiousness' ? 'conscientiousness' :
            d.trait === 'Extraversion' ? 'extraversion' :
            d.trait === 'Agreeableness' ? 'agreeableness' :
            d.trait === 'Neuroticism' ? 'neuroticism' : 'openness'
          ];

          return (
            <div key={d.trait} className="trait-row">
              <div className="trait-header">
                <span className="trait-name">{d.trait}</span>
                <span className="trait-score">{d.value}/10</span>
              </div>
              <div className="trait-bar-bg">
                <div
                  className="trait-bar-fill"
                  style={{ width: `${(d.value / 10) * 100}%` }}
                />
              </div>
              <p className="trait-interpretation">{trait?.interpretation}</p>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .ocean-radar-container {
          background: rgba(15, 10, 30, 0.6);
          border: 1px solid rgba(168, 139, 250, 0.15);
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
          margin-bottom: 8px;
        }
        .trait-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }
        .trait-row {
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .trait-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .trait-name {
          font-size: 13px;
          font-weight: 500;
          color: #e2e8f0;
        }
        .trait-score {
          font-size: 14px;
          font-weight: 700;
          color: #a78bfa;
          font-family: var(--font-mono, monospace);
        }
        .trait-bar-bg {
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
        }
        .trait-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #a78bfa);
          border-radius: 2px;
          transition: width 1s ease-out;
        }
        .trait-interpretation {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-top: 4px;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
