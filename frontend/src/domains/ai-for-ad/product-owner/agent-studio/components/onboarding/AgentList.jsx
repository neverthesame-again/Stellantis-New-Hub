import React, { useState } from 'react';
import { Search, X, Sparkles, PauseCircle } from 'lucide-react';
import { AD_SUBDOMAINS, getStage, stageProgress } from '../../agentStudioData';
import { LIST_FILTERS, getRuntime, runtimeStatusMeta } from './onboardingHelpers';

/**
 * Left column — studio agents grouped by AD sub-domain, with search and
 * lifecycle filter chips.
 */
export default function AgentList({ agents, selectedId, newMode, dirtyIds, onSelect }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const matchesQuery = (a) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [a.name, a.program, a.team, a.owner, a.family, getRuntime(a.runtime.type).label, `asil ${a.asil}`]
      .some((v) => (v || '').toLowerCase().includes(q));
  };

  const searched = agents.filter(matchesQuery);
  const activeFilter = LIST_FILTERS.find((f) => f.id === filter) || LIST_FILTERS[0];
  const visible = searched.filter(activeFilter.test);

  const groups = AD_SUBDOMAINS.map((sd) => ({ key: sd, items: visible.filter((a) => a.subDomain === sd) }));
  const other = visible.filter((a) => !AD_SUBDOMAINS.includes(a.subDomain));
  if (other.length) groups.push({ key: 'Other', items: other });

  return (
    <aside className="ad-studio-card ad-onb-list">
      <div className="ad-studio-card-title">
        <h3>Studio agents</h3>
        <span className="ad-studio-badge is-mono">{visible.length}/{agents.length}</span>
      </div>

      <div className="ad-onb-search">
        <Search size={14} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, program, team, runtime…"
          aria-label="Search studio agents"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={12} /></button>
        )}
      </div>

      <div className="ad-onb-chip-row">
        {LIST_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`ad-studio-chip ad-onb-chip-sm ${filter === f.id ? 'is-selected' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            <span className="ad-onb-chip-count">{searched.filter(f.test).length}</span>
          </button>
        ))}
      </div>

      <div className="ad-studio-scroll ad-onb-list-scroll">
        {newMode && (
          <div className="ad-studio-agent-item is-active ad-onb-new-item">
            <span className="ad-studio-agent-item-name"><Sparkles size={12} /> New registration</span>
            <span className="ad-studio-agent-item-meta">Unsaved draft — complete identity and runtime, then register</span>
          </div>
        )}

        {visible.length === 0 && (
          <div className="ad-studio-empty">No agents match this search or filter.</div>
        )}

        {groups.filter((g) => g.items.length > 0).map((g) => (
          <div key={g.key} className="ad-onb-group">
            <div className="ad-onb-group-head">
              <span>{g.key}</span>
              <span className="ad-onb-group-count">{g.items.length}</span>
            </div>
            {g.items.map((a) => {
              const stage = getStage(a.stage);
              const rt = runtimeStatusMeta(a.runtime.status);
              const pct = stageProgress(a.stage);
              return (
                <button
                  key={a.id}
                  type="button"
                  className={`ad-studio-agent-item ad-onb-item ${!newMode && a.id === selectedId ? 'is-active' : ''}`}
                  onClick={() => onSelect(a.id)}
                >
                  <span className="ad-onb-item-head">
                    <span className={`ad-onb-dot ${rt.dot}`} title={`Runtime: ${rt.label}`} />
                    <span className="ad-studio-agent-item-name">{a.name}</span>
                    {dirtyIds.includes(a.id) && <span className="ad-onb-unsaved-dot" title="Unsaved changes" />}
                  </span>
                  <span className="ad-studio-agent-item-meta">{a.program} · {a.team}</span>
                  <span className="ad-studio-agent-item-tags">
                    <span className="ad-studio-badge is-mono is-info">{getRuntime(a.runtime.type).label}</span>
                    <span className={`ad-studio-badge ad-studio-asil asil-${a.asil}`}>ASIL {a.asil}</span>
                    {a.operationalState === 'Suspended' && (
                      <span className="ad-studio-badge is-critical"><PauseCircle size={10} /> Suspended</span>
                    )}
                    {a.governance?.status === 'pending' && <span className="ad-studio-badge is-warning">Awaiting approval</span>}
                  </span>
                  <span className="ad-onb-item-stage">
                    <span className="ad-onb-item-stage-label">{a.stage}/9 · {stage.label}</span>
                    <span className="ad-onb-item-stage-pct">{pct}%</span>
                  </span>
                  <span className={`ad-studio-progress ${a.stage >= 9 ? 'is-good' : ''}`}><span style={{ width: `${Math.max(pct, 4)}%` }} /></span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
