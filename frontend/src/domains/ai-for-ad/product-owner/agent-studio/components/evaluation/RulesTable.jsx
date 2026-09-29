import React, { useState } from 'react';
import { ListChecks, ShieldAlert, AlertTriangle, Users } from 'lucide-react';
import { EVAL_RULES } from '../../agentStudioData';
import { dimensionLabel, ruleApplies, ruleMin } from './evalUtils';

const SEED_IDS = new Set(EVAL_RULES.map((r) => r.id));

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`ad-eval-switch ${checked ? 'is-on' : ''}`}
      onClick={onChange}
    >
      <span />
    </button>
  );
}

/** Number field that commits on blur / Enter and rejects values outside 0–100. */
function MinInput({ rule, onCommit }) {
  const [draft, setDraft] = useState(null);
  const value = draft ?? String(rule.min);
  const n = Number(value);
  const invalid = value.trim() === '' || !Number.isFinite(n) || n < 0 || n > 100;

  const commit = () => {
    if (!invalid && n !== rule.min) onCommit(n);
    setDraft(null);
  };

  return (
    <input
      type="number"
      min={0}
      max={100}
      step={1}
      className={`ad-studio-input ad-eval-min-input ${invalid ? 'is-invalid' : ''}`}
      value={value}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
        if (e.key === 'Escape') setDraft(null);
      }}
      aria-label={`Minimum for ${rule.name}`}
      title={invalid ? 'Enter a number between 0 and 100' : 'Press Enter to apply'}
    />
  );
}

const scopeText = (rule) => {
  const parts = [];
  if (rule.asil) parts.push(`ASIL ${rule.asil.join(', ')}`);
  if (rule.subDomain) parts.push(rule.subDomain.join(', '));
  return parts.length ? parts : null;
};

/** Violating agents for a rule (evaluated agents in scope scoring below the minimum). */
const violators = (rule, agents, threshold) => {
  const min = ruleMin(rule, threshold);
  return agents.filter((a) => {
    if (!a.evaluation || !ruleApplies(rule, a)) return false;
    const actual = rule.dimension === 'overall' ? a.evaluation.score : a.evaluation.dims[rule.dimension];
    return typeof actual === 'number' && actual < min;
  });
};

export default function RulesTable({ rules, agents, threshold, onToggle, onUpdate }) {
  const enabled = rules.filter((r) => r.enabled);
  const blocking = enabled.filter((r) => r.blocking).length;

  return (
    <section className="ad-studio-card">
      <div className="ad-studio-card-title">
        <h3><ListChecks size={13} /> Evaluation rules & guardrails</h3>
        <div className="ad-eval-rules-summary">
          <span className="ad-studio-badge is-mono">{rules.length} rules</span>
          <span className="ad-studio-badge is-success">{enabled.length} enabled</span>
          <span className="ad-studio-badge is-critical">{blocking} blocking</span>
          <span className="ad-studio-badge is-warning">{enabled.length - blocking} advisory</span>
        </div>
      </div>
      <p className="ad-studio-muted ad-eval-rules-intro">
        Blocking rules stop an agent at the evaluation gate (stage 5 → 6) and regress failing candidates to Skills &amp; Knowledge.
        Advisory rules are flagged but never block. Changes apply immediately to every score on the platform.
      </p>

      <div className="ad-eval-table-wrap">
        <table className="ad-eval-table">
          <thead>
            <tr>
              <th>Rule</th>
              <th>Dimension</th>
              <th>Minimum</th>
              <th>Scope</th>
              <th>Blocking</th>
              <th>Enabled</th>
              <th>Violating</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => {
              const v = violators(r, agents, threshold);
              const scope = scopeText(r);
              return (
                <tr key={r.id} className={r.enabled ? '' : 'is-disabled'}>
                  <td className="ad-eval-table-rule">
                    <div className="ad-eval-table-rule-name">
                      {r.blocking ? <ShieldAlert size={12} className="ad-eval-tone-text is-bad" /> : <AlertTriangle size={12} className="ad-eval-tone-text is-warn" />}
                      {r.name}
                      {!SEED_IDS.has(r.id) && <span className="ad-studio-badge is-purple">Uploaded</span>}
                    </div>
                    <div className="ad-eval-table-rule-desc">{r.description}</div>
                  </td>
                  <td><span className="ad-studio-badge is-mono">{dimensionLabel(r.dimension)}</span></td>
                  <td>
                    {r.dimension === 'overall'
                      ? <span className="ad-eval-table-threshold" title="Edit in the Pass threshold KPI">threshold ({threshold})</span>
                      : <MinInput rule={r} onCommit={(min) => onUpdate(r.id, { min })} />}
                  </td>
                  <td>
                    {scope
                      ? <div className="ad-eval-table-scope">{scope.map((s) => <span key={s} className="ad-studio-badge">{s}</span>)}</div>
                      : <span className="ad-studio-muted">All agents</span>}
                  </td>
                  <td><Switch checked={Boolean(r.blocking)} onChange={() => onUpdate(r.id, { blocking: !r.blocking })} label={`Blocking: ${r.name}`} /></td>
                  <td><Switch checked={r.enabled} onChange={() => onToggle(r.id)} label={`Enabled: ${r.name}`} /></td>
                  <td>
                    <span
                      className={`ad-eval-violating ${v.length && r.enabled ? (r.blocking ? 'is-bad' : 'is-warn') : ''}`}
                      title={v.length ? v.map((a) => a.name).join('\n') : 'No evaluated agent violates this rule'}
                    >
                      <Users size={11} /> {v.length}
                      {!r.enabled && v.length > 0 && <em> (off)</em>}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
