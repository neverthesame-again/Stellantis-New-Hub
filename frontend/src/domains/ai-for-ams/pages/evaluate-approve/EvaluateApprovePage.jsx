import React, { useState } from 'react';
import { Gauge, History, ShieldCheck } from 'lucide-react';
import { useAmsStudio } from '../../state/useAmsStudio';
import { AMS_SUBPAGE, getAmsRoute } from '../../navigation/amsRoutes';
import { useAmsRouteRequest } from '../../navigation/useAmsNavigation';
import { GOVERNANCE_STATUS } from '../../model/agentOptions';
import AuditTrail from '../../components/AuditTrail';
import PageHeader from '../../components/PageHeader';
import SearchField from '../../components/SearchField';
import TabBar from '../../components/TabBar';
import Toast from '../../components/Toast';
import { useToast } from '../../components/useToast';
import EvaluationTab from './evaluation/EvaluationTab';
import ApprovalTab from './governance/ApprovalTab';

/** Views of the page; other pages open one via route params `{ tab, agentId }`. */
const TAB = Object.freeze({ EVALUATE: 'evaluate', APPROVE: 'approve', AUDIT: 'audit' });

/**
 * Whether an audit entry matches the free-text search.
 *
 * @param {Object} entry
 * @param {string} query
 * @returns {boolean}
 */
function matchesQuery(entry, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [entry.action, entry.target, entry.actor, entry.detail].some((field) => (field || '').toLowerCase().includes(needle));
}

/**
 * Evaluate & Approve — the two quality gates before production: scoring
 * against AMS measures (F6), approval against operating policies (F7), and the
 * audit trail of every AMS action.
 *
 * Route params: `{ tab?: 'evaluate' | 'approve' | 'audit', agentId?: string }`.
 *
 * @returns {JSX.Element}
 */
export default function EvaluateApprovePage() {
  const route = getAmsRoute(AMS_SUBPAGE.EVALUATE_APPROVE);
  const { state } = useAmsStudio();
  const [activeTab, setActiveTab] = useState(TAB.EVALUATE);
  const [evaluationAgentId, setEvaluationAgentId] = useState(null);
  const [approvalAgentId, setApprovalAgentId] = useState(null);
  const [auditQuery, setAuditQuery] = useState('');
  const { message, showToast } = useToast();

  useAmsRouteRequest(AMS_SUBPAGE.EVALUATE_APPROVE, (params) => {
    if (Object.values(TAB).includes(params.tab)) setActiveTab(params.tab);
    if (params.agentId && params.tab === TAB.APPROVE) setApprovalAgentId(params.agentId);
    else if (params.agentId) setEvaluationAgentId(params.agentId);
  });

  const pendingApprovals = state.studioAgents.filter((agent) => agent.governance?.status === GOVERNANCE_STATUS.PENDING).length;
  const tabs = [
    { id: TAB.EVALUATE, label: 'Evaluate', icon: Gauge },
    { id: TAB.APPROVE, label: 'Approve', icon: ShieldCheck, count: pendingApprovals },
    { id: TAB.AUDIT, label: 'Audit trail', icon: History }
  ];

  return (
    <div className="ams-page animate-fade-in">
      <PageHeader icon={route.icon} title={route.label} summary={route.summary} />
      <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} ariaLabel="Evaluate and approve views" idPrefix="ams-assure-tab" />
      <div role="tabpanel" id="ams-assure-tab-panel" aria-labelledby={`ams-assure-tab-${activeTab}`}>
        {activeTab === TAB.EVALUATE && (
          <EvaluationTab selectedAgentId={evaluationAgentId} onSelectAgent={setEvaluationAgentId} showToast={showToast} />
        )}
        {activeTab === TAB.APPROVE && (
          <ApprovalTab selectedAgentId={approvalAgentId} onSelectAgent={setApprovalAgentId} showToast={showToast} />
        )}
        {activeTab === TAB.AUDIT && (
          <section className="st-card ams-card" aria-labelledby="ams-audit-title">
            <div className="ams-toolbar">
              <div>
                <h3 id="ams-audit-title" className="ams-card-title">Audit trail</h3>
                <p className="ams-card-subtitle">Every AMS action — actor, action, target and time — newest first.</p>
              </div>
              <SearchField value={auditQuery} onChange={setAuditQuery} placeholder="Search audit trail" />
            </div>
            <AuditTrail
              entries={state.auditLog.filter((entry) => matchesQuery(entry, auditQuery))}
              emptyMessage="No audit entries match your search."
            />
          </section>
        )}
      </div>
      <Toast message={message} />
    </div>
  );
}
