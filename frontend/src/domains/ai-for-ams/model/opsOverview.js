/**
 * @file Ops Studio overview (F11): programme scope, scorecard, guided next
 * steps and recent activity — all derived from live store data.
 */

import { CONNECTION_STATUS, GOVERNANCE_STATUS } from './agentOptions';
import { STAGE, canAdvance, getCurrentStage } from './agentLifecycle';
import { FIX_DECISION_STEP, RCA_STATUS } from './incidentResponse';
import { RUN_KIND, RUN_STATUS } from './runModel';
import { getAgentReuseCount } from './runtimeModel';
import { pluralize } from '../utils/formatters';

/**
 * @typedef {Object} ProgrammeScope
 * @property {Object | null} programme    Active programme, or null for all.
 * @property {Set<string> | null} agentIds Agents in scope, or null for all.
 */

/**
 * The active programme and the agents it covers.
 *
 * @param {import('../state/seedState').AmsStudioState} state
 * @returns {ProgrammeScope}
 */
export function getProgrammeScope(state) {
  const programme = state.programmes.find((candidate) => candidate.id === state.activeProgrammeId) ?? null;
  return { programme, agentIds: programme ? new Set(programme.agentIds) : null };
}

/**
 * Studio agents in scope.
 *
 * @param {import('../state/seedState').AmsStudioState} state
 * @param {ProgrammeScope} scope
 * @returns {Object[]}
 */
export function agentsInScope(state, scope) {
  return scope.agentIds ? state.studioAgents.filter((agent) => scope.agentIds.has(agent.id)) : state.studioAgents;
}

/**
 * Runs in scope: harness runs of in-scope agents and workflow runs of
 * workflows that use an in-scope agent.
 *
 * @param {import('../state/seedState').AmsStudioState} state
 * @param {ProgrammeScope} scope
 * @returns {Object[]}
 */
export function runsInScope(state, scope) {
  if (!scope.agentIds) return state.runs;
  const workflowIds = new Set(state.workflows
    .filter((workflow) => (workflow.nodes || []).some((node) => scope.agentIds.has(node.data?.agentId)))
    .map((workflow) => workflow.id));
  return state.runs.filter((run) => (run.kind === RUN_KIND.HARNESS ? scope.agentIds.has(run.agentId) : workflowIds.has(run.workflowId)));
}

/**
 * Agent scorecard (F11): agents, published, harness runs, average quality,
 * reuse and verified connections.
 *
 * @param {import('../state/seedState').AmsStudioState} state
 * @param {ProgrammeScope} scope
 * @returns {Array<{ id: string, label: string, value: string, hint: string }>}
 */
export function getScorecard(state, scope) {
  const agents = agentsInScope(state, scope);
  const evaluated = agents.filter((agent) => agent.evaluation);
  const harnessRuns = runsInScope(state, scope).filter((run) => run.kind === RUN_KIND.HARNESS);
  const passedRuns = harnessRuns.filter((run) => run.status === RUN_STATUS.PASSED).length;
  const reuse = agents.reduce((sum, agent) => sum + getAgentReuseCount(agent, state.workflows), 0);
  const quality = evaluated.length ? Math.round(evaluated.reduce((sum, agent) => sum + agent.evaluation.score, 0) / evaluated.length) : null;
  return [
    { id: 'agents', label: 'Agents', value: String(agents.length), hint: `${agents.filter((agent) => agent.stage < STAGE.OPERATING).length} in onboarding` },
    { id: 'published', label: 'Published', value: String(agents.filter((agent) => agent.publishedAt).length), hint: 'Listed in the catalogue' },
    { id: 'runs', label: 'Harness runs', value: String(harnessRuns.length), hint: `${passedRuns} passed` },
    { id: 'quality', label: 'Average quality', value: quality === null ? '—' : String(quality), hint: `${pluralize(evaluated.length, 'agent')} evaluated` },
    { id: 'reuse', label: 'Reuse', value: String(reuse), hint: 'Agent uses across workflows' },
    { id: 'verified', label: 'Verified', value: String(agents.filter((agent) => agent.runtime?.connectionStatus === CONNECTION_STATUS.CONNECTED).length), hint: 'Runtime connection verified' }
  ];
}

/**
 * @typedef {Object} NextStepGap
 * @property {string} id
 * @property {string} message
 * @property {{ kind: 'subpage' | 'tab', id: string, params?: Object }} target Where to go to close the gap.
 */

/**
 * Gaps in the flow, most urgent first, each with a jump target (F11 guided next step).
 *
 * @param {import('../state/seedState').AmsStudioState} state
 * @param {ProgrammeScope} scope
 * @param {import('./agentLifecycle').LifecycleContext} context
 * @returns {{ summary: string, gaps: NextStepGap[] }}
 */
export function getNextStepGaps(state, scope, context) {
  const agents = agentsInScope(state, scope);
  const gaps = [];

  const pendingApproval = agents.filter((agent) => agent.governance?.status === GOVERNANCE_STATUS.PENDING);
  if (pendingApproval.length) {
    gaps.push({ id: 'approval', message: `${pluralize(pendingApproval.length, 'agent')} waiting for approval`, target: { kind: 'subpage', id: 'evaluate-approve', params: { tab: 'approve', agentId: pendingApproval[0].id } } });
  }
  const pausedRuns = runsInScope(state, scope).filter((run) => run.status === RUN_STATUS.AWAITING_APPROVAL);
  if (pausedRuns.length) {
    gaps.push({ id: 'runs', message: `${pluralize(pausedRuns.length, 'run')} paused for approval`, target: { kind: 'tab', id: 'inbox' } });
  }
  const fixDecisions = Object.values(state.incidentResponses).filter((response) => (
    response.step === FIX_DECISION_STEP && response.rca.status !== RCA_STATUS.ACCEPTED
  ));
  if (fixDecisions.length) {
    gaps.push({ id: 'fixes', message: `${pluralize(fixDecisions.length, 'incident fix', 'incident fixes')} awaiting a decision`, target: { kind: 'tab', id: 'dashboard', params: { incidentId: fixDecisions[0].incidentId } } });
  }
  const notEvaluated = agents.filter((agent) => agent.stage === STAGE.EVALUATION && !agent.evaluation);
  if (notEvaluated.length) {
    gaps.push({ id: 'evaluate', message: `${pluralize(notEvaluated.length, 'agent')} ready to evaluate`, target: { kind: 'subpage', id: 'evaluate-approve', params: { tab: 'evaluate', agentId: notEvaluated[0].id } } });
  }
  const ready = agents.filter((agent) => agent.stage !== STAGE.APPROVAL && canAdvance(agent, context));
  if (ready.length) {
    gaps.push({ id: 'advance', message: `${pluralize(ready.length, 'agent')} ready to advance — ${ready[0].name} can move past ${getCurrentStage(ready[0]).label}`, target: { kind: 'subpage', id: 'agent-studio', params: { tab: 'onboarding', agentId: ready[0].id } } });
  }

  const evaluatedCount = agents.filter((agent) => agent.evaluation).length;
  const summary = `${pluralize(evaluatedCount, 'agent')} evaluated, ${pendingApproval.length} waiting for approval`;
  return { summary, gaps };
}

/** Audit actions that count as activity (runs, approvals, publishes, stage changes). */
const ACTIVITY_PATTERN = /run|approved|rejected|published|stage changed|fix/i;

/**
 * Recent activity feed (F11), newest first, limited to the programme scope.
 *
 * @param {import('../state/seedState').AmsStudioState} state
 * @param {ProgrammeScope} scope
 * @param {number} [limit]
 * @returns {Object[]} Audit entries.
 */
export function getRecentActivity(state, scope, limit = 8) {
  const names = scope.agentIds ? new Set(agentsInScope(state, scope).map((agent) => agent.name)) : null;
  const runTitles = scope.agentIds ? new Set(runsInScope(state, scope).map((run) => run.title)) : null;
  return state.auditLog
    .filter((entry) => ACTIVITY_PATTERN.test(entry.action))
    .filter((entry) => !names || names.has(entry.target) || runTitles.has(entry.target))
    .slice(0, limit);
}
