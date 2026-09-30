import React, { useState } from 'react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { selectStudioAgent } from '../../../state/selectors';
import EmptyState from '../../../components/EmptyState';
import AgentAreaList from './AgentAreaList';
import AgentDetailPanel from './AgentDetailPanel';
import AgentRegistrationModal from './AgentRegistrationModal';

/**
 * Agent Onboarding Studio (F1 + F2): agents grouped by AMS area on the left,
 * the selected agent's lifecycle and details on the right, and the
 * registration form for new or existing agents.
 *
 * Registering a new agent is controlled by the parent, so other pages (the
 * Ops Studio "Onboard Agent" tile) can open the form directly.
 *
 * @param {Object} props
 * @param {string | null} props.selectedAgentId
 * @param {(agentId: string | null) => void} props.onSelectAgent
 * @param {boolean} props.registering                     Whether the new-agent form is open.
 * @param {(registering: boolean) => void} props.onRegisteringChange
 * @param {() => void} props.onShowPublished
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function OnboardingWorkspace({
  selectedAgentId,
  onSelectAgent,
  registering,
  onRegisteringChange,
  onShowPublished,
  showToast
}) {
  const { state } = useAmsStudio();
  const [query, setQuery] = useState('');
  const [editingAgentId, setEditingAgentId] = useState(null);

  const selectedAgent = selectStudioAgent(state, selectedAgentId) ?? state.studioAgents[0] ?? null;
  const editedAgent = editingAgentId ? selectStudioAgent(state, editingAgentId) : null;

  const closeForm = () => {
    setEditingAgentId(null);
    onRegisteringChange(false);
  };

  const handleSaved = (agentId, isNew) => {
    closeForm();
    onSelectAgent(agentId);
    showToast(isNew ? 'Agent registered as a draft.' : 'Registration saved.');
  };

  return (
    <div className="ams-master-detail">
      <AgentAreaList
        agents={state.studioAgents}
        selectedId={selectedAgent?.id ?? null}
        onSelect={onSelectAgent}
        query={query}
        onQueryChange={setQuery}
        onRegister={() => onRegisteringChange(true)}
      />

      {selectedAgent ? (
        <AgentDetailPanel
          key={selectedAgent.id}
          agent={selectedAgent}
          onEdit={() => setEditingAgentId(selectedAgent.id)}
          onShowPublished={onShowPublished}
          showToast={showToast}
        />
      ) : (
        <EmptyState message="No agents registered yet. Register your first AMS agent to start its lifecycle." />
      )}

      {(registering || editedAgent) && (
        <AgentRegistrationModal
          agent={registering ? null : editedAgent}
          onClose={closeForm}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
