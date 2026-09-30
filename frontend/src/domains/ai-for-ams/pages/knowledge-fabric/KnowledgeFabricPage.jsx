import React, { useMemo, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { useAmsStudio } from '../../state/useAmsStudio';
import { AMS_SUBPAGE, getAmsRoute } from '../../navigation/amsRoutes';
import { useAmsRouteRequest } from '../../navigation/useAmsNavigation';
import { HARNESS_MIN_STAGE } from '../../model/agentLifecycle';
import { AMS_INCIDENTS } from '../../model/incidents';
import { buildKnowledgeGraph, filterGraphToIncident, getDebtProfile, getMemoryCounters } from '../../model/knowledgeGraph';
import FilterPills from '../../components/FilterPills';
import PageHeader from '../../components/PageHeader';
import AgentCoverageCard from './AgentCoverageCard';
import DebtProfiler from './DebtProfiler';
import KnowledgeGraphCanvas from './graph/KnowledgeGraphCanvas';
import MemoryCounters from './MemoryCounters';
import NodeDetailPanel from './NodeDetailPanel';

const VIEW = Object.freeze({ FLOW: 'flow', EXPLORE: 'explore' });
const ALL_INCIDENTS = '';

const VIEW_OPTIONS = [
  { id: VIEW.FLOW, label: 'Flow view' },
  { id: VIEW.EXPLORE, label: 'Explore all knowledge' }
];

/**
 * Knowledge Fabric (F8) — what AMS agents know and where the debt is.
 *
 * - **Flow view**: one incident's chain, left to right — incident → service →
 *   change → logs & monitoring → known error → similar incident → runbook → agents.
 * - **Explore**: every incident's knowledge together; picking an incident
 *   highlights its chain.
 * - Picking an agent shows its knowledge coverage and ticks the records it is bound to.
 *
 * Route params: `{ incidentId }` opens that incident's chain in the flow view.
 *
 * @returns {JSX.Element}
 */
export default function KnowledgeFabricPage() {
  const route = getAmsRoute(AMS_SUBPAGE.KNOWLEDGE_FABRIC);
  const { state } = useAmsStudio();
  const [view, setView] = useState(VIEW.FLOW);
  const [incidentId, setIncidentId] = useState(AMS_INCIDENTS[0].id);
  const [agentId, setAgentId] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const fullGraph = useMemo(() => buildKnowledgeGraph(state.studioAgents), [state.studioAgents]);
  const graph = view === VIEW.FLOW ? filterGraphToIncident(fullGraph, incidentId || AMS_INCIDENTS[0].id) : fullGraph;
  const agent = state.studioAgents.find((candidate) => candidate.id === agentId) ?? null;
  const selectedRecord = graph.nodes.find((node) => node.id === selectedNodeId) ?? null;

  /**
   * Shows an incident's chain in the flow view and selects the incident node.
   *
   * @param {string} id
   */
  const showIncident = (id) => {
    setView(VIEW.FLOW);
    setIncidentId(id);
    setSelectedNodeId(`incident:${id}`);
  };

  useAmsRouteRequest(AMS_SUBPAGE.KNOWLEDGE_FABRIC, (params) => {
    if (params.incidentId) showIncident(params.incidentId);
  });

  const changeView = (next) => {
    setView(next);
    setSelectedNodeId(null);
    if (next === VIEW.FLOW && !incidentId) setIncidentId(AMS_INCIDENTS[0].id);
  };

  const eligibleAgents = state.studioAgents.filter((candidate) => candidate.stage >= HARNESS_MIN_STAGE);

  return (
    <div className="ams-page animate-fade-in">
      <PageHeader icon={route.icon} title={route.label} summary={route.summary} />

      <MemoryCounters counters={getMemoryCounters(state, fullGraph)} />

      <section className="st-card ams-card" aria-label="Knowledge graph">
        <div className="ams-toolbar">
          <FilterPills options={VIEW_OPTIONS} value={view} onChange={changeView} ariaLabel="Graph view" />
          <div className="ams-inline-form">
            <select className="ams-input" value={incidentId} onChange={(event) => { setIncidentId(event.target.value); setSelectedNodeId(null); }} aria-label="Incident">
              {view === VIEW.EXPLORE && <option value={ALL_INCIDENTS}>All incidents</option>}
              {AMS_INCIDENTS.map((incident) => (
                <option key={incident.id} value={incident.id}>{incident.id} · {incident.title}</option>
              ))}
            </select>
            <select className="ams-input" value={agentId} onChange={(event) => setAgentId(event.target.value)} aria-label="Show an agent's knowledge">
              <option value="">No agent highlight</option>
              {eligibleAgents.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}
            </select>
          </div>
        </div>
        <p className="ams-muted-note">
          {view === VIEW.FLOW
            ? 'How the selected incident connects to the knowledge its agents used — read left to right. Click any node for its source.'
            : 'Every open incident\'s knowledge; records shared by several incidents appear once. Pick an incident to highlight its chain.'}
        </p>

        <div className="ams-kg-layout">
          <ReactFlowProvider>
            <KnowledgeGraphCanvas
              key={`${view}-${view === VIEW.FLOW ? incidentId : 'all'}`}
              graph={graph}
              highlightIncidentId={view === VIEW.EXPLORE ? incidentId || null : null}
              agent={agent}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              animatePath={view === VIEW.FLOW || Boolean(incidentId)}
            />
          </ReactFlowProvider>
          {selectedRecord
            ? <NodeDetailPanel record={selectedRecord} agents={state.studioAgents} onShowIncident={showIncident} />
            : agent
              ? <AgentCoverageCard agent={agent} />
              : (
                <aside className="ams-inspector" aria-label="How to read the graph">
                  <p className="ams-section-title">How to read it</p>
                  <ul className="ams-help-list">
                    <li>Each column is one step of the knowledge chain, numbered left to right.</li>
                    <li>Click a node to see its source system, record count and the agents that use it.</li>
                    <li>Pick an agent above to see its knowledge coverage; records it is bound to get a tick.</li>
                  </ul>
                </aside>
              )}
        </div>
      </section>

      <DebtProfiler profile={getDebtProfile(state.studioAgents)} onShowIncident={showIncident} />
    </div>
  );
}
