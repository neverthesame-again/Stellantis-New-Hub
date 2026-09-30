import React, { useMemo, useState } from 'react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { selectStudioAgent } from '../../../state/selectors';
import { GOVERNANCE_STATUS } from '../../../model/agentOptions';
import { formatDateTime } from '../../../utils/formatters';
import FilterPills from '../../../components/FilterPills';
import AgentPickerList from '../AgentPickerList';
import ApprovalDecisionPanel from './ApprovalDecisionPanel';
import PolicyMatrix from './PolicyMatrix';

const QUEUE_FILTERS = [
  { id: GOVERNANCE_STATUS.PENDING, label: 'Pending' },
  { id: GOVERNANCE_STATUS.APPROVED, label: 'Approved' },
  { id: GOVERNANCE_STATUS.REJECTED, label: 'Rejected' },
  { id: 'all', label: 'All' }
];

const STATUS_BADGE = {
  [GOVERNANCE_STATUS.PENDING]: { className: 'badge-high', label: 'Pending' },
  [GOVERNANCE_STATUS.APPROVED]: { className: 'badge-success', label: 'Approved' },
  [GOVERNANCE_STATUS.REJECTED]: { className: 'badge-critical', label: 'Rejected' }
};

/**
 * Operations governance (F7): policy matrix, approval queue with status
 * filters, and the selected agent's checklist and decision.
 *
 * @param {Object} props
 * @param {string | null} props.selectedAgentId
 * @param {(agentId: string) => void} props.onSelectAgent
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function ApprovalTab({ selectedAgentId, onSelectAgent, showToast }) {
  const { state } = useAmsStudio();
  const [filter, setFilter] = useState(GOVERNANCE_STATUS.PENDING);

  const queue = useMemo(() => state.studioAgents.filter((agent) => (
    agent.governance?.status && agent.governance.status !== GOVERNANCE_STATUS.NOT_SUBMITTED
  )), [state.studioAgents]);
  const filterOptions = QUEUE_FILTERS.map((option) => ({
    ...option,
    count: option.id === 'all' ? queue.length : queue.filter((agent) => agent.governance.status === option.id).length
  }));
  const visible = filter === 'all' ? queue : queue.filter((agent) => agent.governance.status === filter);

  // An explicitly chosen agent (e.g. from the policy matrix) wins even when outside the filter.
  const selected = selectStudioAgent(state, selectedAgentId) ?? visible[0] ?? null;

  return (
    <div className="ams-page">
      <PolicyMatrix agents={state.studioAgents} onSelectAgent={onSelectAgent} />

      <div className="ams-master-detail">
        <AgentPickerList
          ariaLabel="Approval queue"
          selectedId={selected?.id ?? null}
          onSelect={onSelectAgent}
          emptyMessage="Nothing in this part of the queue."
          header={<FilterPills options={filterOptions} value={filter} onChange={setFilter} ariaLabel="Approval status" />}
          items={visible.map((agent) => ({
            id: agent.id,
            title: agent.name,
            subtitle: `${agent.serviceTier || 'Untiered'} · submitted ${formatDateTime(agent.governance.submittedAt)}`,
            badges: [STATUS_BADGE[agent.governance.status]]
          }))}
        />
        {selected
          ? <ApprovalDecisionPanel key={selected.id} agent={selected} showToast={showToast} />
          : <p className="ams-muted-note">Select an agent to see its checklist.</p>}
      </div>
    </div>
  );
}
