import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

export default function ReleaseReadinessCard({ data, onOpenSimulationModal }) {
  if (!data) return null;

  const score = data.overallScore || 91;
  const isSuccess = score >= 95;
  const circumference = 2 * Math.PI * 23; // r = 23
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className="ad-card"
      id="card-release-readiness"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '14px'
      }}
    >
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
              color: '#10b981'
            }}>
              <ShieldCheck size={18} />
            </div>
            <h3 className="ad-card-title" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
              Release Readiness
            </h3>
          </div>
          <span className={`st-badge ${isSuccess ? 'badge-success' : 'badge-high'}`} style={{
            padding: '4px 12px',
            fontSize: '0.72rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isSuccess ? 'Full Go (Simulated)' : (data.status || 'Conditional Go')}
          </span>
        </div>

        {/* Circular Score Ring + 5-Day Sprint Pace Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 0'
        }}>
          {/* Left: Gauge + Title + Blocker note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  stroke="var(--border-color)"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  stroke="#10b981"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 28 28)"
                  style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                />
              </svg>
              <span style={{
                position: 'absolute',
                fontSize: '0.9rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)'
              }}>
                {score}%
              </span>
            </div>

            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {data.candidateTag || 'RC v3.4 Gateway'}
              </div>
              <div style={{
                fontSize: '0.74rem',
                color: isSuccess ? '#10b981' : '#f59e0b',
                fontWeight: 600,
                marginTop: '2px'
              }}>
                {isSuccess ? '0 blockers remaining' : '1 blocker remaining'}
              </div>
            </div>
          </div>

          {/* Right: 5-Day Sprint Pace */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              5-Day Sprint Pace
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                <div style={{ width: '3px', height: '6px', background: 'var(--border-color)', borderRadius: '1px' }} />
                <div style={{ width: '3px', height: '8px', background: 'var(--border-color)', borderRadius: '1px' }} />
                <div style={{ width: '3px', height: '11px', background: '#10b981', borderRadius: '1px' }} />
                <div style={{ width: '3px', height: '14px', background: '#10b981', borderRadius: '1px' }} />
              </div>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#10b981' }}>
                +15%
              </span>
            </div>
          </div>
        </div>

        {/* Gatekeeper Checklist matching Image 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Row 1: ASIL-D Safety Verification */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                ASIL-D Safety Verification
              </span>
            </div>
            <span className="st-badge badge-success" style={{
              padding: '2px 8px',
              fontSize: '0.68rem',
              fontWeight: 800
            }}>
              PASS
            </span>
          </div>

          {/* Row 2: HIL Simulation Coverage */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={15} color={isSuccess ? '#10b981' : '#f59e0b'} />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                HIL Simulation Coverage
              </span>
            </div>
            <span className={`st-badge ${isSuccess ? 'badge-success' : 'badge-high'}`} style={{
              padding: '2px 8px',
              fontSize: '0.68rem',
              fontWeight: 700
            }}>
              {isSuccess ? '95% / 90%' : '86% / 90%'}
            </span>
          </div>

          {/* Row 3: NVIDIA Orin SoC Latency */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                NVIDIA Orin SoC Latency
              </span>
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}>
              11.4ms (Budget 15ms)
            </span>
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <button
        id="btn-simulate-release"
        onClick={onOpenSimulationModal}
        className="st-btn st-btn-primary"
        style={{
          width: '100%',
          padding: '12px 18px',
          borderRadius: '10px',
          fontSize: '0.84rem',
          fontWeight: 700,
          cursor: 'pointer',
          marginTop: 'auto'
        }}
      >
        <Play size={14} />
        <span>Simulate Release Impact</span>
      </button>
    </div>
  );
}
