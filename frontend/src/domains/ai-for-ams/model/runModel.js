/**
 * @file Run model shared by AI Harness runs (F3) and workflow runs (F9).
 *
 * A run is a precomputed script of steps. Playback reveals the steps in order
 * until it reaches a failed step, a human-approval step or the end:
 * - failed step   → the run fails; later steps are skipped,
 * - approval step → the run pauses and a Workflow Inbox item is raised; the
 *                   inbox decision resumes (approve) or ends (reject) it,
 * - end           → the run passes.
 *
 * Everything here is pure; the store and the playback provider decide when.
 */

/** Kinds of run. */
export const RUN_KIND = Object.freeze({
  HARNESS: 'harness',
  WORKFLOW: 'workflow'
});

/** Lifecycle of a run. */
export const RUN_STATUS = Object.freeze({
  RUNNING: 'running',
  AWAITING_APPROVAL: 'awaiting-approval',
  PASSED: 'passed',
  FAILED: 'failed',
  REJECTED: 'rejected',
  INTERRUPTED: 'interrupted'
});

/** Statuses after which nothing more happens to a run. */
export const FINAL_RUN_STATUSES = Object.freeze([
  RUN_STATUS.PASSED,
  RUN_STATUS.FAILED,
  RUN_STATUS.REJECTED,
  RUN_STATUS.INTERRUPTED
]);

/** Precomputed outcome of a step. */
export const STEP_OUTCOME = Object.freeze({
  PASSED: 'passed',
  WARNING: 'warning',
  FAILED: 'failed',
  APPROVAL: 'approval',
  SKIPPED: 'skipped'
});

/** What a step looks like right now (outcome + progress of the run). */
export const STEP_STATUS = Object.freeze({
  PENDING: 'pending',
  RUNNING: 'running',
  PASSED: 'passed',
  WARNING: 'warning',
  FAILED: 'failed',
  WAITING: 'waiting',
  REJECTED: 'rejected',
  SKIPPED: 'skipped'
});

/** Log levels. */
export const LOG_LEVEL = Object.freeze({ INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR' });

/**
 * @typedef {Object} RunStep
 * @property {string} id
 * @property {string} label
 * @property {string} detail       One-line result.
 * @property {number} durationMs
 * @property {string} outcome      One of {@link STEP_OUTCOME}.
 * @property {boolean} simulated   True when generated without a connected runtime.
 * @property {string} [nodeId]     Workflow node the step belongs to (workflow runs).
 */

/**
 * @typedef {Object} RunLogLine
 * @property {string} id
 * @property {number} offsetMs     Time since the run started.
 * @property {'INFO' | 'WARN' | 'ERROR'} level
 * @property {string} message
 * @property {number} stepIndex
 */

/**
 * @typedef {Object} AmsRun
 * @property {string} id
 * @property {'harness' | 'workflow'} kind
 * @property {string} title              Task or workflow name.
 * @property {string | null} agentId      Harness runs.
 * @property {string | null} workflowId   Workflow runs.
 * @property {string | null} incidentId   Workflow runs.
 * @property {number} seed
 * @property {string} status             One of {@link RUN_STATUS}.
 * @property {string} startedAt
 * @property {string | null} finishedAt
 * @property {RunStep[]} steps
 * @property {RunLogLine[]} logs
 * @property {{ contextConfidence: number, reuseReadiness: number, knowledgeCoverage: number } | null} gauges
 * @property {number | null} pendingApprovalIndex Approval step the run is waiting on.
 * @property {number[]} approvedStepIndexes       Approval steps already approved.
 * @property {string | null} approvalInboxItemId  Open Workflow Inbox item, if any.
 */

/**
 * Marks every step after the first failure as skipped. Builders call this so
 * a run's script is always consistent.
 *
 * @param {RunStep[]} steps
 * @returns {RunStep[]}
 */
export function skipStepsAfterFailure(steps) {
  const failedAt = steps.findIndex((step) => step.outcome === STEP_OUTCOME.FAILED);
  if (failedAt === -1) return steps;
  return steps.map((step, index) => (index > failedAt ? { ...step, outcome: STEP_OUTCOME.SKIPPED } : step));
}

/**
 * Where playback starting at `fromIndex` stops.
 *
 * @param {AmsRun} run
 * @param {number} fromIndex
 * @returns {{ index: number, reason: 'failed' | 'approval' | 'end' }}
 *   `index` is the last step playback reveals.
 */
export function findPlaybackStop(run, fromIndex) {
  for (let index = fromIndex; index < run.steps.length; index += 1) {
    const { outcome } = run.steps[index];
    if (outcome === STEP_OUTCOME.FAILED) return { index, reason: 'failed' };
    if (outcome === STEP_OUTCOME.APPROVAL) return { index, reason: 'approval' };
  }
  return { index: run.steps.length - 1, reason: 'end' };
}

/**
 * Final display status of a step, once playback is no longer animating it.
 *
 * @param {AmsRun} run
 * @param {number} index
 * @returns {string} One of {@link STEP_STATUS}.
 */
function settledStepStatus(run, index) {
  const step = run.steps[index];
  if (run.status === RUN_STATUS.INTERRUPTED) return STEP_STATUS.SKIPPED;
  if (run.status === RUN_STATUS.RUNNING) return STEP_STATUS.PENDING;

  const pending = run.pendingApprovalIndex;
  if (run.status === RUN_STATUS.AWAITING_APPROVAL && pending !== null) {
    if (index === pending) return STEP_STATUS.WAITING;
    if (index > pending) return STEP_STATUS.PENDING;
  }
  if (run.status === RUN_STATUS.REJECTED && pending !== null) {
    if (index === pending) return STEP_STATUS.REJECTED;
    if (index > pending) return STEP_STATUS.SKIPPED;
  }

  switch (step.outcome) {
    case STEP_OUTCOME.APPROVAL:
      return run.approvedStepIndexes.includes(index) ? STEP_STATUS.PASSED : STEP_STATUS.PENDING;
    case STEP_OUTCOME.WARNING:
      return STEP_STATUS.WARNING;
    case STEP_OUTCOME.FAILED:
      return STEP_STATUS.FAILED;
    case STEP_OUTCOME.SKIPPED:
      return STEP_STATUS.SKIPPED;
    default:
      return STEP_STATUS.PASSED;
  }
}

/**
 * Display status of a step.
 *
 * @param {AmsRun} run
 * @param {number} index
 * @param {number | null} revealedCount Steps revealed so far when the run is
 *   being played back right now; null otherwise.
 * @returns {string} One of {@link STEP_STATUS}.
 */
export function getStepStatus(run, index, revealedCount) {
  if (revealedCount === null) return settledStepStatus(run, index);
  if (index === revealedCount) return STEP_STATUS.RUNNING;
  if (index > revealedCount) return STEP_STATUS.PENDING;
  const outcome = run.steps[index].outcome;
  if (outcome === STEP_OUTCOME.APPROVAL) return STEP_STATUS.WAITING;
  if (outcome === STEP_OUTCOME.WARNING) return STEP_STATUS.WARNING;
  if (outcome === STEP_OUTCOME.FAILED) return STEP_STATUS.FAILED;
  return STEP_STATUS.PASSED;
}

/**
 * Log lines visible for the run: during playback only those of revealed steps.
 *
 * @param {AmsRun} run
 * @param {number | null} revealedCount
 * @returns {RunLogLine[]}
 */
export function getVisibleLogs(run, revealedCount) {
  if (revealedCount === null) {
    if (run.status === RUN_STATUS.AWAITING_APPROVAL || run.status === RUN_STATUS.REJECTED) {
      return run.logs.filter((line) => line.stepIndex <= run.pendingApprovalIndex);
    }
    return run.status === RUN_STATUS.RUNNING ? [] : run.logs.filter((line) => run.steps[line.stepIndex]?.outcome !== STEP_OUTCOME.SKIPPED);
  }
  return run.logs.filter((line) => line.stepIndex < revealedCount);
}

/**
 * Builds log lines for a step at a given time offset.
 *
 * @param {string} runId
 * @param {number} stepIndex
 * @param {number} offsetMs
 * @param {Array<[string, string]>} entries Pairs of [level, message].
 * @returns {RunLogLine[]}
 */
export function stepLogs(runId, stepIndex, offsetMs, entries) {
  return entries.map(([level, message], index) => ({
    id: `${runId}-L${stepIndex}-${index}`,
    offsetMs: offsetMs + index * 40,
    level,
    message,
    stepIndex
  }));
}
