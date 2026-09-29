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
  Info,
  Lock
} from 'lucide-react';
import '../engineeringExperience.css';
import { engineering52InboxItems } from '../mockData.js';

/**
 * PRD §5.2 — Workflow Inbox (Dedicated Experience Zone Sub-Tab 2)
 * Executive Human-in-the-Loop Decision Cockpit for Alex (Chief AI Officer)
 * Completely independent from domain-level WorkflowInbox.jsx
 */
export default function EngineeringExpInbox({ onInspectLevel6 }) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [resolutions, setResolutions] = useState({});
  const [expandedDrawers, setExpandedDrawers] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Interactive Modals
  const [activeAuditModal, setActiveAuditModal] = useState(null);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState(null);
  const [evidenceNote, setEvidenceNote] = useState('');
  const [activeDelegateModal, setActiveDelegateModal] = useState(null);
  const [selectedDelegate, setSelectedDelegate] = useState('Dr. H. Becker (Lead Functional Safety Architect)');
  const [activeCoSignModal, setActiveCoSignModal] = useState(false);
  const [coSignPin, setCoSignPin] = useState('STLA-CAIO-2026');
  const [activeRejectModal, setActiveRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Safety margin does not satisfy ISO 26262 Part 6 Clause 7 tolerance.');
  const [activeRevisionModal, setActiveRevisionModal] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('Provide cycle-accurate memory profiler trace demonstrating zero leak under 120km/h test bench load.');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const toggleDrawer = (id) => {
    setExpandedDrawers(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
    showToast(`Decision Authorized: ${actionLabel}`);
  };

  const handleUndoResolution = (id) => {
    setResolutions(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    showToast('Decision revoked. Item returned to executive queue.');
  };

  // 9 PRD §5.2 Decision Categories
  const CATEGORIES = [
    { id: 'all', label: 'All Categories', count: engineering52InboxItems.length, icon: Layers },
    { id: 'Approvals', label: 'Approvals', count: engineering52InboxItems.filter(i => i.category === 'Approvals').length, icon: CheckCircle2 },
    { id: 'Reviews', label: 'Reviews', count: engineering52InboxItems.filter(i => i.category === 'Reviews').length, icon: Eye },
    { id: 'Exceptions', label: 'Exceptions', count: engineering52InboxItems.filter(i => i.category === 'Exceptions').length, icon: AlertTriangle },
    { id: 'Recommendations', label: 'Recommendations', count: engineering52InboxItems.filter(i => i.category === 'Recommendations').length, icon: Lightbulb },
    { id: 'Assigned actions', label: 'Assigned Actions', count: engineering52InboxItems.filter(i => i.category === 'Assigned actions').length, icon: Pin },
    { id: 'Escalations', label: 'Escalations', count: engineering52InboxItems.filter(i => i.category === 'Escalations').length, icon: AlertOctagon },
    { id: 'Governance decisions', label: 'Governance Decisions', count: engineering52InboxItems.filter(i => i.category === 'Governance decisions').length, icon: Landmark },
    { id: 'System-generated alerts', label: 'System Alerts', count: engineering52InboxItems.filter(i => i.category === 'System-generated alerts').length, icon: Bell },
    { id: 'Agent-generated outputs requiring validation', label: 'Agent Outputs', count: engineering52InboxItems.filter(i => i.category === 'Agent-generated outputs requiring validation').length, icon: Bot }
  ];

  // Filtering
  const filteredItems = engineering52InboxItems.filter((item) => {
    return activeCategoryFilter === 'all' || item.category === activeCategoryFilter;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          background: 'var(--badge-success-bg)',
          color: 'var(--badge-success-text)',
          border: '1px solid var(--badge-success-border)',
          borderRadius: '8px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.875rem',
          fontWeight: 600,
          boxShadow: 'var(--shadow-md)'
        }}>
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 18px'
      }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Workflow Inbox — Executive Governance Console</span>
            <span className="st-badge badge-purple" style={{ fontSize: '0.65rem' }}>Executive Console</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            Single pane of authority for Approvals, Reviews, Exceptions, Recommendations, Actions, Escalations, Governance, and Agent Outputs.
          </div>
        </div>
      </div>

      {/* 9 Category Pills Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategoryFilter === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: isActive ? 'var(--stellantis-navy)' : 'var(--bg-surface)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--stellantis-navy)' : '1px solid var(--border-color)',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={12} />
              <span>{cat.label}</span>
              <span style={{
                fontSize: '0.62rem',
                padding: '1px 5px',
                borderRadius: '9999px',
                background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-surface-secondary)'
              }}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Decision Items Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredItems.map((item) => {
          const resolution = resolutions[item.id];
          const isExpanded = !!expandedDrawers[item.id];

          return (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-surface)',
                border: item.urgencyLane === 'critical' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)',
                borderLeft: item.urgencyLane === 'critical' ? '4px solid #ef4444' : '4px solid var(--stellantis-action)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: 'var(--shadow-sm)',
                opacity: resolution ? 0.78 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {/* Item Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className={`st-badge ${
                      item.urgencyLane === 'critical' ? 'badge-critical' :
                      item.urgencyLane === 'standard' ? 'badge-info' : 'badge-purple'
                    }`} style={{ fontSize: '0.65rem' }}>
                      {item.category}
                    </span>
                    <span className="st-badge badge-high" style={{ fontSize: '0.65rem' }}>
                      {item.riskLevel}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Origin: <strong>{item.originatingSystem}</strong>
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Project: <strong>{item.project}</strong> ({item.portfolio})
                    </span>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {item.title}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 700, color: item.urgencyLane === 'critical' ? '#ef4444' : 'var(--text-muted)' }}>
                    <Clock size={13} />
                    <span>{item.dueDate}</span>
                  </div>
                  {resolution && (
                    <span className="st-badge badge-success" style={{ fontSize: '0.65rem' }}>
                      ✓ {resolution.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Required Decision Box */}
              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '0.76rem',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  <strong style={{ color: 'var(--stellantis-action)' }}>Required Decision: </strong>
                  <span>{item.requiredDecision}</span>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Requestor: <strong>{item.requestor}</strong>
                  </div>
                </div>

                <button
                  onClick={() => toggleDrawer(item.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--stellantis-action)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{isExpanded ? 'Hide Evidence' : 'Supporting Evidence'}</span>
                  {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
              </div>

              {/* Supporting Evidence Expandable Drawer */}
              {isExpanded && item.supportingEvidence && (
                <div style={{
                  background: '#040b17',
                  border: '1px solid #1e3562',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '0.72rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 800 }}>AUDIT EVIDENCE ARTIFACT:</span>
                    <span style={{ color: '#4ade80', fontWeight: 700 }}>{item.supportingEvidence.metricHighlight}</span>
                  </div>
                  <div style={{ color: '#e2e8f0' }}>{item.supportingEvidence.summary}</div>
                  <pre style={{
                    margin: 0,
                    padding: '8px 10px',
                    background: '#020617',
                    borderRadius: '4px',
                    color: '#a5f3fc',
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                    overflowX: 'auto'
                  }}>
                    {item.supportingEvidence.codeSnippet}
                  </pre>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.65rem' }}>
                    <span>Ledger Signature: {item.supportingEvidence.auditHash}</span>
                    {onInspectLevel6 && (
                      <button
                        onClick={() => onInspectLevel6()}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#38bdf8',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <span>Inspect in Level 6 Trace</span>
                        <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '6px' }}>
                {resolution ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>
                      ✓ Decision Executed: {resolution.actionLabel} ({resolution.timestamp})
                    </span>
                    <button
                      onClick={() => handleUndoResolution(item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Undo Action
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {item.actions.map((act) => {
                      if (act.id === 'approve_gated') {
                        return (
                          <button
                            key={act.id}
                            onClick={() => setActiveCoSignModal(true)}
                            className="st-btn st-btn-primary"
                            style={{ padding: '6px 14px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                          >
                            <Lock size={12} />
                            <span>{act.label}</span>
                          </button>
                        );
                      }
                      if (act.id === 'block_release' || act.type === 'danger') {
                        return (
                          <button
                            key={act.id}
                            onClick={() => setActiveRejectModal(item)}
                            className="st-btn"
                            style={{ padding: '6px 14px', fontSize: '0.74rem', background: '#ef4444', color: '#ffffff', border: 'none', cursor: 'pointer' }}
                          >
                            <span>{act.label}</span>
                          </button>
                        );
                      }
                      if (act.id === 'delegate') {
                        return (
                          <button
                            key={act.id}
                            onClick={() => setActiveDelegateModal(item)}
                            className="st-btn st-btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <UserCheck size={12} />
                            <span>{act.label}</span>
                          </button>
                        );
                      }
                      if (act.id === 'request_evidence') {
                        return (
                          <button
                            key={act.id}
                            onClick={() => setActiveEvidenceModal(item)}
                            className="st-btn st-btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <FileText size={12} />
                            <span>{act.label}</span>
                          </button>
                        );
                      }
                      if (act.id === 'view_audit') {
                        return (
                          <button
                            key={act.id}
                            onClick={() => setActiveAuditModal(item)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Eye size={12} />
                            <span>{act.label}</span>
                          </button>
                        );
                      }
                      if (act.id === 'send_back') {
                        return (
                          <button
                            key={act.id}
                            onClick={() => setActiveRevisionModal(true)}
                            className="st-btn st-btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.74rem' }}
                          >
                            <span>{act.label}</span>
                          </button>
                        );
                      }

                      // Default direct resolve button
                      return (
                        <button
                          key={act.id}
                          onClick={() => resolveItem(item.id, act.label, 'Approved')}
                          className="st-btn st-btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.74rem' }}
                        >
                          <span>{act.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          INTERACTIVE ACTION MODALS
          ========================================================================= */}

      {/* Co-Sign Modal (Dual-Key) */}
      {activeCoSignModal && (
        <div className="ad-modal-backdrop" onClick={() => setActiveCoSignModal(false)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#0284c7" />
                <span className="ad-modal-title">Dual-Key Executive Cryptographic Authorization</span>
              </div>
              <button onClick={() => setActiveCoSignModal(false)} className="ad-modal-close"><X size={16} /></button>
            </div>
            <div className="ad-modal-body">
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                You are executing a Tier-1 production gate freeze for <strong>STLA Large SDV Platform Phase 2</strong>.
                Dual-key co-signature is mandated with Dr. H. Becker (Lead Safety Architect).
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Enter Hardware Token or Cryptographic PIN:
                </label>
                <input
                  type="text"
                  value={coSignPin}
                  onChange={(e) => setCoSignPin(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace',
                    fontWeight: 700
                  }}
                />
              </div>
            </div>
            <div className="ad-modal-footer">
              <button onClick={() => setActiveCoSignModal(false)} className="st-btn st-btn-secondary">Cancel</button>
              <button
                onClick={() => {
                  resolveItem('inbox-52-1', 'ASIL-D Microkernel Dual-Key Frozen & Authorized', 'Approved');
                  setActiveCoSignModal(false);
                }}
                className="st-btn st-btn-primary"
              >
                Confirm Dual-Key Authorization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject / Block Modal */}
      {activeRejectModal && (
        <div className="ad-modal-backdrop" onClick={() => setActiveRejectModal(null)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertOctagon size={18} color="#ef4444" />
                <span className="ad-modal-title">Reject Decision / Block Gate</span>
              </div>
              <button onClick={() => setActiveRejectModal(null)} className="ad-modal-close"><X size={16} /></button>
            </div>
            <div className="ad-modal-body">
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Item: <strong>{activeRejectModal.title}</strong>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Mandatory Governance Rejection Rationale:
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '0.76rem'
                  }}
                />
              </div>
            </div>
            <div className="ad-modal-footer">
              <button onClick={() => setActiveRejectModal(null)} className="st-btn st-btn-secondary">Cancel</button>
              <button
                onClick={() => {
                  resolveItem(activeRejectModal.id, `Gate Blocked: ${rejectionReason.slice(0, 40)}...`, 'Blocked');
                  setActiveRejectModal(null);
                }}
                className="st-btn"
                style={{ background: '#ef4444', color: '#ffffff', border: 'none', padding: '6px 14px' }}
              >
                Block Release Gate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delegate Modal */}
      {activeDelegateModal && (
        <div className="ad-modal-backdrop" onClick={() => setActiveDelegateModal(null)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} color="#8b5cf6" />
                <span className="ad-modal-title">Delegate Decision Authority</span>
              </div>
              <button onClick={() => setActiveDelegateModal(null)} className="ad-modal-close"><X size={16} /></button>
            </div>
            <div className="ad-modal-body">
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Reassigning: <strong>{activeDelegateModal.title}</strong>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Select Certified Delegate:
                </label>
                <select
                  value={selectedDelegate}
                  onChange={(e) => setSelectedDelegate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '0.76rem'
                  }}
                >
                  <option value="Dr. H. Becker (Lead Functional Safety Architect)">Dr. H. Becker (Lead Functional Safety Architect)</option>
                  <option value="M. Rossi (Connected Platform Head)">M. Rossi (Connected Platform Head)</option>
                  <option value="C. Dupont (Digital Cockpit Director)">C. Dupont (Digital Cockpit Director)</option>
                  <option value="A. Moretti (Powertrain SW Lead)">A. Moretti (Powertrain SW Lead)</option>
                  <option value="J. Laurent (SWAT Memory Squad Lead)">J. Laurent (SWAT Memory Squad Lead)</option>
                </select>
              </div>
            </div>
            <div className="ad-modal-footer">
              <button onClick={() => setActiveDelegateModal(null)} className="st-btn st-btn-secondary">Cancel</button>
              <button
                onClick={() => {
                  resolveItem(activeDelegateModal.id, `Delegated to ${selectedDelegate.split(' ')[0]} ${selectedDelegate.split(' ')[1]}`, 'Delegated');
                  setActiveDelegateModal(null);
                }}
                className="st-btn st-btn-primary"
              >
                Confirm Delegation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Evidence Modal */}
      {activeEvidenceModal && (
        <div className="ad-modal-backdrop" onClick={() => setActiveEvidenceModal(null)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#0284c7" />
                <span className="ad-modal-title">Request Additional Safety / Engineering Evidence</span>
              </div>
              <button onClick={() => setActiveEvidenceModal(null)} className="ad-modal-close"><X size={16} /></button>
            </div>
            <div className="ad-modal-body">
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Target System: <strong>{activeEvidenceModal.originatingSystem}</strong> (Requestor: {activeEvidenceModal.requestor})
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Specify Required Telemetry / Artifacts:
                </label>
                <textarea
                  rows={3}
                  value={evidenceNote}
                  onChange={(e) => setEvidenceNote(e.target.value)}
                  placeholder="e.g. Provide cycle-accurate Valgrind heap trace or CAN bus jitter analysis..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '0.76rem'
                  }}
                />
              </div>
            </div>
            <div className="ad-modal-footer">
              <button onClick={() => setActiveEvidenceModal(null)} className="st-btn st-btn-secondary">Cancel</button>
              <button
                onClick={() => {
                  showToast('Evidence Request Dispatched to Engineering Squad Jira Ticket');
                  setActiveEvidenceModal(null);
                }}
                className="st-btn st-btn-primary"
              >
                Dispatch Evidence Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Modal */}
      {activeAuditModal && (
        <div className="ad-modal-backdrop" onClick={() => setActiveAuditModal(null)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} color="#8b5cf6" />
                <span className="ad-modal-title">Cryptographic Audit Trail ({activeAuditModal.id})</span>
              </div>
              <button onClick={() => setActiveAuditModal(null)} className="ad-modal-close"><X size={16} /></button>
            </div>
            <div className="ad-modal-body">
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Title: <strong>{activeAuditModal.title}</strong>
              </div>
              <table className="ad-modal-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ color: 'var(--text-muted)' }}>2026-09-13 14:15 CET</td>
                    <td>CI/CD Tekton Pipeline</td>
                    <td>Ticket Created via Automated Gate</td>
                    <td><span className="st-badge badge-info">Opened</span></td>
                  </tr>
                  <tr>
                    <td style={{ color: 'var(--text-muted)' }}>2026-09-13 15:20 CET</td>
                    <td>Dr. H. Becker</td>
                    <td>Reviewed MISRA Compliance (99.4%)</td>
                    <td><span className="st-badge badge-success">Verified</span></td>
                  </tr>
                  <tr>
                    <td style={{ color: 'var(--text-muted)' }}>2026-09-13 16:00 CET</td>
                    <td>Alex (CAIO)</td>
                    <td>Pending Final Dual-Key Executive Sign-off</td>
                    <td><span className="st-badge badge-warning">Awaiting</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="ad-modal-footer">
              <button onClick={() => setActiveAuditModal(null)} className="st-btn st-btn-primary">Close Audit Trail</button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {activeRevisionModal && (
        <div className="ad-modal-backdrop" onClick={() => setActiveRevisionModal(false)}>
          <div className="ad-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={18} color="#f59e0b" />
                <span className="ad-modal-title">Send Back for Revision</span>
              </div>
              <button onClick={() => setActiveRevisionModal(false)} className="ad-modal-close"><X size={16} /></button>
            </div>
            <div className="ad-modal-body">
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Target: Software Architecture Working Group
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Executive Feedback &amp; Revision Mandate:
                </label>
                <textarea
                  rows={3}
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '0.76rem'
                  }}
                />
              </div>
            </div>
            <div className="ad-modal-footer">
              <button onClick={() => setActiveRevisionModal(false)} className="st-btn st-btn-secondary">Cancel</button>
              <button
                onClick={() => {
                  resolveItem('inbox-52-2', 'Revision Mandated & Dispatched', 'Revision Requested');
                  setActiveRevisionModal(false);
                }}
                className="st-btn st-btn-primary"
              >
                Send Revision Mandate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
