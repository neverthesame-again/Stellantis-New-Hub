import React from 'react';
import { Share2, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

export default function DependencyRiskCard({ data, onToggleMitigation, isSubmitting }) {
  if (!data) return null;

  const isMitigated = data.mitigationApplied;

  return (
    <div className="ad-card" id="card-dependency-risk" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
              color: '#ef4444'
            }}>
              <Share2 size={18} />
            </div>
            <h3 className="ad-card-title" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
              Dependency &amp; Risk Status
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: 'var(--bg-surface-secondary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '4px 12px',
              fontSize: '0.68rem',
              fontWeight: 600,
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              lineHeight: 1.25,
              minWidth: '72px'
            }}>
              <span>Day 4</span>
              <span>Blocking</span>
            </div>
            <div
              className={`st-badge ${isMitigated ? 'badge-success' : 'badge-critical'}`}
              style={{
                borderRadius: '14px',
                padding: '4px 12px',
                fontSize: '0.68rem',
                fontWeight: 700,
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                lineHeight: 1.25,
                minWidth: '72px'
              }}
            >
              {isMitigated ? (
                <>
                  <span>Bypass</span>
                  <span>Active</span>
                </>
              ) : (
                <>
                  <span>1 Critical</span>
                  <span>Blocker</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3-Node Topology Diagram matching Image 2 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '12px 14px',
          gap: '8px'
        }}>
          {/* Node 1: Camera Mod. */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center',
            flex: 1
          }}>
            Camera Mod.
          </div>

          {/* Arrow 1 */}
          <ArrowRight size={15} color="#10b981" />

          {/* Node 2: Fusion AD-108 */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center',
            flex: 1
          }}>
            Fusion AD-108
          </div>

          {/* Arrow 2 */}
          <ArrowRight size={15} color={isMitigated ? '#10b981' : '#ef4444'} />

          {/* Node 3: Path Planning */}
          <div style={{
            background: isMitigated ? 'var(--badge-success-bg)' : 'var(--badge-critical-bg)',
            border: `1px solid ${isMitigated ? 'var(--badge-success-border)' : 'var(--badge-critical-border)'}`,
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: isMitigated ? 'var(--badge-success-text)' : 'var(--badge-critical-text)',
            textAlign: 'center',
            flex: 1
          }}>
            Path Planning
          </div>
        </div>

        {/* Risk Blocker Callout */}
        <div style={{ fontSize: '0.78rem', lineHeight: 1.45 }}>
          <strong style={{ color: 'var(--badge-critical-text, #f87171)' }}>Supplier LiDAR SDK Delay:</strong>{' '}
          <span style={{ color: 'var(--text-secondary)' }}>
            Slips Sprint 43 by 3 days &amp; blocks 2 downstream epics.
          </span>
        </div>

        {/* Segmented Timeline Delay Bar matching Image 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{
            width: '100%',
            height: '10px',
            background: 'var(--border-color)',
            borderRadius: '9999px',
            overflow: 'hidden',
            display: 'flex'
          }}>
            <div style={{ width: '70%', height: '100%', background: 'var(--border-strong)' }} />
            <div style={{ width: '30%', height: '100%', background: isMitigated ? '#10b981' : '#f87171' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>Sprint 42</span>
            <span style={{ color: isMitigated ? '#10b981' : '#ef4444', fontWeight: 700 }}>
              {isMitigated ? 'Synthetic Bypass Active' : '+3 Days Delay'}
            </span>
            <span>Sprint 43</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <button
        id="btn-apply-mitigation"
        onClick={onToggleMitigation}
        disabled={isSubmitting}
        className="st-btn st-btn-primary"
        style={{
          width: '100%',
          padding: '12px 18px',
          borderRadius: '10px',
          fontSize: '0.84rem',
          fontWeight: 700,
          cursor: 'pointer',
          opacity: isSubmitting ? 0.7 : 1,
          marginTop: '12px'
        }}
      >
        {isMitigated ? (
          <>
            <CheckCircle2 size={16} color="#10b981" />
            <span>Revert to Physical Dependency</span>
          </>
        ) : (
          <>
            <Shield size={16} />
            <span>Apply Synthetic Emulator Mitigation</span>
          </>
        )}
      </button>
    </div>
  );
}
