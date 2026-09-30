import React, { useState } from 'react';
import { getPolicyCoverage } from '../../../model/governancePolicies';

/**
 * Colour band for a coverage percentage.
 *
 * @param {number | null} coverage
 * @returns {string} Modifier class.
 */
function coverageTone(coverage) {
  if (coverage === null) return 'is-neutral';
  if (coverage >= 90) return 'is-good';
  if (coverage >= 70) return 'is-warn';
  return 'is-bad';
}

/**
 * Policy matrix tiles with coverage % across governed agents (F7). Clicking a
 * tile lists the agents failing that policy.
 *
 * @param {Object} props
 * @param {Object[]} props.agents               All studio agents.
 * @param {(agentId: string) => void} props.onSelectAgent Opens an agent's checklist.
 * @returns {JSX.Element}
 */
export default function PolicyMatrix({ agents, onSelectAgent }) {
  const coverage = getPolicyCoverage(agents);
  const [openPolicyId, setOpenPolicyId] = useState(null);
  const open = coverage.find((entry) => entry.policy.id === openPolicyId);

  return (
    <section className="st-card ams-card" aria-labelledby="ams-policy-title">
      <div>
        <h3 id="ams-policy-title" className="ams-card-title">Operating policy coverage</h3>
        <p className="ams-card-subtitle">Share of agents at Evaluation or later that pass each policy. Select a tile to see who fails it.</p>
      </div>

      <div className="ams-policy-grid">
        {coverage.map(({ policy, coverage: percent, passing, total }) => (
          <button
            key={policy.id}
            type="button"
            className={`ams-policy-tile ${coverageTone(percent)} ${openPolicyId === policy.id ? 'is-open' : ''}`}
            aria-expanded={openPolicyId === policy.id}
            onClick={() => setOpenPolicyId(openPolicyId === policy.id ? null : policy.id)}
            title={policy.description}
          >
            <span className="ams-policy-name">{policy.label}</span>
            <span className="ams-policy-value">{percent === null ? '—' : `${percent}%`}</span>
            <span className="ams-muted-note">{passing} of {total} agents</span>
          </button>
        ))}
      </div>

      {open && (
        <div className="ams-callout is-info" role="region" aria-label={`Agents failing ${open.policy.label}`}>
          {open.failingAgents.length === 0 ? (
            <span>Every governed agent passes <strong>{open.policy.label}</strong>.</span>
          ) : (
            <span>
              <strong>Failing {open.policy.label}:</strong>{' '}
              {open.failingAgents.map((agent, index) => (
                <React.Fragment key={agent.id}>
                  {index > 0 && ', '}
                  <button type="button" className="ams-link-button" onClick={() => onSelectAgent(agent.id)}>
                    {agent.name}
                  </button>
                  {' '}<span className="ams-muted-note">({open.policy.check(agent).evidence})</span>
                </React.Fragment>
              ))}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
