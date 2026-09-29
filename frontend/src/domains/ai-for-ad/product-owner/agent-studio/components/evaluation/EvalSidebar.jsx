import React, { useMemo, useState } from 'react';
import { History, Activity, CheckCircle2, XCircle, Gauge, ShieldCheck, Cpu, GitBranch, Upload } from 'lucide-react';
import { formatDateTime } from '../../agentStudioData';
import { parseAuditScore, relativeTime, scoreTone } from './evalUtils';

const byNewest = (a, b) => Date.parse(b.ts) - Date.parse(a.ts);

const TYPE_ICON = { evaluation: Gauge, governance: ShieldCheck, harness: Cpu, lifecycle: GitBranch };
const FEED_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'evaluation', label: 'Evaluation' },
  { id: 'lifecycle', label: 'Lifecycle' },
  { id: 'governance', label: 'Governance' }
];

/** Recent evaluation runs (audit entries of type 'evaluation' bound to an agent). */
export function RecentRuns({ audit, agentsById, threshold, selectedId, onSelect }) {
  const runs = useMemo(
    () => audit.filter((e) => e.type === 'evaluation' && e.agentId).sort(byNewest).slice(0, 8),
    [audit]
  );
  return (
    <div className="ad-studio-card">
      <div className="ad-studio-card-title">
        <h3><History size={13} /> Recent runs</h3>
        <span className="ad-studio-badge is-mono">{runs.length}</span>
      </div>
      {runs.length === 0 ? (
        <div className="ad-studio-empty">No evaluation runs recorded yet.</div>
      ) : (
        <ul className="ad-eval-runs">
          {runs.map((e) => {
            const passed = /passed/i.test(e.action);
            const score = parseAuditScore(e.detail);
            const agent = agentsById[e.agentId];
            return (
              <li key={e.id}>
                <button
                  type="button"
                  className={`ad-eval-run ${selectedId === e.agentId ? 'is-active' : ''}`}
                  onClick={() => onSelect(e.agentId)}
                  title={`${e.action} · ${e.detail}`}
                >
                  <span className={`ad-eval-run-icon ${passed ? 'is-good' : 'is-bad'}`}>
                    {passed ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  </span>
                  <span className="ad-eval-run-body">
                    <span className="ad-eval-run-name">{agent?.name || e.agentId}</span>
                    <span className="ad-eval-run-detail">{e.detail}</span>
                    <span className="ad-eval-run-time">{formatDateTime(e.ts)} · {relativeTime(e.ts)}</span>
                  </span>
                  <span className={`ad-eval-run-score is-${score === null ? 'none' : scoreTone(score, threshold)}`}>
                    {score ?? '—'}
                    <small>{passed ? 'PASS' : 'FAIL'}</small>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Activity feed — all Agent Studio audit entries, newest first, filterable by type. */
export function ActivityFeed({ audit, agentsById }) {
  const [filter, setFilter] = useState('all');
  const items = useMemo(
    () => audit.filter((e) => filter === 'all' || e.type === filter).sort(byNewest).slice(0, 10),
    [audit, filter]
  );
  return (
    <div className="ad-studio-card">
      <div className="ad-studio-card-title">
        <h3><Activity size={13} /> Activity feed</h3>
      </div>
      <div className="ad-eval-feed-filters" role="tablist" aria-label="Filter activity">
        {FEED_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`ad-eval-feed-filter ${filter === f.id ? 'is-active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <div className="ad-studio-empty">No activity for this filter.</div>
      ) : (
        <ol className="ad-eval-feed">
          {items.map((e) => {
            const Icon = e.action === 'Rule pack uploaded' ? Upload : TYPE_ICON[e.type] || Activity;
            return (
              <li key={e.id} className={`ad-eval-feed-item is-${e.type}`}>
                <span className="ad-eval-feed-icon"><Icon size={12} /></span>
                <div className="ad-eval-feed-body">
                  <div className="ad-eval-feed-line">
                    <strong>{e.action}</strong>
                    {e.agentId && <span> · {agentsById[e.agentId]?.name || e.agentId}</span>}
                  </div>
                  {e.detail && <div className="ad-eval-feed-detail">{e.detail}</div>}
                  <div className="ad-eval-feed-meta">{e.actor} · {relativeTime(e.ts)}</div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
