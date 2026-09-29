import React, { useState } from 'react';
import { Compass, ArrowRight, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function RoadmapHorizonCard({ data }) {
  const [activeHorizon, setActiveHorizon] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  if (!data) return null;

  const renderConfidenceBars = (confidence, isAmber = false) => {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '12px' }} title={`Confidence: ${confidence}/4`}>
        {[1, 2, 3, 4].map((bar) => {
          const isActive = bar <= confidence;
          return (
            <div
              key={bar}
              style={{
                width: '3px',
                height: `${bar * 2.5 + 2}px`,
                background: isActive ? (isAmber ? '#f59e0b' : 'var(--stellantis-action, #0284c7)') : 'var(--border-color)',
                borderRadius: '1px'
              }}
            />
          );
        })}
      </div>
    );
  };

  const horizonDetails = {
    now: {
      badge: 'Active Cadence',
      title: 'Sprint 42–43 Active Delivery Horizon',
      accentColor: 'var(--stellantis-action, #0284c7)',
      borderColor: 'var(--border-color)',
      bg: 'var(--bg-surface-secondary)',
      metrics: [
        { label: 'Milestone Gate', val: 'Release v3.4', sub: 'Oct 15, 2026', subColor: '#60a5fa' },
        { label: 'Committed Scope', val: '64 Story Points', sub: '42 SP Completed (65%)', subColor: '#34d399' },
        { label: 'AI Confidence', val: '94% On Track', sub: 'Safety loop verified', subColor: '#34d399' },
        { label: 'Risk Blocker', val: '1 Active Blocker', sub: 'LiDAR SDK Emulator ON', subColor: '#fbbf24' }
      ],
      commitments: 'Radar-Vision Fusion Clustering (AD-104), Highway Trajectory Planner (AD-108), ASIL-D Fail-Operational Braking Supervisor (AD-110). Target: Euro NCAP 2026 track compliance.'
    },
    next: {
      badge: 'Q4 2026 Horizon',
      title: 'Q4 2026 Euro NCAP 2026 Track Certification',
      accentColor: '#8b5cf6',
      borderColor: 'var(--border-color)',
      bg: 'var(--bg-surface-secondary)',
      metrics: [
        { label: 'Target Release', val: 'Release v4.0', sub: 'Dec 18, 2026', subColor: '#c084fc' },
        { label: 'Estimated Scope', val: '86 Story Points', sub: 'In Backlog Refinement', subColor: '#c084fc' },
        { label: 'AI Confidence', val: '88% High', sub: 'HIL simulation ready', subColor: '#34d399' },
        { label: 'Hardware Target', val: 'Orin SoC (INT8)', sub: 'Latency budget 15ms', subColor: '#60a5fa' }
      ],
      commitments: 'Vision Transformer v2 BEV model (AD-201), Continental ARS548 HD Radar integration (AD-204), Dual-Channel Steer-by-Wire Redundancy (AD-208).'
    },
    later: {
      badge: '2027 Scale',
      title: '2027 L3 Hands-Off Highway Pilot Scale',
      accentColor: 'var(--text-muted)',
      borderColor: 'var(--border-color)',
      bg: 'var(--bg-surface-secondary)',
      metrics: [
        { label: 'Target Launch', val: 'STLA AutoDrive L3', sub: 'Q2 2027 Scale', subColor: 'var(--text-primary)' },
        { label: 'Architecture Runway', val: '140+ Story Points', sub: 'R&D Exploration phase', subColor: 'var(--text-secondary)' },
        { label: 'AI Confidence', val: '82% Feasibility', sub: 'Sim synthetic test valid', subColor: '#34d399' },
        { label: 'Safety Envelope', val: '130 km/h ODD', sub: 'Hands-off driver monitor', subColor: 'var(--text-primary)' }
      ],
      commitments: '4D Volumetric Occupancy Grid & Neural Path Prediction (AD-308), Solid-State LiDAR production clustering (AD-305), STLA AutoDrive L3 Highway Pilot (AD-301).'
    }
  };

  // Structured swimlane data ensuring all 3 quarters have active data
  const swimlaneRows = [
    {
      id: 'perception',
      name: 'L2+ Perception',
      now: {
        id: 'AD-104',
        title: 'Release v3.4 • Euro NCAP Protocol',
        confidence: 4,
        status: '94% Conf',
        badgeClass: 'st-badge badge-info',
        details: 'Vision-Radar dual clustering calibrated for Euro NCAP 2026 pedestrian edge-cases.'
      },
      next: {
        id: 'AD-201',
        title: 'Vision Transformer v2',
        status: 'Refinement',
        badgeClass: 'st-badge badge-purple',
        details: 'BEV Transformer model with 48ms inference latency budget on Orin.'
      },
      later: {
        id: 'AD-308',
        title: '4D Occupancy Grid',
        status: 'Architecture',
        badgeClass: 'st-badge badge-info',
        details: 'High-density volumetric occupancy grid for unmapped construction zones.'
      }
    },
    {
      id: 'fusion',
      name: 'Sensor Fusion',
      now: {
        id: 'AD-108',
        title: 'AD-108 4D Radar Fusion',
        confidence: 2,
        status: 'At Risk',
        badgeClass: 'st-badge badge-high',
        isRisk: true,
        details: 'Hardware LiDAR SDK delay. Mitigated via synthetic radar stream emulator.'
      },
      next: {
        id: 'AD-204',
        title: 'Risk propagates in Sprint 43',
        status: 'At Risk',
        badgeClass: 'st-badge badge-high',
        isWarning: true,
        details: 'Downstream dependency linked to Sprint 43 trajectory planner.'
      },
      later: {
        id: 'AD-305',
        title: 'Solid-State LiDAR',
        status: 'Scale Phase',
        badgeClass: 'st-badge badge-info',
        details: 'Continental ARS548 HD Radar & Solid-State LiDAR production ramp.'
      }
    },
    {
      id: 'safety',
      name: 'Safety Control',
      now: {
        id: 'AD-110',
        title: 'ASIL-D Braking • ISO 26262 Gate',
        status: 'Scheduled',
        badgeClass: 'st-badge badge-navy',
        details: 'ASIL-D dual-redundant deceleration supervisor with 10ms hardware watchdog.'
      },
      next: {
        id: 'AD-208',
        title: 'Dual-Channel Steer-by-Wire',
        status: 'Validation',
        badgeClass: 'st-badge badge-success',
        details: 'HIL simulation testbench for fault-tolerant actuator crossover.'
      },
      later: {
        id: 'AD-301',
        title: 'STLA AutoDrive L3 Pilot',
        status: 'Roadmap',
        badgeClass: 'st-badge badge-info',
        details: 'Hands-off 130 km/h highway pilot with driver monitoring supervisor.'
      }
    }
  ];

  const gridTemplate = '130px 1.25fr 1.15fr 1.15fr';

  return (
    <div
      className="ad-card"
      id="card-roadmap-horizon"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '14px',
        minWidth: 0
      }}
    >
      {/* Top Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
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
              color: 'var(--stellantis-action)'
            }}>
              <Compass size={18} />
            </div>
            <h3 className="ad-card-title" style={{ fontSize: '0.9rem', fontWeight: 800 }}>
              Product Roadmap Horizon
            </h3>
          </div>
          <span className="st-badge badge-success" style={{
            padding: '4px 12px',
            fontSize: '0.72rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            On Track (94% AI Confidence)
          </span>
        </div>

        {/* Interactive Clickable Horizon Column Headers (Pixel-perfect aligned to row tracks) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: gridTemplate,
          gap: '12px',
          padding: '2px 14px',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}>
          <div style={{ fontSize: '0.70rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Swimlanes
          </div>

          {/* Button 1: NOW */}
          <button
            type="button"
            onClick={() => {
              setActiveHorizon(activeHorizon === 'now' ? null : 'now');
              setSelectedItem(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '6px 10px',
              borderRadius: '8px',
              border: activeHorizon === 'now' ? '1.5px solid var(--stellantis-action, #0284c7)' : '1px solid var(--border-color)',
              background: activeHorizon === 'now' ? 'var(--bg-subtle)' : 'var(--bg-surface)',
              color: activeHorizon === 'now' ? 'var(--stellantis-action, #0284c7)' : 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.03em',
              transition: 'all 0.15s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
            title="Click to view Sprint 42-43 deep-dive data"
          >
            <span>NOW &bull; SPRINT 42-43</span>
            <span style={{
              fontSize: '0.60rem',
              padding: '1px 5px',
              borderRadius: '4px',
              background: activeHorizon === 'now' ? 'var(--stellantis-action)' : 'var(--border-color)',
              color: activeHorizon === 'now' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700
            }}>
              3 Epics
            </span>
          </button>

          {/* Button 2: NEXT */}
          <button
            type="button"
            onClick={() => {
              setActiveHorizon(activeHorizon === 'next' ? null : 'next');
              setSelectedItem(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '6px 10px',
              borderRadius: '8px',
              border: activeHorizon === 'next' ? '1.5px solid #8b5cf6' : '1px solid var(--border-color)',
              background: activeHorizon === 'next' ? 'var(--bg-subtle)' : 'var(--bg-surface)',
              color: activeHorizon === 'next' ? '#a78bfa' : 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.03em',
              transition: 'all 0.15s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
            title="Click to view Q4 2026 roadmap and Euro NCAP targets"
          >
            <span>NEXT &bull; Q4 2026</span>
            <span style={{
              fontSize: '0.60rem',
              padding: '1px 5px',
              borderRadius: '4px',
              background: activeHorizon === 'next' ? '#8b5cf6' : 'var(--border-color)',
              color: activeHorizon === 'next' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700
            }}>
              86 SP
            </span>
          </button>

          {/* Button 3: LATER */}
          <button
            type="button"
            onClick={() => {
              setActiveHorizon(activeHorizon === 'later' ? null : 'later');
              setSelectedItem(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '6px 10px',
              borderRadius: '8px',
              border: activeHorizon === 'later' ? '1.5px solid var(--text-muted)' : '1px solid var(--border-color)',
              background: activeHorizon === 'later' ? 'var(--bg-subtle)' : 'var(--bg-surface)',
              color: activeHorizon === 'later' ? 'var(--text-primary)' : 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.03em',
              transition: 'all 0.15s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
            title="Click to view 2027 L3 Scale architecture runway"
          >
            <span>LATER &bull; 2027 L3 SCALE</span>
            <span style={{
              fontSize: '0.60rem',
              padding: '1px 5px',
              borderRadius: '4px',
              background: activeHorizon === 'later' ? 'var(--text-secondary)' : 'var(--border-color)',
              color: activeHorizon === 'later' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700
            }}>
              R&amp;D
            </span>
          </button>
        </div>

        {/* 3 Horizontal Swimlane Rows (Pixel-perfect identical grid) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {swimlaneRows.map((row) => (
            <div
              key={row.id}
              style={{
                display: 'grid',
                gridTemplateColumns: gridTemplate,
                alignItems: 'center',
                gap: '12px',
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '8px 14px',
                minHeight: '48px',
                boxSizing: 'border-box'
              }}
            >
              {/* Col 1: Swimlane Label */}
              <div style={{ fontSize: '0.80rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                {row.name}
              </div>

              {/* Col 2: NOW (Sprint 42-43) Item */}
              <div
                onClick={() => setSelectedItem(row.now)}
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${selectedItem?.id === row.now.id ? 'var(--stellantis-action, #0284c7)' : (activeHorizon === 'now' ? 'var(--stellantis-action, #0284c7)' : (row.now.isRisk ? '#f59e0b' : 'var(--border-color)'))}`,
                  borderRadius: '8px',
                  padding: '7px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  cursor: 'pointer',
                  width: '100%',
                  boxSizing: 'border-box',
                  minWidth: 0,
                  boxShadow: activeHorizon === 'now' ? '0 0 0 1px var(--stellantis-action)' : 'var(--shadow-sm)',
                  transition: 'all 0.15s ease'
                }}
                title={row.now.details}
              >
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: row.now.isRisk ? '#f59e0b' : 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {row.now.title}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  {row.now.confidence && renderConfidenceBars(row.now.confidence, row.now.isRisk)}
                  <span className={row.now.badgeClass} style={{
                    fontSize: '0.64rem',
                    padding: '2px 7px'
                  }}>
                    {row.now.status}
                  </span>
                </div>
              </div>

              {/* Col 3: NEXT (Q4 2026) Item */}
              <div
                onClick={() => setSelectedItem(row.next)}
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${selectedItem?.id === row.next.id ? '#8b5cf6' : (activeHorizon === 'next' ? '#8b5cf6' : (row.next.isWarning ? '#f59e0b' : 'var(--border-color)'))}`,
                  borderRadius: '8px',
                  padding: '7px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                  cursor: 'pointer',
                  width: '100%',
                  boxSizing: 'border-box',
                  minWidth: 0,
                  boxShadow: activeHorizon === 'next' ? '0 0 0 1px #8b5cf6' : 'var(--shadow-sm)',
                  transition: 'all 0.15s ease'
                }}
                title={row.next.details}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, overflow: 'hidden' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', flexShrink: 0 }}>&rarr;</span>
                  <span style={{
                    fontSize: '0.73rem',
                    fontWeight: row.next.isWarning ? 700 : 600,
                    color: row.next.isWarning ? '#f59e0b' : 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {row.next.title}
                  </span>
                </div>
                <span className={row.next.badgeClass} style={{
                  fontSize: '0.60rem',
                  padding: '1px 5px',
                  flexShrink: 0
                }}>
                  {row.next.status}
                </span>
              </div>

              {/* Col 4: LATER (2027 L3 Scale) Item */}
              <div
                onClick={() => setSelectedItem(row.later)}
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${selectedItem?.id === row.later.id ? 'var(--text-muted)' : (activeHorizon === 'later' ? 'var(--text-muted)' : 'var(--border-color)')}`,
                  borderRadius: '8px',
                  padding: '7px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                  cursor: 'pointer',
                  width: '100%',
                  boxSizing: 'border-box',
                  minWidth: 0,
                  boxShadow: activeHorizon === 'later' ? '0 0 0 1px var(--text-muted)' : 'var(--shadow-sm)',
                  transition: 'all 0.15s ease'
                }}
                title={row.later.details}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, overflow: 'hidden' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', flexShrink: 0 }}>&rarr;</span>
                  <span style={{
                    fontSize: '0.73rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {row.later.title}
                  </span>
                </div>
                <span className={row.later.badgeClass} style={{
                  fontSize: '0.60rem',
                  padding: '1px 5px',
                  flexShrink: 0
                }}>
                  {row.later.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Horizon Deep-Dive Panel (When a Horizon Button is clicked) */}
        {activeHorizon && (
          <div style={{
            background: horizonDetails[activeHorizon].bg,
            border: `1px solid ${horizonDetails[activeHorizon].borderColor}`,
            borderLeft: `4px solid ${horizonDetails[activeHorizon].accentColor}`,
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: horizonDetails[activeHorizon].accentColor,
                  color: '#ffffff',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  fontWeight: 800
                }}>
                  {horizonDetails[activeHorizon].badge}
                </span>
                <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                  {horizonDetails[activeHorizon].title}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => setActiveHorizon(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  fontWeight: 700
                }}
              >
                &times; Dismiss
              </button>
            </div>

            {/* 4 Quarter Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginTop: '4px'
            }}>
              {horizonDetails[activeHorizon].metrics.map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {m.label}
                  </span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {m.val}
                  </span>
                  <span style={{ fontSize: '0.64rem', color: m.subColor || 'var(--text-secondary)' }}>
                    {m.sub}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '2px' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Key Commitments:</strong>{' '}
              {horizonDetails[activeHorizon].commitments}
            </div>
          </div>
        )}

        {/* Dynamic Interactive Detail Bar (When an individual item is selected) */}
        {selectedItem && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--stellantis-action, #0284c7)',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '0.72rem',
            animation: 'fadeIn 0.2s ease',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, color: 'var(--stellantis-action)' }}>{selectedItem.id}:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{selectedItem.title}</strong>
              <span style={{ color: 'var(--text-secondary)' }}>&ndash; {selectedItem.details}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              &times; Close
            </button>
          </div>
        )}
      </div>

      {/* Footer matching Image 2 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '8px',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        marginTop: 'auto'
      }}>
        <span>AI Horizon Engine synced 4m ago</span>
        <span>Next Release Milestone Target: Oct 15, 2026</span>
      </div>
    </div>
  );
}
