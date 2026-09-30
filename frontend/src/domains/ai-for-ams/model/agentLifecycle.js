/**
 * @file AMS agent lifecycle rules (F2).
 *
 * Every AMS agent moves through nine stages, in order, from registration to
 * production operation. A stage's exit criteria must all be met before the
 * agent may advance; stages can never be skipped. These rules are pure
 * functions over the agent record so onboarding (F1), evaluation (F6),
 * governance (F7) and the Ops Studio scorecard (F11) all apply them the same way.
 *
 * Criteria that depend on platform settings (the pass mark and the evaluation
 * rules) read them from a {@link LifecycleContext}, so tightening the rules
 * immediately re-blocks agents still in the evaluation stage.
 */

import { CONNECTION_STATUS, GOVERNANCE_STATUS } from './agentOptions';
import { DEFAULT_EVALUATION_RULES, DEFAULT_PASS_MARK, getRuleViolations } from './evaluationModel';

/** Registration fields that must be filled before an agent leaves stage 1. */
export const REQUIRED_REGISTRATION_FIELDS = Object.freeze([
  { key: 'name', label: 'agent name' },
  { key: 'service', label: 'service or portfolio' },
  { key: 'team', label: 'team' },
  { key: 'owner', label: 'owner' },
  { key: 'purpose', label: 'purpose' },
  { key: 'serviceTier', label: 'service tier' }
]);

/**
 * @typedef {Object} LifecycleContext
 * @property {number} passMark                                  Platform evaluation pass mark.
 * @property {import('./evaluationModel').EvaluationRule[]} rules Active evaluation rules.
 */

/** Context used when a caller does not pass one. */
export const DEFAULT_LIFECYCLE_CONTEXT = Object.freeze({
  passMark: DEFAULT_PASS_MARK,
  rules: DEFAULT_EVALUATION_RULES
});

/**
 * @typedef {Object} ExitCriterion
 * @property {string} id
 * @property {string} label Shown in the "Blocked by" line.
 * @property {(agent: Object, context: LifecycleContext) => boolean} isMet
 */

/**
 * @typedef {Object} LifecycleStage
 * @property {number} number             1-based position.
 * @property {string} id
 * @property {string} label              Short stepper label.
 * @property {string} description        What happens in this stage.
 * @property {ExitCriterion[]} exitCriteria Empty for the final stage.
 */

const hasText = (value) => typeof value === 'string' && value.trim().length > 0;
const hasItems = (value) => Array.isArray(value) && value.length > 0;

/** @type {ReadonlyArray<LifecycleStage>} */
export const LIFECYCLE_STAGES = Object.freeze([
  {
    number: 1,
    id: 'registration',
    label: 'Registration',
    description: 'Draft registration with owner, service and purpose.',
    exitCriteria: [{
      id: 'registration-complete',
      label: 'All required registration fields are filled',
      isMet: (agent) => REQUIRED_REGISTRATION_FIELDS.every(({ key }) => hasText(agent[key]))
    }]
  },
  {
    number: 2,
    id: 'runtime-connection',
    label: 'Runtime',
    description: 'Runtime selected and connection verified.',
    exitCriteria: [{
      id: 'runtime-connected',
      label: 'Runtime connection is verified',
      isMet: (agent) => agent.runtime?.connectionStatus === CONNECTION_STATUS.CONNECTED
    }]
  },
  {
    number: 3,
    id: 'skills-knowledge',
    label: 'Skills & knowledge',
    description: 'Knowledge sources and operational tools bound to the agent.',
    exitCriteria: [
      {
        id: 'knowledge-bound',
        label: 'At least one knowledge source is bound',
        isMet: (agent) => hasItems(agent.knowledgeSources)
      },
      {
        id: 'tools-connected',
        label: 'At least one tool is connected',
        isMet: (agent) => hasItems(agent.connectedTools)
      }
    ]
  },
  {
    number: 4,
    id: 'workflow-mapping',
    label: 'Workflows',
    description: 'Incident workflows the agent takes part in.',
    exitCriteria: [{
      id: 'workflow-mapped',
      label: 'Mapped to at least one incident workflow',
      isMet: (agent) => hasItems(agent.workflowIds)
    }]
  },
  {
    number: 5,
    id: 'harness-testing',
    label: 'Harness test',
    description: 'Run on a real ticket in the AI Harness.',
    exitCriteria: [{
      id: 'harness-passed',
      label: 'At least one successful harness run',
      isMet: (agent) => (agent.harness?.successfulRuns ?? 0) > 0
    }]
  },
  {
    number: 6,
    id: 'evaluation',
    label: 'Evaluation',
    description: 'Scored against AMS measures and rules.',
    exitCriteria: [
      {
        id: 'evaluation-pass-mark',
        label: 'Evaluation score meets the platform pass mark',
        isMet: (agent, context) => (agent.evaluation?.score ?? -1) >= context.passMark
      },
      {
        id: 'no-blocking-violations',
        label: 'No blocking rule violations',
        isMet: (agent, context) => agent.evaluation?.scores !== undefined
          && getRuleViolations(agent, context.rules).every((rule) => !rule.blocking)
      }
    ]
  },
  {
    number: 7,
    id: 'governance-approval',
    label: 'Approval',
    description: 'Checked against operating policies and approved.',
    exitCriteria: [{
      id: 'governance-approved',
      label: 'Governance approval granted',
      isMet: (agent) => agent.governance?.status === GOVERNANCE_STATUS.APPROVED
    }]
  },
  {
    number: 8,
    id: 'publication',
    label: 'Published',
    description: 'Listed in the Agent Studio catalogue as Active.',
    exitCriteria: [{
      id: 'published',
      label: 'Published to the agent catalogue',
      isMet: (agent) => hasText(agent.publishedAt)
    }]
  },
  {
    number: 9,
    id: 'production-operation',
    label: 'Operating',
    description: 'Running in production and monitored.',
    exitCriteria: []
  }
]);

/** Number of lifecycle stages. */
export const STAGE_COUNT = LIFECYCLE_STAGES.length;

/** Stage numbers referenced by features outside the lifecycle itself. */
export const STAGE = Object.freeze({
  REGISTRATION: 1,
  RUNTIME: 2,
  SKILLS_KNOWLEDGE: 3,
  WORKFLOWS: 4,
  HARNESS: 5,
  EVALUATION: 6,
  APPROVAL: 7,
  PUBLICATION: 8,
  OPERATING: 9
});

/** Lowest stage from which an agent may be run in the AI Harness (F3). */
export const HARNESS_MIN_STAGE = STAGE.RUNTIME;

/**
 * Clamps any stored stage value into the valid 1…{@link STAGE_COUNT} range.
 *
 * @param {number} stage
 * @returns {number}
 */
function normaliseStage(stage) {
  const value = Number.isInteger(stage) ? stage : 1;
  return Math.min(Math.max(value, 1), STAGE_COUNT);
}

/**
 * @param {number} stageNumber
 * @returns {LifecycleStage}
 */
export function getStage(stageNumber) {
  return LIFECYCLE_STAGES[normaliseStage(stageNumber) - 1];
}

/**
 * Returns the stage the agent is currently in.
 *
 * @param {Object} agent
 * @returns {LifecycleStage}
 */
export function getCurrentStage(agent) {
  return getStage(agent.stage);
}

/**
 * Lists the exit criteria of the current stage that are not yet met — the
 * "Blocked by" line of the lifecycle tracker.
 *
 * @param {Object} agent
 * @param {LifecycleContext} [context]
 * @returns {ExitCriterion[]} Empty when the agent may advance (or is final).
 */
export function getUnmetExitCriteria(agent, context = DEFAULT_LIFECYCLE_CONTEXT) {
  return getCurrentStage(agent).exitCriteria.filter((criterion) => !criterion.isMet(agent, context));
}

/**
 * Whether the agent may move to the next stage.
 *
 * @param {Object} agent
 * @param {LifecycleContext} [context]
 * @returns {boolean} False at the final stage or while any exit criterion is unmet.
 */
export function canAdvance(agent, context = DEFAULT_LIFECYCLE_CONTEXT) {
  return normaliseStage(agent.stage) < STAGE_COUNT && getUnmetExitCriteria(agent, context).length === 0;
}

/**
 * Counts completed stages. Every stage before the current one is complete; the
 * final stage counts as complete once reached.
 *
 * @param {Object} agent
 * @returns {number} 0–{@link STAGE_COUNT}.
 */
export function getCompletedStageCount(agent) {
  const stage = normaliseStage(agent.stage);
  return stage === STAGE_COUNT ? STAGE_COUNT : stage - 1;
}

/**
 * Lifecycle progress as a whole percentage (completed stages ÷ 9).
 *
 * @param {Object} agent
 * @returns {number} 0–100.
 */
export function getProgressPercent(agent) {
  return Math.round((getCompletedStageCount(agent) / STAGE_COUNT) * 100);
}

/**
 * Whether the agent may be run in the AI Harness.
 *
 * @param {Object} agent
 * @returns {boolean}
 */
export function isHarnessEligible(agent) {
  return normaliseStage(agent.stage) >= HARNESS_MIN_STAGE;
}

/**
 * Counts agents per stage for the Ops Studio scorecard.
 *
 * @param {Object[]} agents
 * @returns {Record<number, number>} Map of stage number → agent count (every stage present).
 */
export function countAgentsByStage(agents) {
  const counts = Object.fromEntries(LIFECYCLE_STAGES.map((stage) => [stage.number, 0]));
  agents.forEach((agent) => {
    counts[normaliseStage(agent.stage)] += 1;
  });
  return counts;
}
