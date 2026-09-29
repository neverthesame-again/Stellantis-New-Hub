import React from 'react';
import { Gauge, ShieldCheck, Award, ArrowRight, TriangleAlert, CircleCheck } from 'lucide-react';
import { EVAL_DIMENSIONS, APPROVERS, GOVERNANCE_POLICIES, formatDateTime } from '../../agentStudioData';
import { FormSection } from './FormSection';
import { governanceStatusMeta } from './onboardingHelpers';

const barTone = (v, threshold) => (v >= threshold ? 'is-good' : v >= 75 ? 'is-warn' : 'is-bad');

/** Section 07 — read-only evaluation preview (scores come from the Evaluation Center). */
export function EvaluationPreview({ index, agent, threshold, onNavigate }) {
  const ev = agent?.evaluation;
  return (
    <FormSection
      id="evaluation"
      index={index}
      icon={Gauge}
      title="Evaluation dimensions"
      subtitle="Read-only preview. Scores are produced by the Evaluation Center against the live pass threshold and rule set."
      aside={ev
        ? <span className={`ad-studio-badge ${ev.failed ? 'is-critical' : 'is-success'}`}>{ev.score}/100 · {ev.failed ? 'Below gate' : 'Gate passed'}</span>
        : <span className="ad-studio-badge">Not evaluated</span>}
    >
      {ev ? (
        <>
          <div className="ad-onb-eval-grid">
            {EVAL_DIMENSIONS.map((d) => {
              const v = ev.dims[d.key];
              return (
                <div key={d.key} className="ad-onb-eval-row" title={d.description}>
                  <span className="ad-onb-eval-label">{d.label}</span>
                  <div className={`ad-studio-progress ${barTone(v, threshold)}`}><span style={{ width: `${v}%` }} /></div>
                  <span className="ad-onb-eval-val">{v}</span>
                </div>
              );
            })}
          </div>
          <div className="ad-onb-eval-foot">
            <span className="ad-studio-muted">Threshold {threshold} · {ev.runs} run{ev.runs === 1 ? '' : 's'} · last {formatDateTime(ev.lastRun)}</span>
            {onNavigate && (
              <button type="button" className="ad-onb-link" onClick={() => onNavigate('evaluation')}>Open Evaluation Center <ArrowRight size={11} /></button>
            )}
          </div>
        </>
      ) : (
        <div className="ad-studio-empty ad-onb-empty-row">
          <span>Not yet evaluated — runs in Evaluation Center once the agent reaches <strong>Workflow Mapped</strong> (stage 5).</span>
          {onNavigate && agent?.stage >= 5 && (
            <button type="button" className="ad-studio-btn is-accent is-sm" onClick={() => onNavigate('evaluation')}>
              <Gauge size={12} /> Evaluate now
            </button>
          )}
        </div>
      )}
    </FormSection>
  );
}

/** Section 08 — approver, governance status and certificate. */
export function GovernanceSection({ index, agent, approver, asil, disabled, failures, onApprover, onNavigate }) {
  const gov = governanceStatusMeta(agent?.governance?.status);
  const mandatory = GOVERNANCE_POLICIES.filter((p) => p.mandatory).length;
  const suggestFusa = ['C', 'D'].includes(asil) && approver !== 'Dr. Katrin Müller';
  return (
    <FormSection
      id="governance"
      index={index}
      icon={ShieldCheck}
      title="Governance & certification"
      subtitle="Named human approver for ISO 26262 / ASPICE gated decisions. Approval and certification happen in the Governance Center."
      aside={<span className={`ad-studio-badge ${gov.tone}`}>{gov.label}</span>}
    >
      <div className="ad-studio-grid-2">
        <label className="ad-studio-field">
          <span className="ad-studio-label">Approver</span>
          <select className="ad-studio-select" value={approver} onChange={(e) => onApprover(e.target.value)} disabled={disabled}>
            <option value="">Unassigned</option>
            {APPROVERS.map((a) => <option key={a.id} value={a.name}>{a.name} — {a.role}</option>)}
          </select>
          {suggestFusa && <span className="ad-onb-help">ASIL {asil}: Dr. Katrin Müller (Functional Safety Manager) is the recommended approver.</span>}
          {!approver && <span className="ad-onb-help">The Human Approval guardrail fails until an approver is assigned.</span>}
        </label>

        <div className="ad-onb-gov-facts">
          <div>
            <span className="ad-studio-label">Certificate</span>
            {agent?.certificateId
              ? <span className="ad-studio-badge is-mono is-success"><Award size={11} /> {agent.certificateId}</span>
              : <span className="ad-studio-muted">Issued at stage 8 (Certified)</span>}
          </div>
          {agent?.governance?.decidedBy && (
            <div>
              <span className="ad-studio-label">Decision</span>
              <span className="ad-onb-gov-decision">{agent.governance.decidedBy} · {formatDateTime(agent.governance.decidedAt)}</span>
              {agent.governance.comment && <span className="ad-studio-muted">“{agent.governance.comment}”</span>}
            </div>
          )}
          {failures && (
            <div>
              <span className="ad-studio-label">Guardrail pre-check</span>
              {failures.length === 0 ? (
                <span className="ad-onb-inline-ok"><CircleCheck size={12} /> {mandatory}/{mandatory} mandatory guardrails pass</span>
              ) : (
                <span className="ad-onb-inline-bad">
                  <TriangleAlert size={12} /> {mandatory - failures.length}/{mandatory} pass · failing: {failures.map((f) => f.name).join(', ')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {agent && agent.stage >= 6 && onNavigate && (
        <div className="ad-onb-eval-foot">
          <span className="ad-studio-muted">Decisions, guardrail evidence and certificates are managed in the Governance Center.</span>
          <button type="button" className="ad-onb-link" onClick={() => onNavigate('governance')}>Open Governance Center <ArrowRight size={11} /></button>
        </div>
      )}
    </FormSection>
  );
}
