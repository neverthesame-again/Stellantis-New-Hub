import React from 'react';
import { Scale, Gauge, ArrowRight, Flag, UserCheck, Cpu } from 'lucide-react';
import { EVAL_DIMENSIONS, getStage, formatDateTime } from '../../agentStudioData';
import { useAgentStudio } from '../../useAgentStudio';
import LifecycleStepper from '../LifecycleStepper';
import GuardrailChecklist from './GuardrailChecklist';
import GovernanceActions from './GovernanceActions';
import { STATUS_META } from './governanceUtils';

const SUMMARY_DIMS = ['safety', 'traceability', 'scenarioCoverage'];

const scoreTone = (v) => (v >= 90 ? 'is-good' : v >= 85 ? 'is-warn' : 'is-bad');

/**
 * AgentGovernancePanel — centre column: identity, lifecycle, evaluation
 * summary, guardrail checklist and the state-dependent governance actions.
 */
export default function AgentGovernancePanel({ agent, checks, notify }) {
  const { navigate, blockersFor } = useAgentStudio();

  if (!agent) {
    return (
      <section className="ad-studio-card ad-gov-panel">
        <div className="ad-studio-empty">Select an agent from the approval queue to review its guardrails.</div>
      </section>
    );
  }

  const status = STATUS_META[agent.governance.status] || STATUS_META.not_submitted;
  const ev = agent.evaluation;
  const nextStage = agent.stage < 9 ? getStage(agent.stage + 1) : null;
  const blockers = blockersFor(agent);

  return (
    <section className="ad-studio-card ad-gov-panel">
      <div className="ad-gov-panel-head">
        <div className="ad-gov-panel-title">
          <div className="ad-studio-eyebrow"><Scale size={11} /> Agent governance</div>
          <h3>{agent.name}</h3>
          <div className="ad-gov-panel-meta">{agent.program} · {agent.team} · Owner {agent.owner}</div>
        </div>
        <div className="ad-gov-panel-badges">
          <span className={`ad-studio-badge ad-gov-pill ${status.tone}`}>{status.label}</span>
          <span className={`ad-studio-badge ad-studio-asil asil-${agent.asil}`}>ASIL {agent.asil}</span>
          <span className="ad-studio-badge is-mono">v{agent.version}</span>
          <span className="ad-studio-badge is-purple">{agent.subDomain}</span>
        </div>
      </div>

      <div className="ad-gov-facts">
        <div><span className="ad-studio-label"><UserCheck size={10} /> Approver</span><strong>{agent.approver || 'Not assigned'}</strong></div>
        <div><span className="ad-studio-label"><Cpu size={10} /> Runtime</span><strong>{agent.runtime.type} · {agent.runtime.status}</strong></div>
        <div><span className="ad-studio-label">Operational</span><strong>{agent.operationalState}</strong></div>
        <div><span className="ad-studio-label">Updated</span><strong>{formatDateTime(agent.updatedAt)}</strong></div>
      </div>

      <div className="ad-gov-section">
        <div className="ad-gov-section-head">
          <h4><Flag size={13} /> Lifecycle</h4>
          <span className="ad-studio-muted">Stage {agent.stage}/9 · {getStage(agent.stage).label}</span>
        </div>
        <LifecycleStepper stage={agent.stage} />
        {nextStage && (
          <div className="ad-gov-next">
            <span><strong>Next: {nextStage.label}</strong> <span className="ad-studio-muted">— {nextStage.exit}</span></span>
            {blockers.length > 0 && (
              <span className="ad-gov-blockers">
                {blockers.map((b) => <span key={b} className="ad-studio-badge is-warning">{b}</span>)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="ad-gov-section">
        <div className="ad-gov-section-head">
          <h4><Gauge size={13} /> Evaluation summary</h4>
          <button type="button" className="ad-studio-btn is-ghost is-sm" onClick={() => navigate({ tab: 'evaluation', agentId: agent.id })}>
            View in Evaluation Center <ArrowRight size={12} />
          </button>
        </div>
        {ev ? (
          <div className="ad-gov-eval">
            <div className={`ad-gov-eval-score ${scoreTone(ev.score)}`}>
              <span className="ad-gov-eval-num">{ev.score}</span>
              <span className="ad-studio-muted">/100 · {ev.runs} run{ev.runs === 1 ? '' : 's'}</span>
              <span className={`ad-studio-badge ${ev.failed ? 'is-critical' : 'is-success'}`}>{ev.failed ? 'Failed' : 'Passed'}</span>
            </div>
            {SUMMARY_DIMS.map((key) => {
              const dim = EVAL_DIMENSIONS.find((d) => d.key === key);
              const v = ev.dims[key];
              return (
                <div key={key} className="ad-gov-eval-dim" title={dim?.description}>
                  <span className="ad-gov-eval-dim-label">{dim?.label}</span>
                  <span className="ad-gov-eval-dim-value">{v}</span>
                  <span className={`ad-studio-progress ${scoreTone(v)}`}><span style={{ width: `${v}%` }} /></span>
                </div>
              );
            })}
            <div className="ad-studio-muted ad-gov-eval-foot">Last run {formatDateTime(ev.lastRun)}</div>
          </div>
        ) : (
          <div className="ad-studio-empty">Not evaluated yet — run an evaluation in the Evaluation Center.</div>
        )}
      </div>

      <GuardrailChecklist key={`chk-${agent.id}`} agent={agent} checks={checks} notify={notify} />
      <GovernanceActions key={`act-${agent.id}`} agent={agent} notify={notify} />
    </section>
  );
}
