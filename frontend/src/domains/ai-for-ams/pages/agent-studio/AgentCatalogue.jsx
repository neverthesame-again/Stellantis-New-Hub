import React, { useMemo, useState } from 'react';
import { Play, Wallet } from 'lucide-react';
import { useAmsStudio } from '../../state/useAmsStudio';
import { selectCatalogueAgents } from '../../state/selectors';
import { useAmsNavigation } from '../../navigation/useAmsNavigation';
import { AMS_SUBPAGE } from '../../navigation/amsRoutes';
import EmptyState from '../../components/EmptyState';
import FilterPills from '../../components/FilterPills';
import SearchField from '../../components/SearchField';

/** Catalogue statuses, in filter order. */
const AGENT_STATUSES = [
  { id: 'Active', label: 'Active production' },
  { id: 'Experimental', label: 'Experimental' },
  { id: 'Suspended', label: 'Suspended' },
  { id: 'Retired', label: 'Retired' }
];

const ALL_STATUSES = 'All';

/** Statuses from which an agent can no longer be run. */
const NON_RUNNABLE_STATUSES = new Set(['Suspended', 'Retired']);

/**
 * Badge class for an agent's catalogue status.
 *
 * @param {string} status
 * @returns {string}
 */
function statusBadgeClass(status) {
  if (status === 'Active') return 'badge-success';
  if (status === 'Experimental') return 'badge-purple';
  return 'badge-critical';
}

/**
 * Whether an agent matches the free-text search.
 *
 * @param {Object} agent
 * @param {string} query
 * @returns {boolean}
 */
function matchesQuery(agent, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [agent.name, agent.purpose, agent.domain].some((field) => (field || '').toLowerCase().includes(needle));
}

/**
 * Published AMS agents — agents published through onboarding plus the legacy
 * catalogue — with status filters. "Test in Harness" opens the AI Harness and
 * starts a run for the chosen agent.
 *
 * @param {Object} props
 * @param {(message: string) => void} props.showToast Page-level confirmation toast.
 * @returns {JSX.Element}
 */
export default function AgentCatalogue({ showToast }) {
  const { state } = useAmsStudio();
  const { goToSubPage } = useAmsNavigation();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(ALL_STATUSES);
  const agents = useMemo(() => selectCatalogueAgents(state), [state]);

  const statusOptions = useMemo(() => [
    { id: ALL_STATUSES, label: 'All agents', count: agents.length },
    ...AGENT_STATUSES.map(({ id, label }) => ({
      id,
      label,
      count: agents.filter((agent) => agent.status === id).length
    }))
  ], [agents]);

  const visibleAgents = agents.filter((agent) => (
    matchesQuery(agent, query) && (status === ALL_STATUSES || agent.status === status)
  ));

  return (
    <div className="ams-page">
      <div className="ams-toolbar">
        <FilterPills options={statusOptions} value={status} onChange={setStatus} ariaLabel="Agent status" label="Status" />
        <SearchField value={query} onChange={setQuery} placeholder="Search agents" />
      </div>

      {visibleAgents.length === 0 ? (
        <EmptyState message="No published agents match your search and filter." />
      ) : (
        <div className="ams-grid" style={{ '--ams-grid-min': '360px' }}>
          {visibleAgents.map((agent) => {
            const runnable = !NON_RUNNABLE_STATUSES.has(agent.status);
            return (
              <article key={agent.id} className={`st-card ams-card ${agent.status === 'Retired' ? 'is-muted' : ''}`}>
                <div className="ams-card-head">
                  <span className="st-badge badge-purple">{agent.autonomyLevel}</span>
                  <div className="ams-badge-row">
                    <span className={`st-badge ${agent.riskRating === 'High' ? 'badge-high' : 'badge-info'}`}>
                      {agent.riskRating} risk
                    </span>
                    <span className={`st-badge ${statusBadgeClass(agent.status)}`}>{agent.status}</span>
                  </div>
                </div>

                <div>
                  <h3 className="ams-card-title">{agent.name}</h3>
                  <p className="ams-card-subtitle">
                    Project: <strong>{agent.project}</strong> • Domain: {agent.domain}
                  </p>
                </div>

                <p className="ams-card-text">{agent.purpose}</p>

                <dl className="ams-details">
                  <div><dt>Inputs</dt><dd>{agent.inputs}</dd></div>
                  <div><dt>Outputs</dt><dd>{agent.outputs}</dd></div>
                  <div><dt>Model dependency</dt><dd className="ams-text-accent">{agent.modelDependencies}</dd></div>
                  <div><dt>Outcomes / SLA</dt><dd className="ams-text-success">{agent.metrics}</dd></div>
                </dl>

                <div>
                  <p className="ams-section-title">Granted permissions</p>
                  <div className="ams-chip-list">
                    {(agent.permissions || []).map((permission) => (
                      <span key={permission} className="ams-chip">{permission}</span>
                    ))}
                  </div>
                </div>

                <div className="ams-card-actions">
                  <button
                    type="button"
                    className="st-btn st-btn-primary is-grow"
                    disabled={!runnable}
                    title={runnable ? undefined : `${agent.status} agents cannot be run`}
                    onClick={() => goToSubPage(AMS_SUBPAGE.HARNESS, agent.studioAgentId
                      ? { agentId: agent.studioAgentId, autoRun: true }
                      : { sandbox: true, agentName: agent.name, autoRun: true })}
                  >
                    <Play size={12} /> Test in Harness
                  </button>
                  <button
                    type="button"
                    className="st-btn st-btn-outline"
                    onClick={() => showToast(`Subscribed "${agent.name}" to the active project.`)}
                  >
                    Subscribe project
                  </button>
                  {agent.studioAgentId && (
                    <button
                      type="button"
                      className="st-btn st-btn-outline"
                      title="See this agent's cost"
                      onClick={() => goToSubPage(AMS_SUBPAGE.MONITOR_FINOPS, { tab: 'cost', agentId: agent.studioAgentId })}
                    >
                      <Wallet size={13} /> Cost
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
