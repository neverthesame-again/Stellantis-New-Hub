import React from 'react';
import { Activity, Cpu, MemoryStick, Pause, Play, TriangleAlert, Wallet } from 'lucide-react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { useAmsNavigation } from '../../../navigation/useAmsNavigation';
import { AMS_SUBPAGE } from '../../../navigation/amsRoutes';
import { getProgrammeScope, agentsInScope } from '../../../model/opsOverview';
import {
  aggregateRuntime,
  getAgentReadiness,
  getAgentReuseCount,
  getAgentRuntimeMetrics,
  getLastRun,
  isPublished
} from '../../../model/runtimeModel';
import { formatDateTime } from '../../../utils/formatters';
import { useNow } from '../../../utils/useNow';
import EmptyState from '../../../components/EmptyState';
import RunStatusBadge from '../../../components/RunStatusBadge';

/** How often the simulated runtime metrics refresh. */
const REFRESH_MS = 3000;

/**
 * Agent runtime monitor (F12): live CPU, memory, throughput and error-rate
 * tiles for the published agents, and per agent its readiness, skills, tools,
 * reuse, last run and a pause / resume control (mocked). Respects the active
 * programme.
 *
 * @param {Object} props
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function RuntimeTab({ showToast }) {
  const { state, actions } = useAmsStudio();
  const { goToSubPage } = useAmsNavigation();
  const tick = Math.floor(useNow(REFRESH_MS) / REFRESH_MS);
  const scope = getProgrammeScope(state);
  const published = agentsInScope(state, scope).filter(isPublished);

  const rows = published.map((agent) => {
    const paused = state.pausedAgentIds.includes(agent.id);
    return { agent, paused, metrics: getAgentRuntimeMetrics(agent, tick, paused) };
  });
  const fleet = aggregateRuntime(rows.map((row) => row.metrics));
  const tiles = [
    { icon: Cpu, label: 'CPU', value: `${fleet.cpu}%`, hint: 'Average across running agents' },
    { icon: MemoryStick, label: 'Memory', value: `${fleet.memoryGb} GB`, hint: 'Total in use' },
    { icon: Activity, label: 'Throughput', value: `${fleet.throughputPerMin}/min`, hint: 'Requests handled' },
    { icon: TriangleAlert, label: 'Error rate', value: `${fleet.errorRate}%`, hint: 'Weighted by throughput' }
  ];

  const toggle = (agent, paused) => {
    actions.toggleAgentRuntime(agent.id);
    showToast(`${agent.name} ${paused ? 'resumed' : 'paused'}.`);
  };

  return (
    <div className="ams-page">
      <div className="ams-toolbar">
        <p className="ams-muted-note">
          {scope.programme ? `Agents of the “${scope.programme.name}” programme. ` : ''}
          Live values refresh every {REFRESH_MS / 1000} s. <span className="st-badge badge-purple">Simulated telemetry</span>
        </p>
      </div>

      <div className="ams-kpi-row" aria-live="polite">
        {tiles.map(({ icon: Icon, label, value, hint }) => (
          <div key={label} className="st-card ams-kpi">
            <span className="ams-kpi-label"><Icon size={13} aria-hidden="true" /> {label}</span>
            <span className="ams-kpi-value">{value}</span>
            <span className="ams-muted-note">{hint}</span>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState message="No published agents in this programme yet. Publish an agent from Agent Studio to see it running here." />
      ) : (
        <section className="st-card ams-card" aria-labelledby="ams-runtime-agents-title">
          <h3 id="ams-runtime-agents-title" className="ams-card-title">Published agents</h3>
          <div className="ams-table-wrap">
            <table className="ams-table">
              <thead>
                <tr>
                  <th scope="col">Agent</th><th scope="col">Status</th><th scope="col">Readiness</th>
                  <th scope="col">Skills</th><th scope="col">Tools</th><th scope="col">Reuse</th>
                  <th scope="col">CPU · req/min</th><th scope="col">Last run</th><th scope="col" className="is-right">Control</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ agent, paused, metrics }) => {
                  const lastRun = getLastRun(agent, state.runs, state.workflows);
                  return (
                    <tr key={agent.id}>
                      <td className="is-strong">{agent.name}<div className="is-small">{agent.serviceTier} · v{agent.version}</div></td>
                      <td><span className={`st-badge ${paused ? 'badge-high' : 'badge-success'}`}>{paused ? 'Paused' : 'Running'}</span></td>
                      <td>
                        <span className="ams-meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={getAgentReadiness(agent)} aria-label="Readiness">
                          <span className="ams-meter-fill" style={{ width: `${getAgentReadiness(agent)}%` }} />
                        </span>
                        {getAgentReadiness(agent)}%
                      </td>
                      <td>{(agent.skillIds || []).length}</td>
                      <td>{(agent.connectedTools || []).length}</td>
                      <td>{getAgentReuseCount(agent, state.workflows)}</td>
                      <td>{metrics.cpu}% · {metrics.throughputPerMin}</td>
                      <td className="is-small">
                        {lastRun ? <><RunStatusBadge status={lastRun.status} /> {formatDateTime(lastRun.startedAt)}</> : `Harness ${formatDateTime(agent.harness?.lastRunAt) || '—'}`}
                      </td>
                      <td className="is-right">
                        <div className="ams-page-actions ams-justify-end">
                          <button type="button" className="st-btn st-btn-outline" onClick={() => goToSubPage(AMS_SUBPAGE.MONITOR_FINOPS, { tab: 'cost', agentId: agent.id })} title="See this agent's cost">
                            <Wallet size={13} />
                          </button>
                          <button type="button" className="st-btn st-btn-outline" onClick={() => toggle(agent, paused)}>
                            {paused ? <><Play size={13} /> Resume</> : <><Pause size={13} /> Pause</>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
