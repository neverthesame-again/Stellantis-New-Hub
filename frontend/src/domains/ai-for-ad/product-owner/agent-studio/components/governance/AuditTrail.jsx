import React, { useMemo, useState } from 'react';
import { History, Search, GitBranch, FlaskConical, Scale, Cpu, Activity } from 'lucide-react';
import { formatDateTime } from '../../agentStudioData';
import { relativeTime } from './governanceUtils';

const TYPES = [
  { id: 'all', label: 'All', icon: Activity },
  { id: 'lifecycle', label: 'Lifecycle', icon: GitBranch },
  { id: 'evaluation', label: 'Evaluation', icon: FlaskConical },
  { id: 'governance', label: 'Governance', icon: Scale },
  { id: 'harness', label: 'Harness', icon: Cpu }
];

const TYPE_ICON = Object.fromEntries(TYPES.map((t) => [t.id, t.icon]));

/**
 * AuditTrail — newest-first, filterable log of every lifecycle, evaluation,
 * governance and harness event. Optionally scoped to the selected agent.
 */
export default function AuditTrail({ audit, agents, selectedAgent, onSelectAgent }) {
  const [type, setType] = useState('all');
  const [query, setQuery] = useState('');
  const [agentOnly, setAgentOnly] = useState(false);

  const nameOf = useMemo(() => {
    const map = Object.fromEntries(agents.map((a) => [a.id, a.name]));
    return (id) => (id ? map[id] || id : 'Platform');
  }, [agents]);

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...audit]
      .sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts))
      .filter((e) => type === 'all' || e.type === type)
      .filter((e) => !agentOnly || !selectedAgent || e.agentId === selectedAgent.id)
      .filter((e) => !q || [e.action, e.actor, e.detail, nameOf(e.agentId)].some((v) => (v || '').toLowerCase().includes(q)));
  }, [audit, type, query, agentOnly, selectedAgent, nameOf]);

  return (
    <aside className="ad-studio-card ad-gov-audit">
      <div className="ad-studio-card-title">
        <h3><History size={13} /> Audit trail</h3>
        <span className="ad-studio-badge is-mono">{entries.length}</span>
      </div>

      <div className="ad-gov-audit-chips">
        {TYPES.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} type="button" className={`ad-studio-chip ad-gov-mini-chip ${type === t.id ? 'is-selected' : ''}`} onClick={() => setType(t.id)}>
              <Icon size={11} /> {t.label}
            </button>
          );
        })}
      </div>

      <label className="ad-gov-search">
        <Search size={13} />
        <input type="search" placeholder="Search action, actor, detail…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>

      {selectedAgent && (
        <label className="ad-gov-toggle">
          <input type="checkbox" checked={agentOnly} onChange={(e) => setAgentOnly(e.target.checked)} />
          Only {selectedAgent.name}
        </label>
      )}

      <ol className="ad-studio-scroll ad-gov-audit-list">
        {entries.length === 0 ? (
          <li className="ad-studio-empty">No audit entries match the current filters.</li>
        ) : entries.map((e) => {
          const Icon = TYPE_ICON[e.type] || Activity;
          return (
            <li key={e.id} className={`ad-gov-audit-item type-${e.type}`}>
              <span className="ad-gov-audit-icon"><Icon size={13} /></span>
              <div className="ad-gov-audit-body">
                <div className="ad-gov-audit-action">{e.action}</div>
                {e.agentId ? (
                  <button type="button" className="ad-gov-audit-agent" onClick={() => onSelectAgent(e.agentId)}>{nameOf(e.agentId)}</button>
                ) : (
                  <span className="ad-gov-audit-agent is-static">Platform</span>
                )}
                {e.detail && <div className="ad-gov-audit-detail">{e.detail}</div>}
                <div className="ad-gov-audit-meta">
                  <span>{e.actor}</span>
                  <span title={formatDateTime(e.ts)}>{relativeTime(e.ts)} · {formatDateTime(e.ts)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
