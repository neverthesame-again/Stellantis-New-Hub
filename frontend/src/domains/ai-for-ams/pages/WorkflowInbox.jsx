import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ShieldAlert,
  Filter,
  Clock,
  ShieldCheck,
  Bot,
  Zap,
  TrendingUp,
  GitPullRequest,
  RefreshCw
} from 'lucide-react';
import { useAmsStudio } from '../state/useAmsStudio';
import { canDecideLinkedApproval } from '../state/amsStudioReducer';
import { INBOX_DECISION, INBOX_DECISION_STATUS } from '../state/constants';
import { useAmsNavigation } from '../navigation/useAmsNavigation';
import { AMS_SUBPAGE } from '../navigation/amsRoutes';
import { INBOX_LINK_AGENT_APPROVAL, INBOX_LINK_RUN_APPROVAL } from '../model/agentRecords';
import { RUN_KIND } from '../model/runModel';
import Toast from '../components/Toast';
import { useToast } from '../components/useToast';

/**
 * Workflow Inbox — the single approval queue for AI for AMS. Items and their
 * decision history live in the AMS studio store, so decisions survive reloads
 * and other AMS features (harness approvals, RCA hand-offs, governance
 * approvals) can add items to the same queue.
 *
 * @returns {JSX.Element}
 */
export default function WorkflowInbox() {
  const { state, actions } = useAmsStudio();
  const { goToSubPage } = useAmsNavigation();
  const items = state.inbox;
  const [selectedType, setSelectedType] = useState('All');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const { message, showToast } = useToast(4000);

  // 7 explicit categories requested by user
  const categories = [
    { 
      id: 'All', 
      label: 'All Items', 
      count: items.length, 
      icon: Filter,
      color: 'var(--stellantis-accent)'
    },
    { 
      id: 'Incident pattern recommendations', 
      label: 'Incident pattern recommendations', 
      shortLabel: 'Pattern Recommendations',
      count: items.filter(i => i.type.toLowerCase().includes('pattern')).length, 
      icon: TrendingUp,
      color: '#3b82f6'
    },
    { 
      id: 'Problem records requiring review', 
      label: 'Problem records requiring review', 
      shortLabel: 'Problem Records',
      count: items.filter(i => i.type.toLowerCase().includes('problem')).length, 
      icon: FileText,
      color: '#f59e0b'
    },
    { 
      id: 'Feature change requests', 
      label: 'Feature change requests', 
      shortLabel: 'Feature Change Requests',
      count: items.filter(i => i.type.toLowerCase().includes('feature')).length, 
      icon: GitPullRequest,
      color: '#8b5cf6'
    },
    { 
      id: 'Application enhancement requests', 
      label: 'Application enhancement requests', 
      shortLabel: 'Application Enhancements',
      count: items.filter(i => i.type.toLowerCase().includes('enhancement') || i.type.toLowerCase().includes('brownfield')).length, 
      icon: RefreshCw,
      color: '#06b6d4'
    },
    { 
      id: 'Automation approvals', 
      label: 'Automation approvals', 
      shortLabel: 'Automation Approvals',
      count: items.filter(i => i.type.toLowerCase().includes('automation')).length, 
      icon: Zap,
      color: '#10b981'
    },
    { 
      id: 'High-risk remediation actions', 
      label: 'High-risk remediation actions', 
      shortLabel: 'High-Risk Remediation',
      count: items.filter(i => i.type.toLowerCase().includes('high-risk')).length, 
      icon: ShieldAlert,
      color: '#ef4444'
    },
    { 
      id: 'Production governance exceptions', 
      label: 'Production governance exceptions', 
      shortLabel: 'Governance Exceptions',
      count: items.filter(i => i.type.toLowerCase().includes('governance')).length, 
      icon: ShieldCheck,
      color: '#6366f1'
    }
  ];

  const filteredItems = selectedType === 'All' 
    ? items 
    : items.filter(i => {
        if (selectedType === 'Application enhancement requests') {
          return i.type.toLowerCase().includes('enhancement') || i.type.toLowerCase().includes('brownfield');
        }
        return i.type.toLowerCase().includes(selectedType.toLowerCase());
      });

  // The selection always resolves to an item in the current filter: the chosen
  // one when it is visible, otherwise the first. Deriving it (rather than
  // copying the item into state) keeps the detail pane in step with the store.
  const selectedItem = filteredItems.find((item) => item.id === selectedItemId) || filteredItems[0] || null;

  // Agent production approvals are the same decision as in Evaluate & Approve:
  // approval needs every policy check to pass and rejection needs a comment.
  const isAgentApproval = selectedItem?.link?.kind === INBOX_LINK_AGENT_APPROVAL;
  const pausedRun = selectedItem?.link?.kind === INBOX_LINK_RUN_APPROVAL
    ? state.runs.find((run) => run.id === selectedItem.link.runId)
    : null;

  /** Opens the harness run or workflow that raised the selected item. */
  const openPausedRun = () => {
    if (pausedRun.kind === RUN_KIND.HARNESS) goToSubPage(AMS_SUBPAGE.HARNESS, { runId: pausedRun.id });
    else goToSubPage(AMS_SUBPAGE.AGENT_STUDIO, { tab: 'workflows', workflowId: pausedRun.workflowId });
  };
  const canApproveAgent = !selectedItem?.link || canDecideLinkedApproval(state, selectedItem, INBOX_DECISION.APPROVE, decisionNotes);

  /**
   * Records the approver's decision on the selected item.
   *
   * @param {'approve' | 'reject' | 'escalate'} decision
   */
  const handleAction = (decision) => {
    if (!selectedItem) return;
    if (!canDecideLinkedApproval(state, selectedItem, decision, decisionNotes)) {
      showToast(decision === INBOX_DECISION.REJECT
        ? 'Add a comment to reject this agent approval.'
        : 'This item can no longer be approved: it was already decided or a policy check fails.');
      return;
    }
    actions.recordInboxDecision(selectedItem.id, decision, decisionNotes);
    showToast(`Item ${selectedItem.id} marked as ${INBOX_DECISION_STATUS[decision]}`);
    setDecisionNotes('');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Toast message={message} />

      {/* 7-CATEGORY EXECUTIVE WORKFLOW SUMMARY CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedType === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedType(cat.id)}
              style={{
                background: isSelected ? 'var(--bg-surface-secondary)' : 'var(--bg-surface)',
                border: isSelected ? `2px solid ${cat.color}` : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
              }}
              onMouseEnter={e => {
                if (!isSelected) e.currentTarget.style.borderColor = cat.color;
              }}
              onMouseLeave={e => {
                if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: `${cat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={16} color={cat.color} />
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: isSelected ? cat.color : 'var(--bg-subtle)',
                  color: isSelected ? '#ffffff' : 'var(--text-primary)',
                  border: isSelected ? 'none' : '1px solid var(--border-color)'
                }}>
                  {cat.count} {cat.count === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <div style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                lineHeight: 1.3,
                marginTop: '2px'
              }}>
                {cat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Master-detail layout (stacks on narrow screens) */}
      <div className="ams-inbox-layout">

        {/* LEFT: Items List */}
        <div className="st-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '850px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Action Items ({filteredItems.length})
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Sorted by Priority SLA
            </span>
          </div>

          {filteredItems.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                style={{
                  background: isSelected ? 'var(--bg-surface-secondary)' : 'var(--bg-surface)',
                  border: isSelected ? '2px solid var(--stellantis-accent)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>{item.id}</span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)'
                    }}>
                      {item.type}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span className={`st-badge ${item.riskLevel === 'Critical' ? 'badge-critical' : item.riskLevel === 'High' ? 'badge-high' : 'badge-info'}`}>
                      {item.priority} • {item.riskLevel}
                    </span>
                    <span className={`st-badge ${item.status === 'Approved' ? 'badge-success' : item.status === 'Rejected' ? 'badge-critical' : 'badge-purple'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {item.title}
                </div>

                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Origin: <strong>{item.requestor}</strong> ({item.originatingSystem})
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '8px'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: item.dueDate.includes('Immediate') ? '#ef4444' : 'var(--text-muted)', fontWeight: item.dueDate.includes('Immediate') ? 700 : 500 }}>
                    <Clock size={12} /> {item.dueDate}
                  </span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>
                    AI Confidence: {item.confidence}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Detailed Decision & Compliance Pane */}
        {selectedItem && (
          <div className="st-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {selectedItem.id} • {selectedItem.type}
                </span>
                <span className={`st-badge ${selectedItem.riskLevel === 'Critical' ? 'badge-critical' : selectedItem.riskLevel === 'High' ? 'badge-high' : 'badge-info'}`}>
                  {selectedItem.priority} • {selectedItem.riskLevel} Risk
                </span>
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                {selectedItem.title}
              </h2>
              {isAgentApproval && (
                <div className="ams-callout is-info">
                  <ShieldCheck size={16} aria-hidden="true" />
                  <span>
                    Agent production approval — deciding here also updates the agent in Evaluate &amp; Approve.{' '}
                    <button
                      type="button"
                      className="ams-link-button"
                      onClick={() => goToSubPage(AMS_SUBPAGE.EVALUATE_APPROVE, { tab: 'approve', agentId: selectedItem.link.agentId })}
                    >
                      Open checklist
                    </button>
                  </span>
                </div>
              )}
              {pausedRun && (
                <div className="ams-callout is-info">
                  <Clock size={16} aria-hidden="true" />
                  <span>
                    {pausedRun.kind === RUN_KIND.HARNESS ? 'Harness run' : 'Workflow run'} {pausedRun.id} is paused here —
                    approving resumes it, rejecting stops it.{' '}
                    <button type="button" className="ams-link-button" onClick={openPausedRun}>Open run</button>
                  </span>
                </div>
              )}
            </div>

            {/* Context meta grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              background: 'var(--bg-surface-secondary)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Project / Portfolio:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedItem.project}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{selectedItem.portfolio}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>Requestor & Origin:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedItem.requestor}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{selectedItem.originatingSystem}</div>
              </div>
            </div>

            {/* Required Decision */}
            <div style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              padding: '14px',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Required Governance Decision
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                {selectedItem.requiredDecision}
              </div>
              <div style={{ fontSize: '0.75rem', color: selectedItem.dueDate.includes('Immediate') ? '#ef4444' : 'var(--badge-high-text)', marginTop: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> SLA Target: {selectedItem.dueDate}
              </div>
            </div>

            {/* AI Recommendation */}
            <div style={{
              background: 'var(--badge-purple-bg)',
              border: '1px solid var(--badge-purple-border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--badge-purple-text)', fontWeight: 700, fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bot size={17} />
                  <span>AI Agent Recommendation</span>
                </div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                  Confidence: {selectedItem.confidence}
                </span>
              </div>
              <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.45, margin: '8px 0 0 0' }}>
                {selectedItem.aiRecommendation}
              </p>
            </div>

            {/* Supporting Evidence */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Supporting Evidence & Telemetry
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Metrics & Observations:</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{selectedItem.supportingEvidence?.metrics}</div>
                </div>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Blast Radius / Impact:</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{selectedItem.supportingEvidence?.impact}</div>
                </div>
                <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Rollback Plan & Safety Guarantee:</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{selectedItem.supportingEvidence?.rollbackPlan}</div>
                </div>
              </div>
            </div>

            {/* Decision History & Audit Trail */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Decision History & Compliance Audit
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {(selectedItem.decisionHistory || []).map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{h.timestamp}</span>
                    <span>[{h.actor}]</span>
                    <span>{h.action}</span>
                  </div>
                ))}
                <div style={{ marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'var(--bg-subtle)', padding: '6px 8px', borderRadius: '4px' }}>
                  {selectedItem.auditTrail}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder={isAgentApproval
                  ? 'Decision notes (required to reject an agent approval)…'
                  : 'Optional decision notes, conditions or constraints...'}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontSize: '0.82rem',
                  outline: 'none',
                  color: 'var(--text-primary)'
                }}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleAction(INBOX_DECISION.APPROVE)}
                  disabled={!canApproveAgent}
                  title={canApproveAgent ? undefined : 'Not approvable: the agent is not pending or a policy check fails'}
                  className="st-btn st-btn-primary"
                  style={{ flex: 1.2, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px' }}
                >
                  <CheckCircle2 size={16} /> Approve & Execute
                </button>

                <button
                  onClick={() => handleAction(INBOX_DECISION.REJECT)}
                  className="st-btn st-btn-outline"
                  style={{ color: '#ef4444', borderColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px' }}
                >
                  <XCircle size={16} /> Reject
                </button>

                <button
                  onClick={() => handleAction(INBOX_DECISION.ESCALATE)}
                  className="st-btn st-btn-outline"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px' }}
                >
                  <AlertTriangle size={16} color="#f59e0b" /> Escalate to CAIO
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
