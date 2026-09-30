import React from 'react';
import { Bot, Radio } from 'lucide-react';
import { useAmsNavigation } from '../../navigation/useAmsNavigation';
import { AMS_MAIN_TAB, AMS_SUBPAGE } from '../../navigation/amsRoutes';
import { KNOWLEDGE_LANES } from '../../model/knowledgeGraph';

/**
 * Details of the clicked graph node: source system, record and record count,
 * what it says, the incidents it belongs to and the agents bound to its
 * knowledge source (F8).
 *
 * @param {Object} props
 * @param {import('../../model/knowledgeGraph').KnowledgeNode} props.record
 * @param {Object[]} props.agents Studio agents.
 * @param {(incidentId: string) => void} props.onShowIncident Focus an incident's chain.
 * @returns {JSX.Element}
 */
export default function NodeDetailPanel({ record, agents, onShowIncident }) {
  const { goToTab, goToSubPage } = useAmsNavigation();
  const lane = KNOWLEDGE_LANES.find((candidate) => candidate.id === record.lane);
  const usingAgents = record.knowledgeSource
    ? agents.filter((agent) => (agent.knowledgeSources || []).includes(record.knowledgeSource))
    : [];

  return (
    <aside className="ams-inspector" aria-label={`${record.label} details`}>
      <p className="ams-section-title">{lane?.label}</p>
      <h3 className="ams-card-title">{record.label}</h3>
      <dl className="ams-details">
        <div><dt>Source system</dt><dd>{record.system}</dd></div>
        <div><dt>Record</dt><dd>{record.recordId}</dd></div>
        <div><dt>Records</dt><dd>{record.count}</dd></div>
      </dl>
      <p className="ams-card-text">{record.detail}</p>

      {record.lane === 'incident' && (
        <button type="button" className="st-btn st-btn-primary" onClick={() => goToTab(AMS_MAIN_TAB.DASHBOARD, { incidentId: record.recordId })}>
          <Radio size={14} /> Open in live war room
        </button>
      )}
      {record.lane === 'agent' && (
        <button type="button" className="st-btn st-btn-outline" onClick={() => goToSubPage(AMS_SUBPAGE.AGENT_STUDIO, { tab: 'onboarding', agentId: record.recordId })}>
          <Bot size={14} /> Open in Agent Studio
        </button>
      )}

      <div>
        <p className="ams-section-title">Used in incidents</p>
        <div className="ams-chip-list">
          {record.incidentIds.map((incidentId) => (
            <button key={incidentId} type="button" className="ams-toggle-chip" onClick={() => onShowIncident(incidentId)}>{incidentId}</button>
          ))}
        </div>
      </div>

      {record.knowledgeSource && (
        <div>
          <p className="ams-section-title">Agents bound to {record.knowledgeSource}</p>
          {usingAgents.length === 0
            ? <p className="ams-muted-note">No agent uses this source yet.</p>
            : (
              <ul className="ams-help-list">
                {usingAgents.map((agent) => <li key={agent.id}>{agent.name}</li>)}
              </ul>
            )}
        </div>
      )}
    </aside>
  );
}
