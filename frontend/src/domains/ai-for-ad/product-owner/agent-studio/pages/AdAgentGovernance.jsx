import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Scale, Rocket, Gauge, Gavel, BookOpen, CircleCheck, TriangleAlert } from 'lucide-react';
import { useAgentStudio } from '../useAgentStudio';
import GovernanceKpis from '../components/governance/GovernanceKpis';
import PolicyMatrix from '../components/governance/PolicyMatrix';
import ApprovalQueue from '../components/governance/ApprovalQueue';
import AgentGovernancePanel from '../components/governance/AgentGovernancePanel';
import AuditTrail from '../components/governance/AuditTrail';
import HarnessApprovals from '../components/governance/HarnessApprovals';
import GuardrailsRegulations from '../components/governance/GuardrailsRegulations';
import { isGoverned, sortQueue } from '../components/governance/governanceUtils';
import AdLiveTelemetry from '../../components/live/AdLiveTelemetry';
import { LIVE_PRESETS } from '../../components/live/liveTelemetry';
import '../adAgentStudio.css';
import '../adAgentGovernance.css';

const INNER_TABS = [
  { id: 'approvals', label: 'Approvals & Audit', icon: Gavel },
  { id: 'guardrails', label: 'Guardrails & Regulations', icon: BookOpen }
];

/**
 * F4 — Safety & Compliance Governance Center (AI for AD · Product Owner).
 * Approve AD agents against ISO 26262 / SOTIF / ISO 21434 · R155 / R156 /
 * ASPICE / GDPR guardrails; issue certificates, publish and operate them.
 */
export default function AdAgentGovernance() {
  const { agents, audit, policyChecks, focusAgentId, setFocusAgentId, navigate } = useAgentStudio();
  // Cross-tab focus (e.g. from Evaluation Center or the catalogue) is consumed on mount —
  // this page is unmounted whenever another Experience Zone tab is active.
  const [initialFocus] = useState(() => (focusAgentId && agents.some((a) => a.id === focusAgentId) ? focusAgentId : null));
  const [tab, setTab] = useState('approvals');
  const [filter, setFilter] = useState(initialFocus ? 'all' : 'pending');
  const [selectedId, setSelectedId] = useState(initialFocus);
  const [drillPolicyId, setDrillPolicyId] = useState(null);
  const [toast, setToast] = useState(null);

  const governed = useMemo(() => agents.filter(isGoverned), [agents]);
  const checksById = useMemo(() => Object.fromEntries(agents.map((a) => [a.id, policyChecks(a)])), [agents, policyChecks]);

  const notify = useCallback((msg, kind = 'ok') => setToast({ msg, kind, key: Date.now() }), []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (focusAgentId) setFocusAgentId(null);
  }, [focusAgentId, setFocusAgentId]);

  const defaultAgent = useMemo(() => sortQueue(governed, audit)[0] || null, [governed, audit]);
  const selectedAgent = agents.find((a) => a.id === selectedId) || defaultAgent;

  // Pin the reviewed agent once an action is taken so it stays selected after its status changes
  const panelNotify = useCallback((msg, kind) => {
    if (selectedAgent) setSelectedId(selectedAgent.id);
    notify(msg, kind);
  }, [selectedAgent, notify]);

  const selectAgent = useCallback((id) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent) return;
    setSelectedId(id);
    setTab('approvals');
    setFilter((f) => (f === 'all' || f === agent.governance.status ? f : 'all'));
  }, [agents]);

  return (
    <div className="ad-studio-scope ad-gov-scope">
      <header className="ad-studio-header">
        <div className="ad-studio-header-title">
          <div className="ad-studio-header-icon"><Scale size={20} /></div>
          <div>
            <div className="ad-studio-eyebrow">Compliance · ISO 26262 · ASPICE · UNECE R155</div>
            <h2>Governance Center</h2>
            <p>Approve AD agents against functional-safety, SOTIF, cybersecurity and traceability guardrails — every decision is audited</p>
          </div>
        </div>
        <div className="ad-studio-header-actions">
          <button type="button" className="ad-studio-btn" onClick={() => navigate({ tab: 'agents', view: 'onboarding' })}>
            <Rocket size={14} /> Onboarding Studio
          </button>
          <button type="button" className="ad-studio-btn is-primary" onClick={() => navigate({ tab: 'evaluation', agentId: selectedAgent?.id || null })}>
            <Gauge size={14} /> Evaluation Center
          </button>
        </div>
      </header>

      <AdLiveTelemetry title="Guardrail activity" metrics={LIVE_PRESETS.governance()} />

      <div className="ad-gov-tabs" role="tablist" aria-label="Governance sections">
        {INNER_TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`ad-gov-tab ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      <GovernanceKpis agents={agents} governed={governed} checksById={checksById} />

      {tab === 'approvals' ? (
        <>
          <PolicyMatrix
            governed={governed}
            checksById={checksById}
            activePolicyId={drillPolicyId}
            onTogglePolicy={setDrillPolicyId}
            onSelectAgent={selectAgent}
          />

          <div className="ad-studio-split-3 ad-gov-layout">
            <ApprovalQueue
              governed={governed}
              audit={audit}
              checksById={checksById}
              filter={filter}
              onFilter={setFilter}
              selectedId={selectedAgent?.id}
              onSelect={setSelectedId}
              notSubmittedCount={agents.length - governed.length}
              onOpenOnboarding={() => navigate({ tab: 'agents', view: 'onboarding' })}
            />
            <AgentGovernancePanel
              agent={selectedAgent}
              checks={selectedAgent ? checksById[selectedAgent.id] || {} : {}}
              notify={panelNotify}
            />
            <AuditTrail audit={audit} agents={agents} selectedAgent={selectedAgent} onSelectAgent={selectAgent} />
          </div>

          <HarnessApprovals notify={notify} />
        </>
      ) : (
        <GuardrailsRegulations governed={governed} checksById={checksById} onSelectAgent={selectAgent} />
      )}

      {toast && (
        <div key={toast.key} className={`ad-studio-toast ${toast.kind === 'error' ? 'is-error' : ''}`} role="status">
          {toast.kind === 'error' ? <TriangleAlert size={15} /> : <CircleCheck size={15} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
