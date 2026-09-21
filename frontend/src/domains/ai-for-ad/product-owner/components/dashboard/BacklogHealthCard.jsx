import React from 'react';
import { Layers } from 'lucide-react';

export default function BacklogHealthCard({ data }) {
  if (!data) return null;

  return (
    <div className="ad-card" id="card-backlog-health" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
              color: 'var(--stellantis-accent)'
            }}>
              <Layers size={18} />
            </div>
            <h3 className="ad-card-title" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
              Backlog Health
            </h3>
          </div>
          <span className="st-badge badge-success" style={{ padding: '4px 12px', fontSize: '0.72rem' }}>
            {data.status || 'Backlog Flow: Healthy'}
          </span>
        </div>

        {/* Section Label */}
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Progression Funnel &amp; Conversion Rates
        </div>

        {/* 4 Solid-Styled Progression Funnel Boxes (Zero Gradients, Full Dark Theme Support) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          textAlign: 'center'
        }}>
          {/* 1. RAW */}
          <div style={{
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-color)',
            borderTop: '3px solid #64748b',
            borderRadius: '10px',
            padding: '12px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.15s ease'
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.04em' }}>
              RAW
            </span>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              14
            </span>
            <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              1.2d avg
            </span>
          </div>

          {/* 2. DRAFT */}
          <div style={{
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-color)',
            borderTop: '3px solid #f59e0b',
            borderRadius: '10px',
            padding: '12px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.15s ease'
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.04em' }}>
              DRAFT
            </span>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              8
            </span>
            <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              2.4d avg
            </span>
          </div>

          {/* 3. GHERKIN */}
          <div style={{
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-color)',
            borderTop: '3px solid #8b5cf6',
            borderRadius: '10px',
            padding: '12px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.15s ease'
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#a78bfa', letterSpacing: '0.04em' }}>
              GHERKIN
            </span>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              18
            </span>
            <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              0.8d avg
            </span>
          </div>

          {/* 4. READY */}
          <div style={{
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-color)',
            borderTop: '3px solid #0284c7',
            borderRadius: '10px',
            padding: '12px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform 0.15s ease'
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.04em' }}>
              READY
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                28
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8' }}>
                SP
              </span>
            </div>
            <span style={{ fontSize: '0.66rem', color: '#0284c7', fontWeight: 700 }}>
              92% Ready
            </span>
          </div>
        </div>

        {/* Conversion Rates Row with Bullets */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 4px',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '4px'
        }}>
          <div>
            &bull; Raw ➔ Draft: <strong style={{ color: 'var(--text-primary)' }}>85%</strong>
          </div>
          <div>
            &bull; Draft ➔ AC: <strong style={{ color: 'var(--text-primary)' }}>78%</strong>
          </div>
          <div>
            &bull; AC ➔ Ready: <strong style={{ color: 'var(--text-primary)' }}>92%</strong>
          </div>
        </div>

      </div>

      {/* Bottom Status Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        flexWrap: 'nowrap',
        background: 'var(--bg-surface-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '0.74rem',
        marginTop: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#10b981',
          fontWeight: 600,
          minWidth: 0,
          overflow: 'hidden'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Stage Aging: No critical bottlenecks detected
          </span>
        </div>
        <div style={{
          fontWeight: 800,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>Flow:</span>
          <span style={{ color: 'var(--stellantis-action, #0284c7)' }}>2.1x</span>
        </div>
      </div>
    </div>
  );
}
