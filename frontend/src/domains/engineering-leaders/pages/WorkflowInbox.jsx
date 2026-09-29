import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ShieldAlert,
  Filter,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  History,
  Bot,
  Zap,
  TrendingUp,
  GitPullRequest,
  RefreshCw,
  Layers,
  Activity,
  Briefcase,
  Search,
  Check,
  X,
  Cpu,
  AlertOctagon,
  RotateCcw
} from 'lucide-react';
import { engineeringWorkflowInbox } from '../mockData.js';

export default function WorkflowInbox() {
  const [items, setItems] = useState(engineeringWorkflowInbox);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedItem, setSelectedItem] = useState(engineeringWorkflowInbox[0]);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [notification, setNotification] = useState(null);

  // Fetch from backend API if available, fallback to mockData
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/engineering/workflows`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          setItems(json.data);
          setSelectedItem(json.data[0]);
        }
      })
      .catch((err) => {
        console.log('Backend not reached, using local mock data', err);
      });
  }, []);

  // 7 explicit categories requested by user + 'All Items'
  const categories = [
    {
      id: 'All',
      label: 'All Decisions',
      count: items.length,
      icon: Filter,
      color: 'var(--stellantis-accent, #1a3a6e)'
    },
    {
      id: 'New project approvals',
      label: 'New project approvals',
      count: items.filter(i => i.type === 'New project approvals').length,
      icon: Briefcase,
      color: '#3b82f6'
    },
    {
      id: 'Model, agent, and tool subscription requests',
      label: 'Model, agent, & tool subscriptions',
      count: items.filter(i => i.type.toLowerCase().includes('subscription')).length,
      icon: Cpu,
      color: '#8b5cf6'
    },
    {
      id: 'Governance exceptions',
      label: 'Governance exceptions',
      count: items.filter(i => i.type.toLowerCase().includes('governance')).length,
      icon: ShieldAlert,
      color: '#ef4444'
    },
    {
      id: 'High-risk deployment approvals',
      label: 'High-risk deployment approvals',
      count: items.filter(i => i.type.toLowerCase().includes('deployment')).length,
      icon: AlertOctagon,
      color: '#f59e0b'
    },
    {
      id: 'Productivity benefit reviews',
      label: 'Productivity benefit reviews',
      count: items.filter(i => i.type.toLowerCase().includes('productivity')).length,
      icon: TrendingUp,
      color: '#10b981'
    },
    {
      id: 'Escalations from projects',
      label: 'Escalations from projects',
      count: items.filter(i => i.type.toLowerCase().includes('escalation')).length,
      icon: Zap,
      color: '#ec4899'
    },
    {
      id: 'Portfolio-level recommendations',
      label: 'Portfolio-level recommendations',
      count: items.filter(i => i.type.toLowerCase().includes('portfolio')).length,
      icon: Layers,
      color: '#0284c7'
    }
  ];

  const filteredItems = selectedType === 'All'
    ? items
    : items.filter(i => {
        if (selectedType === 'New project approvals') return i.type === 'New project approvals';
        if (selectedType === 'Escalations from projects') return i.type.toLowerCase().includes('escalation');
        return i.type.toLowerCase().includes(selectedType.toLowerCase());
      });

  // Ensure an item from the current filtered list is selected
  useEffect(() => {
    if (filteredItems.length > 0 && (!selectedItem || !filteredItems.some(i => i.id === selectedItem.id))) {
      setSelectedItem(filteredItems[0]);
    }
  }, [selectedType, filteredItems]);

  const handleAction = async (actionType) => {
    if (!selectedItem) return;

    const actionText = actionType === 'approve' ? 'Authorized' : (actionType === 'reject' ? 'Rejected' : 'Escalated');
    const recordedComment = decisionNotes.trim() || (actionType === 'approve' ? 'Executive sign-off granted by Chief AI Officer.' : (actionType === 'reject' ? 'Proposal rejected by Chief AI Officer.' : 'Escalated to Executive Board.'));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/engineering/workflows/${selectedItem.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          comments: recordedComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', text: `Item ${selectedItem.id} marked as ${data.data?.status || actionText}` });
      }
    } catch (e) {
      setNotification({ type: 'success', text: `Item ${selectedItem.id} marked as ${actionText}` });
    }

    const newStatus = actionText;

    setItems((prev) =>
      prev.map((it) =>
        it.id === selectedItem.id
          ? {
              ...it,
              status: newStatus,
              decisionHistory: [
                {
                  timestamp: 'Just now',
                  actor: 'Alex / Chief AI Officer',
                  action: `${newStatus.toUpperCase()}: ${recordedComment}`,
                  comment: recordedComment
                },
                ...(it.decisionHistory || [])
              ]
            }
          : it
      )
    );

    setSelectedItem((prev) => ({
      ...prev,
      status: newStatus,
      decisionHistory: [
        {
          timestamp: 'Just now',
          actor: 'Alex / Chief AI Officer',
          action: `${newStatus.toUpperCase()}: ${recordedComment}`,
          comment: recordedComment
        },
        ...(prev.decisionHistory || [])
      ]
    }));

    setDecisionNotes('');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReopen = (id) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, status: 'Pending Action' } : it
      )
    );
    setSelectedItem((prev) => ({
      ...prev,
      status: 'Pending Action'
    }));
    setNotification({ type: 'success', text: `Item ${id} re-opened for decision review.` });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Toast Notification */}
      {notification && (
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
          fontWeight: 600
        }}>
          <CheckCircle2 size={16} />
          <span>{notification.text}</span>
        </div>
      )}

      {/* 7-CATEGORY EXECUTIVE WORKFLOW SUMMARY CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
                justifyContent: 'space-between',
                minHeight: '84px',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                boxSizing: 'border-box'
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
                marginTop: '6px'
              }}>
                {cat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* MASTER-DETAIL WORKFLOW CONSOLE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        gap: '20px',
        height: 'calc(100vh - 280px)',
        minHeight: '680px',
        maxHeight: '840px',
        alignItems: 'stretch'
      }}>

        {/* LEFT: Items List */}
        <div className="st-card" style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* List Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-color)',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Action Items
              </span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                background: 'var(--stellantis-accent)',
                color: '#ffffff',
                padding: '1px 7px',
                borderRadius: '10px'
              }}>
                {filteredItems.length}
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Sorted by Priority & SLA
            </span>
          </div>

          {/* Scrollable Items Container with Bottom Padding so no item is chopped */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '6px',
            marginTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingBottom: '20px'
          }}>
            {filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
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
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                    borderLeft: item.priority === 'P1' ? '4px solid #ef4444' : (item.priority === 'P2' ? '4px solid #f59e0b' : '4px solid #3b82f6'),
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>{item.id}</span>
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
                      <span className={`st-badge ${
                        (item.status === 'Authorized' || item.status === 'Approved') ? 'badge-success' : 
                        (item.status === 'Rejected' ? 'badge-critical' : 
                        (item.status === 'Escalated' ? 'badge-high' : 'badge-navy'))
                      }`}>
                        {item.status === 'Authorized' || item.status === 'Approved' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><CheckCircle2 size={11} /> Authorized</span>
                        ) : item.status === 'Rejected' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><XCircle size={11} /> Rejected</span>
                        ) : item.status === 'Escalated' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><AlertTriangle size={11} /> Escalated</span>
                        ) : (
                          item.status || 'Pending Action'
                        )}
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
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: item.dueDate.includes('Today') ? '#ef4444' : 'var(--text-muted)', fontWeight: item.dueDate.includes('Today') ? 700 : 500 }}>
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
        </div>

        {/* RIGHT: Detailed Decision & Evidence Pane */}
        {selectedItem && (
          <div className="st-card" style={{
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            {/* Pinned Top Header */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--stellantis-action)' }}>
                    {selectedItem.id}
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)'
                  }}>
                    {selectedItem.type}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className={`st-badge ${selectedItem.riskLevel === 'Critical' ? 'badge-critical' : selectedItem.riskLevel === 'High' ? 'badge-high' : 'badge-info'}`}>
                    {selectedItem.priority} • {selectedItem.riskLevel} Risk
                  </span>
                  <span className={`st-badge ${
                    (selectedItem.status === 'Authorized' || selectedItem.status === 'Approved') ? 'badge-success' : 
                    (selectedItem.status === 'Rejected' ? 'badge-critical' : 
                    (selectedItem.status === 'Escalated' ? 'badge-high' : 'badge-navy'))
                  }`} style={{ fontSize: '0.78rem', padding: '3px 10px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    {(selectedItem.status === 'Authorized' || selectedItem.status === 'Approved') && <CheckCircle2 size={13} />}
                    {selectedItem.status === 'Rejected' && <XCircle size={13} />}
                    {selectedItem.status === 'Escalated' && <AlertTriangle size={13} />}
                    {selectedItem.status === 'Authorized' || selectedItem.status === 'Approved' ? 'Authorized' : (selectedItem.status || 'Pending Action')}
                  </span>
                </div>
              </div>
              <h2 style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35, margin: 0 }}>
                {selectedItem.title}
              </h2>
            </div>

            {/* Scrollable Middle Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '8px',
              marginTop: '14px',
              marginBottom: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              {/* Context Meta Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                background: 'var(--bg-surface-secondary)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Target Portfolio:</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedItem.portfolio}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Category: {selectedItem.type}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Requestor & Originating System:</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedItem.requestor}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{selectedItem.originatingSystem}</div>
                </div>
              </div>

              {/* Required Decision Prompt */}
              <div style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                padding: '14px',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Required Governance Decision (Alex • Chief AI Officer)
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {selectedItem.requiredDecision}
                </div>
                <div style={{ fontSize: '0.75rem', color: selectedItem.dueDate.includes('Today') ? '#ef4444' : 'var(--badge-high-text)', marginTop: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> SLA Target: {selectedItem.dueDate}
                </div>
              </div>

              {/* AI Agent Recommendation */}
              <div style={{
                background: 'var(--badge-purple-bg)',
                border: '1px solid var(--badge-purple-border)',
                borderRadius: 'var(--radius-md)',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--badge-purple-text)', fontWeight: 700, fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bot size={17} />
                    <span>AI Copilot Recommendation</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.5)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--badge-purple-border)', fontWeight: 700 }}>
                    Confidence: {selectedItem.confidence}
                  </span>
                </div>
                <p style={{ marginTop: '8px', fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.45, margin: '8px 0 0 0' }}>
                  {selectedItem.aiRecommendation}
                </p>
              </div>

              {/* Supporting Evidence & Telemetry */}
              {selectedItem.supportingEvidence && (
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Supporting Evidence & Telemetry
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                    <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Metrics & Observations:</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{selectedItem.supportingEvidence.metrics}</div>
                    </div>
                    <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Blast Radius / Platform Impact:</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{selectedItem.supportingEvidence.impact}</div>
                    </div>
                    <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Risk Assessment:</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{selectedItem.supportingEvidence.riskAssessment}</div>
                    </div>
                    <div style={{ background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Rollback Plan & Safety Guarantee:</strong>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{selectedItem.supportingEvidence.rollbackPlan}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Decision History & Compliance Audit */}
              <div style={{
                background: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px'
              }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Decision History & Compliance Audit ({(selectedItem.decisionHistory || []).length})</span>
                  <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={13} /> Tamper-Proof Audit
                  </span>
                </div>
                <div style={{
                  maxHeight: '130px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  paddingRight: '4px'
                }}>
                  {(selectedItem.decisionHistory || []).map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '4px', fontSize: '0.74rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{h.timestamp}</span>
                      <span style={{ color: 'var(--stellantis-action)', fontWeight: 600, whiteSpace: 'nowrap' }}>[{h.actor}]</span>
                      <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{h.action} {h.comment ? <em>— {h.comment}</em> : ''}</span>
                    </div>
                  ))}
                </div>
                {selectedItem.auditTrail && (
                  <div style={{ marginTop: '8px', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'var(--bg-subtle)', padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    {selectedItem.auditTrail}
                  </div>
                )}
              </div>
            </div>

            {/* Pinned Bottom Action Box (Executive Decision Dock) - Fully Styled & Finished */}
            {(() => {
              const isAuthorized = selectedItem.status === 'Authorized' || selectedItem.status === 'Approved';
              const isRejected = selectedItem.status === 'Rejected';
              const isEscalated = selectedItem.status === 'Escalated';
              const isDecided = isAuthorized || isRejected || isEscalated;
              const latestHistory = selectedItem.decisionHistory?.[0];

              if (isDecided) {
                return (
                  <div style={{
                    flexShrink: 0,
                    background: isAuthorized ? 'var(--badge-success-bg, #ecfdf5)' : (isRejected ? '#fef2f2' : '#fffbeb'),
                    border: `1.5px solid ${isAuthorized ? '#10b981' : (isRejected ? '#ef4444' : '#f59e0b')}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)',
                    animation: 'fadeIn 0.2s ease-in-out'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isAuthorized ? '#059669' : (isRejected ? '#dc2626' : '#d97706'),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff'
                        }}>
                          {isAuthorized && <CheckCircle2 size={18} />}
                          {isRejected && <XCircle size={18} />}
                          {isEscalated && <AlertTriangle size={18} />}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '0.92rem',
                            fontWeight: 800,
                            color: isAuthorized ? '#065f46' : (isRejected ? '#991b1b' : '#92400e'),
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            {isAuthorized && 'Decision Executed: Authorized & Signed Off'}
                            {isRejected && 'Decision Executed: Rejected'}
                            {isEscalated && 'Decision Executed: Escalated to Executive Board'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            Signer: <strong>Alex (Head of Software Engineering & CAIO)</strong> • {latestHistory?.timestamp || 'Just now'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleReopen(selectedItem.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-secondary)',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.15s ease'
                        }}
                        title="Re-open this item to modify or issue a different directive"
                      >
                        <RotateCcw size={12} /> Re-evaluate Decision
                      </button>
                    </div>

                    {/* Display recorded directives */}
                    <div style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '9px 12px',
                      fontSize: '0.8rem',
                      color: 'var(--text-primary)'
                    }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px', letterSpacing: '0.04em' }}>
                        Recorded Directives & Governance Comments:
                      </div>
                      <div style={{ lineHeight: 1.45, fontWeight: 500 }}>
                        {latestHistory?.comment || (isAuthorized ? 'Executive sign-off granted by Chief AI Officer.' : isRejected ? 'Proposal rejected by Chief AI Officer.' : 'Escalated to Executive Board.')}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '6px'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={12} color="#059669" /> ISO-26262 & EARB-Certified Audit Log Permanent Record
                      </span>
                      <span>Audit: {selectedItem.auditTrail?.split(' // ')[0] || selectedItem.id}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div style={{
                  flexShrink: 0,
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--stellantis-navy)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={14} color="var(--stellantis-action)" />
                      Executive Decision Sign-off • Alex (Chief AI Officer)
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Target SLA: {selectedItem.dueDate}
                    </span>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Enter executive directives, governance constraints, or sign-off notes (press Enter to authorize)..."
                      value={decisionNotes}
                      onChange={(e) => setDecisionNotes(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAction('approve');
                      }}
                      style={{
                        width: '100%',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '9px 12px',
                        fontSize: '0.82rem',
                        outline: 'none',
                        color: 'var(--text-primary)',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--stellantis-action)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      onClick={() => handleAction('approve')}
                      className="st-btn st-btn-primary"
                      style={{
                        flex: 1.3,
                        background: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '7px',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 2px 4px rgba(5, 150, 105, 0.25)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#047857'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#059669'}
                    >
                      <CheckCircle2 size={16} /> Authorize & Sign Off
                    </button>

                    <button
                      onClick={() => handleAction('reject')}
                      style={{
                        flex: 0.9,
                        background: 'transparent',
                        color: '#dc2626',
                        border: '1px solid #dc2626',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <XCircle size={16} /> Reject
                    </button>

                    <button
                      onClick={() => handleAction('escalate')}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        color: '#d97706',
                        border: '1px solid #d97706',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fffbeb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <AlertTriangle size={16} /> Escalate to Board
                    </button>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '6px',
                    marginTop: '2px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={12} color="#059669" /> ISO-26262 & EARB-Certified Governance Gate
                    </span>
                    <span>Signer: Alex (Head of Software Engineering & CAIO)</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

      </div>

    </div>
  );
}
