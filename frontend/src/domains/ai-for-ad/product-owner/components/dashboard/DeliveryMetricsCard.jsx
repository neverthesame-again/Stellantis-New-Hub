import React from 'react';
import { Cpu, Zap, Clock, Target, FileCode, CheckCircle } from 'lucide-react';

export default function DeliveryMetricsCard({ data }) {
  if (!data) return null;
  const kpiThemes = [
    {
      topBorder: '3px solid #2563eb',
      valColor: '#60a5fa'
    },
    {
      topBorder: '3px solid #10b981',
      valColor: '#34d399'
    },
    {
      topBorder: '3px solid #8b5cf6',
      valColor: '#c084fc'
    },
    {
      topBorder: '3px solid #0d9488',
      valColor: '#2dd4bf'
    }
  ];

  const logBorders = ['#0284c7', '#8b5cf6', '#f59e0b'];

  return (
    <div className="ad-card" id="card-delivery-metrics" style={{ gap: '16px' }}>
      {/* Header */}
      <div className="ad-card-header" style={{ paddingBottom: '14px' }}>
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
            color: 'var(--stellantis-action)'
          }}>
            <Cpu size={18} />
          </div>
          <h3 className="ad-card-title" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
            AI-Assisted Delivery Metrics
          </h3>
        </div>
        <span className="st-badge badge-success" style={{ padding: '4px 12px', fontSize: '0.72rem' }}>
          Efficiency: High
        </span>
      </div>

      {/* 4 KPIs Row (Zero Gradients, Full Dark Theme Support) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px'
      }}>
        {data.kpis.map((kpi, idx) => {
          const theme = kpiThemes[idx % kpiThemes.length];
          return (
            <div
              key={kpi.label}
              style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderTop: theme.topBorder,
                borderRadius: '10px',
                padding: '12px 8px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.15s ease'
              }}
            >
              <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: theme.valColor, lineHeight: 1.1 }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: '0.70rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Split Row: Delivery Acceleration + Drafting Time Drop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '12px'
      }}>
        {/* Delivery Acceleration Breakdown */}
        <div style={{
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '12px 14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.70rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            <span>Backlog Authoring Breakdown</span>
            <span style={{ color: 'var(--stellantis-action)', fontWeight: 800 }}>68% AI Synthesized</span>
          </div>

          {/* Segmented Bar */}
          <div style={{
            display: 'flex',
            height: '8px',
            borderRadius: '9999px',
            overflow: 'hidden',
            margin: '10px 0',
            background: 'var(--border-color)'
          }}>
            <div style={{ width: `${data.accelerationBreakdown.aiSynthesized}%`, background: '#0284c7' }} title="AI Synthesized: 68%" />
            <div style={{ width: `${data.accelerationBreakdown.humanAuthored}%`, background: '#10b981' }} title="Human Authored: 24%" />
            <div style={{ width: `${data.accelerationBreakdown.hybridRefined}%`, background: '#8b5cf6' }} title="Hybrid: 8%" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7' }} /> AI (68%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Human (24%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6' }} /> Hybrid (8%)
            </span>
          </div>
        </div>

        {/* Drafting Time Reduction */}
        <div style={{
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            Story Drafting Time
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {data.draftingTimeDrop.after}
            </span>
            <span className="st-badge badge-success" style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px'
            }}>
              {data.draftingTimeDrop.reduction}
            </span>
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
            Down from {data.draftingTimeDrop.before} baseline
          </div>
        </div>
      </div>

      {/* Recent PO Override & Governance Log */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '0.70rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Recent PO AI Governance Log
        </div>
        {data.governanceLog.map((log, idx) => (
          <div
            key={log.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-color)',
              borderLeft: `3px solid ${logBorders[idx % logBorders.length]}`,
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.72rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, color: 'var(--stellantis-action)' }}>{log.userStory}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{log.action}</span>
            </div>
            <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.68rem' }}>
              {log.time} &bull; {log.actor}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
