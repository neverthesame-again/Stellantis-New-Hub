import React, { useMemo, useState } from 'react';
import { Search, CircleCheck, CircleAlert } from 'lucide-react';
import { AD_SUBDOMAINS } from '../../agentStudioData';
import { harnessReadiness, runtimeLabel } from './harnessUtils';

/** Left column of the Single Agent Harness — agents grouped by AD sub-domain. */
export default function HarnessAgentPicker({ agents, selectedId, onSelect, locked }) {
  const [q, setQ] = useState('');
  const [readyOnly, setReadyOnly] = useState(false);

  const groups = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = agents
      .map((a) => ({ a, r: harnessReadiness(a) }))
      .filter(({ a, r }) => (!readyOnly || r.ready)
        && (!term || `${a.name} ${a.family} ${a.subDomain} ${a.owner}`.toLowerCase().includes(term)));
    const subs = [...AD_SUBDOMAINS, ...new Set(list.map((x) => x.a.subDomain).filter((s) => !AD_SUBDOMAINS.includes(s)))];
    return subs
      .map((sd) => ({
        sd,
        items: list.filter((x) => x.a.subDomain === sd).sort((x, y) => Number(y.r.ready) - Number(x.r.ready))
      }))
      .filter((g) => g.items.length);
  }, [agents, q, readyOnly]);

  const readyCount = agents.filter((a) => harnessReadiness(a).ready).length;

  return (
    <div className="ad-studio-card ad-hrn-picker">
      <div className="ad-studio-card-title">
        <h3>Onboarded agents</h3>
        <span className="ad-studio-badge is-info">{readyCount}/{agents.length} ready</span>
      </div>
      <div className="ad-hrn-search">
        <Search size={13} />
        <input
          className="ad-studio-input"
          placeholder="Search agents, owners…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search agents"
        />
      </div>
      <label className="ad-hrn-check">
        <input type="checkbox" checked={readyOnly} onChange={(e) => setReadyOnly(e.target.checked)} />
        Harness-ready only
      </label>
      {locked && <div className="ad-hrn-lock-note">Pipeline in progress — selection locked</div>}
      <div className="ad-studio-scroll ad-hrn-picker-list">
        {groups.length === 0 && <div className="ad-studio-empty">No agents match “{q}”.</div>}
        {groups.map((g) => (
          <div key={g.sd} className="ad-hrn-picker-group">
            <div className="ad-hrn-picker-group-label">{g.sd} <span>{g.items.length}</span></div>
            {g.items.map(({ a, r }) => (
              <button
                key={a.id}
                type="button"
                className={`ad-studio-agent-item ${a.id === selectedId ? 'is-active' : ''} ${r.ready ? '' : 'ad-hrn-not-ready'}`}
                onClick={() => onSelect(a.id)}
                disabled={locked && a.id !== selectedId}
              >
                <span className="ad-studio-agent-item-name">{a.name}</span>
                <span className="ad-studio-agent-item-meta">{a.family} · v{a.version} · {a.owner}</span>
                <span className="ad-studio-agent-item-tags">
                  <span className="ad-studio-badge is-mono">{runtimeLabel(a.runtime.type)}</span>
                  <span className={`ad-studio-badge ad-studio-asil asil-${a.asil}`}>ASIL {a.asil}</span>
                  <span className="ad-studio-badge is-mono">S{a.stage}</span>
                </span>
                {r.ready ? (
                  <span className="ad-hrn-ready-flag"><CircleCheck size={11} /> Harness-ready</span>
                ) : (
                  <span className="ad-hrn-not-ready-flag"><CircleAlert size={11} /> {r.reason}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
