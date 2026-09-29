import React, { useMemo, useState } from 'react';
import { Inbox, Search, Siren, UserCheck, Clock, ArrowRight } from 'lucide-react';
import { GOVERNANCE_POLICIES, getStage } from '../../agentStudioData';
import { QUEUE_FILTERS, STATUS_META, isCritical, relativeTime, sortQueue, waitingSince } from './governanceUtils';

/**
 * ApprovalQueue — governed agents filtered by decision status, pending first.
 */
export default function ApprovalQueue({ governed, audit, checksById, filter, onFilter, selectedId, onSelect, notSubmittedCount, onOpenOnboarding }) {
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const c = { all: governed.length, pending: 0, approved: 0, rejected: 0 };
    governed.forEach((a) => { if (c[a.governance.status] != null) c[a.governance.status] += 1; });
    return c;
  }, [governed]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = governed
      .filter((a) => filter === 'all' || a.governance.status === filter)
      .filter((a) => !q || [a.name, a.owner, a.team, a.approver, a.program].some((v) => (v || '').toLowerCase().includes(q)));
    return sortQueue(list, audit);
  }, [governed, audit, filter, query]);

  return (
    <aside className="ad-studio-card ad-gov-queue">
      <div className="ad-studio-card-title">
        <h3><Inbox size={13} /> Approval queue</h3>
        <span className="ad-studio-badge is-mono">{items.length}</span>
      </div>

      <div className="ad-gov-segment" role="tablist" aria-label="Queue filter">
        {QUEUE_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`ad-gov-segment-btn ${filter === f.id ? 'is-active' : ''}`}
            onClick={() => onFilter(f.id)}
          >
            {f.label} <span className="ad-gov-segment-count">{counts[f.id]}</span>
          </button>
        ))}
      </div>

      <label className="ad-gov-search">
        <Search size={13} />
        <input
          type="search"
          placeholder="Search agent, owner, approver…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <div className="ad-studio-scroll ad-gov-queue-list">
        {items.length === 0 ? (
          <div className="ad-studio-empty">
            {query ? 'No agents match your search.' : `No ${filter === 'all' ? '' : `${filter} `}agents in the queue.`}
          </div>
        ) : items.map((a) => {
          const status = STATUS_META[a.governance.status] || STATUS_META.not_submitted;
          const checks = checksById[a.id] || {};
          const passed = GOVERNANCE_POLICIES.filter((p) => checks[p.id]?.pass).length;
          const mandatoryFail = GOVERNANCE_POLICIES.filter((p) => p.mandatory && !checks[p.id]?.pass).length;
          const pending = a.governance.status === 'pending';
          return (
            <button
              key={a.id}
              type="button"
              className={`ad-studio-agent-item ad-gov-queue-item ${selectedId === a.id ? 'is-active' : ''} ${pending && isCritical(a) ? 'is-critical' : ''}`}
              onClick={() => onSelect(a.id)}
            >
              <span className="ad-gov-queue-row">
                <span className="ad-studio-agent-item-name">{a.name}</span>
                {pending && isCritical(a) && <span className="ad-studio-badge is-critical"><Siren size={10} /> Critical</span>}
              </span>
              <span className="ad-studio-agent-item-tags">
                <span className={`ad-studio-badge ad-studio-asil asil-${a.asil}`}>ASIL {a.asil}</span>
                <span className={`ad-studio-badge ${status.tone}`}>{status.label}</span>
                <span className="ad-studio-badge">{getStage(a.stage).label}</span>
              </span>
              <span className="ad-studio-agent-item-meta"><UserCheck size={11} /> {a.approver || 'No approver assigned'}</span>
              <span className="ad-gov-queue-foot">
                <span><Clock size={11} /> {pending ? 'Waiting since' : 'Decided'} {relativeTime(waitingSince(a, audit))}</span>
                <span className={mandatoryFail ? 'ad-gov-bad' : 'ad-gov-ok'}>{passed}/{GOVERNANCE_POLICIES.length} guardrails</span>
              </span>
            </button>
          );
        })}
      </div>

      {notSubmittedCount > 0 && (
        <button type="button" className="ad-gov-queue-note" onClick={onOpenOnboarding}>
          {notSubmittedCount} agent{notSubmittedCount === 1 ? '' : 's'} still in onboarding or evaluation — not yet submitted
          <ArrowRight size={12} />
        </button>
      )}
    </aside>
  );
}
