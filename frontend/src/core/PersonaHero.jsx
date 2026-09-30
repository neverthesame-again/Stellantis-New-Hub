import React from 'react';
import { DOMAIN_PERSONA_MAP } from './WorkspaceBar';
import { useAuth } from '../auth/AuthContext';

export default function PersonaHero({ selectedDomain, selectedRole }) {
  const { user } = useAuth();
  const persona = DOMAIN_PERSONA_MAP[selectedDomain] || DOMAIN_PERSONA_MAP['AI for AMS'];

  return (
    <div style={{ marginBottom: '20px', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      {/* Top Banner Card */}
      <div style={{
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
        gap: '16px',
        width: '100%',
        boxSizing: 'border-box',
        flexWrap: 'wrap',
        transition: 'background 0.3s ease, border-color 0.3s ease'
      }}>
        {/* Left Title & Tagline */}
        <div style={{ flex: '1 1 280px', minWidth: '220px', maxWidth: '560px' }}>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0
          }}>
            <span>{selectedDomain}</span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span>{selectedRole}</span>
          </h1>
          <p style={{
            fontSize: '0.83rem',
            color: 'var(--text-muted)',
            marginTop: '3px',
            margin: 0,
            lineHeight: 1.4
          }}>
            {persona.subtitle}
          </p>
        </div>

        {/* Right Section: 2-Tier Stack (Metadata on top, Info Chips directly underneath) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '10px',
          flex: '0 1 auto',
          minWidth: 0
        }}>
          {/* Row 1: Platform | Shift | Shift Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{persona.platform}</div>
            </div>

            <div style={{ width: '1px', height: '22px', background: 'var(--border-color)' }} />

            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shift</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{persona.shift}</div>
            </div>

            <div style={{ width: '1px', height: '22px', background: 'var(--border-color)' }} />

            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shift Progress</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{persona.shiftProgress}</div>
            </div>
          </div>

          {/* Row 2: Info Chips horizontally in a row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {persona.infoChips && persona.infoChips.map((chip, i) => (
              <div key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: chip.bg || 'var(--bg-subtle)',
                border: `1px solid ${chip.border || 'var(--border-color)'}`,
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: chip.color || 'var(--text-primary)',
                whiteSpace: 'nowrap'
              }}>
                {chip.dot && (
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: chip.dotColor || '#10b981',
                    boxShadow: `0 0 6px ${chip.dotColor || '#10b981'}`,
                    display: 'inline-block',
                    flexShrink: 0
                  }} />
                )}
                {chip.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Greeting & Key KPI Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '20px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ flex: '1 1 280px', minWidth: '220px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Good morning, {user?.full_name?.split(' ')[0] || 'User'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {persona.statusText}
          </p>
        </div>

        {/* Big KPI Metric Boxes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {persona.kpis.map((kpi, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 16px',
                minWidth: '130px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: kpi.color, lineHeight: 1.2 }}>
                {kpi.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
