import React from 'react';
import { FileCheck, PenLine } from 'lucide-react';

export default function RequirementQualityCard({ data, onOpenStoryDoctorModal }) {
  if (!data) return null;

  const defaultFeed = [
    { id: 'US-389', title: 'US-389: Low-friction ABS edge cases', status: 'PO Accepted', badgeType: 'success' },
    { id: 'US-402', title: 'US-402: Camera spray occlusion AC', status: 'PO Accepted', badgeType: 'success' },
    { id: 'US-377', title: 'US-377: Pre-fill braking redundancy', status: 'Modified & Approved', badgeType: 'info' }
  ];

  const activityFeed = data.activityFeed || defaultFeed;

  return (
    <div className="ad-card" id="card-requirement-quality" style={{ gap: '18px' }}>
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
            color: '#10b981'
          }}>
            <FileCheck size={18} />
          </div>
          <h3 className="ad-card-title" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
            Requirement Quality
          </h3>
        </div>
        <span className="st-badge badge-success" style={{
          padding: '4px 14px',
          fontSize: '0.72rem',
          fontFamily: 'monospace'
        }}>
          {data.status || 'INVEST: 93/100'}
        </span>
      </div>

      {/* 3 Metric Equalizer Cards (Zero Gradients, Full Dark Theme Support) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px'
      }}>
        {data.indices.map((idx, i) => {
          const themes = [
            {
              topBorder: '3px solid #2563eb',
              labelColor: '#60a5fa',
              deltaColor: '#60a5fa',
              barActive: '#2563eb'
            },
            {
              topBorder: '3px solid #10b981',
              labelColor: '#34d399',
              deltaColor: '#34d399',
              barActive: '#10b981'
            },
            {
              topBorder: '3px solid #8b5cf6',
              labelColor: '#c084fc',
              deltaColor: '#c084fc',
              barActive: '#8b5cf6'
            }
          ];
          const theme = themes[i % themes.length];

          return (
            <div
              key={idx.name || i}
              style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderTop: theme.topBorder,
                borderRadius: '12px',
                padding: '16px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.15s ease'
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: theme.labelColor, letterSpacing: '0.04em' }}>
                {idx.name}
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {idx.score}%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                {/* Micro Column Equalizer */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                  {[1, 2, 3, 4, 5].map((bar) => {
                    const activeHeight = bar <= 4 ? bar * 2.5 + 2 : 14;
                    return (
                      <div
                        key={bar}
                        style={{
                          width: '3px',
                          height: `${activeHeight}px`,
                          background: bar <= 3 ? 'var(--border-color)' : theme.barActive,
                          borderRadius: '1px'
                        }}
                      />
                    );
                  })}
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: theme.deltaColor }}>
                  {idx.delta}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Story Doctor Activity Feed Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          AI Story Doctor Activity Feed
        </div>

        {/* 3 Activity Feed Items (Zero Gradients, Full Dark Theme Support) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activityFeed.map((item) => {
            const isInfo = item.badgeType === 'info' || item.status.includes('Modified');
            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-color)',
                  borderLeft: isInfo ? '3px solid #3b82f6' : '3px solid #10b981',
                  borderRadius: '8px',
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.title}
                </span>
                <span className={`st-badge ${isInfo ? 'badge-info' : 'badge-success'}`} style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap'
                }}>
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auto-Enhance Active Backlog Full-Width Button */}
      <button
        id="btn-auto-enhance-backlog"
        onClick={onOpenStoryDoctorModal}
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
        <PenLine size={15} />
        <span>Auto-Enhance Active Backlog</span>
      </button>
    </div>
  );
}
