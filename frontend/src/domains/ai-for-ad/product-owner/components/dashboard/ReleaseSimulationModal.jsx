import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, CheckCircle2 } from 'lucide-react';

export default function ReleaseSimulationModal({ isOpen, onClose, onApplySimulation, currentScore = 91 }) {
  const [grantWaiver, setGrantWaiver] = useState(false);
  const [injectSyntheticData, setInjectSyntheticData] = useState(false);

  if (!isOpen) return null;

  let simulatedScore = currentScore;
  if (grantWaiver) simulatedScore += 3;
  if (injectSyntheticData) simulatedScore += 2;

  const isFullGo = simulatedScore >= 95;

  const handleApply = () => {
    onApplySimulation({ grantWaiver, injectSyntheticData, simulatedScore });
    onClose();
  };

  const modalContent = (
    <div className="ad-modal-backdrop" onClick={onClose}>
      <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ad-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Play size={18} color="var(--stellantis-action)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Release Impact Simulation Engine
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          Simulate gate approval outcomes for <strong>RC_v3.4.0-rc2_EuroNCAP</strong> by applying synthetic sensor telemetry and temporary testing waivers.
        </div>

        {/* Projected Score Preview Box */}
        <div style={{
          background: isFullGo ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-secondary)',
          border: `1px solid ${isFullGo ? '#10b981' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Projected Gate Decision
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isFullGo ? '#047857' : 'var(--text-primary)', marginTop: '2px' }}>
              {isFullGo ? 'FULL GO (VERIFIED)' : 'CONDITIONAL GO'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Projected Readiness
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: isFullGo ? '#10b981' : '#f59e0b' }}>
              {simulatedScore}%
            </div>
          </div>
        </div>

        {/* Simulation Parameter Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={grantWaiver}
              onChange={(e) => setGrantWaiver(e.target.checked)}
              style={{ marginTop: '2px' }}
            />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Waive HIL 90% threshold for Balocco closed-course track trial (+3%)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Grants provisional approval while nightly regression rerun executes on Rig 1.
              </div>
            </div>
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={injectSyntheticData}
              onChange={(e) => setInjectSyntheticData(e.target.checked)}
              style={{ marginTop: '2px' }}
            />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Inject Synthetic LiDAR emulator stream into regression suite (+2%)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Supplements delayed hardware stream with validated virtual Balocco road telemetry.
              </div>
            </div>
          </label>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={onClose}
            className="st-btn st-btn-outline"
            style={{ padding: '8px 16px', fontSize: '0.78rem' }}
          >
            Cancel
          </button>
          <button
            id="btn-apply-simulation"
            onClick={handleApply}
            className="st-btn st-btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.78rem', fontWeight: 700 }}
          >
            Apply Simulation
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
