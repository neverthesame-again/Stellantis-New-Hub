import React from 'react';
import { RUN_STATUS } from '../../model/runModel';
import { formatDateTime } from '../../utils/formatters';
import EmptyState from '../../components/EmptyState';
import RunStatusBadge from '../../components/RunStatusBadge';

/**
 * Recent harness runs: agent, task, status and time. Selecting a row shows it.
 *
 * @param {Object} props
 * @param {Object[]} props.runs                 Harness runs, newest first.
 * @param {Record<string, Object>} props.agentsById
 * @param {string | null} props.selectedRunId
 * @param {(runId: string) => void} props.onSelect
 * @param {string | null} props.animatingRunId Run currently playing, shown as running.
 * @returns {JSX.Element}
 */
export default function RecentRuns({ runs, agentsById, selectedRunId, onSelect, animatingRunId }) {
  return (
    <section className="st-card ams-card" aria-labelledby="ams-recent-runs-title">
      <h3 id="ams-recent-runs-title" className="ams-card-title">Recent runs</h3>
      {runs.length === 0 ? (
        <EmptyState message="No harness runs yet. Run an agent above to see it here." />
      ) : (
        <div className="ams-table-wrap">
          <table className="ams-table">
            <thead>
              <tr>
                <th scope="col">Run</th>
                <th scope="col">Agent</th>
                <th scope="col">Task</th>
                <th scope="col">Status</th>
                <th scope="col">Started</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id} className={run.id === selectedRunId ? 'is-selected' : undefined}>
                  <td>
                    <button type="button" className="ams-link-button" onClick={() => onSelect(run.id)} aria-pressed={run.id === selectedRunId}>
                      {run.id}
                    </button>
                  </td>
                  <td className="is-strong">{agentsById[run.agentId]?.name ?? '—'}</td>
                  <td>{run.title}</td>
                  <td><RunStatusBadge status={run.id === animatingRunId ? RUN_STATUS.RUNNING : run.status} /></td>
                  <td className="is-small">{formatDateTime(run.startedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
