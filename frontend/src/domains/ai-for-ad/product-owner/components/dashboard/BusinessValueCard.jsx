import React from 'react';
import { TrendingUp, DollarSign, Clock, BarChart3 } from 'lucide-react';

export default function BusinessValueCard({ data }) {
  if (!data) return null;

  return (
    <div className="ad-card" id="card-business-value">
      {/* Header */}
      <div className="ad-card-header">
        <div className="ad-card-title-group">
          <TrendingUp size={18} color="var(--stellantis-action)" />
          <h3 className="ad-card-title">Business Value Realization</h3>
        </div>
        <span className="st-badge badge-success">{data.status}</span>
      </div>

      {/* Panoramic Content: Split into 3 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.8fr 1.5fr',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        
        {/* Column 1: Financial Snapshot */}
        <div style={{
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Cumulative Value Realized (FY26)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                €{(data.realizedValueEur / 1000).toLocaleString()}k
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                / €{(data.targetValueEur / 1000).toLocaleString()}k
              </span>
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Target Achievement: <strong>{data.progressPercentage}%</strong></span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>{data.scheduleVariance}</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--border-color)',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${data.progressPercentage}%`,
                height: '100%',
                background: 'var(--stellantis-action, #0284c7)',
                borderRadius: '9999px'
              }} />
            </div>
          </div>

          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Autonomous Driving Program ROI multiplier: <strong>4.2x</strong>
          </div>
        </div>

        {/* Column 2: Cumulative Value Pace Curve (SVG) */}
        <div style={{
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              Value Delivery Pace Curve (Q1–Q3)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.66rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Actual
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }} /> Planned
              </span>
            </div>
          </div>

          {/* SVG Pace Curve */}
          <div style={{ width: '100%', height: '90px', marginTop: '10px' }}>
            <svg viewBox="0 0 300 90" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Planned Line (Dashed) */}
              <polyline
                fill="none"
                stroke="var(--border-strong)"
                strokeWidth="2"
                strokeDasharray="4 4"
                points="20,80 70,68 120,54 170,40 220,26 270,12"
              />
              {/* Actual Line (Solid Green) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points="20,78 70,60 120,44 170,28 220,16 270,4"
              />
              {/* Actual Points */}
              {[[20, 78], [70, 60], [120, 44], [170, 28], [220, 16], [270, 4]].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3.5" fill="#10b981" stroke="var(--bg-surface)" strokeWidth="1.5" />
              ))}
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '4px' }}>
            {data.paceCurve.map((pt) => (
              <span key={pt.week}>{pt.week}</span>
            ))}
          </div>
        </div>

        {/* Column 3: Cycle Time Distribution Histogram */}
        <div style={{
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              Story Cycle Time Histogram
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981' }}>
              Median: {data.cycleTime.medianDrop} ({data.cycleTime.percentageDrop})
            </span>
          </div>

          {/* Histogram Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px', marginTop: '10px' }}>
            {data.cycleTime.distribution.map((bucket) => (
              <div key={bucket.bucket} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {bucket.percentage}%
                </span>
                <div style={{
                  width: '100%',
                  height: `${bucket.percentage * 1.3}px`,
                  background: bucket.color,
                  borderRadius: '4px 4px 0 0'
                }} />
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {bucket.bucket}
                </span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>
            AI-assisted delivery reduced median story cycle time by 69.5%
          </div>
        </div>

      </div>
    </div>
  );
}
