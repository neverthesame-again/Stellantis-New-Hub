/**
 * @file Pure state transitions for harness runs (F3), workflow runs and saved
 * workflows (F9).
 *
 * The playback provider animates a run and then calls
 * {@link completeRunPlayback}; from there the store decides — from the run's
 * own script — whether it failed, passed or must wait for human approval.
 * Inbox decisions on a paused run arrive through {@link decideRunApproval}.
 */

import { buildRunApprovalInboxItem } from '../model/agentRecords';
import { RUN_KIND, RUN_STATUS, findPlaybackStop } from '../model/runModel';
import { nextSequentialId } from '../utils/ids';
import { recordHarnessRun } from './agentTransitions';
import { appendAudit, auditEntry } from './auditLog';

/** Upper bound on retained runs, to keep saved state small. */
const MAX_RUNS = 40;

/**
 * @typedef {import('./seedState').AmsStudioState} AmsStudioState
 * @typedef {import('./auditLog').EventMeta} EventMeta
 * @typedef {import('../model/runModel').AmsRun} AmsRun
 */

/**
 * Id the next run will get, e.g. "RUN-1004".
 *
 * @param {AmsStudioState} state
 * @returns {string}
 */
export function nextRunId(state) {
  return nextSequentialId(state.runs.map((run) => run.id), 'RUN', 1000);
}

/**
 * Id the next saved custom workflow will get, e.g. "FLOW-3".
 *
 * @param {AmsStudioState} state
 * @returns {string}
 */
export function nextWorkflowId(state) {
  return nextSequentialId(state.workflows.map((workflow) => workflow.id), 'FLOW', 0);
}

const findRun = (state, runId) => state.runs.find((run) => run.id === runId);

const replaceRun = (state, updated) => ({
  ...state,
  runs: state.runs.map((run) => (run.id === updated.id ? updated : run))
});

/**
 * Stores a newly started run.
 *
 * @param {AmsStudioState} state
 * @param {{ run: AmsRun, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function startRun(state, { run, meta }) {
  if (findRun(state, run.id)) return state;
  const next = { ...state, runs: [run, ...state.runs].slice(0, MAX_RUNS) };
  return appendAudit(next, auditEntry(meta, 'run', {
    action: run.kind === RUN_KIND.HARNESS ? 'Harness run started' : 'Workflow run started',
    target: run.title,
    detail: run.id
  }));
}

/**
 * Finishes a run and applies its effects (a harness run counts towards the
 * agent's lifecycle stage 5 criterion).
 *
 * @param {AmsStudioState} state
 * @param {AmsRun} run
 * @param {string} status Final status.
 * @param {EventMeta} meta
 * @returns {AmsStudioState}
 */
function finishRun(state, run, status, meta) {
  let next = replaceRun(state, { ...run, status, finishedAt: meta.at, approvalInboxItemId: null });
  next = appendAudit(next, auditEntry(meta, `run-${status}`, {
    action: `Run ${status}`,
    target: run.title,
    detail: run.id
  }));
  if (run.kind === RUN_KIND.HARNESS && run.agentId) {
    next = recordHarnessRun(next, {
      agentId: run.agentId,
      passed: status === RUN_STATUS.PASSED,
      task: `${run.title} (${run.id})`,
      meta: { ...meta, eventId: `${meta.eventId}-agent` }
    });
  }
  return next;
}

/**
 * Pauses a run at an approval step and raises the Workflow Inbox item.
 *
 * @param {AmsStudioState} state
 * @param {AmsRun} run
 * @param {number} stepIndex
 * @param {EventMeta} meta
 * @returns {AmsStudioState}
 */
function pauseForApproval(state, run, stepIndex, meta) {
  const inboxItemId = nextSequentialId(state.inbox.map((item) => item.id), 'WF-INB', 100);
  const item = buildRunApprovalInboxItem(run, stepIndex, {
    id: inboxItemId,
    at: meta.at,
    actor: meta.actor,
    agent: state.studioAgents.find((agent) => agent.id === run.agentId),
    workflowName: state.workflows.find((workflow) => workflow.id === run.workflowId)?.name
  });
  const paused = { ...run, status: RUN_STATUS.AWAITING_APPROVAL, pendingApprovalIndex: stepIndex, approvalInboxItemId: inboxItemId };
  return appendAudit({ ...replaceRun(state, paused), inbox: [item, ...state.inbox] }, auditEntry(meta, 'pause', {
    action: 'Run awaiting approval',
    target: run.title,
    detail: `${run.id} paused at "${run.steps[stepIndex].label}" — ${inboxItemId}`
  }));
}

/**
 * Moves a run on from a step index to its next stopping point.
 *
 * @param {AmsStudioState} state
 * @param {AmsRun} run
 * @param {number} fromIndex
 * @param {EventMeta} meta
 * @returns {AmsStudioState}
 */
function continueRun(state, run, fromIndex, meta) {
  if (fromIndex >= run.steps.length) return finishRun(state, run, RUN_STATUS.PASSED, meta);
  const stop = findPlaybackStop(run, fromIndex);
  if (stop.reason === 'failed') return finishRun(state, run, RUN_STATUS.FAILED, meta);
  if (stop.reason === 'approval') return pauseForApproval(state, run, stop.index, meta);
  return finishRun(state, run, RUN_STATUS.PASSED, meta);
}

/**
 * Called when playback has revealed every step up to the first stop.
 *
 * @param {AmsStudioState} state
 * @param {{ runId: string, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function completeRunPlayback(state, { runId, meta }) {
  const run = findRun(state, runId);
  if (!run || run.status !== RUN_STATUS.RUNNING) return state;
  return continueRun(state, run, 0, meta);
}

/**
 * Applies a Workflow Inbox decision to a paused run: approval resumes it (it
 * may pause again at a later approval gate); rejection ends it.
 *
 * @param {AmsStudioState} state
 * @param {{ runId: string, approve: boolean, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function decideRunApproval(state, { runId, approve, meta }) {
  const run = findRun(state, runId);
  if (!run || run.status !== RUN_STATUS.AWAITING_APPROVAL) return state;
  const index = run.pendingApprovalIndex;
  if (!approve) return finishRun(state, run, RUN_STATUS.REJECTED, meta);
  const resumed = {
    ...run,
    status: RUN_STATUS.RUNNING,
    approvedStepIndexes: [...run.approvedStepIndexes, index],
    pendingApprovalIndex: null,
    approvalInboxItemId: null
  };
  return continueRun(replaceRun(state, resumed), resumed, index + 1, meta);
}

/**
 * Whether an inbox decision on a run-approval item can be applied.
 *
 * @param {AmsStudioState} state
 * @param {string} runId
 * @returns {boolean}
 */
export function isRunAwaitingApproval(state, runId) {
  return findRun(state, runId)?.status === RUN_STATUS.AWAITING_APPROVAL;
}

/**
 * Marks runs that were mid-playback when the page closed as interrupted.
 * Used when saved state is loaded.
 *
 * @param {AmsStudioState} state
 * @returns {AmsStudioState}
 */
export function interruptUnfinishedRuns(state) {
  if (!state.runs.some((run) => run.status === RUN_STATUS.RUNNING)) return state;
  return {
    ...state,
    runs: state.runs.map((run) => (run.status === RUN_STATUS.RUNNING ? { ...run, status: RUN_STATUS.INTERRUPTED, finishedAt: run.startedAt } : run))
  };
}

/**
 * Saves a workflow: updates it when the id exists, otherwise adds it.
 *
 * @param {AmsStudioState} state
 * @param {{ workflow: Object, meta: EventMeta }} payload Workflow with its final id.
 * @returns {AmsStudioState}
 */
export function saveWorkflow(state, { workflow, meta }) {
  const exists = state.workflows.some((candidate) => candidate.id === workflow.id);
  const saved = { ...workflow, updatedAt: meta.at, createdAt: workflow.createdAt ?? meta.at };
  const workflows = exists
    ? state.workflows.map((candidate) => (candidate.id === workflow.id ? saved : candidate))
    : [...state.workflows, saved];
  return appendAudit({ ...state, workflows }, auditEntry(meta, 'flow', {
    action: exists ? 'Workflow saved' : 'Workflow created',
    target: workflow.name,
    detail: `${workflow.id} • ${workflow.nodes.length} nodes`
  }));
}
