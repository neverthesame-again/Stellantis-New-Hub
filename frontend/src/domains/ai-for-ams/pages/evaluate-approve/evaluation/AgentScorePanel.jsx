import React from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { useAmsNavigation } from '../../../navigation/useAmsNavigation';
import { AMS_SUBPAGE } from '../../../navigation/amsRoutes';
import { STAGE, canAdvance, getCurrentStage } from '../../../model/agentLifecycle';
import { getMeasureLabel, getRuleViolations, passesEvaluation } from '../../../model/evaluationModel';
import { formatDateTime } from '../../../utils/formatters';
import ScoreBars from './ScoreBars';

/**
 * Scores, verdict and rule violations for one agent, with "Run evaluation" (F6).
 *
 * @param {Object} props
 * @param {Object} props.agent
 * @param {import('../../../model/agentLifecycle').LifecycleContext} props.context
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function AgentScorePanel({ agent, context, showToast }) {
  const { actions } = useAmsStudio();
  const { goToSubPage } = useAmsNavigation();
  const stage = getCurrentStage(agent);
  const canEvaluate = agent.stage >= STAGE.HARNESS;
  const evaluation = agent.evaluation;
  const violations = getRuleViolations(agent, context.rules);
  const passing = passesEvaluation(agent, context);

  const runEvaluation = () => {
    actions.evaluateAgent(agent.id);
    showToast(`Evaluation run for ${agent.name}; result written to its lifecycle history.`);
  };

  return (
    <section className="st-card ams-card ams-detail" aria-labelledby="ams-score-title">
      <header className="ams-page-header">
        <div>
          <h3 id="ams-score-title" className="ams-card-title">{agent.name}</h3>
          <p className="ams-card-subtitle">Stage {stage.number} · {stage.label} · {agent.serviceTier || 'untiered'}</p>
        </div>
        <div className="ams-page-actions">
          <span className="st-badge badge-purple">Simulated scoring</span>
          <button
            type="button"
            className="st-btn st-btn-primary"
            onClick={runEvaluation}
            disabled={!canEvaluate}
            title={canEvaluate ? undefined : 'Available once the agent reaches harness testing (stage 5)'}
          >
            <RefreshCw size={14} /> Run evaluation
          </button>
        </div>
      </header>

      {evaluation ? (
        <>
          <div className="ams-score-summary">
            <span className="ams-score-big">{evaluation.score}</span>
            <span>
              <span className={`st-badge ${passing ? 'badge-success' : 'badge-critical'}`}>
                {passing ? 'Passes' : 'Does not pass'}
              </span>
              <span className="ams-muted-note"> Pass mark {context.passMark} · evaluated {formatDateTime(evaluation.evaluatedAt)}</span>
            </span>
          </div>
          <ScoreBars scores={evaluation.scores} reference={context.passMark} />

          <div>
            <p className="ams-section-title">Rule violations</p>
            {violations.length === 0 ? (
              <p className="ams-muted-note">No rules broken.</p>
            ) : (
              <ul className="ams-violations">
                {violations.map((rule) => (
                  <li key={rule.id}>
                    <span className={`st-badge ${rule.blocking ? 'badge-critical' : 'badge-high'}`}>
                      {rule.blocking ? 'Blocking' : 'Advisory'}
                    </span>
                    <span><strong>{rule.id}</strong> {rule.name}</span>
                    <span className="ams-muted-note">
                      {getMeasureLabel(rule.measure)} {evaluation.scores[rule.measure]} &lt; {rule.threshold}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <p className="ams-muted-note">
          {canEvaluate ? 'Not evaluated yet — run an evaluation to score this agent.' : 'This agent has not reached harness testing yet.'}
        </p>
      )}

      {agent.stage === STAGE.EVALUATION && canAdvance(agent, context) && (
        <button
          type="button"
          className="ams-next-step"
          onClick={() => goToSubPage(AMS_SUBPAGE.AGENT_STUDIO, { tab: 'onboarding', agentId: agent.id })}
        >
          <span>
            <span className="ams-next-step-label">Ready</span>
            <span className="ams-next-step-title">Advance {agent.name} to Approval in Agent Studio</span>
          </span>
          <ArrowRight size={18} color="var(--stellantis-action)" aria-hidden="true" />
        </button>
      )}
    </section>
  );
}
