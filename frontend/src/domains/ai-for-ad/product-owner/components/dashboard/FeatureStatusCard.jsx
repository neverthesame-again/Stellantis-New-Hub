import React from 'react';
import { GitBranch } from 'lucide-react';

export default function FeatureStatusCard({ data }) {
  if (!data) return null;

  return (
    <div className="ad-card" id="card-feature-status" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Top Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Header */}
        <div className="ad-card-header" style={{ paddingBottom: '12px' }}>
          <div className="ad-card-title-group" style={{ gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b5cf6'
            }}>
              <GitBranch size={18} />
            </div>
            <h3 className="ad-card-title" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
              Feature Status
            </h3>
          </div>
          <span className="st-badge badge-info" style={{
            padding: '4px 12px',
            fontSize: '0.72rem'
          }}>
            {data.status || 'Sprint 42: Active'}
          </span>
        </div>

        {/* Top Burn-Up Chart Box */}
        <div style={{
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Sprint Burn-Up (Scope vs Done)
            </span>
            <strong style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>
              42 / 64 SP Completed
            </strong>
          </div>

          {/* SVG Burn-Up Mini Chart */}
          <div style={{ width: '100%', height: '36px' }}>
            <svg viewBox="0 0 280 36" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Target Dashed Line */}
              <line x1="10" y1="8" x2="270" y2="8" stroke="var(--border-strong, #cbd5e1)" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Area fill */}
              <path d="M 10 30 Q 140 24, 270 8 L 270 34 L 10 34 Z" fill="rgba(16, 185, 129, 0.1)" />
              {/* Green burn-up line */}
              <path d="M 10 30 Q 140 24, 270 8" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
              {/* Endpoint Dot */}
              <circle cx="270" cy="8" r="3.5" fill="#10b981" />
            </svg>
          </div>
        </div>

        {/* 3 Active Epics List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Epic 1: AD-104 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                AD-104 Radar-Vision Fusion
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#047857' }}>
                78%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'var(--border-color)',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{ width: '78%', height: '100%', background: '#10b981', borderRadius: '9999px' }} />
            </div>
          </div>

          {/* Epic 2: AD-108 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                AD-108 Trajectory Planner
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#b45309' }}>
                45% (At Risk)
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'var(--border-color)',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{ width: '45%', height: '100%', background: '#f59e0b', borderRadius: '9999px' }} />
            </div>
          </div>

          {/* Epic 3: AD-112 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                AD-112 Pedestrian Detection
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0284c7' }}>
                92%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'var(--border-color)',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{ width: '92%', height: '100%', background: '#0284c7', borderRadius: '9999px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Finish Forecast */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '12px',
        marginTop: '12px',
        fontSize: '0.74rem'
      }}>
        <span style={{ color: 'var(--text-muted)' }}>Finish Forecast:</span>
        <strong style={{ color: 'var(--text-primary)' }}>
          Thu Oct 16 &ndash; Mon Oct 20 (94% Conf)
        </strong>
      </div>
    </div>
  );
}
