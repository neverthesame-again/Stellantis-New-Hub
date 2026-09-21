import React from 'react';
import { createPortal } from 'react-dom';
import { X, Wand2, CheckCircle2 } from 'lucide-react';

export default function StoryDoctorModal({ isOpen, onClose, onApplyStoryEnhancement, storyDoctorData }) {
  if (!isOpen || !storyDoctorData) return null;

  const isEnhanced = storyDoctorData.enhanced;

  const handleApply = () => {
    onApplyStoryEnhancement();
    onClose();
  };

  const modalContent = (
    <div className="ad-modal-backdrop" onClick={onClose}>
      <div className="ad-modal-dialog" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ad-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wand2 size={18} color="var(--stellantis-action)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              AI Story Doctor: INVEST Acceptance Criteria Refinement
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

        {/* Story Metadata */}
        <div style={{
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>TARGET USER STORY</span>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {storyDoctorData.targetStory}
            </div>
          </div>
          <span className="st-badge badge-purple">Epic {storyDoctorData.epicId}</span>
        </div>

        {/* Diagnostic Finding */}
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Diagnostic Finding:</strong> {storyDoctorData.issueDescription}
        </div>

        {/* Side-by-Side Before vs After Gherkin Spec */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px'
        }}>
          {/* Before */}
          <div style={{
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '14px'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#b91c1c', marginBottom: '8px', textTransform: 'uppercase' }}>
              Baseline AC (Incomplete)
            </div>
            <pre style={{
              fontSize: '0.7rem',
              fontFamily: 'monospace',
              color: 'var(--text-muted)',
              whiteSpace: 'pre-wrap',
              margin: 0,
              lineHeight: 1.45
            }}>
              {`Given vehicle is in cruise mode
When obstacle is detected
Then trigger ABS if distance < 30m.`}
            </pre>
            <div style={{ fontSize: '0.66rem', color: '#b91c1c', marginTop: '10px', fontWeight: 600 }}>
              Fails edge-case test: Missing rain condition sensor fallback rule.
            </div>
          </div>

          {/* After (GenAI Gherkin) */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid #10b981',
            borderRadius: 'var(--radius-md)',
            padding: '14px'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#047857', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} color="#10b981" />
              <span>AI Synthesized Gherkin AC</span>
            </div>
            <pre style={{
              fontSize: '0.7rem',
              fontFamily: 'monospace',
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              margin: 0,
              lineHeight: 1.45
            }}>
              {storyDoctorData.suggestedGherkin}
            </pre>
            <div style={{ fontSize: '0.66rem', color: '#047857', marginTop: '10px', fontWeight: 600 }}>
              Passes INVEST Testability criteria (100% Gherkin automation compatible).
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={onClose}
            className="st-btn st-btn-outline"
            style={{ padding: '8px 18px', fontSize: '0.8rem', fontWeight: 600 }}
          >
            Close
          </button>
          {!isEnhanced && (
            <button
              id="btn-accept-story-enhancement"
              onClick={handleApply}
              className="st-btn st-btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.8rem', fontWeight: 700 }}
            >
              Accept &amp; Update Backlog
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render directly into document.body to break out of transformed parent containers
  return createPortal(modalContent, document.body);
}
