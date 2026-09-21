import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import '../adWorkflowInbox.css';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Send,
  RotateCcw,
  Edit3,
  ListOrdered,
  X,
  Check
} from 'lucide-react';

export default function AdWorkflowInbox() {
  const [activeSubTab, setActiveSubTab] = useState('reviews');

  // Interactive tracking states
  const [feedbackState, setFeedbackState] = useState({});
  const [itemStatuses, setItemStatuses] = useState({});
  const [activeDrawers, setActiveDrawers] = useState({}); // { [itemId]: 'clarify' | 'reject' | 'delegate' | 'editStory' | 'customRank' }
  const [customRankInputs, setCustomRankInputs] = useState({});
  const [clarifyNotes, setClarifyNotes] = useState({});
  const [rejectReasons, setRejectReasons] = useState({});
  const [storyEdits, setStoryEdits] = useState({
    'story-1': 'As an Autonomous Driving System, I want to forecast pedestrian crossing trajectories using 4D Radar Doppler signatures during heavy rain spray, so that emergency brake pre-fill initiates 80ms earlier without generating nuisance alarms.'
  });
  const [gherkinEdits, setGherkinEdits] = useState({
    'ac-1': `Scenario: Evasive steer assist on dry asphalt\n  Given vehicle travels between 50-80 km/h on dry asphalt roadway\n  When driver steering wheel torque input exceeds 4.5 Nm within 120ms\n  Then electric power steering motor shall amplify torque by 25%`,
    'ac-2': `Scenario: Matrix LED glare suppression on straight flat motorway\n  Given vehicle travels at 110 km/h with active adaptive matrix headlights\n  When oncoming vehicle headlamps are detected at 450m on level road\n  Then shade matrix LED sectors 4-8 within 40ms to avoid dazzle`,
    'ac-3': `Scenario: Adjacent car lane cut-in deceleration smoothing\n  Given ego vehicle travels in ACC Highway Pilot mode at 90 km/h\n  When adjacent four-wheeled vehicle crosses lane divider within 15m\n  Then modulate regenerative braking with deceleration ramp capped at 1.5 m/s³`
  });
  const [enhancedAC, setEnhancedAC] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const toggleEnhanced = (id, gapName) => {
    setEnhancedAC(prev => {
      const next = !prev[id];
      showToast(next ? `Auto-Enhanced: AI added ${gapName} criteria (ISO 21448 / UNECE)` : 'Reverted to baseline criteria');
      return { ...prev, [id]: next };
    });
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Check if an item has been acted upon (Approved, Rejected, Delegated, Snoozed, or Telemetry Requested)
  const isResolved = (id) =>
    itemStatuses[id]?.type === 'approved' ||
    itemStatuses[id]?.type === 'rejected' ||
    itemStatuses[id]?.type === 'delegated' ||
    itemStatuses[id]?.type === 'snoozed' ||
    itemStatuses[id]?.type === 'telemetry_requested';

  // Dynamic open counts
  const reviewsOpen = (isResolved('rev-1') ? 0 : 1) + (isResolved('rev-2') ? 0 : 1);
  const storiesOpen = isResolved('story-1') ? 0 : 1; // 1 total
  const criteriaOpen = (isResolved('ac-1') ? 0 : 1) + (isResolved('ac-2') ? 0 : 1) + (isResolved('ac-3') ? 0 : 1); // 3 total
  const prioOpen = (isResolved('prio-1') ? 0 : 1) + (isResolved('prio-2') ? 0 : 1); // 2 total
  const featOpen = (isResolved('feat-1') ? 0 : 1); // 1 total
  const relOpen = (isResolved('rel-1') ? 0 : 1); // 1 total
  const valOpen = (isResolved('val-1') ? 0 : 1) + (isResolved('val-2') ? 0 : 1); // 2 total

  const totalOpen = reviewsOpen + storiesOpen + criteriaOpen + prioOpen + featOpen + relOpen + valOpen;

  const SUBTABS = [
    { id: 'reviews', label: 'Requirement Reviews', count: reviewsOpen },
    { id: 'stories', label: 'AI User Stories', count: storiesOpen },
    { id: 'criteria', label: 'Acceptance Criteria', count: criteriaOpen },
    { id: 'prioritization', label: 'Prioritization', count: prioOpen },
    { id: 'features', label: 'Feature Changes', count: featOpen },
    { id: 'release', label: 'Release Decisions', count: relOpen },
    { id: 'validation', label: 'Business Validation', count: valOpen },
  ];

  const handleFeedback = (itemId, vote) => {
    const nextVote = feedbackState[itemId] === vote ? null : vote;
    setFeedbackState(prev => ({ ...prev, [itemId]: nextVote }));
    if (nextVote === 'agree') {
      showToast(`✓ PO Agreed with AI recommendation for ${itemId.toUpperCase()}. Feedback logged for model tuning.`);
    } else if (nextVote === 'disagree') {
      showToast(`✕ PO Disagreed with AI advice for ${itemId.toUpperCase()}. Feedback logged for prompt tuning.`);
    }
  };

  const handleStatusChange = (itemId, newStatus, message) => {
    setItemStatuses(prev => ({ ...prev, [itemId]: newStatus }));
    setActiveDrawers(prev => ({ ...prev, [itemId]: null }));
    if (message) {
      showToast(message);
    }
  };

  const toggleDrawer = (itemId, drawerType) => {
    setActiveDrawers(prev => ({
      ...prev,
      [itemId]: prev[itemId] === drawerType ? null : drawerType
    }));
  };

  return (
    <div className="ad-workflow-container animate-fade-in">
      {/* Floating Action Toast via React Portal to screen bottom-right */}
      {toastMessage && typeof document !== 'undefined' && createPortal(
        <div className="ad-workflow-toast" role="alert">
          <CheckCircle2 size={18} style={{ color: 'var(--badge-success-text)', flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>,
        document.body
      )}

      {/* ================================================================= */}
      {/* HEADER & EXECUTIVE METRICS STRIP                                  */}
      {/* ================================================================= */}
      <div className="ad-workflow-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 className="ad-workflow-title">Workflow Inbox • Action Center</h2>
            <span className="st-badge badge-info" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
              Live Triage Active
            </span>
          </div>
          <p className="ad-workflow-subtitle">
            {totalOpen} Actionable item{totalOpen === 1 ? '' : 's'} awaiting Human-in-the-Loop review across 7 PRD categories
          </p>
        </div>

        {/* Informational Metrics Strip - Just Tells the Numbers (No Buttons, No Toasts) */}
        <div className="ad-header-metrics-strip">
          <div className="ad-metric-pill">
            <span className="ad-metric-pill-label">Total Open</span>
            <span className="ad-metric-pill-val font-mono">{totalOpen}</span>
          </div>
          <div className="ad-metric-pill ad-metric-pill-due">
            <span className="ad-metric-dot-amber" />
            <span className="ad-metric-pill-label">Due Today</span>
            <span className="ad-metric-pill-val font-mono">{Math.min(totalOpen, 4)}</span>
          </div>
          <div className="ad-metric-pill ad-metric-pill-resolved">
            <span className="ad-metric-dot-green" />
            <span className="ad-metric-pill-label">Resolved</span>
            <span className="ad-metric-pill-val font-mono">
              {Object.values(itemStatuses).filter(Boolean).length}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 7 PRD SUB-TABS NAVIGATION BAR                                     */}
      {/* ================================================================= */}
      <nav className="ad-subtab-bar" aria-label="Workflow Subcategories">
        {SUBTABS.map(tab => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`ad-subtab-btn ${isActive ? 'active' : ''}`}
            >
              <span>{tab.label}</span>
              <span className="ad-subtab-badge">{tab.count}</span>
            </button>
          );
        })}
      </nav>

      {/* ================================================================= */}
      {/* SUB-TAB 1: REQUIREMENT REVIEWS                                    */}
      {/* ================================================================= */}
      {activeSubTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* ITEM 1: Euro NCAP Camera Perception SRS v3.2 */}
          {/* STATE 1: APPROVED (Resolved & Closed) */}
          {itemStatuses['rev-1']?.type === 'approved' ? (
            <div className="ad-resolved-card">
              <div className="ad-card-meta-left">
                <CheckCircle2 size={24} style={{ color: 'var(--badge-success-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">Euro NCAP 2026 Camera Perception SRS v3.2 Revision</span>
                    <span className="st-badge badge-success">✓ Approved with ISO 16505 Fix</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Sensor recovery time capped at 60ms under 15,000 lux illumination. Committed to Polarion baseline • Unblocks Sprint 43 perception pipeline.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('rev-1', null, 'Euro NCAP SRS v3.2 reopened for review')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen Card / Undo
              </button>
            </div>
          ) : itemStatuses['rev-1']?.type === 'rejected' ? (
            /* STATE 2: REJECTED (Resolved & Closed) */
            <div className="ad-resolved-card rejected">
              <div className="ad-card-meta-left">
                <XCircle size={24} style={{ color: 'var(--badge-critical-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">Euro NCAP 2026 Camera Perception SRS v3.2 Revision</span>
                    <span className="st-badge badge-critical">✕ Rejected by PO</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Reason: {itemStatuses['rev-1'].reason || 'Exceeds 12ms Orin Latency Budget'} • Priya Nair (Lead BA) notified via Jira.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('rev-1', null, 'Euro NCAP SRS v3.2 reopened for review')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen Card / Undo
              </button>
            </div>
          ) : itemStatuses['rev-1']?.type === 'delegated' ? (
            /* STATE 3: DELEGATED TO ARCHITECT */
            <div className="ad-delegated-card">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="st-badge badge-purple">👤 Delegated to Dr. Stefan Keller (Lead Perception Architect)</span>
                  <span className="ad-card-resolved-title">Euro NCAP 2026 Camera Perception SRS v3.2 Revision</span>
                </div>
                <span className="st-badge badge-info">Awaiting Architecture Sign-Off</span>
              </div>
              <div className="ad-callout-info">
                <UserCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Ownership Handed Off:</strong> Transferred to Dr. Stefan Keller for HIL inference latency arbitration under high-beam glare conditions.
                </div>
              </div>
              <div className="ad-workflow-action-bar" style={{ paddingTop: '10px' }}>
                <div className="ad-action-group">
                  <button
                    onClick={() => handleStatusChange('rev-1', null, 'Delegation recalled. Card returned to your inbox.')}
                    className="ad-btn-action-secondary"
                  >
                    <RotateCcw size={12} /> Recall to My Inbox
                  </button>
                  <button
                    onClick={() => handleStatusChange('rev-1', { type: 'snoozed', label: 'Snoozed until Architect Signs Off' }, 'Snoozed until Dr. Keller submits architectural review.')}
                    className="ad-btn-action-secondary"
                  >
                    <Clock size={12} /> Snooze until Sign-Off
                  </button>
                  <button
                    onClick={() => showToast('Urgent reminder ping sent to Dr. Stefan Keller!')}
                    className="ad-btn-action-primary"
                  >
                    <Send size={12} /> Ping Dr. Stefan Keller
                  </button>
                </div>
              </div>
            </div>
          ) : itemStatuses['rev-1']?.type === 'snoozed' ? (
            /* STATE 4: SNOOZED */
            <div className="ad-snoozed-card">
              <div className="ad-card-meta-left">
                <Clock size={22} style={{ color: 'var(--badge-high-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">Euro NCAP 2026 Camera Perception SRS v3.2 Revision</span>
                    <span className="st-badge badge-high">💤 Snoozed for 2 Days (Wakes Sept 15)</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Temporarily suppressed from active daily triage until next backlog grooming session.
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => handleStatusChange('rev-1', null, 'Item unsnoozed and returned to active review')}
                  className="ad-btn-action-primary"
                >
                  Wake Now / Unsnooze
                </button>
                <button
                  onClick={() => showToast('Snooze extended by an additional 2 days (until Sept 17)')}
                  className="ad-btn-action-secondary"
                >
                  Extend (+2 Days)
                </button>
              </div>
            </div>
          ) : (
            /* STATE 5: PENDING REVIEW (FULL CARD) */
            <div className="ad-workflow-card card-reviews">
              {/* If Clarification is currently pending, show active banner */}
              {itemStatuses['rev-1']?.type === 'clarify' && (
                <div className="ad-callout-warning" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>⏳ Clarification Dispatched to Priya Nair (Lead BA):</strong>{' '}
                    <span>"{clarifyNotes['rev-1'] || 'Please clarify recovery latency margin under 15,000 lux illumination.'}"</span>
                  </div>
                  <button
                    onClick={() => handleStatusChange('rev-1', null, 'Clarification request withdrawn')}
                    style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}
                  >
                    Withdraw
                  </button>
                </div>
              )}

              {/* Header Meta */}
              <div className="ad-workflow-card-header">
                <div className="ad-meta-cluster">
                  <span className="st-badge badge-critical">Critical Risk • Due Today (2h 15m)</span>
                  <span className="ad-meta-text">
                    Origin: <strong>Requirements Engine</strong>
                  </span>
                  <span className="ad-meta-text">
                    • Requestor: <strong>Priya Nair (Lead BA)</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="ad-meta-text">Linked:</span>
                  <span className="st-badge badge-info font-mono" style={{ fontSize: '0.72rem' }}>
                    AD-EPIC-104: Radar-Vision Fusion
                  </span>
                </div>
              </div>

              {/* Escalation Callout */}
              <div className="ad-callout-warning">
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>Why this needs you (PO Escalation):</strong>
                  Conflict detected with NFR-22 latency budget. Proposed recovery time exceeds the 12ms Orin inference SLA and requires PO authorization to adjust safety boundary.
                </div>
              </div>

              {/* Content Columns: Left Content & Right High-Density AI Recommendation */}
              <div className="ad-card-columns">
                <div className="ad-content-left">
                  <h4 className="ad-item-title">Euro NCAP 2026 Camera Perception SRS v3.2 Revision</h4>
                  <p className="ad-item-desc">
                    Specification update submitted for camera sensor recovery parameters under high-beam headlight glare during night urban maneuvers.
                  </p>

                  {/* Redline / Conflict Highlighter Box */}
                  <div className="ad-redline-box">
                    <div className="ad-redline-title">AI Ambiguity Flag &amp; Recommendation:</div>
                    <div className="ad-redline-removed">
                      &times; Draft Text: "Camera sensor must recover swiftly after sudden oncoming high-beam glare."
                    </div>
                    <div className="ad-redline-added">
                      &check; AI Proposed Fix: "Sensor recovery time shall not exceed 60ms under 15,000 lux illumination (ISO 16505 compliant)."
                    </div>
                  </div>
                  {/* Source Doc link permanently removed as instructed */}
                </div>

                {/* DENSE AI RECOMMENDATION PANEL (Zero Empty Space) */}
                <div className="ad-recommendation-panel">
                  <div className="ad-rec-header-row">
                    <span className="ad-rec-badge-label">
                      <Sparkles size={12} /> AI Recommendation
                    </span>
                    <span className="ad-rec-confidence">96.8% Confidence</span>
                  </div>

                  <div className="ad-rec-statement">
                    Approve with Proposed ISO 16505 Precision Revision
                  </div>

                  {/* 4-Metric High Density Grid */}
                  <div className="ad-rec-metrics-grid">
                    <div className="ad-rec-metric-cell">
                      <span className="ad-rec-metric-label">Safety / ASIL</span>
                      <span className="ad-rec-metric-val" style={{ color: 'var(--badge-success-text)' }}>ASIL-B Pass</span>
                    </div>
                    <div className="ad-rec-metric-cell">
                      <span className="ad-rec-metric-label">Latency Impact</span>
                      <span className="ad-rec-metric-val">+0.2ms / 12ms</span>
                    </div>
                    <div className="ad-rec-metric-cell">
                      <span className="ad-rec-metric-label">Simulation Pass</span>
                      <span className="ad-rec-metric-val" style={{ color: 'var(--badge-success-text)' }}>120/120 Tests</span>
                    </div>
                    <div className="ad-rec-metric-cell">
                      <span className="ad-rec-metric-label">GenAI Model</span>
                      <span className="ad-rec-metric-val">Claude 3.5 Sonnet</span>
                    </div>
                  </div>

                  <div className="ad-rec-audit-trail">
                    <span>Engine: AD-Engine-v2.4</span>
                    <span>Trace: #REQ-AUD-9824</span>
                  </div>

                  {/* Interactive Feedback */}
                  <div className="ad-rec-feedback-row">
                    <span style={{ color: 'var(--text-muted)' }}>AI Advice Helpful?</span>
                    <div className="ad-feedback-group">
                      <button
                        onClick={() => handleFeedback('rev-1', 'agree')}
                        className={`ad-feedback-btn ${feedbackState['rev-1'] === 'agree' ? 'agreed' : ''}`}
                      >
                        <ThumbsUp size={11} /> Agree
                      </button>
                      <button
                        onClick={() => handleFeedback('rev-1', 'disagree')}
                        className={`ad-feedback-btn ${feedbackState['rev-1'] === 'disagree' ? 'disagreed' : ''}`}
                      >
                        <ThumbsDown size={11} /> Disagree
                      </button>
                    </div>
                  </div>

                  {feedbackState['rev-1'] === 'agree' && (
                    <div style={{ marginTop: '8px', padding: '6px 10px', background: 'var(--badge-success-bg)', border: '1px solid var(--badge-success-border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--badge-success-text)' }}>
                      <span>✓ Agreed with AI Advice: SOTIF fix ready</span>
                      <button
                        onClick={() => handleStatusChange('rev-1', { type: 'approved', patch: 'iso16505' }, 'Approved with ISO 16505 Fix & Closed!')}
                        style={{ background: 'var(--badge-success-text)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Apply Fix &amp; Close
                      </button>
                    </div>
                  )}

                  {feedbackState['rev-1'] === 'disagree' && (
                    <div style={{ marginTop: '8px', padding: '6px 10px', background: 'var(--badge-critical-bg)', border: '1px solid var(--badge-critical-border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--badge-critical-text)' }}>
                      <span>✕ Disagreed with AI Advice</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => toggleDrawer('rev-1', 'clarify')}
                          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Clarify
                        </button>
                        <button
                          onClick={() => toggleDrawer('rev-1', 'reject')}
                          style={{ background: 'var(--badge-critical-text)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* INLINE DRAWERS */}
              {activeDrawers['rev-1'] === 'clarify' && (
                <div className="ad-inline-form-box">
                  <div className="ad-inline-form-header">
                    <span>Request Clarification from Priya Nair (Lead BA)</span>
                    <button onClick={() => toggleDrawer('rev-1', 'clarify')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                  </div>
                  <input
                    type="text"
                    className="ad-input-field"
                    placeholder="e.g. Please clarify Orin SoC recovery latency margin under 15,000 lux illumination..."
                    value={clarifyNotes['rev-1'] || ''}
                    onChange={e => setClarifyNotes({ ...clarifyNotes, 'rev-1': e.target.value })}
                  />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => toggleDrawer('rev-1', 'clarify')} className="ad-btn-action-secondary" style={{ padding: '4px 12px' }}>Cancel</button>
                    <button
                      onClick={() => handleStatusChange('rev-1', { type: 'clarify', label: 'Clarification Dispatched' }, 'Clarification request sent to Priya Nair via Jira integration!')}
                      className="ad-btn-action-primary"
                      style={{ padding: '4px 12px' }}
                    >
                      <Send size={12} /> Send Request
                    </button>
                  </div>
                </div>
              )}

              {activeDrawers['rev-1'] === 'reject' && (
                <div className="ad-inline-form-box">
                  <div className="ad-inline-form-header">
                    <span>Confirm Rejection of SRS v3.2</span>
                    <button onClick={() => toggleDrawer('rev-1', 'reject')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Exceeds 12ms Orin Latency Budget', 'Redundant with SRS-Cam-2.9', 'Fails ASIL-B Safety Gate'].map(reason => (
                      <button
                        key={reason}
                        onClick={() => setRejectReasons({ ...rejectReasons, 'rev-1': reason })}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          border: '1px solid var(--border-color)',
                          background: rejectReasons['rev-1'] === reason ? 'var(--badge-critical-bg)' : 'var(--bg-surface)',
                          color: rejectReasons['rev-1'] === reason ? 'var(--badge-critical-text)' : 'var(--text-secondary)'
                        }}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => toggleDrawer('rev-1', 'reject')} className="ad-btn-action-secondary" style={{ padding: '4px 12px' }}>Cancel</button>
                    <button
                      onClick={() => handleStatusChange('rev-1', { type: 'rejected', reason: rejectReasons['rev-1'] || 'Exceeds 12ms Orin Latency Budget' }, 'Requirement revision rejected and closed!')}
                      className="ad-btn-action-danger"
                      style={{ padding: '4px 12px' }}
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}

              {activeDrawers['rev-1'] === 'delegate' && (
                <div className="ad-inline-form-box">
                  <div className="ad-inline-form-header">
                    <span>Delegate Review to Technical Specialist</span>
                    <button onClick={() => toggleDrawer('rev-1', 'delegate')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Dr. Stefan Keller (Perception Architect)', 'Marcus Vance (Safety Systems)', 'Elena Rostova (Chassis Lead)'].map(lead => (
                      <button
                        key={lead}
                        onClick={() => handleStatusChange('rev-1', { type: 'delegated', lead }, `Task delegated to ${lead}!`)}
                        className="ad-btn-action-secondary"
                        style={{ fontSize: '0.74rem' }}
                      >
                        <UserCheck size={12} /> {lead}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Bar (Logical Actions when Pending Review) */}
              <div className="ad-workflow-action-bar">
                {itemStatuses['rev-1']?.type === 'clarify' ? (
                  /* Contextual Actions when Clarification is Pending */
                  <div className="ad-action-group">
                    <button
                      onClick={() => handleStatusChange('rev-1', { type: 'approved' }, 'Euro NCAP SRS v3.2 Approved with AI Fix!')}
                      className="ad-btn-action-primary"
                    >
                      <Check size={13} /> Force Approve with AI Fix
                    </button>
                    <button
                      onClick={() => handleStatusChange('rev-1', null, 'Clarification request withdrawn')}
                      className="ad-btn-action-secondary"
                    >
                      <RotateCcw size={12} /> Withdraw Clarification
                    </button>
                    <button
                      onClick={() => showToast('Urgent reminder dispatched to Priya Nair')}
                      className="ad-btn-action-secondary"
                    >
                      <Send size={12} /> Nudge Priya Nair
                    </button>
                    <button
                      onClick={() => toggleDrawer('rev-1', 'reject')}
                      className="ad-btn-action-danger"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  /* Standard Actions when Pending Review */
                  <>
                    <div className="ad-action-group">
                      <button
                        onClick={() => handleStatusChange('rev-1', { type: 'approved' }, 'Euro NCAP SRS v3.2 Approved with AI Fix and closed!')}
                        className="ad-btn-action-primary"
                      >
                        <Check size={13} /> Approve with AI Fix
                      </button>
                      <button
                        onClick={() => toggleDrawer('rev-1', 'clarify')}
                        className="ad-btn-action-secondary"
                      >
                        Request Clarification
                      </button>
                      <button
                        onClick={() => toggleDrawer('rev-1', 'reject')}
                        className="ad-btn-action-danger"
                      >
                        Reject
                      </button>
                    </div>

                    <div className="ad-secondary-links">
                      <span onClick={() => toggleDrawer('rev-1', 'delegate')} className="ad-text-action-link">
                        <UserCheck size={13} /> Delegate to Architect
                      </span>
                      <span>•</span>
                      <span
                        onClick={() => handleStatusChange('rev-1', { type: 'snoozed' }, 'Item snoozed for 2 days.')}
                        className="ad-text-action-link"
                      >
                        <Clock size={13} /> Snooze 2 Days
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ITEM 2: Ultrasonic Proximity Alert Damping Curve */}
          {itemStatuses['rev-2']?.type === 'approved' ? (
              <div className="ad-resolved-card">
                <div className="ad-card-meta-left">
                  <CheckCircle2 size={24} style={{ color: 'var(--badge-success-text)', flexShrink: 0 }} />
                  <div className="ad-card-resolved-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="ad-card-resolved-title">Ultrasonic Proximity Alert Damping Curve v2.1</span>
                      <span className="st-badge badge-success">✓ Approved with ISO 17386 Fix</span>
                    </div>
                    <span className="ad-card-resolved-desc">
                      Audio chiming capped at 45 dB with visual pulsing on infotainment HUD below 0.35m clearance.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleStatusChange('rev-2', null, 'Ultrasonic alert curve reopened')}
                  className="ad-btn-undo"
                >
                  <RotateCcw size={12} /> Reopen Card / Undo
                </button>
              </div>
            ) : itemStatuses['rev-2']?.type === 'rejected' ? (
              <div className="ad-resolved-card rejected">
                <div className="ad-card-meta-left">
                  <XCircle size={24} style={{ color: 'var(--badge-critical-text)', flexShrink: 0 }} />
                  <div className="ad-card-resolved-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="ad-card-resolved-title">Ultrasonic Proximity Alert Damping Curve v2.1</span>
                      <span className="st-badge badge-critical">✕ Rejected by PO</span>
                    </div>
                    <span className="ad-card-resolved-desc">
                      Specification rejected. Marcus Vance (Safety Systems) notified.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleStatusChange('rev-2', null, 'Ultrasonic alert curve reopened')}
                  className="ad-btn-undo"
                >
                  <RotateCcw size={12} /> Reopen Card / Undo
                </button>
              </div>
            ) : itemStatuses['rev-2']?.type === 'delegated' ? (
              <div className="ad-delegated-card">
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="st-badge badge-purple">👤 Delegated to HMI Lead (Infotainment &amp; Audio UX)</span>
                    <span className="ad-card-resolved-title">Ultrasonic Proximity Alert Damping Curve v2.1</span>
                  </div>
                  <span className="st-badge badge-info">Awaiting HMI UX Review</span>
                </div>
                <div className="ad-callout-info">
                  <UserCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Delegated for Audio Frequency Calibration:</strong> Transferred to HMI Lead to confirm ISO 17386 chime loudness limits and visual HUD pulse synchronization.
                  </div>
                </div>
                <div className="ad-workflow-action-bar" style={{ paddingTop: '10px' }}>
                  <div className="ad-action-group">
                    <button
                      onClick={() => handleStatusChange('rev-2', null, 'Delegation recalled to PO inbox')}
                      className="ad-btn-action-secondary"
                    >
                      <RotateCcw size={12} /> Recall to My Inbox
                    </button>
                    <button
                      onClick={() => handleStatusChange('rev-2', { type: 'approved' }, 'Ultrasonic damping curve approved!')}
                      className="ad-btn-action-primary"
                    >
                      <Check size={13} /> Approve Specification
                    </button>
                    <button
                      onClick={() => showToast('Ping sent to HMI Lead!')}
                      className="ad-btn-action-secondary"
                    >
                      <Send size={12} /> Ping HMI Lead
                    </button>
                  </div>
                </div>
              </div>
            ) : itemStatuses['rev-2']?.type === 'snoozed' ? (
              <div className="ad-snoozed-card">
                <div className="ad-card-meta-left">
                  <Clock size={22} style={{ color: 'var(--badge-high-text)', flexShrink: 0 }} />
                  <div className="ad-card-resolved-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="ad-card-resolved-title">Ultrasonic Proximity Alert Damping Curve v2.1</span>
                      <span className="st-badge badge-high">💤 Snoozed for 3 Days</span>
                    </div>
                    <span className="ad-card-resolved-desc">
                      Specification review paused until acoustic bench testing data is uploaded.
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleStatusChange('rev-2', null, 'Ultrasonic curve unsnoozed')}
                    className="ad-btn-action-primary"
                  >
                    Wake Now / Unsnooze
                  </button>
                  <button
                    onClick={() => showToast('Snooze extended by 2 days')}
                    className="ad-btn-action-secondary"
                  >
                    Extend (+2 Days)
                  </button>
                </div>
              </div>
            ) : (
              <div className="ad-workflow-card card-reviews">
                <div className="ad-workflow-card-header">
                  <div className="ad-meta-cluster">
                    <span className="st-badge badge-high">High Priority • Sprint 42</span>
                    <span className="ad-meta-text">Origin: <strong>Requirements Engine</strong></span>
                    <span className="ad-meta-text">• Requestor: <strong>Marcus Vance (Safety Systems Lead)</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="ad-meta-text">Linked:</span>
                    <span className="st-badge badge-info font-mono" style={{ fontSize: '0.72rem' }}>
                      AD-EPIC-108: Blindspot Monitoring
                    </span>
                  </div>
                </div>

                <div className="ad-callout-info">
                  <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '2px' }}>Acoustic Alert Boundary Tuning:</strong>
                    Ambiguity in ultrasonic alert suppression threshold at low vehicle speeds (&lt;5 km/h) in tight multi-story parking structures.
                  </div>
                </div>

                <div className="ad-card-columns">
                  <div className="ad-content-left">
                    <h4 className="ad-item-title">Ultrasonic Proximity Alert Damping Curve v2.1</h4>
                    <p className="ad-item-desc">
                      Specification modification for dampening audible alert chime frequency during parallel docking when curb distance is under 0.35m.
                    </p>
                    <div className="ad-redline-box">
                      <div className="ad-redline-title">AI Ambiguity Flag &amp; Recommendation:</div>
                      <div className="ad-redline-removed">
                        &times; Draft Text: "Alert sound shall be dimmed when car is close to obstacle."
                      </div>
                      <div className="ad-redline-added">
                        &check; AI Proposed Fix: "Audio chiming frequency capped at 45 dB with visual pulsing on infotainment HUD below 0.35m clearance."
                      </div>
                    </div>
                  </div>

                  <div className="ad-recommendation-panel">
                    <div className="ad-rec-header-row">
                      <span className="ad-rec-badge-label"><Sparkles size={12} /> AI Recommendation</span>
                      <span className="ad-rec-confidence">94.2% Confidence</span>
                    </div>
                    <div className="ad-rec-statement">
                      Approve with ISO 17386 Damping Standard
                    </div>
                    <div className="ad-rec-metrics-grid">
                      <div className="ad-rec-metric-cell">
                        <span className="ad-rec-metric-label">Acoustic Check</span>
                        <span className="ad-rec-metric-val" style={{ color: 'var(--badge-success-text)' }}>45 dB Cap</span>
                      </div>
                      <div className="ad-rec-metric-cell">
                        <span className="ad-rec-metric-label">HMI Compliance</span>
                        <span className="ad-rec-metric-val">HUD Pulse Pass</span>
                      </div>
                      <div className="ad-rec-metric-cell">
                        <span className="ad-rec-metric-label">Simulation Pass</span>
                        <span className="ad-rec-metric-val" style={{ color: 'var(--badge-success-text)' }}>48/48 Docks</span>
                      </div>
                      <div className="ad-rec-metric-cell">
                        <span className="ad-rec-metric-label">GenAI Model</span>
                        <span className="ad-rec-metric-val">Claude 3.5 Sonnet</span>
                      </div>
                    </div>
                    <div className="ad-rec-audit-trail">
                      <span>Engine: AD-Engine-v2.4</span>
                      <span>Trace: #USS-AUD-4190</span>
                    </div>
                    <div className="ad-rec-feedback-row">
                      <span style={{ color: 'var(--text-muted)' }}>AI Advice Helpful?</span>
                      <div className="ad-feedback-group">
                        <button
                          onClick={() => handleFeedback('rev-2', 'agree')}
                          className={`ad-feedback-btn ${feedbackState['rev-2'] === 'agree' ? 'agreed' : ''}`}
                        >
                          <ThumbsUp size={11} /> Agree
                        </button>
                        <button
                          onClick={() => handleFeedback('rev-2', 'disagree')}
                          className={`ad-feedback-btn ${feedbackState['rev-2'] === 'disagree' ? 'disagreed' : ''}`}
                        >
                          <ThumbsDown size={11} /> Disagree
                        </button>
                      </div>
                    </div>

                    {feedbackState['rev-2'] === 'agree' && (
                      <div style={{ marginTop: '8px', padding: '6px 10px', background: 'var(--badge-success-bg)', border: '1px solid var(--badge-success-border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--badge-success-text)' }}>
                        <span>✓ Agreed with AI Advice: ISO 17386 fix ready</span>
                        <button
                          onClick={() => handleStatusChange('rev-2', { type: 'approved' }, 'Ultrasonic Damping Curve Approved with ISO 17386!')}
                          style={{ background: 'var(--badge-success-text)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Apply Fix &amp; Close
                        </button>
                      </div>
                    )}

                    {feedbackState['rev-2'] === 'disagree' && (
                      <div style={{ marginTop: '8px', padding: '6px 10px', background: 'var(--badge-critical-bg)', border: '1px solid var(--badge-critical-border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--badge-critical-text)' }}>
                        <span>✕ Disagreed with AI Advice</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => toggleDrawer('rev-2', 'clarify')}
                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', padding: '3px 8px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Clarify
                          </button>
                          <button
                            onClick={() => toggleDrawer('rev-2', 'reject')}
                            style={{ background: 'var(--badge-critical-text)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ad-workflow-action-bar">
                  <div className="ad-action-group">
                    <button
                      onClick={() => handleStatusChange('rev-2', { type: 'approved' }, 'Ultrasonic Damping Curve Approved with ISO 17386!')}
                      className="ad-btn-action-primary"
                    >
                      <Check size={13} /> Approve with AI Fix
                    </button>
                    <button
                      onClick={() => handleStatusChange('rev-2', { type: 'clarify', label: 'Clarification Dispatched to Marcus Vance' }, 'Clarification requested from Marcus Vance!')}
                      className="ad-btn-action-secondary"
                    >
                      Request Clarification
                    </button>
                    <button
                      onClick={() => handleStatusChange('rev-2', { type: 'rejected', reason: 'Acoustic curve conflicts with Euro NCAP docking standard' }, 'Ultrasonic specification rejected!')}
                      className="ad-btn-action-danger"
                    >
                      Reject
                    </button>
                  </div>
                  <div className="ad-secondary-links">
                    <span
                      onClick={() => handleStatusChange('rev-2', { type: 'delegated', lead: 'HMI Lead' }, 'Delegated to HMI Lead!')}
                      className="ad-text-action-link"
                    >
                      Delegate to HMI Lead
                    </span>
                    <span>•</span>
                    <span
                      onClick={() => handleStatusChange('rev-2', { type: 'snoozed' }, 'Snoozed for 3 days!')}
                      className="ad-text-action-link"
                    >
                      Snooze
                    </span>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 2: AI USER STORIES                                        */}
      {/* ================================================================= */}
      {activeSubTab === 'stories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Story Card 1 */}
          {itemStatuses['story-1']?.type === 'approved' ? (
            <div className="ad-resolved-card">
              <div className="ad-card-meta-left">
                <CheckCircle2 size={24} style={{ color: 'var(--badge-success-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">AD-EPIC-112: Pedestrian Intent Detection (5 SP)</span>
                    <span className="st-badge badge-success">✓ Accepted to Sprint 43 Backlog</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Story and Gherkin scenario committed to Jira Sprint 43 backlog. 4D Radar Doppler pre-fill enabled.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('story-1', null, 'Story reopened for review')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen Story / Undo
              </button>
            </div>
          ) : itemStatuses['story-1']?.type === 'rejected' ? (
            <div className="ad-resolved-card rejected">
              <div className="ad-card-meta-left">
                <XCircle size={24} style={{ color: 'var(--badge-critical-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">AD-EPIC-112: Pedestrian Intent Detection (5 SP)</span>
                    <span className="st-badge badge-critical">✕ Rejected: {itemStatuses['story-1'].reason || 'Out of Sprint Scope'}</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Story rejected by PO. BA team notified in Jira Backlog.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('story-1', null, 'Story reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen Story / Undo
              </button>
            </div>
          ) : itemStatuses['story-1']?.type === 'snoozed' ? (
            <div className="ad-snoozed-card">
              <div className="ad-card-meta-left">
                <Clock size={22} style={{ color: 'var(--badge-high-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">AD-EPIC-112: Pedestrian Intent Detection (5 SP)</span>
                    <span className="st-badge badge-high">💤 Snoozed for 2 Days (Wakes Sept 15)</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Temporarily suppressed from active sprint refinement until next backlog review.
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => handleStatusChange('story-1', null, 'Story unsnoozed and returned to active triage')}
                  className="ad-btn-action-primary"
                >
                  Wake Now / Unsnooze
                </button>
                <button
                  onClick={() => showToast('Snooze extended by 2 days (until Sept 17)')}
                  className="ad-btn-action-secondary"
                >
                  Extend (+2 Days)
                </button>
              </div>
            </div>
          ) : (
            <div className="ad-workflow-card card-stories">
              <div className="ad-workflow-card-header">
                <div className="ad-meta-cluster">
                  <span className="st-badge badge-success">High Confidence: 96.4%</span>
                  <span className="ad-meta-text">Origin: <strong>Backlog AI Engine</strong></span>
                  <span className="ad-meta-text">• Est: <strong className="font-mono">5 SP</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="ad-meta-text">Linked:</span>
                  <span className="st-badge badge-info font-mono" style={{ fontSize: '0.72rem' }}>
                    AD-EPIC-112: Pedestrian Intent Detection
                  </span>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                fontSize: '0.78rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Why this needs you:</strong>{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Synthesized from Balocco fleet rain track incident #4192. Touches Euro NCAP pedestrian braking logic.
                  </span>
                </div>
                <span className="st-badge badge-success" style={{ fontSize: '0.7rem' }}>
                  <CheckCircle2 size={12} style={{ marginRight: '4px' }} /> Duplicate Check: 0 Overlaps (Pass)
                </span>
              </div>

              {/* User Story Display / Inline Editor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      User Story
                    </span>
                    <button
                      onClick={() => toggleDrawer('story-1', 'editStory')}
                      style={{ background: 'none', border: 'none', color: 'var(--stellantis-action)', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <Edit3 size={11} /> {activeDrawers['story-1'] === 'editStory' ? 'Close Editor' : 'Edit Inline'}
                    </button>
                  </div>

                  {activeDrawers['story-1'] === 'editStory' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <textarea
                        className="ad-inline-editor-textarea"
                        value={storyEdits['story-1']}
                        onChange={e => setStoryEdits({ ...storyEdits, 'story-1': e.target.value })}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button onClick={() => toggleDrawer('story-1', 'editStory')} className="ad-btn-action-secondary" style={{ padding: '4px 10px' }}>Cancel</button>
                        <button
                          onClick={() => { toggleDrawer('story-1', 'editStory'); showToast('User story edits saved and synced with Backlog!'); }}
                          className="ad-btn-action-primary"
                          style={{ padding: '4px 10px' }}
                        >
                          Save Story
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p style={{
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: 0,
                      lineHeight: 1.55,
                      background: 'var(--bg-subtle)',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)'
                    }}>
                      "{storyEdits['story-1']}"
                    </p>
                  )}
                </div>

                {/* Gherkin Code Snippet */}
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Attached Draft Acceptance Criteria (Gherkin)
                  </div>
                  <div className="ad-gherkin-snippet">
                    <span style={{ color: 'var(--stellantis-action)', fontWeight: 800 }}>Scenario:</span> Pedestrian sudden curb entry under rain spray<br />
                    &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>Given</span> the vehicle is operating in Highway Pilot L2+ at 65 km/h<br />
                    &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>When</span> front camera confidence drops below 40% due to rain spray occlusion<br />
                    &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>And</span> 4D Imaging Radar identifies a pedestrian Doppler velocity vector &gt;= 1.2 m/s<br />
                    &nbsp;&nbsp;<span style={{ color: 'var(--badge-success-text)', fontWeight: 700 }}>Then</span> trigger brake pre-fill pressure within 80ms<br />
                    &nbsp;&nbsp;<span style={{ color: 'var(--badge-success-text)', fontWeight: 700 }}>And</span> maintain false positive alarm rate &lt; 0.01 per 1,000 km
                  </div>
                </div>
              </div>

              {/* Inline Rejection Reason Drawer */}
              {activeDrawers['story-1'] === 'reject' && (
                <div className="ad-inline-form-box">
                  <div className="ad-inline-form-header">
                    <span>Reject Story AD-EPIC-112</span>
                    <button onClick={() => toggleDrawer('story-1', 'reject')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Out of Sprint Scope', 'Redundant with AD-EPIC-102', 'Violates Latency Budget', 'Incomplete Sensor Spec'].map(reason => (
                      <button
                        key={reason}
                        onClick={() => setRejectReasons({ ...rejectReasons, 'story-1': reason })}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          border: '1px solid var(--border-color)',
                          background: rejectReasons['story-1'] === reason ? 'var(--badge-critical-bg)' : 'var(--bg-surface)',
                          color: rejectReasons['story-1'] === reason ? 'var(--badge-critical-text)' : 'var(--text-secondary)'
                        }}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => toggleDrawer('story-1', 'reject')} className="ad-btn-action-secondary" style={{ padding: '4px 12px' }}>Cancel</button>
                    <button
                      onClick={() => handleStatusChange('story-1', { type: 'rejected', reason: rejectReasons['story-1'] || 'Out of Sprint Scope' }, 'Story AD-EPIC-112 rejected with reason logged!')}
                      className="ad-btn-action-danger"
                      style={{ padding: '4px 12px' }}
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="ad-workflow-action-bar">
                <div className="ad-action-group">
                  <button
                    onClick={() => handleStatusChange('story-1', { type: 'approved' }, 'Story AD-EPIC-112 accepted to Sprint 43 Backlog in Jira!')}
                    className="ad-btn-action-primary"
                  >
                    <Check size={13} /> Accept to Backlog (Sprint 43)
                  </button>
                  <button
                    onClick={() => toggleDrawer('story-1', 'editStory')}
                    className="ad-btn-action-secondary"
                  >
                    Edit Story Inline
                  </button>
                  <button
                    onClick={() => toggleDrawer('story-1', 'reject')}
                    className="ad-btn-action-danger"
                  >
                    Reject with Reason
                  </button>
                </div>
                <div className="ad-secondary-links">
                  <span>AI Est: 5 SP</span>
                  <span>•</span>
                  <span
                    onClick={() => handleStatusChange('story-1', { type: 'snoozed' }, 'Story AD-EPIC-112 snoozed for 2 days!')}
                    className="ad-text-action-link"
                  >
                    <Clock size={13} /> Snooze
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* ================================================================= */}
      {/* SUB-TAB 3: ACCEPTANCE CRITERIA                                    */}
      {/* ================================================================= */}
      {activeSubTab === 'criteria' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* CARD 1: US-389 Low-Friction ABS Emergency Steer Assist */}
          {itemStatuses['ac-1']?.type === 'approved' ? (
            <div className="ad-resolved-card">
              <div className="ad-card-meta-left">
                <CheckCircle2 size={24} style={{ color: 'var(--badge-success-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">US-389: Low-Friction ABS Emergency Steer Assist</span>
                    <span className="st-badge badge-success">✓ Criteria Approved &amp; Closed</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    {enhancedAC['ac-1'] ? 'Enhanced with ISO 21448 Low-Friction Bounds (Snow/Ice μ < 0.3 gap resolved).' : 'Standard dry road criteria approved.'} Synced to Jira US-389.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('ac-1', null, 'Acceptance criteria reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen Criteria / Undo
              </button>
            </div>
          ) : itemStatuses['ac-1']?.type === 'delegated' ? (
            <div className="ad-delegated-card">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="st-badge badge-purple">👤 Delegated to Safety Systems Team (ABS/ESC)</span>
                  <span className="ad-card-resolved-title">US-389: Low-Friction ABS Emergency Steer Assist</span>
                </div>
                <span className="st-badge badge-info">Awaiting Safety Engineering Sign-Off</span>
              </div>
              <div className="ad-callout-info">
                <UserCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Delegated for ESC Yaw Review:</strong> Transferred ownership to Marcus Vance and the ABS/ESC Safety Systems team to validate yaw torque limits on low-friction split-μ surfaces.
                </div>
              </div>
              <div className="ad-workflow-action-bar" style={{ paddingTop: '10px' }}>
                <div className="ad-action-group">
                  <button
                    onClick={() => handleStatusChange('ac-1', null, 'Delegation recalled to PO inbox')}
                    className="ad-btn-action-secondary"
                  >
                    <RotateCcw size={12} /> Recall to My Inbox
                  </button>
                  <button
                    onClick={() => handleStatusChange('ac-1', { type: 'approved' }, 'Criteria Approved with Safety Sign-Off!')}
                    className="ad-btn-action-primary"
                  >
                    <Check size={13} /> Approve Criteria Now
                  </button>
                  <button
                    onClick={() => showToast('Urgent ping sent to Marcus Vance (Safety Systems)!')}
                    className="ad-btn-action-secondary"
                  >
                    <Send size={12} /> Ping Safety Eng
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="ad-workflow-card card-criteria">
              <div className="ad-workflow-card-header">
                <div className="ad-meta-cluster">
                  <span className="st-badge badge-critical">Edge-Case Gap Detected</span>
                  <span className="ad-meta-text">Story: <strong className="font-mono">US-389</strong></span>
                  <span className="ad-meta-text">• Low-Friction ABS Emergency Steer Assist</span>
                </div>
                <span className="st-badge badge-info" style={{ fontSize: '0.72rem' }}>
                  Origin: Backlog AI Engine
                </span>
              </div>

              <div className="ad-callout-critical">
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>Critical Gap Identified by AI Story Doctor:</strong>
                  US-389 lacks acceptance criteria for low-friction icy road surfaces (&lt;0.3 &mu;). Under split-friction conditions, unconstrained steer amplification risks vehicle yaw instability.
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {enhancedAC['ac-1'] ? 'AI Enhanced Acceptance Criteria (Snow/Ice Gap Resolved)' : 'Current Gherkin Criteria (Dry Road Only)'}
                  </span>
                  {enhancedAC['ac-1'] && (
                    <span className="st-badge badge-success" style={{ fontSize: '0.68rem' }}>
                      Enhanced with ISO 21448 Low-Friction Bounds
                    </span>
                  )}
                </div>

                {activeDrawers['ac-1'] === 'editGherkin' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea
                      className="ad-inline-editor-textarea"
                      rows={6}
                      value={gherkinEdits['ac-1']}
                      onChange={e => setGherkinEdits({ ...gherkinEdits, 'ac-1': e.target.value })}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => toggleDrawer('ac-1', 'editGherkin')} className="ad-btn-action-secondary" style={{ padding: '4px 10px' }}>Cancel</button>
                      <button
                        onClick={() => { toggleDrawer('ac-1', 'editGherkin'); showToast('Manual Gherkin criteria saved!'); }}
                        className="ad-btn-action-primary"
                        style={{ padding: '4px 10px' }}
                      >
                        Save Gherkin
                      </button>
                    </div>
                  </div>
                ) : (
                  !enhancedAC['ac-1'] ? (
                    <div className="ad-gherkin-snippet">
                      <span style={{ color: 'var(--stellantis-action)', fontWeight: 800 }}>Scenario:</span> Evasive steer assist on dry asphalt<br />
                      &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>Given</span> vehicle travels between 50-80 km/h on dry asphalt roadway<br />
                      &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>When</span> driver steering wheel torque input exceeds 4.5 Nm within 120ms<br />
                      &nbsp;&nbsp;<span style={{ color: 'var(--badge-success-text)', fontWeight: 700 }}>Then</span> electric power steering motor shall amplify torque by 25%
                    </div>
                  ) : (
                    <div className="ad-gherkin-snippet" style={{ border: '1px solid var(--badge-success-border)' }}>
                      <span style={{ color: 'var(--stellantis-action)', fontWeight: 800 }}>Scenario:</span> Evasive steer assist on low-friction snow/ice (surface &mu; &lt; 0.3)<br />
                      &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>Given</span> vehicle wheel speed differential detects slippery surface condition (&mu; &lt; 0.3)<br />
                      &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>When</span> evasive steer torque is requested exceeding 4.5 Nm<br />
                      &nbsp;&nbsp;<span style={{ color: 'var(--badge-success-text)', fontWeight: 700 }}>Then</span> clamp electric steer motor assist amplification to max 12%<br />
                      &nbsp;&nbsp;<span style={{ color: 'var(--badge-success-text)', fontWeight: 700 }}>And</span> trigger differential ESC yaw counter-torque within 15ms to avert spinout
                    </div>
                  )
                )}
              </div>

              {/* Actions */}
              <div className="ad-workflow-action-bar">
                <div className="ad-action-group">
                  {enhancedAC['ac-1'] ? (
                    <>
                      <button
                        onClick={() => handleStatusChange('ac-1', { type: 'approved', enhanced: true }, 'Enhanced criteria approved & closed in Jira!')}
                        className="ad-btn-action-primary"
                      >
                        <Check size={13} /> Accept Enhanced Criteria &amp; Close
                      </button>
                      <button
                        onClick={() => toggleEnhanced('ac-1', 'Snow/Ice')}
                        className="ad-btn-action-secondary"
                      >
                        <RotateCcw size={12} /> Revert to Original
                      </button>
                      <button
                        onClick={() => toggleDrawer('ac-1', 'editGherkin')}
                        className="ad-btn-action-secondary"
                      >
                        <Edit3 size={12} /> Edit Gherkin
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleEnhanced('ac-1', 'Snow/Ice')}
                        className="ad-btn-action-primary"
                      >
                        <Sparkles size={13} /> Auto-Enhance (AI Fills Snow/Ice Gap)
                      </button>
                      <button
                        onClick={() => toggleDrawer('ac-1', 'editGherkin')}
                        className="ad-btn-action-secondary"
                      >
                        <Edit3 size={12} /> Manual Edit Gherkin
                      </button>
                      <button
                        onClick={() => handleStatusChange('ac-1', { type: 'approved' }, 'Criteria Approved for US-389 and closed!')}
                        className="ad-btn-action-secondary"
                      >
                        Approve Current Only
                      </button>
                    </>
                  )}
                </div>
                <div className="ad-secondary-links">
                  <span
                    onClick={() => handleStatusChange('ac-1', { type: 'delegated', lead: 'Safety Systems Team (ABS/ESC)' }, 'Delegated to Safety Eng!')}
                    className="ad-text-action-link"
                  >
                    <UserCheck size={13} /> Delegate to Safety Eng
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CARD 2: US-402 Matrix LED High-Beam Crest Glare Suppression */}
          {itemStatuses['ac-2']?.type === 'approved' ? (
            <div className="ad-resolved-card">
              <div className="ad-card-meta-left">
                <CheckCircle2 size={24} style={{ color: 'var(--badge-success-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">US-402: Dynamic Matrix Headlamp Glare Shielding</span>
                    <span className="st-badge badge-success">✓ Criteria Approved &amp; Closed</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    {enhancedAC['ac-2'] ? 'Enhanced with UNECE R149 Motorway Crest pitch damping bounds.' : 'Standard matrix LED criteria approved.'} Committed to Jira US-402.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('ac-2', null, 'Acceptance criteria reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen Criteria / Undo
              </button>
            </div>
          ) : itemStatuses['ac-2']?.type === 'delegated' ? (
            <div className="ad-delegated-card">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="st-badge badge-purple">👤 Delegated to Optics &amp; Lighting Safety Team</span>
                  <span className="ad-card-resolved-title">US-402: Dynamic Matrix Headlamp Glare Shielding</span>
                </div>
                <span className="st-badge badge-info">Awaiting Optics Sign-Off</span>
              </div>
              <div className="ad-callout-info">
                <UserCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Delegated for Optical Pitch Review:</strong> Transferred to Lighting Engineering to calibrate 2.4° beam downward tilt angle on &gt;6% road gradient crests.
                </div>
              </div>
              <div className="ad-workflow-action-bar" style={{ paddingTop: '10px' }}>
                <div className="ad-action-group">
                  <button
                    onClick={() => handleStatusChange('ac-2', null, 'Delegation recalled to PO inbox')}
                    className="ad-btn-action-secondary"
                  >
                    <RotateCcw size={12} /> Recall to My Inbox
                  </button>
                  <button
                    onClick={() => handleStatusChange('ac-2', { type: 'approved' }, 'Criteria Approved with Optics Sign-Off!')}
                    className="ad-btn-action-primary"
                  >
                    <Check size={13} /> Approve Criteria Now
                  </button>
                  <button
                    onClick={() => showToast('Urgent reminder sent to Optics Lead!')}
                    className="ad-btn-action-secondary"
                  >
                    <Send size={12} /> Ping Optics Eng
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="ad-workflow-card card-criteria">
              <div className="ad-workflow-card-header">
                <div className="ad-meta-cluster">
                  <span className="st-badge badge-critical">Edge-Case Gap Detected</span>
                  <span className="ad-meta-text">Story: <strong className="font-mono">US-402</strong></span>
                  <span className="ad-meta-text">• Dynamic Headlamp Glare Shielding</span>
                </div>
                <span className="st-badge badge-info" style={{ fontSize: '0.72rem' }}>
                  Origin: Backlog AI Engine
                </span>
              </div>

              <div className="ad-callout-critical">
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>Critical Gap Identified by AI Story Doctor:</strong>
                  US-402 lacks acceptance criteria for curved uphill motorway crests (gradient &gt; 6%). Vehicle pitch rate causes temporary high-beam dazzle to oncoming HGV drivers before camera sensor tilt compensation adjusts.
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {enhancedAC['ac-2'] ? 'AI Enhanced Acceptance Criteria (Vertical Crest Gap Resolved)' : 'Current Gherkin Criteria (Flat Road Only)'}
                  </span>
                  {enhancedAC['ac-2'] && (
                    <span className="st-badge badge-success" style={{ fontSize: '0.68rem' }}>
                      Enhanced with UNECE R149 Pitch Compensated Bounds
                    </span>
                  )}
                </div>

                {activeDrawers['ac-2'] === 'editGherkin' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea
                      className="ad-inline-editor-textarea"
                      rows={6}
                      value={gherkinEdits['ac-2']}
                      onChange={e => setGherkinEdits({ ...gherkinEdits, 'ac-2': e.target.value })}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => toggleDrawer('ac-2', 'editGherkin')} className="ad-btn-action-secondary" style={{ padding: '4px 10px' }}>Cancel</button>
                      <button
                        onClick={() => { toggleDrawer('ac-2', 'editGherkin'); showToast('Manual Gherkin criteria saved for US-402!'); }}
                        className="ad-btn-action-primary"
                        style={{ padding: '4px 10px' }}
                      >
                        Save Gherkin
                      </button>
                    </div>
                  </div>
                ) : (
                  !enhancedAC['ac-2'] ? (
                    <div className="ad-gherkin-snippet">
                      <span style={{ color: 'var(--stellantis-action)', fontWeight: 800 }}>Scenario:</span> Matrix LED glare suppression on straight flat motorway<br />
                      &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>Given</span> vehicle travels at 110 km/h with active adaptive matrix headlights<br />
                      &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>When</span> oncoming vehicle headlamps are detected at 450m on level road<br />
                      &nbsp;&nbsp;<span style={{ color: 'var(--badge-success-text)', fontWeight: 700 }}>Then</span> shade matrix LED sectors 4-8 within 40ms to avoid dazzle
                    </div>
                  ) : (
                    <div className="ad-gherkin-snippet" style={{ border: '1px solid var(--badge-success-border)' }}>
                      <span style={{ color: 'var(--stellantis-action)', fontWeight: 800 }}>Scenario:</span> Matrix LED glare suppression on uphill motorway crests (gradient &gt; 6%)<br />
                      &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>Given</span> vehicle pitch sensor detects incline grade &gt; 6% approaching vertical road crest<br />
                      &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>When</span> oncoming HGV cabin height is detected exceeding 2.2m above roadway plane<br />
                      &nbsp;&nbsp;<span style={{ color: 'var(--badge-success-text)', fontWeight: 700 }}>Then</span> pre-emptively tilt matrix beam cutoff downward by 2.4 degrees within 25ms<br />
                      &nbsp;&nbsp;<span style={{ color: 'var(--badge-success-text)', fontWeight: 700 }}>And</span> log 0 lux illuminance spill into opposing driver eye box (UNECE R149 compliant)
                    </div>
                  )
                )}
              </div>

              {/* Actions */}
              <div className="ad-workflow-action-bar">
                <div className="ad-action-group">
                  {enhancedAC['ac-2'] ? (
                    <>
                      <button
                        onClick={() => handleStatusChange('ac-2', { type: 'approved', enhanced: true }, 'Enhanced criteria approved & closed in Jira!')}
                        className="ad-btn-action-primary"
                      >
                        <Check size={13} /> Accept Enhanced Criteria &amp; Close
                      </button>
                      <button
                        onClick={() => toggleEnhanced('ac-2', 'Vertical Crest Glare')}
                        className="ad-btn-action-secondary"
                      >
                        <RotateCcw size={12} /> Revert to Original
                      </button>
                      <button
                        onClick={() => toggleDrawer('ac-2', 'editGherkin')}
                        className="ad-btn-action-secondary"
                      >
                        <Edit3 size={12} /> Edit Gherkin
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleEnhanced('ac-2', 'Vertical Crest Glare')}
                        className="ad-btn-action-primary"
                      >
                        <Sparkles size={13} /> Auto-Enhance (AI Fills Crest Gap)
                      </button>
                      <button
                        onClick={() => toggleDrawer('ac-2', 'editGherkin')}
                        className="ad-btn-action-secondary"
                      >
                        <Edit3 size={12} /> Manual Edit Gherkin
                      </button>
                      <button
                        onClick={() => handleStatusChange('ac-2', { type: 'approved' }, 'Criteria Approved for US-402 and closed!')}
                        className="ad-btn-action-secondary"
                      >
                        Approve Current Only
                      </button>
                    </>
                  )}
                </div>
                <div className="ad-secondary-links">
                  <span
                    onClick={() => handleStatusChange('ac-2', { type: 'delegated', lead: 'Optics & Lighting Safety Team' }, 'Delegated to Optics Eng!')}
                    className="ad-text-action-link"
                  >
                    <UserCheck size={13} /> Delegate to Safety Eng
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CARD 3: US-418 Cut-in Vehicle Deceleration Rate Smoothing */}
          {itemStatuses['ac-3']?.type === 'approved' ? (
            <div className="ad-resolved-card">
              <div className="ad-card-meta-left">
                <CheckCircle2 size={24} style={{ color: 'var(--badge-success-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">US-418: Cut-in Vehicle Deceleration Rate Smoothing</span>
                    <span className="st-badge badge-success">✓ Criteria Approved &amp; Closed</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    {enhancedAC['ac-3'] ? 'Enhanced with single-track motorcycle lane splitting bounds.' : 'Standard 4-wheel cut-in criteria approved.'} Committed to Jira US-418.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('ac-3', null, 'Acceptance criteria reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen Criteria / Undo
              </button>
            </div>
          ) : itemStatuses['ac-3']?.type === 'delegated' ? (
            <div className="ad-delegated-card">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="st-badge badge-purple">👤 Delegated to Motion Control Safety Team</span>
                  <span className="ad-card-resolved-title">US-418: Cut-in Vehicle Deceleration Rate Smoothing</span>
                </div>
                <span className="st-badge badge-info">Awaiting Longitudinal Control Sign-Off</span>
              </div>
              <div className="ad-callout-info">
                <UserCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Delegated for Comfort Braking Calibration:</strong> Transferred to Longitudinal Motion Control team to review deceleration ramp jerk thresholds for single-track radar clusters.
                </div>
              </div>
              <div className="ad-workflow-action-bar" style={{ paddingTop: '10px' }}>
                <div className="ad-action-group">
                  <button
                    onClick={() => handleStatusChange('ac-3', null, 'Delegation recalled to PO inbox')}
                    className="ad-btn-action-secondary"
                  >
                    <RotateCcw size={12} /> Recall to My Inbox
                  </button>
                  <button
                    onClick={() => handleStatusChange('ac-3', { type: 'approved' }, 'Criteria Approved with Motion Control Sign-Off!')}
                    className="ad-btn-action-primary"
                  >
                    <Check size={13} /> Approve Criteria Now
                  </button>
                  <button
                    onClick={() => showToast('Urgent reminder sent to Motion Control Lead!')}
                    className="ad-btn-action-secondary"
                  >
                    <Send size={12} /> Ping Motion Eng
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="ad-workflow-card card-criteria">
              <div className="ad-workflow-card-header">
                <div className="ad-meta-cluster">
                  <span className="st-badge badge-critical">Edge-Case Gap Detected</span>
                  <span className="ad-meta-text">Story: <strong className="font-mono">US-418</strong></span>
                  <span className="ad-meta-text">• Cut-in Vehicle Deceleration Smoothing</span>
                </div>
                <span className="st-badge badge-info" style={{ fontSize: '0.72rem' }}>
                  Origin: Backlog AI Engine
                </span>
              </div>

              <div className="ad-callout-critical">
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>Critical Gap Identified by AI Story Doctor:</strong>
                  US-418 lacks acceptance criteria for lane-splitting two-wheeled motorcycles in dense traffic. Radar bounding box underestimates single-track vehicle width, delaying comfort deceleration.
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {enhancedAC['ac-3'] ? 'AI Enhanced Acceptance Criteria (Motorcycle Lane-Splitting Resolved)' : 'Current Gherkin Criteria (Four-Wheeled Vehicles Only)'}
                  </span>
                  {enhancedAC['ac-3'] && (
                    <span className="st-badge badge-success" style={{ fontSize: '0.68rem' }}>
                      Enhanced with Single-Track Doppler Tracking Bounds
                    </span>
                  )}
                </div>

                {activeDrawers['ac-3'] === 'editGherkin' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea
                      className="ad-inline-editor-textarea"
                      rows={6}
                      value={gherkinEdits['ac-3']}
                      onChange={e => setGherkinEdits({ ...gherkinEdits, 'ac-3': e.target.value })}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => toggleDrawer('ac-3', 'editGherkin')} className="ad-btn-action-secondary" style={{ padding: '4px 10px' }}>Cancel</button>
                      <button
                        onClick={() => { toggleDrawer('ac-3', 'editGherkin'); showToast('Manual Gherkin criteria saved for US-418!'); }}
                        className="ad-btn-action-primary"
                        style={{ padding: '4px 10px' }}
                      >
                        Save Gherkin
                      </button>
                    </div>
                  </div>
                ) : (
                  !enhancedAC['ac-3'] ? (
                    <div className="ad-gherkin-snippet">
                      <span style={{ color: 'var(--stellantis-action)', fontWeight: 800 }}>Scenario:</span> Adjacent passenger car lane cut-in deceleration smoothing<br />
                      &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>Given</span> ego vehicle travels in ACC Highway Pilot mode at 90 km/h<br />
                      &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>When</span> adjacent four-wheeled passenger vehicle crosses lane divider within 15m<br />
                      &nbsp;&nbsp;<span style={{ color: 'var(--badge-success-text)', fontWeight: 700 }}>Then</span> modulate regenerative braking with deceleration ramp capped at 1.5 m/s³
                    </div>
                  ) : (
                    <div className="ad-gherkin-snippet" style={{ border: '1px solid var(--badge-success-border)' }}>
                      <span style={{ color: 'var(--stellantis-action)', fontWeight: 800 }}>Scenario:</span> Motorcycle lane-splitting cut-in deceleration smoothing<br />
                      &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>Given</span> ego vehicle travels in dense traffic below 60 km/h<br />
                      &nbsp;&nbsp;<span style={{ color: '#2563eb', fontWeight: 700 }}>When</span> 4D radar identifies single-track Doppler cluster crossing lane divider within 8m<br />
                      &nbsp;&nbsp;<span style={{ color: 'var(--badge-success-text)', fontWeight: 700 }}>Then</span> trigger soft brake deceleration ramp of 0.8 m/s³ within 60ms<br />
                      &nbsp;&nbsp;<span style={{ color: 'var(--badge-success-text)', fontWeight: 700 }}>And</span> maintain passenger comfort without nuisance jerk while keeping 1.2s headway
                    </div>
                  )
                )}
              </div>

              {/* Actions */}
              <div className="ad-workflow-action-bar">
                <div className="ad-action-group">
                  {enhancedAC['ac-3'] ? (
                    <>
                      <button
                        onClick={() => handleStatusChange('ac-3', { type: 'approved', enhanced: true }, 'Enhanced criteria approved & closed in Jira!')}
                        className="ad-btn-action-primary"
                      >
                        <Check size={13} /> Accept Enhanced Criteria &amp; Close
                      </button>
                      <button
                        onClick={() => toggleEnhanced('ac-3', 'Motorcycle Cut-in')}
                        className="ad-btn-action-secondary"
                      >
                        <RotateCcw size={12} /> Revert to Original
                      </button>
                      <button
                        onClick={() => toggleDrawer('ac-3', 'editGherkin')}
                        className="ad-btn-action-secondary"
                      >
                        <Edit3 size={12} /> Edit Gherkin
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleEnhanced('ac-3', 'Motorcycle Cut-in')}
                        className="ad-btn-action-primary"
                      >
                        <Sparkles size={13} /> Auto-Enhance (AI Fills Motorcycle Gap)
                      </button>
                      <button
                        onClick={() => toggleDrawer('ac-3', 'editGherkin')}
                        className="ad-btn-action-secondary"
                      >
                        <Edit3 size={12} /> Manual Edit Gherkin
                      </button>
                      <button
                        onClick={() => handleStatusChange('ac-3', { type: 'approved' }, 'Criteria Approved for US-418 and closed!')}
                        className="ad-btn-action-secondary"
                      >
                        Approve Current Only
                      </button>
                    </>
                  )}
                </div>
                <div className="ad-secondary-links">
                  <span
                    onClick={() => handleStatusChange('ac-3', { type: 'delegated', lead: 'Motion Control Safety Team' }, 'Delegated to Motion Control Safety Eng!')}
                    className="ad-text-action-link"
                  >
                    <UserCheck size={13} /> Delegate to Safety Eng
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 4: PRIORITIZATION RECOMMENDATIONS                         */}
      {/* ================================================================= */}
      {activeSubTab === 'prioritization' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* CARD 1: AD-104 */}
          {itemStatuses['prio-1']?.type === 'approved' ? (
            <div className="ad-resolved-card">
              <div className="ad-card-meta-left">
                <CheckCircle2 size={24} style={{ color: 'var(--badge-success-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">AD-104: 4D Radar-Vision Fusion Clustering</span>
                    <span className="st-badge badge-success">✓ {itemStatuses['prio-1']?.label || 'Reordered in Jira Sprint 43 Backlog'}</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Elevated from Rank #9 to Rank #2 • +€80K Cost Avoidance unlocked across 2 HIL benches.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('prio-1', null, 'Rank recommendation reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen / Undo
              </button>
            </div>
          ) : itemStatuses['prio-1']?.type === 'rejected' ? (
            <div className="ad-resolved-card" style={{ borderLeft: '3px solid var(--badge-critical-border)' }}>
              <div className="ad-card-meta-left">
                <XCircle size={24} style={{ color: 'var(--badge-critical-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">AD-104: 4D Radar-Vision Fusion Clustering</span>
                    <span className="st-badge badge-critical">{itemStatuses['prio-1']?.label || 'PO Override: Kept Rank #9'}</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    {itemStatuses['prio-1']?.reason || 'AI recommendation declined. Story retained at current position #9. Disagreement feedback logged.'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('prio-1', null, 'Rank decision reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen / Undo
              </button>
            </div>
          ) : (
            <div className="ad-workflow-card card-prioritization">
              <div className="ad-workflow-card-header">
                <div className="ad-meta-cluster">
                  <span className="st-badge badge-info">Schedule Optimization</span>
                  <span className="ad-meta-text">Origin: <strong>Backlog AI Engine</strong></span>
                </div>
                <span className="st-badge badge-success font-mono" style={{ fontSize: '0.74rem', fontWeight: 800 }}>
                  +€80K Cost Avoidance
                </span>
              </div>

              {/* Rank Comparison Visual Stack */}
              <div className="ad-rank-stack">
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Current Position
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    AD-104: 4D Radar-Vision Fusion
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Backlog Rank: <strong className="font-mono">#9</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={22} style={{ color: 'var(--stellantis-action)' }} />
                </div>

                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--stellantis-action)' }}>
                    AI Proposed Rank
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {customRankInputs['prio-1'] ? `Custom Rank ${customRankInputs['prio-1']} in Sprint 43` : 'Elevate to Rank #2 in Sprint 43'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--badge-success-text)', fontWeight: 600, marginTop: '2px' }}>
                    Unblocks 2 downstream HIL teams
                  </div>
                </div>
              </div>

              {/* Custom Rank Input Drawer */}
              {activeDrawers['prio-1'] === 'customRank' && (
                <div className="ad-inline-form-box">
                  <div className="ad-inline-form-header">
                    <span>Propose Custom Backlog Rank for AD-104</span>
                    <button onClick={() => toggleDrawer('prio-1', 'customRank')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="ad-input-field"
                      placeholder="Enter rank, e.g. #3 or #5"
                      style={{ maxWidth: '200px' }}
                      defaultValue="#3"
                      id="custom-rank-val"
                    />
                    <button
                      onClick={() => {
                        const val = document.getElementById('custom-rank-val')?.value || '#3';
                        setCustomRankInputs({ ...customRankInputs, 'prio-1': val });
                        toggleDrawer('prio-1', 'customRank');
                        handleStatusChange('prio-1', { type: 'approved', label: `Custom Rank ${val} Applied` }, `AD-104 assigned custom rank ${val} in Sprint 43!`);
                      }}
                      className="ad-btn-action-primary"
                      style={{ padding: '6px 14px' }}
                    >
                      Apply Rank &amp; Close
                    </button>
                  </div>
                </div>
              )}

              {/* Plain Language Rationale */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Plain Language AI Rationale
                </div>
                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                  margin: 0,
                  background: 'var(--bg-subtle)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  "Moving AD-104 ahead of EPIC-098 unblocks the Chassis Actuation team waiting on radar clustering feeds. This prevents a 4-day idle bench blocker on HIL Bench #4, saving an estimated €80,000 in delayed validation costs, with minimal shift to non-critical Infotainment telemetry."
                </p>
              </div>

              {/* Actions */}
              <div className="ad-workflow-action-bar">
                <div className="ad-action-group">
                  <button
                    onClick={() => handleStatusChange('prio-1', { type: 'approved' }, 'AD-104 elevated to Rank #2 in Jira Sprint 43 Backlog!')}
                    className="ad-btn-action-primary"
                  >
                    <Check size={13} /> Accept Reorder in Jira
                  </button>
                  <button
                    onClick={() => handleStatusChange('prio-1', { type: 'rejected', label: 'PO Override: Kept Rank #9', reason: 'Story retained at current position #9. Disagreement feedback logged.' }, 'Position retained at Rank #9 in Backlog.')}
                    className="ad-btn-action-secondary"
                  >
                    Keep Current Position (#9)
                  </button>
                  <button
                    onClick={() => toggleDrawer('prio-1', 'customRank')}
                    className="ad-btn-action-secondary"
                  >
                    <ListOrdered size={12} /> Propose Custom Rank
                  </button>
                </div>

                <div className="ad-secondary-links">
                  <span>Feedback on Rec:</span>
                  <div className="ad-feedback-group">
                    <button
                      onClick={() => handleFeedback('prio-1', 'agree')}
                      className={`ad-feedback-btn ${feedbackState['prio-1'] === 'agree' ? 'agreed' : ''}`}
                    >
                      <ThumbsUp size={11} /> Agree
                    </button>
                    <button
                      onClick={() => handleFeedback('prio-1', 'disagree')}
                      className={`ad-feedback-btn ${feedbackState['prio-1'] === 'disagree' ? 'disagreed' : ''}`}
                    >
                      <ThumbsDown size={11} /> Disagree
                    </button>
                  </div>
                  {feedbackState['prio-1'] === 'agree' && (
                    <span className="st-badge badge-success font-mono" style={{ fontSize: '0.68rem' }}>✓ AI Rec Confirmed by PO</span>
                  )}
                  {feedbackState['prio-1'] === 'disagree' && (
                    <span className="st-badge badge-high font-mono" style={{ fontSize: '0.68rem' }}>✕ PO Disagreed with Logic</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CARD 2: AD-119 Euro NCAP 2026 VRU Nighttime AEB */}
          {itemStatuses['prio-2']?.type === 'approved' ? (
            <div className="ad-resolved-card">
              <div className="ad-card-meta-left">
                <CheckCircle2 size={24} style={{ color: 'var(--badge-success-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">AD-119: Euro NCAP 2026 VRU Nighttime AEB Calibration</span>
                    <span className="st-badge badge-success">✓ {itemStatuses['prio-2']?.label || 'Fast-Tracked in Jira Sprint 43'}</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Fast-tracked from Rank #14 to Rank #3 (+11 spots) • Balocco track homologation unblocked.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('prio-2', null, 'Rank recommendation reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen / Undo
              </button>
            </div>
          ) : itemStatuses['prio-2']?.type === 'rejected' ? (
            <div className="ad-resolved-card" style={{ borderLeft: '3px solid var(--badge-critical-border)' }}>
              <div className="ad-card-meta-left">
                <XCircle size={24} style={{ color: 'var(--badge-critical-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">AD-119: Euro NCAP 2026 VRU Nighttime AEB Calibration</span>
                    <span className="st-badge badge-critical">{itemStatuses['prio-2']?.label || 'PO Override: Kept Rank #14'}</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    {itemStatuses['prio-2']?.reason || 'AI recommendation declined. Story retained at Rank #14 for Sprint 45.'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('prio-2', null, 'Rank decision reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen / Undo
              </button>
            </div>
          ) : (
            <div className="ad-workflow-card card-prioritization">
              <div className="ad-workflow-card-header">
                <div className="ad-meta-cluster">
                  <span className="st-badge badge-purple">Safety &amp; Compliance Milestone</span>
                  <span className="ad-meta-text">Origin: <strong>Regulatory AI Radar</strong></span>
                </div>
                <span className="st-badge badge-critical font-mono" style={{ fontSize: '0.74rem', fontWeight: 800 }}>
                  Critical Path • Sprint 44 Homologation
                </span>
              </div>

              {/* Rank Comparison Visual Stack */}
              <div className="ad-rank-stack">
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Current Position
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    AD-119: Euro NCAP 2026 VRU Night AEB
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Backlog Rank: <strong className="font-mono">#14</strong> (Scheduled Sprint 45)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={22} style={{ color: 'var(--stellantis-action)' }} />
                </div>

                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--stellantis-action)' }}>
                    AI Proposed Rank
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {customRankInputs['prio-2'] ? `Custom Rank ${customRankInputs['prio-2']} in Sprint 43` : 'Fast-Track to Rank #3 in Sprint 43 (+11)'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--badge-success-text)', fontWeight: 600, marginTop: '2px' }}>
                    Unblocks Balocco track homologation
                  </div>
                </div>
              </div>

              {/* Custom Rank Input Drawer */}
              {activeDrawers['prio-2'] === 'customRank' && (
                <div className="ad-inline-form-box">
                  <div className="ad-inline-form-header">
                    <span>Propose Custom Backlog Rank for AD-119</span>
                    <button onClick={() => toggleDrawer('prio-2', 'customRank')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="ad-input-field"
                      placeholder="Enter rank, e.g. #3 or #5"
                      style={{ maxWidth: '200px' }}
                      defaultValue="#3"
                      id="custom-rank-val-prio-2"
                    />
                    <button
                      onClick={() => {
                        const val = document.getElementById('custom-rank-val-prio-2')?.value || '#3';
                        setCustomRankInputs({ ...customRankInputs, 'prio-2': val });
                        toggleDrawer('prio-2', 'customRank');
                        handleStatusChange('prio-2', { type: 'approved', label: `Custom Rank ${val} Applied` }, `AD-119 assigned custom rank ${val} in Sprint 43!`);
                      }}
                      className="ad-btn-action-primary"
                      style={{ padding: '6px 14px' }}
                    >
                      Apply Rank &amp; Close
                    </button>
                  </div>
                </div>
              )}

              {/* Plain Language Rationale */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Plain Language AI Rationale
                </div>
                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                  margin: 0,
                  background: 'var(--bg-subtle)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  "Euro NCAP 2026 protocol audit window opens in Sprint 44. Currently, AD-119 sits at Rank #14, scheduled behind non-safety Comfort Park Assist features. Fast-tracking AD-119 to Rank #3 ensures firmware release 4.2 contains calibrated IR/RGB nighttime cyclist bounding boxes prior to physical vehicle track testing at the Balocco Proving Ground, eliminating a 3-week homologation freeze."
                </p>
              </div>

              {/* Actions */}
              <div className="ad-workflow-action-bar">
                <div className="ad-action-group">
                  <button
                    onClick={() => handleStatusChange('prio-2', { type: 'approved' }, 'AD-119 fast-tracked to Rank #3 in Jira Sprint 43 Backlog!')}
                    className="ad-btn-action-primary"
                  >
                    <Check size={13} /> Accept Fast-Track in Jira
                  </button>
                  <button
                    onClick={() => handleStatusChange('prio-2', { type: 'rejected', label: 'PO Override: Kept Rank #14', reason: 'Story retained at Rank #14 for Sprint 45.' }, 'Position retained at Rank #14 (Sprint 45).')}
                    className="ad-btn-action-secondary"
                  >
                    Keep at Rank #14 (Sprint 45)
                  </button>
                  <button
                    onClick={() => toggleDrawer('prio-2', 'customRank')}
                    className="ad-btn-action-secondary"
                  >
                    <ListOrdered size={12} /> Propose Custom Rank
                  </button>
                </div>

                <div className="ad-secondary-links">
                  <span>Feedback on Rec:</span>
                  <div className="ad-feedback-group">
                    <button
                      onClick={() => handleFeedback('prio-2', 'agree')}
                      className={`ad-feedback-btn ${feedbackState['prio-2'] === 'agree' ? 'agreed' : ''}`}
                    >
                      <ThumbsUp size={11} /> Agree
                    </button>
                    <button
                      onClick={() => handleFeedback('prio-2', 'disagree')}
                      className={`ad-feedback-btn ${feedbackState['prio-2'] === 'disagree' ? 'disagreed' : ''}`}
                    >
                      <ThumbsDown size={11} /> Disagree
                    </button>
                  </div>
                  {feedbackState['prio-2'] === 'agree' && (
                    <span className="st-badge badge-success font-mono" style={{ fontSize: '0.68rem' }}>✓ AI Rec Confirmed by PO</span>
                  )}
                  {feedbackState['prio-2'] === 'disagree' && (
                    <span className="st-badge badge-high font-mono" style={{ fontSize: '0.68rem' }}>✕ PO Disagreed with Logic</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 5: FEATURE CHANGES                                        */}
      {/* ================================================================= */}
      {activeSubTab === 'features' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {itemStatuses['feat-1']?.type === 'approved' ? (
            <div className="ad-resolved-card">
              <div className="ad-card-meta-left">
                <CheckCircle2 size={24} style={{ color: 'var(--badge-success-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">ECR-412: Reduce LiDAR Point Cloud Resolution</span>
                    <span className="st-badge badge-success">✓ Scope Approved (-4 SP)</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Voxel density reduced from 120 to 95 pts/m² for high-temperature thermal mitigation. ASIL-B pre-verified.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('feat-1', null, 'ECR-412 reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen / Undo
              </button>
            </div>
          ) : itemStatuses['feat-1']?.type === 'rejected' ? (
            <div className="ad-resolved-card" style={{ borderLeft: '3px solid var(--badge-critical-border)' }}>
              <div className="ad-card-meta-left">
                <XCircle size={24} style={{ color: 'var(--badge-critical-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">ECR-412: Reduce LiDAR Point Cloud Resolution</span>
                    <span className="st-badge badge-critical">✕ Rejected with Counter-Proposal</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    {itemStatuses['feat-1']?.reason || 'PO rejected 95 pts/m² reduction. Counter-proposal dispatched to Dr. Stefan Keller requesting 105 pts/m² compromise with dynamic temperature clustering.'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('feat-1', null, 'ECR-412 reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen / Undo
              </button>
            </div>
          ) : itemStatuses['feat-1']?.type === 'delegated' ? (
            <div className="ad-delegated-card">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="st-badge badge-purple">👤 {itemStatuses['feat-1']?.lead || 'Global Portfolio Council'}</span>
                  <span className="ad-card-resolved-title">ECR-412: Reduce LiDAR Point Cloud Resolution</span>
                </div>
                <span className="st-badge badge-info">Awaiting Architecture Escalation Sign-Off</span>
              </div>
              <div className="ad-callout-info">
                <UserCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Transferred for Portfolio Governance:</strong> Assigned to {itemStatuses['feat-1']?.lead || 'Global Portfolio Council'} to evaluate Orin SoC thermal mitigation vs Euro NCAP debris range trade-offs.
                </div>
              </div>
              <div className="ad-workflow-action-bar" style={{ paddingTop: '10px' }}>
                <div className="ad-action-group">
                  <button
                    onClick={() => handleStatusChange('feat-1', null, 'ECR-412 recalled to PO inbox')}
                    className="ad-btn-action-secondary"
                  >
                    <RotateCcw size={12} /> Recall to My Inbox
                  </button>
                  <button
                    onClick={() => handleStatusChange('feat-1', { type: 'approved' }, 'ECR-412 Scope Change Approved!')}
                    className="ad-btn-action-primary"
                  >
                    <Check size={13} /> Approve Scope Now
                  </button>
                  <button
                    onClick={() => showToast(`Urgent reminder dispatched to ${itemStatuses['feat-1']?.lead || 'Lead'}!`)}
                    className="ad-btn-action-secondary"
                  >
                    <Send size={12} /> Ping {itemStatuses['feat-1']?.lead?.split(' ')[0] || 'Council'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="ad-workflow-card card-features">
              <div className="ad-workflow-card-header">
                <div className="ad-meta-cluster">
                  <span className="st-badge badge-purple">Scope &amp; Architecture Change</span>
                  <span className="ad-meta-text">Requestor: <strong>Dr. Stefan Keller (Lead Perception Architect)</strong></span>
                </div>
                <span className="st-badge badge-info" style={{ fontSize: '0.72rem' }}>
                  Origin: Architecture Review Board
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 className="ad-item-title">
                  ECR-412: Reduce LiDAR Point Cloud Resolution Threshold for Thermal Mitigation
                </h4>
                <p className="ad-item-desc">
                  Proposal to reduce LiDAR background voxel clustering density from 120 pts/m² to 95 pts/m² during high-ambient vehicle operating conditions (&gt;42°C) to prevent Orin SoC thermal throttling.
                </p>

                {/* 4-Tile Impact Summary Grid */}
                <div className="ad-impact-grid">
                  <div className="ad-impact-tile">
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Scope Impact</span>
                    <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>-4 Story Points</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>GPU optimization</span>
                  </div>
                  <div className="ad-impact-tile">
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Timeline Impact</span>
                    <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--badge-success-text)' }}>0 Days Shift</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Neutral schedule</span>
                  </div>
                  <div className="ad-impact-tile">
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Debris Range</span>
                    <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--badge-high-text)' }}>80m &rarr; 74m</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Within NCAP limit</span>
                  </div>
                  <div className="ad-impact-tile">
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Safety Check</span>
                    <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--badge-success-text)' }}>ASIL-B Pass</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ISO 21448 verified</span>
                  </div>
                </div>
              </div>

              {/* Counter-Proposal Drawer */}
              {activeDrawers['feat-1'] === 'counterProposal' && (
                <div className="ad-inline-form-box">
                  <div className="ad-inline-form-header">
                    <span>Counter-Proposal for ECR-412 (LiDAR Thermal Mitigation)</span>
                    <button onClick={() => toggleDrawer('feat-1', 'counterProposal')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="ad-input-field"
                      placeholder="e.g. Propose 105 pts/m² with dynamic temperature clustering"
                      defaultValue="Reject 95 pts/m²; propose 105 pts/m² with dynamic thermal clustering"
                      id="counter-proposal-input"
                    />
                    <button
                      onClick={() => {
                        const note = document.getElementById('counter-proposal-input')?.value || 'Counter-proposal: 105 pts/m² requested';
                        handleStatusChange('feat-1', { type: 'rejected', reason: note }, 'Counter-proposal dispatched to Dr. Stefan Keller!');
                      }}
                      className="ad-btn-action-primary"
                      style={{ padding: '6px 14px' }}
                    >
                      Submit Counter-Proposal &amp; Close
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="ad-workflow-action-bar">
                <div className="ad-action-group">
                  <button
                    onClick={() => handleStatusChange('feat-1', { type: 'approved' }, 'ECR-412 Approved! Architecture baseline updated.')}
                    className="ad-btn-action-primary"
                  >
                    <Check size={13} /> Approve Feature Scope Change
                  </button>
                  <button
                    onClick={() => toggleDrawer('feat-1', 'counterProposal')}
                    className="ad-btn-action-secondary"
                  >
                    Reject with Counter-Proposal
                  </button>
                  <button
                    onClick={() => handleStatusChange('feat-1', { type: 'delegated', lead: 'Global Portfolio Council' }, 'ECR-412 escalated to Global Portfolio Board!')}
                    className="ad-btn-action-secondary"
                  >
                    Escalate to Portfolio Level
                  </button>
                </div>
                <div className="ad-secondary-links">
                  <span
                    onClick={() => handleStatusChange('feat-1', { type: 'delegated', lead: 'Systems Engineering Lead' }, 'ECR-412 delegated to Systems Engineering Lead!')}
                    className="ad-text-action-link"
                    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <UserCheck size={13} /> Delegate to Systems Lead
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 6: RELEASE DECISIONS                                      */}
      {/* ================================================================= */}
      {activeSubTab === 'release' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {itemStatuses['rel-1']?.type === 'approved' ? (
            <div className="ad-resolved-card">
              <div className="ad-card-meta-left">
                <CheckCircle2 size={24} style={{ color: 'var(--badge-success-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">RC_v3.4.0-rc2_EuroNCAP</span>
                    <span className="st-badge badge-success">✓ Conditional Go Signed Off</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Physical track staging authorized using Synthetic Emulator. Track drive locked pending 16:00 HIL test suite completion.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('rel-1', null, 'Release gate reopened for review')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen Gate / Undo
              </button>
            </div>
          ) : itemStatuses['rel-1']?.type === 'rejected' ? (
            <div className="ad-resolved-card" style={{ borderLeft: '3px solid var(--badge-critical-border)' }}>
              <div className="ad-card-meta-left">
                <XCircle size={24} style={{ color: 'var(--badge-critical-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">RC_v3.4.0-rc2_EuroNCAP</span>
                    <span className="st-badge badge-critical">✕ Release Vetoed / Blocked</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    {itemStatuses['rel-1']?.reason || 'Release blocked by PO. Simulation test coverage below required 90% threshold. Critical ticket dispatched.'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('rel-1', null, 'Release gate reopened for review')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen Gate / Undo
              </button>
            </div>
          ) : itemStatuses['rel-1']?.type === 'snoozed' ? (
            <div className="ad-snoozed-card">
              <div className="ad-card-meta-left">
                <Clock size={22} style={{ color: 'var(--badge-high-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="ad-card-resolved-title">RC_v3.4.0-rc2_EuroNCAP</span>
                    <span className="st-badge badge-high">⏱ Release Gate on HOLD (Awaiting 16:00 HIL Retest)</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Gate held pending 16:00 CET HIL Simulation test run (Target: &ge;90% coverage). Track staging team alerted to stand by.
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleStatusChange('rel-1', null, 'Release gate resumed for PO evaluation')}
                  className="ad-btn-action-secondary"
                >
                  <RotateCcw size={12} /> Resume Review
                </button>
                <button
                  onClick={() => handleStatusChange('rel-1', { type: 'approved' }, 'Conditional Go Signed Off! Track staging authorized.')}
                  className="ad-btn-action-primary"
                >
                  <Check size={12} /> Sign Conditional Go
                </button>
                <button
                  onClick={() => handleStatusChange('rel-1', { type: 'rejected', reason: 'Release Vetoed by PO during Hold' }, 'Release Blocked / No-Go dispatched.')}
                  className="ad-btn-action-danger"
                >
                  <X size={12} /> Block Release
                </button>
              </div>
            </div>
          ) : (
            <div className="ad-workflow-card card-release">
              <div className="ad-workflow-card-header">
                <div className="ad-meta-cluster">
                  <span className="st-badge badge-high">Release Gatekeeper • Live Telemetry</span>
                  <span className="ad-meta-text">Candidate: <strong className="font-mono">RC_v3.4.0-rc2_EuroNCAP</strong></span>
                </div>
                <span className="st-badge badge-info" style={{ fontSize: '0.72rem' }}>
                  Origin: CI/CD Pipeline
                </span>
              </div>

              {/* Live Pull Telemetry Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ position: 'relative', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg className="-rotate-90" viewBox="0 0 36 36" style={{ width: '48px', height: '48px' }}>
                      <path
                        stroke="var(--border-color)"
                        strokeWidth="3.5"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        stroke="var(--badge-success-text)"
                        strokeWidth="3.5"
                        strokeDasharray="91, 100"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="font-mono" style={{ position: 'absolute', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      91%
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>Conditional Go</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Euro NCAP Track Test Flight</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Remaining Blocker (Direct Linked Preview)
                  </div>
                  <div style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--badge-high-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    fontSize: '0.74rem'
                  }}>
                    <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--badge-high-text)' }}></span>
                      HIL Simulation Test Coverage at 86% (Threshold: 90%)
                    </span>
                    <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>ETA: 16:00 CET</span>
                  </div>
                </div>
              </div>

              <div className="ad-callout-info">
                <Sparkles size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>AI Recommendation:</strong>
                  Authorize Conditional Go for physical vehicle track staging using Synthetic Emulator; lock track driving authorization pending 16:00 HIL test suite completion.
                </div>
              </div>

              {/* Actions */}
              <div className="ad-workflow-action-bar">
                <div className="ad-action-group">
                  <button
                    onClick={() => handleStatusChange('rel-1', { type: 'approved' }, 'Conditional Go Signed Off! Track staging team notified.')}
                    className="ad-btn-action-primary"
                  >
                    <Check size={13} /> Sign-Off Conditional Go
                  </button>
                  <button
                    onClick={() => handleStatusChange('rel-1', { type: 'snoozed', label: 'Hold Active (Awaiting 16:00 HIL)' }, 'Release held pending 16:00 HIL simulation run.')}
                    className="ad-btn-action-secondary"
                  >
                    Hold for 16:00 HIL Retest
                  </button>
                  <button
                    onClick={() => handleStatusChange('rel-1', { type: 'rejected', reason: 'Release Vetoed by PO: Simulation coverage below 90%' }, 'No-Go / Release Blocked. Critical ticket dispatched.')}
                    className="ad-btn-action-danger"
                  >
                    No-Go / Block Release
                  </button>
                </div>
                <div className="ad-secondary-links">
                  <span>Agree with AI Go/No-Go?</span>
                  <div className="ad-feedback-group">
                    <button
                      onClick={() => handleFeedback('rel-1', 'agree')}
                      className={`ad-feedback-btn ${feedbackState['rel-1'] === 'agree' ? 'agreed' : ''}`}
                    >
                      <ThumbsUp size={11} /> Agree
                    </button>
                    <button
                      onClick={() => handleFeedback('rel-1', 'disagree')}
                      className={`ad-feedback-btn ${feedbackState['rel-1'] === 'disagree' ? 'disagreed' : ''}`}
                    >
                      <ThumbsDown size={11} /> Disagree
                    </button>
                  </div>
                  {feedbackState['rel-1'] === 'agree' && (
                    <span className="st-badge badge-success font-mono" style={{ fontSize: '0.68rem' }}>✓ AI Go/No-Go Endorsed</span>
                  )}
                  {feedbackState['rel-1'] === 'disagree' && (
                    <span className="st-badge badge-high font-mono" style={{ fontSize: '0.68rem' }}>✕ AI Go/No-Go Disputed</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* SUB-TAB 7: BUSINESS VALIDATION                                    */}
      {/* ================================================================= */}
      {activeSubTab === 'validation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Milestone 1: OEM Commercial Acceptance */}
          {itemStatuses['val-1']?.type === 'approved' ? (
            <div className="ad-resolved-card">
              <div className="ad-card-meta-left">
                <CheckCircle2 size={24} style={{ color: 'var(--badge-success-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">OEM Commercial Acceptance: Lane Change SLA</span>
                    <span className="st-badge badge-success">✓ €2.4M Payment Milestone Gate Released</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Commercial SLA verified against Balocco Proving Ground trials (2.1s reaction time passed). Invoiced to OEM partner.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('val-1', null, 'Milestone verification reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen Gate / Undo
              </button>
            </div>
          ) : itemStatuses['val-1']?.type === 'rejected' ? (
            <div className="ad-resolved-card" style={{ borderLeft: '3px solid var(--badge-critical-border)' }}>
              <div className="ad-card-meta-left">
                <XCircle size={24} style={{ color: 'var(--badge-critical-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">OEM Commercial Acceptance: Lane Change SLA</span>
                    <span className="st-badge badge-critical">✕ Commercial Discrepancy Flagged</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    {itemStatuses['val-1']?.reason || 'Milestone payment gate frozen. Formal SLA discrepancy report dispatched to Program Legal Board and Claire Dubois. Reconciliation review scheduled.'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('val-1', null, 'Milestone verification reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen Gate / Undo
              </button>
            </div>
          ) : itemStatuses['val-1']?.type === 'telemetry_requested' ? (
            <div className="ad-snoozed-card">
              <div className="ad-card-meta-left">
                <Clock size={22} style={{ color: 'var(--badge-high-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="ad-card-resolved-title">OEM Commercial Acceptance: Lane Change SLA</span>
                    <span className="st-badge badge-high">📡 Balocco Telemetry Pull Active (Pending Data)</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Additional 24h raw vehicle sensor logs requested from Balocco Proving Ground to confirm reaction SLA stability under rainy road conditions.
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleStatusChange('val-1', null, 'Milestone returned to active review')}
                  className="ad-btn-action-secondary"
                >
                  <RotateCcw size={12} /> Resume Review
                </button>
                <button
                  onClick={() => handleStatusChange('val-1', { type: 'approved' }, 'Assumption Confirmed! €2.4M payment gate released.')}
                  className="ad-btn-action-primary"
                >
                  <Check size={12} /> Confirm &amp; Release Gate
                </button>
                <button
                  onClick={() => handleStatusChange('val-1', { type: 'rejected', reason: 'Discrepancy confirmed after telemetry review' }, 'Commercial discrepancy flagged to Legal.')}
                  className="ad-btn-action-danger"
                >
                  <X size={12} /> Flag Discrepancy
                </button>
                <button
                  onClick={() => showToast('Priority reminder dispatched to Balocco Test Operations Team!')}
                  className="ad-btn-action-secondary"
                >
                  <Send size={12} /> Ping Balocco Ops
                </button>
              </div>
            </div>
          ) : (
            <div className="ad-workflow-card card-validation">
              <div className="ad-workflow-card-header">
                <div className="ad-meta-cluster">
                  <span className="st-badge badge-success">Commercial Milestone Gate</span>
                  <span className="ad-meta-text">Requestor: <strong>Claire Dubois (Commercial Program Director)</strong></span>
                </div>
                <span className="st-badge badge-success font-mono" style={{ fontSize: '0.74rem', fontWeight: 800 }}>
                  Unlocks €2.4M Payment Gate
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 className="ad-item-title">
                  OEM Commercial Acceptance: Highway Autonomous Lane Change Reaction SLA
                </h4>

                <div style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Assumption Statement under Validation
                  </div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                    "OEM partner SLA requires driver notification to initiated steer maneuver within &lt;2.8s under dense highway traffic."
                  </p>
                </div>

                <div style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Evidence Gathered from Balocco Proving Ground
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Average trial reaction time across 4,200 simulated maneuvers:</span>
                    <span className="font-mono" style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--badge-success-text)' }}>2.1s (Passed SLA)</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    99.2% of trials satisfied criteria with 0 critical disengagements recorded.
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="ad-workflow-action-bar">
                <div className="ad-action-group">
                  <button
                    onClick={() => handleStatusChange('val-1', { type: 'approved' }, 'Assumption Confirmed! €2.4M payment gate released and signed.')}
                    className="ad-btn-action-primary"
                  >
                    <Check size={13} /> Confirm Assumption &amp; Release Milestone
                  </button>
                  <button
                    onClick={() => handleStatusChange('val-1', { type: 'telemetry_requested' }, 'Fleet telemetry pull request dispatched to Balocco Proving Ground!')}
                    className="ad-btn-action-secondary"
                  >
                    Request Additional Fleet Telemetry
                  </button>
                  <button
                    onClick={() => handleStatusChange('val-1', { type: 'rejected', reason: 'Commercial discrepancy flagged: reaction time SLA variance in wet conditions.' }, 'Commercial discrepancy flagged to Program Legal board!')}
                    className="ad-btn-action-danger"
                  >
                    Flag Commercial Discrepancy
                  </button>
                </div>
                <div className="ad-secondary-links">
                  <span>Deadline: Today 18:00 CET</span>
                </div>
              </div>
            </div>
          )}

          {/* Milestone 2: Euro NCAP Driver Monitoring Attentiveness SLA */}
          {itemStatuses['val-2']?.type === 'approved' ? (
            <div className="ad-resolved-card">
              <div className="ad-card-meta-left">
                <CheckCircle2 size={24} style={{ color: 'var(--badge-success-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">Euro NCAP Driver Monitoring Attentiveness SLA Gate</span>
                    <span className="st-badge badge-success">✓ Regulatory Milestone Approved</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    In-cabin IR gaze tracking confirmed compliant (0.84s latency). Euro NCAP 5-Star compliance dossier certified.
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('val-2', null, 'DMS compliance gate reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen Gate / Undo
              </button>
            </div>
          ) : itemStatuses['val-2']?.type === 'rejected' ? (
            <div className="ad-resolved-card" style={{ borderLeft: '3px solid var(--badge-critical-border)' }}>
              <div className="ad-card-meta-left">
                <XCircle size={24} style={{ color: 'var(--badge-critical-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="ad-card-resolved-title">Euro NCAP Driver Monitoring Attentiveness SLA Gate</span>
                    <span className="st-badge badge-critical">✕ Regulatory Discrepancy Flagged</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    {itemStatuses['val-2']?.reason || 'Compliance gate locked. In-cabin IR gaze tracking calibration discrepancy reported to Safety Engineering board.'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStatusChange('val-2', null, 'DMS compliance gate reopened')}
                className="ad-btn-undo"
              >
                <RotateCcw size={12} /> Reopen Gate / Undo
              </button>
            </div>
          ) : itemStatuses['val-2']?.type === 'telemetry_requested' ? (
            <div className="ad-snoozed-card">
              <div className="ad-card-meta-left">
                <Clock size={22} style={{ color: 'var(--badge-high-text)', flexShrink: 0 }} />
                <div className="ad-card-resolved-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="ad-card-resolved-title">Euro NCAP Driver Monitoring Attentiveness SLA Gate</span>
                    <span className="st-badge badge-high">📡 Cabin Telemetry Pull Active (IR Camera Logs Requested)</span>
                  </div>
                  <span className="ad-card-resolved-desc">
                    Additional raw driver micro-sleep and head pose telemetry logs requested from fleet testing in low sun glare conditions.
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleStatusChange('val-2', null, 'Milestone returned to active review')}
                  className="ad-btn-action-secondary"
                >
                  <RotateCcw size={12} /> Resume Review
                </button>
                <button
                  onClick={() => handleStatusChange('val-2', { type: 'approved' }, 'DMS Assumption Confirmed! Euro NCAP dossier signed.')}
                  className="ad-btn-action-primary"
                >
                  <Check size={12} /> Confirm &amp; Sign Gate
                </button>
                <button
                  onClick={() => handleStatusChange('val-2', { type: 'rejected', reason: 'Discrepancy confirmed: IR gaze latency exceeded in glare' }, 'Regulatory discrepancy flagged.')}
                  className="ad-btn-action-danger"
                >
                  <X size={12} /> Flag Discrepancy
                </button>
              </div>
            </div>
          ) : (
            <div className="ad-workflow-card card-validation">
              <div className="ad-workflow-card-header">
                <div className="ad-meta-cluster">
                  <span className="st-badge badge-purple">Regulatory Safety Milestone</span>
                  <span className="ad-meta-text">Requestor: <strong>Marcus Vance (Safety Systems Lead)</strong></span>
                </div>
                <span className="st-badge badge-critical font-mono" style={{ fontSize: '0.74rem', fontWeight: 800 }}>
                  Euro NCAP 5-Star Gate
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 className="ad-item-title">
                  Euro NCAP Direct Driver Monitoring Attentiveness SLA Gate
                </h4>

                <div style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Assumption Statement under Validation
                  </div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                    "Driver micro-sleep and gaze diversion detection latency must remain &lt;1.2s across 99.5% of lighting scenarios (low sun glare to dark cabin)."
                  </p>
                </div>

                <div style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Evidence Gathered from Cabin Fleet Trials
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Average detection latency across 1,800 Balocco cabin sessions:</span>
                    <span className="font-mono" style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--badge-success-text)' }}>0.84s (Passed SLA)</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    0 false-positive alerts registered across 12 diverse driver profiles with eyewear.
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="ad-workflow-action-bar">
                <div className="ad-action-group">
                  <button
                    onClick={() => handleStatusChange('val-2', { type: 'approved' }, 'DMS Assumption Confirmed! Regulatory gate released.')}
                    className="ad-btn-action-primary"
                  >
                    <Check size={13} /> Confirm Assumption &amp; Release Milestone
                  </button>
                  <button
                    onClick={() => handleStatusChange('val-2', { type: 'telemetry_requested' }, 'Cabin fleet telemetry pull dispatched to Balocco Proving Ground!')}
                    className="ad-btn-action-secondary"
                  >
                    Request Additional Fleet Telemetry
                  </button>
                  <button
                    onClick={() => handleStatusChange('val-2', { type: 'rejected', reason: 'Regulatory discrepancy flagged: IR eye-tracking latency in direct sunlight.' }, 'Regulatory discrepancy flagged to Safety Systems Board!')}
                    className="ad-btn-action-danger"
                  >
                    Flag Regulatory Discrepancy
                  </button>
                </div>
                <div className="ad-secondary-links">
                  <span>Deadline: Friday 12:00 CET</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
