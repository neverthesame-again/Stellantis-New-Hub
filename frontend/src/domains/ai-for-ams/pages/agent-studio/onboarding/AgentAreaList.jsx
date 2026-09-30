import React from 'react';
import { Plus } from 'lucide-react';
import { AMS_AGENT_AREAS, getRuntimeOption } from '../../../model/agentOptions';
import { getCurrentStage } from '../../../model/agentLifecycle';
import ConnectionBadge from '../../../components/ConnectionBadge';
import EmptyState from '../../../components/EmptyState';
import SearchField from '../../../components/SearchField';

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
  return [agent.name, agent.service, agent.team, agent.owner].some((field) => (field || '').toLowerCase().includes(needle));
}

/**
 * Agents grouped by AMS area, each group with its count (F1). Each card shows
 * name, service, team, runtime, lifecycle stage and connection status.
 *
 * @param {Object} props
 * @param {Object[]} props.agents        All studio agents.
 * @param {string | null} props.selectedId
 * @param {(agentId: string) => void} props.onSelect
 * @param {string} props.query
 * @param {(query: string) => void} props.onQueryChange
 * @param {() => void} props.onRegister  Opens the registration form.
 * @returns {JSX.Element}
 */
export default function AgentAreaList({ agents, selectedId, onSelect, query, onQueryChange, onRegister }) {
  const visible = agents.filter((agent) => matchesQuery(agent, query));

  return (
    <section className="st-card ams-card ams-agent-list" aria-label="Agents by AMS area">
      <div className="ams-toolbar">
        <SearchField value={query} onChange={onQueryChange} placeholder="Search agents, services, owners" />
        <button type="button" className="st-btn st-btn-primary" onClick={onRegister}>
          <Plus size={14} /> Register agent
        </button>
      </div>

      {visible.length === 0 && <EmptyState message="No agents match your search." />}

      {AMS_AGENT_AREAS.map((area) => {
        const areaAgents = visible.filter((agent) => agent.area === area.id);
        if (areaAgents.length === 0 && query) return null;
        return (
          <div key={area.id} className="ams-agent-group">
            <h3 className="ams-section-title">
              {area.label} <span className="ams-count">{areaAgents.length}</span>
            </h3>
            {areaAgents.length === 0 ? (
              <p className="ams-muted-note">No agents in this area yet.</p>
            ) : (
              <ul className="ams-agent-items">
                {areaAgents.map((agent) => {
                  const stage = getCurrentStage(agent);
                  const selected = agent.id === selectedId;
                  return (
                    <li key={agent.id}>
                      <button
                        type="button"
                        className={`ams-agent-item ${selected ? 'is-selected' : ''}`}
                        aria-pressed={selected}
                        onClick={() => onSelect(agent.id)}
                      >
                        <span className="ams-agent-item-name">{agent.name}</span>
                        <span className="ams-agent-item-meta">
                          {agent.service || 'No service yet'} · {agent.team || 'No team yet'}
                        </span>
                        <span className="ams-badge-row">
                          <span className="st-badge badge-navy">{getRuntimeOption(agent.runtime?.type)?.shortLabel ?? 'No runtime'}</span>
                          <span className="st-badge badge-purple">Stage {stage.number} · {stage.label}</span>
                          <ConnectionBadge status={agent.runtime?.connectionStatus} />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </section>
  );
}
