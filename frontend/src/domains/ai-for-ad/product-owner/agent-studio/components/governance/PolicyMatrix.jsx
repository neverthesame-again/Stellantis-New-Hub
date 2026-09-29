import React from 'react';
import { LayoutGrid, CircleCheck, CircleX, X, ArrowRight } from 'lucide-react';
import { GOVERNANCE_POLICIES } from '../../agentStudioData';
import { coverageTone, policyCoverage } from './governanceUtils';

/**
 * PolicyMatrix — one tile per guardrail policy with coverage across governed
 * agents. Clicking a tile opens a drill-down listing every governed agent's
 * pass/fail and evidence for that policy.
 */
export default function PolicyMatrix({ governed, checksById, activePolicyId, onTogglePolicy, onSelectAgent }) {
  const activePolicy = GOVERNANCE_POLICIES.find((p) => p.id === activePolicyId) || null;

  return (
    <section className="ad-studio-card ad-gov-matrix-card">
      <div className="ad-studio-card-title">
        <h3><LayoutGrid size={13} /> Policy matrix</h3>
        <span className="ad-studio-muted">Coverage across {governed.length} governed agents · click to drill down</span>
      </div>

      <div className="ad-gov-matrix">
        {GOVERNANCE_POLICIES.map((p) => {
          const cov = policyCoverage(p.id, governed, checksById);
          const tone = coverageTone(cov.pct);
          const active = p.id === activePolicyId;
          return (
            <button
              key={p.id}
              type="button"
              className={`ad-gov-tile ${tone} ${active ? 'is-active' : ''}`}
              onClick={() => onTogglePolicy(active ? null : p.id)}
              aria-pressed={active}
            >
              <span className="ad-gov-tile-top">
                <span className="ad-gov-tile-name">{p.name}</span>
                {p.mandatory
                  ? <span className="ad-studio-badge is-critical ad-gov-tile-badge">Mandatory</span>
                  : <span className="ad-studio-badge ad-gov-tile-badge">Advisory</span>}
              </span>
              <span className="ad-gov-tile-standard">{p.standard}</span>
              <span className="ad-gov-tile-value">
                {cov.pct == null ? '—' : `${cov.pct}%`}
                <small>{cov.passed}/{cov.total} pass</small>
              </span>
              <span className={`ad-studio-progress ${tone === 'is-good' ? 'is-good' : tone === 'is-warn' ? 'is-warn' : 'is-bad'}`}>
                <span style={{ width: `${cov.pct ?? 0}%` }} />
              </span>
            </button>
          );
        })}
      </div>

      {activePolicy && (
        <PolicyDrillDown
          policy={activePolicy}
          governed={governed}
          checksById={checksById}
          onClose={() => onTogglePolicy(null)}
          onSelectAgent={onSelectAgent}
        />
      )}
    </section>
  );
}

function PolicyDrillDown({ policy, governed, checksById, onClose, onSelectAgent }) {
  const cov = policyCoverage(policy.id, governed, checksById);
  const rows = [...governed].sort((a, b) => Number(Boolean(checksById[a.id]?.[policy.id]?.pass)) - Number(Boolean(checksById[b.id]?.[policy.id]?.pass)));

  return (
    <div className="ad-gov-drill" role="region" aria-label={`${policy.name} drill-down`}>
      <div className="ad-gov-drill-head">
        <div>
          <div className="ad-studio-eyebrow">{policy.standard}</div>
          <h4>{policy.name} <span className="ad-studio-muted">— {policy.description}</span></h4>
        </div>
        <div className="ad-gov-drill-head-actions">
          <span className={`ad-studio-badge ${cov.failing.length ? 'is-critical' : 'is-success'}`}>
            {cov.failing.length ? `${cov.failing.length} failing` : 'All passing'}
          </span>
          <button type="button" className="ad-studio-btn is-ghost is-sm" onClick={onClose} aria-label="Close drill-down"><X size={13} /></button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="ad-studio-empty">No governed agents yet.</div>
      ) : (
        <div className="ad-gov-drill-list">
          {rows.map((a) => {
            const check = checksById[a.id]?.[policy.id];
            const pass = Boolean(check?.pass);
            return (
              <button key={a.id} type="button" className={`ad-gov-drill-row ${pass ? 'is-pass' : 'is-fail'}`} onClick={() => onSelectAgent(a.id)}>
                {pass ? <CircleCheck size={15} className="ad-gov-ok" /> : <CircleX size={15} className="ad-gov-bad" />}
                <span className="ad-gov-drill-name">
                  {a.name}
                  <span className={`ad-studio-badge ad-studio-asil asil-${a.asil}`}>ASIL {a.asil}</span>
                </span>
                <span className="ad-gov-drill-evidence">{check?.evidence || '—'}</span>
                <span className="ad-gov-drill-go">Review <ArrowRight size={12} /></span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
