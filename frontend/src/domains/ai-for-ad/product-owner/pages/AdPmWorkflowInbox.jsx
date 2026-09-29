import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Eye,
  AlertTriangle,
  Lightbulb,
  Pin,
  AlertOctagon,
  Landmark,
  Bell,
  Bot,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  Send,
  UserCheck,
  RotateCcw,
  X,
  Sparkles,
  ArrowRight,
  Sliders,
  Check,
  RefreshCw,
  ThumbsDown,
  Info
} from 'lucide-react';
import '../adPmWorkflowInbox.css';
import { INBOX_CATEGORIES, INBOX_ITEMS } from '../adPmWorkflowData';

/**
 * TAB 2 — Workflow Inbox (Product Manager, AI for AD)
 * Clean Human-in-the-Loop Decision Cockpit (PRD §5.2)
 */
export default function AdPmWorkflowInbox({ onInspectLevel6 }) {
  // Filtering states (NO "All" tab — direct category stream & urgency lanes)
  const [activeLaneFilter, setActiveLaneFilter] = useState('all-lanes'); // 'all-lanes' | 'critical' | 'standard' | 'fyi'
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('approval'); // 'approval' active by default matching user design

  // Card resolution state { [itemId]: { status: string, actionLabel: string, timestamp: string } }
  const [resolutions, setResolutions] = useState({});

  // Expanded evidence drawers { [itemId]: boolean }
  const [expandedDrawers, setExpandedDrawers] = useState({});

  // Live Toast Notification
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // =========================================================================
  // INTERACTIVE MODAL STATES (All Actions Function Realistically)
  // =========================================================================
  const [activeAuditModal, setActiveAuditModal] = useState(null); // Item for audit trail
  const [activeEvidenceModal, setActiveEvidenceModal] = useState(null); // Item for evidence query
  const [evidenceNote, setEvidenceNote] = useState('');
  
  const [activeDelegateModal, setActiveDelegateModal] = useState(null); // Item for delegation
  const [selectedDelegate, setSelectedDelegate] = useState('Dr. Marco V. (Safety Architecture Lead)');

  const [activeCoSignModal, setActiveCoSignModal] = useState(false); // Item 1 Co-signature
  const [coSignPin, setCoSignPin] = useState('STLA-SAFETY-42');

  const [activeRejectModal, setActiveRejectModal] = useState(null); // Item 1 & 3 Rejection
  const [rejectionReason, setRejectionReason] = useState('Telemetry shows unmitigated edge variance on track bench.');

  const [activeRevisionModal, setActiveRevisionModal] = useState(false); // Item 2 Send Back
  const [revisionFeedback, setRevisionFeedback] = useState('Clarify evasive maneuver trajectory boundary under 80 km/h rain conditions.');

  const [activeConflictModal, setActiveConflictModal] = useState(false); // Item 2 Conflict Check

  const [activeMitigationModal, setActiveMitigationModal] = useState(null); // Item 3 & Item 6 Mitigation
  const [selectedMitigation, setSelectedMitigation] = useState('emulator');

  const [activeBlockReleaseModal, setActiveBlockReleaseModal] = useState(false); // Item 3 Block Release

  const [activeSimulateModal, setActiveSimulateModal] = useState(false); // Item 4 Sprint Impact

  const [activeChecklistModal, setActiveChecklistModal] = useState(false); // Item 5 Checklist
  const [checklistChecks, setChecklistChecks] = useState({
    1: true, 2: true, 3: true, 4: true, 5: true, 6: false,
    7: false, 8: false, 9: false, 10: false, 11: false, 12: false
  });

  const [activeRollbackModal, setActiveRollbackModal] = useState(false); // Item 7 Rollback Analysis

  const [activeThresholdModal, setActiveThresholdModal] = useState(false); // Item 8 Drift Slider
  const [driftThreshold, setDriftThreshold] = useState(-3.0);

  const [activeEdgePromptModal, setActiveEdgePromptModal] = useState(false); // Item 9 Edge Prompt
  const [edgePromptWeather, setEdgePromptWeather] = useState('Dense Fog + Lens Flare (95% occlusion)');

  // Toggle drawer expand/collapse
  const toggleDrawer = (id) => {
    setExpandedDrawers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Generic resolve helper
  const resolveItem = (itemId, actionLabel, statusType = 'Completed') => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setResolutions(prev => ({
      ...prev,
      [itemId]: {
        status: statusType,
        actionLabel: actionLabel,
        timestamp: `Today at ${now} CET`
      }
    }));
    showToast(`Decision Recorded: ${actionLabel}`);
  };

  // Undo resolution
  const handleUndoResolution = (id) => {
    setResolutions(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    showToast('Decision reverted. Ticket returned to active queue.');
  };

  // =========================================================================
  // ACTION DISPATCHER — Maps every button to its real functional behavior
  // =========================================================================
  const handleResolveAction = (item, action) => {
    // 1. Audit Trail
    if (action.id === 'view_audit') {
      setActiveAuditModal(item);
      return;
    }
    // 2. Request Evidence
    if (action.id === 'request_evidence') {
      setActiveEvidenceModal(item);
      return;
    }
    // 3. Delegate
    if (action.id === 'delegate' || action.id === 'delegate_safety') {
      setActiveDelegateModal(item);
      return;
    }

    // Specific Item Action Triggers
    if (item.id === 'inbox-1') {
      if (action.id === 'approve_gated') {
        setActiveCoSignModal(true);
        return;
      }
      if (action.id === 'reject') {
        setActiveRejectModal(item);
        return;
      }
    }

    if (item.id === 'inbox-2') {
      if (action.id === 'confirm_wording') {
        resolveItem(item.id, 'Requirement Approved & Committed to Jira AD-108');
        return;
      }
      if (action.id === 'send_back') {
        setActiveRevisionModal(true);
        return;
      }
      if (action.id === 'conflict_analysis') {
        setActiveConflictModal(true);
        return;
      }
    }

    if (item.id === 'inbox-3') {
      if (action.id === 'accept_mitigation') {
        setActiveMitigationModal('item-3');
        return;
      }
      if (action.id === 'block_release') {
        setActiveBlockReleaseModal(true);
        return;
      }
      if (action.id === 'escalate') {
        resolveItem(item.id, 'Escalated to VP of Software Engineering', 'Escalated');
        return;
      }
    }

    if (item.id === 'inbox-4') {
      if (action.id === 'reprioritize') {
        resolveItem(item.id, 'Backlog Reprioritized: AD-108 Moved Ahead of AD-115');
        return;
      }
      if (action.id === 'keep_priority') {
        resolveItem(item.id, 'Current Priority Confirmed (AD-115 Maintained)');
        return;
      }
      if (action.id === 'simulate_impact') {
        setActiveSimulateModal(true);
        return;
      }
    }

    if (item.id === 'inbox-5') {
      if (action.id === 'complete_checklist') {
        setActiveChecklistModal(true);
        return;
      }
      if (action.id === 'assign_specialist') {
        resolveItem(item.id, 'Checklist Reassigned to Safety Compliance Lead', 'Delegated');
        return;
      }
    }

    if (item.id === 'inbox-6') {
      if (action.id === 'choose_mitigation') {
        setActiveMitigationModal('item-6');
        return;
      }
      if (action.id === 'schedule_review') {
        resolveItem(item.id, 'Emergency Supplier Executive Review Scheduled');
        return;
      }
    }

    if (item.id === 'inbox-7') {
      if (action.id === 'sign_off') {
        resolveItem(item.id, 'Sensor Fusion Safety Policy v3.2 Signed Off & Deployed');
        return;
      }
      if (action.id === 'rollback_analysis') {
        setActiveRollbackModal(true);
        return;
      }
    }

    if (item.id === 'inbox-8') {
      if (action.id === 'set_threshold') {
        setActiveThresholdModal(true);
        return;
      }
      if (action.id === 'ack_mute') {
        resolveItem(item.id, 'Watchdog Alert Muted for 48 Hours', 'Acknowledged');
        return;
      }
      if (action.id === 'retrain') {
        resolveItem(item.id, 'Orin NPU TensorRT Calibration Pipeline Triggered');
        return;
      }
    }

    if (item.id === 'inbox-9') {
      if (action.id === 'approve_ingest') {
        resolveItem(item.id, '420 Synthetic Scenarios Ingested into HIL Benchmark');
        return;
      }
      if (action.id === 'rerun_edge') {
        setActiveEdgePromptModal(true);
        return;
      }
      if (action.id === 'inspect_level6') {
        if (onInspectLevel6) {
          onInspectLevel6();
        }
        return;
      }
    }

    // Default fallback
    resolveItem(item.id, action.label);
  };

  // Filter items based on active lane and category
  const filteredItems = INBOX_ITEMS.filter(item => {
    // Lane filter
    if (activeLaneFilter !== 'all-lanes' && item.lane !== activeLaneFilter) {
      return false;
    }
    // Category filter
    if (activeCategoryFilter !== null && item.itemType !== activeCategoryFilter) {
      return false;
    }
    return true;
  });

  // Calculate live counts
  const criticalItems = INBOX_ITEMS.filter(i => i.lane === 'critical');
  const standardItems = INBOX_ITEMS.filter(i => i.lane === 'standard');
  const fyiItems = INBOX_ITEMS.filter(i => i.lane === 'fyi');

  const openCriticalCount = criticalItems.filter(i => !resolutions[i.id]).length;
  const openStandardCount = standardItems.filter(i => !resolutions[i.id]).length;
  const openFyiCount = fyiItems.filter(i => !resolutions[i.id]).length;
  const totalResolvedCount = Object.keys(resolutions).length;

  // Render Icon helper
  const getCategoryIcon = (iconName, size = 15) => {
    switch (iconName) {
      case 'CheckCircle2':
      case 'Check':
        return <Check size={size} strokeWidth={2.4} />;
      case 'Eye':
        return <Eye size={size} strokeWidth={2} />;
      case 'AlertTriangle':
        return <AlertTriangle size={size} strokeWidth={2} />;
      case 'Lightbulb':
        return <Lightbulb size={size} strokeWidth={2} />;
      case 'Pin':
        return <Pin size={size} strokeWidth={2} />;
      case 'AlertOctagon':
        return <AlertOctagon size={size} strokeWidth={2} />;
      case 'Landmark':
        return <Landmark size={size} strokeWidth={2} />;
      case 'Bell':
        return <Bell size={size} strokeWidth={2} />;
      case 'Bot':
        return <Bot size={size} strokeWidth={2} />;
      default:
        return <Layers size={size} strokeWidth={2} />;
    }
  };

  const activeCategoryObj = INBOX_CATEGORIES.find(c => c.id === activeCategoryFilter);

  return (
    <div className="ad-pm-inbox-container">

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="ad-inbox-toast">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================================================================= */}
      {/* CONNECTED HEADER: DECISION COCKPIT & INNOVATIVE TRIAGE CONTROLS   */}
      {/* ================================================================= */}
      <div className="ad-inbox-header-card">

        {/* Title, Velocity Meter & View Switcher */}
        <div className="ad-inbox-title-row">
          <div className="ad-inbox-title-group">
            <div className="ad-inbox-icon-box">
              <Layers size={18} />
            </div>
            <div>
              <div className="ad-inbox-title">
                Workflow Inbox • Decision Cockpit
              </div>
              <div className="ad-inbox-subtitle">
                Product Manager Triage &bull; 9 Operational Items &bull; Direct Urgency Streams
              </div>
            </div>
          </div>

          <div className="ad-inbox-stats-row">
            <span className="st-badge badge-critical font-mono">
              {openCriticalCount} Critical Gated
            </span>
            <span className="st-badge badge-info font-mono">
              {openStandardCount} Standard
            </span>
            <span className="st-badge badge-neutral font-mono">
              {openFyiCount} FYI
            </span>
            <span className="st-badge badge-success font-mono">
              {totalResolvedCount} of 9 Resolved
            </span>
          </div>
        </div>

        {/* Visual Urgency Distribution Bar */}
        <div className="ad-urgency-section">
          <div className="ad-urgency-bar" title="Urgency allocation across 9 items">
            <div
              onClick={() => {
                setActiveLaneFilter(activeLaneFilter === 'critical' ? 'all-lanes' : 'critical');
                setActiveCategoryFilter(null);
              }}
              className="ad-urgency-seg seg-critical"
              style={{ width: `${(criticalItems.length / INBOX_ITEMS.length) * 100}%` }}
              title="Filter Critical Lane (3 items)"
            />
            <div
              onClick={() => {
                setActiveLaneFilter(activeLaneFilter === 'standard' ? 'all-lanes' : 'standard');
                setActiveCategoryFilter(null);
              }}
              className="ad-urgency-seg seg-standard"
              style={{ width: `${(standardItems.length / INBOX_ITEMS.length) * 100}%` }}
              title="Filter Standard Lane (5 items)"
            />
            <div
              onClick={() => {
                setActiveLaneFilter(activeLaneFilter === 'fyi' ? 'all-lanes' : 'fyi');
                setActiveCategoryFilter(null);
              }}
              className="ad-urgency-seg seg-fyi"
              style={{ width: `${(fyiItems.length / INBOX_ITEMS.length) * 100}%` }}
              title="Filter FYI Lane (1 item)"
            />
          </div>
        </div>

        {/* Live SLA Countdown Sentinel Strip */}
        <div className="ad-sla-strip">
          <div className="ad-sla-left">
            <div className="ad-sla-pulse-dot" />
            <span className="ad-sla-text">
              ⏰ 2 Critical Gated items due today — under 4 hours remaining (ISO 26262 Tier 2 SLA Gate)
            </span>
          </div>
          <span className="ad-sla-subtext">
            Release 4.2 Balocco Track Gates: Active Sentinel Sync
          </span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2-COLUMN DECISION WORKSPACE: CATEGORIES SIDEBAR + MAIN FEED       */}
      {/* ================================================================= */}
      <div className="ad-inbox-workspace-card">

        {/* Left Sidebar: Categories Navigation (All 9 Visible, None Hidden) */}
        <aside className="ad-inbox-categories-panel">
          <div className="ad-inbox-categories-header">
            CATEGORIES
          </div>
          <div className="ad-inbox-categories-list">
            {INBOX_CATEGORIES.map(cat => {
              const isActive = activeCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (activeCategoryFilter === cat.id) {
                      setActiveCategoryFilter(null);
                    } else {
                      setActiveCategoryFilter(cat.id);
                      setActiveLaneFilter('all-lanes');
                    }
                  }}
                  className={`ad-inbox-cat-btn ${isActive ? 'active' : ''}`}
                >
                  {isActive && <span className="ad-cat-active-indicator" />}
                  <div className="ad-cat-left">
                    <span className="ad-cat-icon">{getCategoryIcon(cat.icon, 15)}</span>
                    <span className="ad-cat-label">{cat.label}</span>
                  </div>
                  <span className={`ad-cat-badge ${cat.hasCritical ? 'critical' : 'standard'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {activeCategoryFilter !== null && (
            <button
              onClick={() => setActiveCategoryFilter(null)}
              className="ad-cat-view-all-btn"
              title="Show all categories across all lanes"
            >
              <Layers size={13} />
              <span>Show All Decisions (9)</span>
            </button>
          )}
        </aside>

        {/* Right Main Feed Area */}
        <main className="ad-inbox-main-feed">
          {/* Main Feed Header matching User Screenshot */}
          <div className="ad-feed-header">
            <div className="ad-feed-header-left">
              <h3 className="ad-feed-title">
                {activeCategoryObj ? activeCategoryObj.label : 'All Decisions'}
              </h3>
              <p className="ad-feed-subtitle">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                {activeCategoryObj ? ` awaiting review in ${activeCategoryObj.label}` : ' awaiting Human-in-the-Loop review across 3 urgency lanes'}
              </p>
            </div>
            {activeCategoryFilter !== null && (
              <button
                onClick={() => setActiveCategoryFilter(null)}
                className="ad-feed-show-all-chip"
              >
                Clear Filter &bull; Show All (9)
              </button>
            )}
          </div>

          {/* Decision Lanes Container & Ticket Cards */}
          <div className="ad-lanes-wrapper">
            {/* LANE 1: CRITICAL LANE */}
            {(activeLaneFilter === 'all-lanes' || activeLaneFilter === 'critical') && (
              criticalItems.filter(i => filteredItems.some(f => f.id === i.id)).length > 0 ? (
                <div className="ad-lane-section">
                  <div className="ad-lane-header header-critical">
                    <span>● Critical Lane • Immediate Gated Action Required</span>
                    <span>SLA: Under 24h ({criticalItems.filter(i => filteredItems.some(f => f.id === i.id)).length} {criticalItems.filter(i => filteredItems.some(f => f.id === i.id)).length === 1 ? 'item' : 'items'})</span>
                  </div>
                  <div className="ad-lane-cards-list">
                    {criticalItems
                      .filter(item => filteredItems.some(f => f.id === item.id))
                      .map(item => renderTicketCard(item))}
                  </div>
                </div>
              ) : null
            )}

            {/* LANE 2: STANDARD LANE */}
            {(activeLaneFilter === 'all-lanes' || activeLaneFilter === 'standard') && (
              standardItems.filter(i => filteredItems.some(f => f.id === i.id)).length > 0 ? (
                <div className="ad-lane-section">
                  <div className="ad-lane-header header-standard">
                    <span>● Standard Lane • Backlog &amp; Engineering Governance</span>
                    <span>SLA: 2–6 Days ({standardItems.filter(i => filteredItems.some(f => f.id === i.id)).length} {standardItems.filter(i => filteredItems.some(f => f.id === i.id)).length === 1 ? 'item' : 'items'})</span>
                  </div>
                  <div className="ad-lane-cards-list">
                    {standardItems
                      .filter(item => filteredItems.some(f => f.id === item.id))
                      .map(item => renderTicketCard(item))}
                  </div>
                </div>
              ) : null
            )}

            {/* LANE 3: FYI LANE */}
            {(activeLaneFilter === 'all-lanes' || activeLaneFilter === 'fyi') && (
              fyiItems.filter(i => filteredItems.some(f => f.id === i.id)).length > 0 ? (
                <div className="ad-lane-section">
                  <div className="ad-lane-header header-fyi">
                    <span>● FYI Lane • Model &amp; System Telemetry Monitoring</span>
                    <span>Awareness Only ({fyiItems.filter(i => filteredItems.some(f => f.id === i.id)).length} {fyiItems.filter(i => filteredItems.some(f => f.id === i.id)).length === 1 ? 'item' : 'items'})</span>
                  </div>
                  <div className="ad-lane-cards-list">
                    {fyiItems
                      .filter(item => filteredItems.some(f => f.id === item.id))
                      .map(item => renderTicketCard(item))}
                  </div>
                </div>
              ) : null
            )}

            {/* Empty State fallback if lane/category combo has 0 items */}
            {filteredItems.length === 0 && (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active operational items match the selected filter.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ================================================================= */}
      {/* MODAL 1: FULL AUDIT TRAIL MODAL                                   */}
      {/* ================================================================= */}
      {activeAuditModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveAuditModal(null)}>
          <div className="ad-inbox-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--stellantis-action, #0284c7)" />
                <div className="ad-inbox-modal-title">
                  Tamper-Evident Audit Trail — #{activeAuditModal.id.toUpperCase()}
                </div>
              </div>
              <button onClick={() => setActiveAuditModal(null)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {activeAuditModal.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Lifecycle event provenance signed with SHA-256 cryptographic compliance verification.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {activeAuditModal.auditTrail.map((entry, idx) => (
                  <div key={idx} className="ad-modal-audit-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      <span>{entry.timestamp}</span>
                      <strong>{entry.actor}</strong>
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {entry.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveAuditModal(null)} className="ad-btn-action btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: REQUEST EVIDENCE MODAL                                   */}
      {/* ================================================================= */}
      {activeEvidenceModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveEvidenceModal(null)}>
          <div className="ad-inbox-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={18} color="var(--stellantis-action, #0284c7)" />
                <div className="ad-inbox-modal-title">
                  Request Clarifying Evidence
                </div>
              </div>
              <button onClick={() => setActiveEvidenceModal(null)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                Target Requestor: <strong>{activeEvidenceModal.requestor}</strong>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Inquiry for: <em>{activeEvidenceModal.title}</em>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Specify missing documentation or test telemetry required:
                </label>
                <textarea
                  rows={4}
                  value={evidenceNote}
                  onChange={(e) => setEvidenceNote(e.target.value)}
                  placeholder="e.g. Please provide HIL test bench logs for frames 400-600 and sensor Doppler variance under wet track conditions..."
                  className="ad-modal-textarea"
                />
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveEvidenceModal(null)} className="ad-btn-action btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  resolveItem(activeEvidenceModal.id, 'Evidence Requested from Engineering', 'Inquiry Dispatched');
                  setActiveEvidenceModal(null);
                  setEvidenceNote('');
                }}
                className="ad-btn-action btn-primary"
              >
                <span>Dispatch Inquiry</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3: DELEGATION SELECTOR MODAL                                */}
      {/* ================================================================= */}
      {activeDelegateModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveDelegateModal(null)}>
          <div className="ad-inbox-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} color="var(--stellantis-action, #0284c7)" />
                <div className="ad-inbox-modal-title">
                  Delegate Gating Decision
                </div>
              </div>
              <button onClick={() => setActiveDelegateModal(null)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                Re-routing authority for: <strong>{activeDelegateModal.title}</strong>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Select Certified Automotive Co-Signer / Delegate:
                </label>
                <select
                  value={selectedDelegate}
                  onChange={(e) => setSelectedDelegate(e.target.value)}
                  className="ad-modal-select"
                >
                  <option value="Dr. Marco V. (Safety Architecture Lead)">Dr. Marco V. (Lead Functional Safety Engineer · Tier 1)</option>
                  <option value="Stefan R. (Lead Architect)">Stefan R. (Lead Systems Architecture · Tier 2)</option>
                  <option value="Dr. Elena K. (Head of AD AI Research)">Dr. Elena K. (Head of AD Perception R&amp;D)</option>
                </select>
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveDelegateModal(null)} className="ad-btn-action btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  resolveItem(activeDelegateModal.id, `Delegated to ${selectedDelegate.split(' ')[0]}`, 'Delegated');
                  setActiveDelegateModal(null);
                }}
                className="ad-btn-action btn-primary"
              >
                <span>Confirm Delegation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 4: ITEM 1 DUAL-KEY CO-SIGNATURE MODAL                       */}
      {/* ================================================================= */}
      {activeCoSignModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveCoSignModal(false)}>
          <div className="ad-inbox-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#10b981" />
                <div className="ad-inbox-modal-title">
                  ISO 26262 Safety Tier 2 Dual-Key Sign-Off
                </div>
              </div>
              <button onClick={() => setActiveCoSignModal(false)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                ASIL-D Exception: <strong>Radar-Vision Fusion Timeout (25ms &rarr; 35ms)</strong>
              </div>
              <div className="ad-modal-notice-box">
                <ShieldCheck size={16} color="#10b981" />
                <div>
                  <strong>Primary Safety Co-Signer Verified:</strong> Dr. Marco V. (Pre-Signed on Balocco Rig 3 Telemetry · Passkey verified).
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Product Manager Authorization Key:
                </label>
                <input
                  type="text"
                  value={coSignPin}
                  onChange={(e) => setCoSignPin(e.target.value)}
                  className="ad-modal-input font-mono"
                />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Authorizing this exception commits Release 4.2 to a 30-day telemetry monitoring window.
                </span>
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveCoSignModal(false)} className="ad-btn-action btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  resolveItem('inbox-1', 'Approved (Gated Exception Granted — 30-Day Monitoring)', 'Approved');
                  setActiveCoSignModal(false);
                }}
                className="ad-btn-action btn-primary"
              >
                <span>Authorize &amp; Sign Exception</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 5: REJECTION REASON MODAL (ITEMS 1 & 3)                     */}
      {/* ================================================================= */}
      {activeRejectModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveRejectModal(null)}>
          <div className="ad-inbox-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ThumbsDown size={18} color="#ef4444" />
                <div className="ad-inbox-modal-title">
                  Record Rejection Rationale
                </div>
              </div>
              <button onClick={() => setActiveRejectModal(null)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                Target Item: <strong>{activeRejectModal.title}</strong>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Enter formal engineering rejection rationale:
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="ad-modal-textarea"
                />
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveRejectModal(null)} className="ad-btn-action btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  resolveItem(activeRejectModal.id, `Rejected: ${rejectionReason.slice(0, 32)}...`, 'Rejected');
                  setActiveRejectModal(null);
                }}
                className="ad-btn-action btn-danger"
              >
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 6: ITEM 2 REQUIREMENTS REVISION MODAL                       */}
      {/* ================================================================= */}
      {activeRevisionModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveRevisionModal(false)}>
          <div className="ad-inbox-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={18} color="var(--stellantis-action, #0284c7)" />
                <div className="ad-inbox-modal-title">
                  Send Requirement Back for AI Revision
                </div>
              </div>
              <button onClick={() => setActiveRevisionModal(false)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                The Requirements Review Agent will re-generate Gherkin scenario clauses incorporating your feedback:
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Refinement Prompt Feedback:
                </label>
                <textarea
                  rows={3}
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  className="ad-modal-textarea"
                />
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveRevisionModal(false)} className="ad-btn-action btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  resolveItem('inbox-2', 'Revision Feedback Dispatched to AI Requirements Agent');
                  setActiveRevisionModal(false);
                }}
                className="ad-btn-action btn-primary"
              >
                <span>Dispatch Prompt to Agent</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 7: ITEM 2 ISO 26262 CONFLICT ANALYSIS MODAL                 */}
      {/* ================================================================= */}
      {activeConflictModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveConflictModal(false)}>
          <div className="ad-inbox-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#10b981" />
                <div className="ad-inbox-modal-title">
                  Automated ISO 26262 Conflict Analysis Matrix
                </div>
              </div>
              <button onClick={() => setActiveConflictModal(false)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div className="ad-conflict-summary-box">
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>
                  ✓ Zero Hard Rule Conflicts Detected
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Cross-verified against 42 safety requirements in L2+ Systems Specification Rev 6.
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem' }}>
                <div className="ad-conflict-item pass">
                  <span>Part 3 Clause 6 Hazard Analysis &amp; Risk Assessment (HARA)</span>
                  <strong style={{ color: '#10b981' }}>PASS</strong>
                </div>
                <div className="ad-conflict-item pass">
                  <span>Part 4 Clause 7 Technical Safety Concept Consistency</span>
                  <strong style={{ color: '#10b981' }}>PASS</strong>
                </div>
                <div className="ad-conflict-item pass">
                  <span>Euro NCAP 2026 Evasive Steering Protocol v3.4</span>
                  <strong style={{ color: '#10b981' }}>PASS (99.4%)</strong>
                </div>
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveConflictModal(false)} className="ad-btn-action btn-secondary">
                Close
              </button>
              <button
                onClick={() => {
                  resolveItem('inbox-2', 'Requirement Approved Post-Conflict Analysis');
                  setActiveConflictModal(false);
                }}
                className="ad-btn-action btn-primary"
              >
                <span>Approve Requirement Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 8: MITIGATION PATH SELECTOR (ITEMS 3 & 6)                   */}
      {/* ================================================================= */}
      {activeMitigationModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveMitigationModal(null)}>
          <div className="ad-inbox-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#f59e0b" />
                <div className="ad-inbox-modal-title">
                  {activeMitigationModal === 'item-3' ? 'Choose Mitigation — HIL Coverage Gap (86%)' : 'Choose Mitigation Path — LiDAR SDK Delay'}
                </div>
              </div>
              <button onClick={() => setActiveMitigationModal(null)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Select an automotive risk-mitigation pathway to unblock the release pipeline:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="ad-mitigation-option">
                  <input
                    type="radio"
                    name="mitigation"
                    checked={selectedMitigation === 'emulator'}
                    onChange={() => setSelectedMitigation('emulator')}
                  />
                  <div>
                    <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>1. Synthetic Hardware Replay Pipeline (Recommended)</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Fills coverage gap via 14-day parallel synthetic dataset runs. Zero schedule impact.
                    </div>
                  </div>
                </label>
                <label className="ad-mitigation-option">
                  <input
                    type="radio"
                    name="mitigation"
                    checked={selectedMitigation === 'defer'}
                    onChange={() => setSelectedMitigation('defer')}
                  />
                  <div>
                    <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>2. Defer Milestone to Release 4.3</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Slips verification milestone by 14 calendar days; maintains strict real-hardware rule.
                    </div>
                  </div>
                </label>
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveMitigationModal(null)} className="ad-btn-action btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  const targetId = activeMitigationModal === 'item-3' ? 'inbox-3' : 'inbox-6';
                  resolveItem(targetId, `Mitigation Applied: ${selectedMitigation === 'emulator' ? 'Synthetic Replay Pipeline' : 'Milestone Deferred'}`);
                  setActiveMitigationModal(null);
                }}
                className="ad-btn-action btn-primary"
              >
                <span>Confirm &amp; Apply Mitigation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 9: RELEASE BLOCKER CONFIRMATION (ITEM 3)                    */}
      {/* ================================================================= */}
      {activeBlockReleaseModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveBlockReleaseModal(false)}>
          <div className="ad-inbox-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertOctagon size={18} color="#ef4444" />
                <div className="ad-inbox-modal-title">
                  Block Release 4.2 Candidate Build
                </div>
              </div>
              <button onClick={() => setActiveBlockReleaseModal(false)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                You are about to issue a formal release block for <strong>Release 4.2 Program</strong>.
              </div>
              <div className="ad-modal-notice-box-danger">
                <AlertTriangle size={16} color="#ef4444" />
                <div>
                  This immediately halts the build pipeline in Jenkins / Stellantis CI until HIL Simulation Coverage reaches &ge;90%.
                </div>
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveBlockReleaseModal(false)} className="ad-btn-action btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  resolveItem('inbox-3', 'Release 4.2 Candidate Blocked Pending 90% Coverage', 'Release Blocked');
                  setActiveBlockReleaseModal(false);
                }}
                className="ad-btn-action btn-danger"
              >
                <span>Confirm Release Block</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 10: SPRINT IMPACT SIMULATION MODAL (ITEM 4)                 */}
      {/* ================================================================= */}
      {activeSimulateModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveSimulateModal(false)}>
          <div className="ad-inbox-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={18} color="var(--stellantis-action, #0284c7)" />
                <div className="ad-inbox-modal-title">
                  Sprint Reprioritization Impact Simulation
                </div>
              </div>
              <button onClick={() => setActiveSimulateModal(false)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Predictive velocity model computed across Sprint 24.3 capacity:
              </div>
              <div className="ad-sim-grid">
                <div className="ad-sim-metric">
                  <span className="ad-sim-metric-val" style={{ color: '#10b981' }}>-2 Days</span>
                  <span className="ad-sim-metric-lbl">Milestone 3 Track Delivery</span>
                </div>
                <div className="ad-sim-metric">
                  <span className="ad-sim-metric-val" style={{ color: '#0284c7' }}>0.0%</span>
                  <span className="ad-sim-metric-lbl">Regression Risk to AD-115</span>
                </div>
                <div className="ad-sim-metric">
                  <span className="ad-sim-metric-val" style={{ color: '#8b5cf6' }}>+12 SP</span>
                  <span className="ad-sim-metric-lbl">Perception Team Throughput</span>
                </div>
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveSimulateModal(false)} className="ad-btn-action btn-secondary">
                Close
              </button>
              <button
                onClick={() => {
                  resolveItem('inbox-4', 'Backlog Reprioritized (AD-108 Moved to Top of Sprint 24.3)');
                  setActiveSimulateModal(false);
                }}
                className="ad-btn-action btn-primary"
              >
                <span>Apply Backlog Reprioritization</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 11: ASIL-D COMPLIANCE CHECKLIST (ITEM 5)                    */}
      {/* ================================================================= */}
      {activeChecklistModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveChecklistModal(false)}>
          <div className="ad-inbox-modal-dialog" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#10b981" />
                <div className="ad-inbox-modal-title">
                  ASIL-D Quarterly Compliance Verification (12 Items)
                </div>
              </div>
              <button onClick={() => setActiveChecklistModal(false)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  Interactive verification scorecard for ISO 26262 audit compliance.
                </span>
                <span className="st-badge badge-success font-mono">
                  {Object.values(checklistChecks).filter(Boolean).length} / 12 Verified
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto' }}>
                {[
                  { id: 1, title: 'ISO 26262 Part 4 Clause 7 Hardware metrics integrity', pre: true },
                  { id: 2, title: 'Inference cycle hard deadline (<25.0ms) telemetry audit', pre: true },
                  { id: 3, title: 'Radar Doppler point density consistency (>10 pts/frame)', pre: true },
                  { id: 4, title: 'De-escalation fail-operational fallback verified', pre: false },
                  { id: 5, title: 'Sovereign cloud VPC European data residency certificate', pre: false },
                  { id: 6, title: 'Tool qualification record (TCL 2) verified for model runtime', pre: false },
                  { id: 7, title: 'Static MISRA & AUTOSAR linter zero-critical violations', pre: false },
                  { id: 8, title: 'Hardware fault injection simulation log reviewed', pre: false },
                  { id: 9, title: 'Dual-key co-signer matrix active for Release 4.2', pre: false },
                  { id: 10, title: 'UNECE R157 Cybersecurity lifecycle compliance audit', pre: false },
                  { id: 11, title: 'AI model drift threshold watchdog active in MLOps', pre: false },
                  { id: 12, title: 'Final systems safety engineering concurrence signed', pre: false }
                ].map(checkItem => (
                  <label key={checkItem.id} className="ad-checklist-row">
                    <input
                      type="checkbox"
                      checked={checklistChecks[checkItem.id] || false}
                      onChange={(e) => setChecklistChecks({ ...checklistChecks, [checkItem.id]: e.target.checked })}
                    />
                    <div style={{ flex: 1, color: 'var(--text-primary)' }}>
                      {checkItem.id}. {checkItem.title}
                    </div>
                    {checkItem.pre && (
                      <span className="st-badge badge-success" style={{ fontSize: '0.62rem' }}>
                        Auto-Verified
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveChecklistModal(false)} className="ad-btn-action btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  resolveItem('inbox-5', `Checklist Submitted & Signed (${Object.values(checklistChecks).filter(Boolean).length}/12 Verified)`);
                  setActiveChecklistModal(false);
                }}
                className="ad-btn-action btn-primary"
              >
                <span>Submit &amp; Sign Off Checklist</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 12: ROLLBACK BLAST RADIUS ANALYSIS (ITEM 7)                 */}
      {/* ================================================================= */}
      {activeRollbackModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveRollbackModal(false)}>
          <div className="ad-inbox-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Landmark size={18} color="var(--stellantis-action, #0284c7)" />
                <div className="ad-inbox-modal-title">
                  Policy Rollback Blast-Radius Risk Analysis
                </div>
              </div>
              <button onClick={() => setActiveRollbackModal(false)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Sensor Fusion Safety Policy v3.2 &rarr; Fallback to v3.1 Impact:
              </div>
              <div className="ad-conflict-summary-box">
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>
                  ✓ Instant Revert Zero-Downtime Guarantee
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Shadow policy v3.1 remains hot-standby across all 18 vehicle edge nodes. Revert latency is &lt;1.2 seconds.
                </div>
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveRollbackModal(false)} className="ad-btn-action btn-secondary">
                Close
              </button>
              <button
                onClick={() => {
                  resolveItem('inbox-7', 'Policy v3.2 Signed Off Post-Rollback Verification');
                  setActiveRollbackModal(false);
                }}
                className="ad-btn-action btn-primary"
              >
                <span>Proceed to Sign Off &amp; Deploy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 13: CUSTOM ALERT THRESHOLD SLIDER (ITEM 8)                  */}
      {/* ================================================================= */}
      {activeThresholdModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveThresholdModal(false)}>
          <div className="ad-inbox-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="var(--stellantis-action, #0284c7)" />
                <div className="ad-inbox-modal-title">
                  Configure Model Drift Watchdog Threshold
                </div>
              </div>
              <button onClick={() => setActiveThresholdModal(false)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Target Foundation Model: <strong>VisionTransformer v2.4.1-Edge (Orin NPU)</strong>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 700 }}>
                  <span>Drift Escalation Trigger:</span>
                  <span style={{ color: '#ef4444' }}>{driftThreshold.toFixed(1)}% IoU Decline</span>
                </div>
                <input
                  type="range"
                  min="-10.0"
                  max="-1.0"
                  step="0.5"
                  value={driftThreshold}
                  onChange={(e) => setDriftThreshold(parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  <span>-1.0% (Ultra-Sensitive)</span>
                  <span>-5.0% (Standard Auto-Escalate)</span>
                  <span>-10.0% (Relaxed)</span>
                </div>
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveThresholdModal(false)} className="ad-btn-action btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  resolveItem('inbox-8', `Threshold Set to ${driftThreshold.toFixed(1)}% IoU`);
                  setActiveThresholdModal(false);
                }}
                className="ad-btn-action btn-primary"
              >
                <span>Save Watchdog Threshold</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 14: EDGE PROMPT RE-GENERATION (ITEM 9)                      */}
      {/* ================================================================= */}
      {activeEdgePromptModal && (
        <div className="ad-inbox-modal-backdrop" onClick={() => setActiveEdgePromptModal(false)}>
          <div className="ad-inbox-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-inbox-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={18} color="#8b5cf6" />
                <div className="ad-inbox-modal-title">
                  Re-Prompt Synthetic Scenario Generation Agent
                </div>
              </div>
              <button onClick={() => setActiveEdgePromptModal(false)} className="ad-inbox-modal-close">
                <X size={18} />
              </button>
            </div>
            <div className="ad-inbox-modal-body">
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Configure adverse perception stress-testing parameters for Batch #421:
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Adverse Weather &amp; Occlusion Matrix:
                </label>
                <input
                  type="text"
                  value={edgePromptWeather}
                  onChange={(e) => setEdgePromptWeather(e.target.value)}
                  className="ad-modal-input"
                />
              </div>
            </div>
            <div className="ad-inbox-modal-footer">
              <button onClick={() => setActiveEdgePromptModal(false)} className="ad-btn-action btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  resolveItem('inbox-9', 'Batch #421 Re-Prompt Dispatched to Synthetic Agent');
                  setActiveEdgePromptModal(false);
                }}
                className="ad-btn-action btn-primary"
              >
                <span>Dispatch Prompt &amp; Synthesize</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // =========================================================================
  // HELPER: RENDER PERFORATED BOARDING PASS TICKET CARD
  // =========================================================================
  function renderTicketCard(item, isKanban = false) {
    const isResolved = Boolean(resolutions[item.id]);
    const isExpanded = Boolean(expandedDrawers[item.id]);

    return (
      <div
        key={item.id}
        className={`ad-ticket-card card-${item.lane} ${isResolved ? 'resolved' : ''} ${isKanban ? 'kanban-compact' : ''}`}
      >
        {/* Two-Half Split Grid */}
        <div className="ad-ticket-split">

          {/* Left Half: Context & Identity Stub with Perforation */}
          <div className="ad-ticket-left ticket-perforation">
            <div className="ad-ticket-meta-top">
              <span className="ad-type-badge">{item.typeLabel}</span>
              <span className="ad-id-badge">#{item.id.toUpperCase()}</span>
            </div>

            <div className="ad-risk-pills">
              <span
                className={`ad-risk-pill ${
                  item.priority === 'Critical'
                    ? 'critical-high'
                    : item.priority === 'High' && item.riskLevel === 'Low'
                    ? 'high-low'
                    : item.lane === 'fyi'
                    ? 'monitoring'
                    : 'medium-medium'
                }`}
              >
                {item.priorityPill}
              </span>
            </div>

            <div className="ad-ticket-requestor">
              Requestor: <strong>{item.requestor}</strong>
            </div>

            <div className="ad-ticket-scope">
              {item.project} &bull; {item.portfolio}
            </div>
          </div>

          {/* Right Half: Decision Core */}
          <div className="ad-ticket-right">
            <div>
              <div className="ad-ticket-headline-row">
                <div className="ad-ticket-title">{item.title}</div>
                <span
                  className={`ad-due-badge ${
                    item.dueBadgeType === 'critical'
                      ? 'badge-due-today'
                      : item.dueBadgeType === 'warning'
                      ? 'badge-due-tomorrow'
                      : item.dueBadgeType === 'info'
                      ? 'badge-due-ongoing'
                      : 'badge-due-future'
                  }`}
                >
                  Due {item.dueDate}
                </span>
              </div>

              <div className="ad-decision-box" style={{ marginTop: '8px' }}>
                <strong>Required Decision:</strong> {item.requiredDecision}
              </div>
            </div>

            {/* If resolved, show resolution ribbon */}
            {isResolved ? (
              <div className="ad-resolution-banner">
                <div className="ad-res-left">
                  <Check size={16} />
                  <span>
                    Status: <strong>{resolutions[item.id].actionLabel}</strong> ({resolutions[item.id].timestamp})
                  </span>
                </div>
                <button
                  onClick={() => handleUndoResolution(item.id)}
                  className="ad-undo-btn"
                >
                  <RotateCcw size={12} />
                  <span>Undo</span>
                </button>
              </div>
            ) : (
              /* Action Buttons */
              <div className="ad-actions-row">
                <div className="ad-actions-left">
                  {item.actions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleResolveAction(item, action)}
                      className={`ad-btn-action btn-${action.variant}`}
                    >
                      {action.id === 'view_audit' && <FileText size={12} />}
                      {action.id === 'request_evidence' && <Send size={12} />}
                      {action.id === 'inspect_level6' && <ArrowRight size={12} />}
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>

                <div className="ad-actions-right">
                  <button
                    onClick={() => toggleDrawer(item.id)}
                    className="ad-drawer-toggle-btn"
                    title="Toggle Evidence & Governance Details"
                  >
                    <span>{isExpanded ? 'Collapse' : 'Inspect Details & Evidence'}</span>
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Evidence & Governance Drawer */}
        {isExpanded && (
          <div className="ad-ticket-drawer">
            {/* Supporting Evidence Documents */}
            <div className="ad-evidence-section">
              <div className="ad-section-label">Supporting Evidence &amp; Artifacts:</div>
              <div className="ad-evidence-grid">
                {item.supportingEvidence.map((doc, idx) => (
                  <div key={idx} className="ad-evidence-item">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={13} color="var(--stellantis-action, #0284c7)" />
                      <span style={{ fontWeight: 600 }}>{doc.name}</span>
                    </span>
                    <span className="st-badge badge-info" style={{ fontSize: '0.62rem' }}>
                      {doc.format} &bull; {doc.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI-Generated Recommendation */}
            <div className="ad-ai-rec-box">
              <div className="ad-ai-rec-header">
                <div className="ad-ai-rec-title">
                  <Sparkles size={14} />
                  <span>AI Recommendation: {item.aiRecommendation.action}</span>
                </div>
                <span className="st-badge badge-purple" style={{ fontSize: '0.65rem' }}>
                  Engine: {item.aiRecommendation.model} ({Math.round(item.aiRecommendation.confidence * 100)}% Confidence)
                </span>
              </div>
              <div className="ad-ai-rec-rationale">
                {item.aiRecommendation.rationale}
              </div>
            </div>

            {/* Decision History & Audit Trail */}
            <div className="ad-history-trail-grid">
              <div className="ad-timeline-box">
                <div className="ad-section-label">Decision History &amp; Precedent:</div>
                {item.decisionHistory.map((hist, idx) => (
                  <div key={idx} className="ad-timeline-item">
                    <span className="ad-timeline-time">{hist.date}</span>
                    <span className="ad-timeline-action">{hist.note}</span>
                  </div>
                ))}
              </div>

              <div className="ad-timeline-box">
                <div className="ad-section-label">Lifecycle Audit Trail:</div>
                {item.auditTrail.slice(0, 3).map((trail, idx) => (
                  <div key={idx} className="ad-timeline-item">
                    <span className="ad-timeline-time">{trail.timestamp} &bull; {trail.actor}</span>
                    <span className="ad-timeline-action">{trail.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
