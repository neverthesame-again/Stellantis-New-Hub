import React from 'react';
import { ShieldHalf, BookOpen, CircleCheck, CircleX, UserCheck } from 'lucide-react';
import { GOVERNANCE_POLICIES } from '../../agentStudioData';
import CoverageRing from './CoverageRing';
import { REGULATIONS, coverageForPolicies, coverageTone, policyCoverage } from './governanceUtils';

const POLICY_BY_ID = Object.fromEntries(GOVERNANCE_POLICIES.map((p) => [p.id, p]));

/**
 * GuardrailsRegulations — policy table + regulation map (which guardrails
 * enforce ISO 26262, SOTIF, 21434/R155, R156, ASPICE and GDPR).
 */
export default function GuardrailsRegulations({ governed, checksById, onSelectAgent }) {
  return (
    <>
      <section className="ad-studio-card">
        <div className="ad-studio-card-title">
          <h3><ShieldHalf size={13} /> Guardrail policies</h3>
          <span className="ad-studio-muted">
            {GOVERNANCE_POLICIES.filter((p) => p.mandatory).length} mandatory · {GOVERNANCE_POLICIES.filter((p) => !p.mandatory).length} advisory · evaluated on {governed.length} governed agents
          </span>
        </div>
        <div className="ad-gov-table-wrap">
          <table className="ad-gov-table">
            <thead>
              <tr>
                <th>Policy</th>
                <th>Standard</th>
                <th>Description</th>
                <th>Type</th>
                <th>Coverage</th>
                <th>Failing agents</th>
              </tr>
            </thead>
            <tbody>
              {GOVERNANCE_POLICIES.map((p) => {
                const cov = policyCoverage(p.id, governed, checksById);
                const tone = coverageTone(cov.pct);
                return (
                  <tr key={p.id}>
                    <td className="ad-gov-table-name">{p.name}</td>
                    <td><span className="ad-studio-badge is-mono">{p.standard}</span></td>
                    <td className="ad-gov-table-desc">{p.description}</td>
                    <td>{p.mandatory ? <span className="ad-studio-badge is-critical">Mandatory</span> : <span className="ad-studio-badge">Advisory</span>}</td>
                    <td>
                      <div className={`ad-gov-table-cov ${tone}`}>
                        <strong>{cov.pct == null ? '—' : `${cov.pct}%`}</strong>
                        <span className={`ad-studio-progress ${tone === 'is-good' ? 'is-good' : tone === 'is-warn' ? 'is-warn' : 'is-bad'}`}>
                          <span style={{ width: `${cov.pct ?? 0}%` }} />
                        </span>
                        <small>{cov.passed}/{cov.total}</small>
                      </div>
                    </td>
                    <td>
                      {cov.failing.length === 0 ? (
                        <span className="ad-gov-ok ad-gov-inline"><CircleCheck size={12} /> None</span>
                      ) : (
                        <span className="ad-gov-fail-list">
                          {cov.failing.map((a) => (
                            <button key={a.id} type="button" className="ad-gov-fail-chip" onClick={() => onSelectAgent(a.id)} title={checksById[a.id]?.[p.id]?.evidence}>
                              <CircleX size={11} /> {a.name}
                            </button>
                          ))}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ad-studio-card">
        <div className="ad-studio-card-title">
          <h3><BookOpen size={13} /> Regulation map</h3>
          <span className="ad-studio-muted">Which guardrails enforce each automotive regulation · live coverage</span>
        </div>
        <div className="ad-gov-reg-grid">
          {REGULATIONS.map((reg) => {
            const cov = coverageForPolicies(reg.policies, governed, checksById);
            return (
              <article key={reg.id} className={`ad-gov-reg ${coverageTone(cov.pct)}`}>
                <header className="ad-gov-reg-head">
                  <div>
                    <span className="ad-studio-badge is-mono is-info">{reg.code}</span>
                    <h4>{reg.title}</h4>
                  </div>
                  <CoverageRing pct={cov.pct} size={54} />
                </header>
                <p className="ad-gov-reg-summary">{reg.summary}</p>
                <ul className="ad-gov-reg-clauses">
                  {reg.clauses.map((c) => <li key={c}>{c}</li>)}
                </ul>
                <div className="ad-gov-reg-policies">
                  <span className="ad-studio-label">Enforced by</span>
                  <div className="ad-gov-reg-policy-list">
                    {reg.policies.map((pid) => {
                      const p = POLICY_BY_ID[pid];
                      const pc = policyCoverage(pid, governed, checksById);
                      return (
                        <span key={pid} className={`ad-gov-reg-policy ${coverageTone(pc.pct)}`} title={p?.description}>
                          {pc.failing.length ? <CircleX size={11} /> : <CircleCheck size={11} />}
                          {p?.name}
                          <small>{pc.pct == null ? '—' : `${pc.pct}%`}</small>
                        </span>
                      );
                    })}
                  </div>
                </div>
                <footer className="ad-gov-reg-foot">
                  <span><UserCheck size={11} /> {reg.owner}</span>
                  <span>{cov.passed}/{cov.total} checks</span>
                </footer>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
