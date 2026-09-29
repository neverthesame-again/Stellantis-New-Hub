import React, { useMemo, useState } from 'react';
import { Search, History, ChevronRight, Hand, FlaskConical } from 'lucide-react';
import { formatDateTime } from '../../agentStudioData';
import { RUN_STATUS_META, formatDuration } from './harnessUtils';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'awaiting_approval', label: 'Awaiting approval' },
  { id: 'failed', label: 'Failed' },
  { id: 'running', label: 'Running' }
];

/** Filterable list of harness runs. Clicking a row opens the detail drawer. */
export default function RunHistory({ runs, agents, getAgent, onOpen, selectedRunId }) {
  const [status, setStatus] = useState('all');
  const [agentId, setAgentId] = useState('all');
  const [q, setQ] = useState('');

  const counts = useMemo(() => {
    const c = { all: runs.length };
    runs.forEach((r) => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, [runs]);

  const agentsWithRuns = useMemo(() => agents.filter((a) => runs.some((r) => r.agentId === a.id)), [agents, runs]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return runs.filter((r) => (status === 'all' || r.status === status)
      && (agentId === 'all' || r.agentId === agentId)
      && (!term || `${r.id} ${r.task} ${getAgent(r.agentId)?.name || ''} ${r.approver || ''}`.toLowerCase().includes(term)));
  }, [runs, status, agentId, q, getAgent]);

  return (
    <div className="ad-studio-card">
      <div className="ad-studio-card-title">
        <h3><History size={14} /> Run history</h3>
        <span className="ad-studio-muted">{filtered.length} of {runs.length} runs</span>
      </div>

      <div className="ad-hrn-filters">
        <div className="ad-hrn-chip-row">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`ad-studio-chip ${status === f.id ? 'is-selected' : ''}`}
              onClick={() => setStatus(f.id)}
            >
              {f.label} <span className="ad-hrn-chip-count">{counts[f.id] || 0}</span>
            </button>
          ))}
        </div>
        <div className="ad-hrn-filter-controls">
          <select className="ad-studio-select" value={agentId} onChange={(e) => setAgentId(e.target.value)} aria-label="Filter by agent">
            <option value="all">All agents</option>
            {agentsWithRuns.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <div className="ad-hrn-search">
            <Search size={13} />
            <input className="ad-studio-input" placeholder="Search task, run id, approver…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search runs" />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="ad-studio-empty">No harness runs match these filters.</div>
      ) : (
        <div className="ad-hrn-history" role="table">
          <div className="ad-hrn-history-row is-head" role="row">
            <span>Agent</span><span>Task</span><span>Status</span><span>Started</span><span>Duration</span><span>Approver</span><span />
          </div>
          {filtered.map((r) => {
            const agent = getAgent(r.agentId);
            const meta = RUN_STATUS_META[r.status] || { label: r.status, cls: '' };
            return (
              <button
                key={r.id}
                type="button"
                role="row"
                className={`ad-hrn-history-row ${selectedRunId === r.id ? 'is-active' : ''}`}
                onClick={() => onOpen(r.id)}
              >
                <span className="ad-hrn-history-agent">
                  <strong>{agent?.name || r.agentId}</strong>
                  <small className="ad-hrn-mono">{r.id}</small>
                </span>
                <span className="ad-hrn-history-task">
                  {r.task}
                  {r.dryRun && <span className="ad-studio-badge is-info"><FlaskConical size={10} /> Dry run</span>}
                </span>
                <span>
                  <span className={`ad-studio-badge ${meta.cls}`}>
                    {r.status === 'awaiting_approval' && <Hand size={10} />}{meta.label}
                  </span>
                </span>
                <span className="ad-hrn-history-meta" data-label="Started">{formatDateTime(r.startedAt)}</span>
                <span className="ad-hrn-history-meta ad-hrn-mono" data-label="Duration">{formatDuration(r.durationMs)}</span>
                <span className="ad-hrn-history-meta" data-label="Approver">{r.approver || '—'}</span>
                <span className="ad-hrn-history-chevron"><ChevronRight size={14} /></span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
