import React, { useState } from 'react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { selectLifecycleContext, selectStudioAgent } from '../../../state/selectors';
import { STAGE, getCurrentStage } from '../../../model/agentLifecycle';
import { PASS_MARK_RANGE, averageScoresByMeasure, passesEvaluation } from '../../../model/evaluationModel';
import AgentPickerList from '../AgentPickerList';
import AgentScorePanel from './AgentScorePanel';
import RulesPanel from './RulesPanel';
import ScoreBars from './ScoreBars';

/**
 * Badge describing an agent's evaluation state in the picker.
 *
 * @param {Object} agent
 * @param {import('../../../model/agentLifecycle').LifecycleContext} context
 * @returns {{ className: string, label: string }}
 */
function evaluationBadge(agent, context) {
  if (!agent.evaluation) {
    return agent.stage >= STAGE.HARNESS
      ? { className: 'badge-high', label: 'Not evaluated' }
      : { className: 'badge-info', label: 'Not ready' };
  }
  return passesEvaluation(agent, context)
    ? { className: 'badge-success', label: `Score ${agent.evaluation.score} · pass` }
    : { className: 'badge-critical', label: `Score ${agent.evaluation.score} · fail` };
}

/**
 * Agent evaluation center (F6): platform pass mark, per-agent scores and rule
 * violations, the rules list with rule-pack upload, and the average score per
 * measure across all AMS agents.
 *
 * @param {Object} props
 * @param {string | null} props.selectedAgentId
 * @param {(agentId: string) => void} props.onSelectAgent
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function EvaluationTab({ selectedAgentId, onSelectAgent, showToast }) {
  const { state, actions } = useAmsStudio();
  const context = selectLifecycleContext(state);
  const [passMarkDraft, setPassMarkDraft] = useState(String(context.passMark));

  // Agents ready for evaluation first, then by stage (latest first).
  const agents = [...state.studioAgents].sort((a, b) => (
    Number(b.stage >= STAGE.HARNESS) - Number(a.stage >= STAGE.HARNESS) || b.stage - a.stage
  ));
  const selected = selectStudioAgent(state, selectedAgentId) ?? agents[0] ?? null;
  const evaluated = state.studioAgents.filter((agent) => agent.evaluation);
  const passingCount = evaluated.filter((agent) => passesEvaluation(agent, context)).length;
  const { averages, evaluatedCount } = averageScoresByMeasure(state.studioAgents);
  const blockingRules = state.evaluationRules.filter((rule) => rule.blocking).length;

  const applyPassMark = (event) => {
    event.preventDefault();
    const value = Number(passMarkDraft);
    if (!Number.isFinite(value) || value < PASS_MARK_RANGE.min || value > PASS_MARK_RANGE.max) {
      setPassMarkDraft(String(context.passMark));
      showToast(`Pass mark must be between ${PASS_MARK_RANGE.min} and ${PASS_MARK_RANGE.max}.`);
      return;
    }
    actions.setPassMark(value);
    showToast(`Platform pass mark set to ${Math.round(value)}.`);
  };

  return (
    <div className="ams-page">
      <div className="ams-kpi-row">
        <form className="st-card ams-kpi" onSubmit={applyPassMark}>
          <label className="ams-kpi-label" htmlFor="ams-pass-mark">Platform pass mark</label>
          <div className="ams-inline-form">
            <input
              id="ams-pass-mark"
              type="number"
              min={PASS_MARK_RANGE.min}
              max={PASS_MARK_RANGE.max}
              className="ams-input ams-input-number"
              value={passMarkDraft}
              onChange={(event) => setPassMarkDraft(event.target.value)}
            />
            <button type="submit" className="st-btn st-btn-outline" disabled={Number(passMarkDraft) === context.passMark}>Apply</button>
          </div>
        </form>
        <div className="st-card ams-kpi">
          <span className="ams-kpi-label">Agents evaluated</span>
          <span className="ams-kpi-value">{evaluated.length} <small>of {state.studioAgents.length}</small></span>
        </div>
        <div className="st-card ams-kpi">
          <span className="ams-kpi-label">Passing</span>
          <span className="ams-kpi-value ams-text-success">{passingCount}</span>
        </div>
        <div className="st-card ams-kpi">
          <span className="ams-kpi-label">Active rules</span>
          <span className="ams-kpi-value">{state.evaluationRules.length} <small>{blockingRules} blocking</small></span>
        </div>
      </div>

      <div className="ams-master-detail">
        <AgentPickerList
          ariaLabel="Agents to evaluate"
          selectedId={selected?.id ?? null}
          onSelect={onSelectAgent}
          items={agents.map((agent) => ({
            id: agent.id,
            title: agent.name,
            subtitle: `Stage ${agent.stage} · ${getCurrentStage(agent).label}`,
            badges: [evaluationBadge(agent, context)]
          }))}
        />
        {selected && <AgentScorePanel agent={selected} context={context} showToast={showToast} />}
      </div>

      <section className="st-card ams-card" aria-labelledby="ams-aggregate-title">
        <h3 id="ams-aggregate-title" className="ams-card-title">Average score per measure</h3>
        <p className="ams-card-subtitle">Across {evaluatedCount} evaluated AMS agents · marker at the pass mark ({context.passMark})</p>
        <ScoreBars scores={averages} reference={context.passMark} />
      </section>

      <RulesPanel showToast={showToast} />
    </div>
  );
}
