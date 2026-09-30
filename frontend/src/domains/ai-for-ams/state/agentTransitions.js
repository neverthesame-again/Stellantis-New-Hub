/**
 * @file Pure state transitions for Agent Studio, evaluation and governance
 * (F1, F2, F6, F7).
 *
 * Every transition:
 * - re-checks its guard (the UI disables invalid actions, but the store is the
 *   authority, so a stale click can never skip a stage),
 * - appends to the agent's lifecycle history, and
 * - writes the global audit trail shown in Evaluate & Approve.
 *
 * Record ids and timestamps arrive in the event metadata, so every function
 * here is deterministic.
 */

import {
  CONNECTION_STATUS,
  GOVERNANCE_STATUS,
  INBOX_APPROVAL_TIER,
  getAreaLabel
} from '../model/agentOptions';
import { STAGE, canAdvance, getStage } from '../model/agentLifecycle';
import { PASS_MARK_RANGE, computeEvaluationScores, getRuleViolations } from '../model/evaluationModel';
import { getComplianceChecklist, isFullyCompliant } from '../model/governancePolicies';
import { buildAgentApprovalInboxItem } from '../model/agentRecords';
import { formatDateTime, pluralize } from '../utils/formatters';
import { nextSequentialId } from '../utils/ids';
import { appendAudit, auditEntry } from './auditLog';
import { GOVERNANCE_DECISION, INBOX_DECISION_STATUS, INBOX_DECISION } from './constants';

/**
 * @typedef {import('./auditLog').EventMeta} EventMeta
 * @typedef {import('./seedState').AmsStudioState} AmsStudioState
 */

/**
 * Lifecycle context (pass mark and rules) from the current state.
 *
 * @param {AmsStudioState} state
 * @returns {import('../model/agentLifecycle').LifecycleContext}
 */
export function lifecycleContextOf(state) {
  return { passMark: state.settings.passMark, rules: state.evaluationRules };
}

/**
 * Id the next registered agent will get, e.g. "AMS-AGT-210".
 *
 * @param {AmsStudioState} state
 * @returns {string}
 */
export function nextAgentId(state) {
  return nextSequentialId(state.studioAgents.map((agent) => agent.id), 'AMS-AGT', 200);
}

/**
 * Id the next Workflow Inbox item will get, e.g. "WF-INB-202".
 *
 * @param {AmsStudioState} state
 * @returns {string}
 */
function nextInboxItemId(state) {
  return nextSequentialId(state.inbox.map((item) => item.id), 'WF-INB', 100);
}

const findAgent = (state, agentId) => state.studioAgents.find((agent) => agent.id === agentId);

const replaceAgent = (state, updated) => ({
  ...state,
  studioAgents: state.studioAgents.map((agent) => (agent.id === updated.id ? updated : agent))
});

/**
 * Prepends lifecycle-history entries to an agent (entries in the order they happened).
 *
 * @param {Object} agent
 * @param {EventMeta} meta
 * @param {Array<{ suffix: string, kind: string, action: string, detail?: string, from?: string, to?: string }>} entries
 * @returns {Object}
 */
function withHistory(agent, meta, entries) {
  const records = entries.map(({ suffix, ...fields }) => ({ id: `${meta.eventId}-${suffix}`, at: meta.at, actor: meta.actor, ...fields }));
  return { ...agent, updatedAt: meta.at, history: [...records.reverse(), ...(agent.history || [])] };
}

/**
 * Moves an agent to another stage, recording history and audit.
 *
 * @param {AmsStudioState} state
 * @param {Object} agent   Agent as it should be saved (stage not yet changed).
 * @param {number} toStage
 * @param {EventMeta} meta
 * @returns {AmsStudioState}
 */
function moveToStage(state, agent, toStage, meta) {
  const from = getStage(agent.stage).label;
  const to = getStage(toStage).label;
  const moved = withHistory({ ...agent, stage: toStage }, meta, [
    { suffix: 'stage', kind: 'stage', action: 'Stage changed', from, to, detail: `${from} → ${to}` }
  ]);
  return appendAudit(replaceAgent(state, moved), auditEntry(meta, 'stage', {
    action: 'Stage changed', target: agent.name, from, to, detail: `${from} → ${to}`
  }));
}

/**
 * Registers a new agent as a stage-1 draft (F1 "Save registration").
 *
 * @param {AmsStudioState} state
 * @param {{ agentId: string, registration: Object, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function registerAgent(state, { agentId, registration, meta }) {
  const agent = withHistory({
    ...registration,
    id: agentId,
    stage: STAGE.REGISTRATION,
    harness: { successfulRuns: 0, lastRunAt: null, lastRunStatus: null },
    evaluation: null,
    governance: {
      status: GOVERNANCE_STATUS.NOT_SUBMITTED,
      submittedAt: null,
      decidedAt: null,
      decidedBy: null,
      comment: null,
      inboxItemId: null,
      lastScanAt: null
    },
    publishedAt: null,
    createdAt: meta.at,
    history: []
  }, meta, [{ suffix: 'reg', kind: 'registration', action: 'Registered', detail: 'Draft registration saved' }]);

  return appendAudit({ ...state, studioAgents: [agent, ...state.studioAgents] }, auditEntry(meta, 'reg', {
    action: 'Agent registered', target: agent.name, detail: `${getAreaLabel(agent.area)} • draft`
  }));
}

/**
 * Saves edits to an agent's registration. The form owns the runtime's
 * verification state (it resets it whenever the endpoint changes).
 *
 * @param {AmsStudioState} state
 * @param {{ agentId: string, registration: Object, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function updateAgent(state, { agentId, registration, meta }) {
  const agent = findAgent(state, agentId);
  if (!agent) return state;
  const updated = withHistory({ ...agent, ...registration }, meta, [
    { suffix: 'upd', kind: 'registration', action: 'Registration updated', detail: `Version ${registration.version || agent.version}` }
  ]);
  return appendAudit(replaceAgent(state, updated), auditEntry(meta, 'upd', {
    action: 'Registration updated', target: updated.name
  }));
}

/**
 * Stores the result of a runtime connection check.
 *
 * @param {AmsStudioState} state
 * @param {{ agentId: string, result: import('../model/runtimeVerification').ConnectionResult, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function recordConnectionCheck(state, { agentId, result, meta }) {
  const agent = findAgent(state, agentId);
  if (!agent) return state;
  const action = result.status === CONNECTION_STATUS.CONNECTED ? 'Connection verified' : 'Connection failed';
  const updated = withHistory({
    ...agent,
    runtime: { ...agent.runtime, connectionStatus: result.status, latencyMs: result.latencyMs, checkedAt: result.checkedAt }
  }, meta, [{ suffix: 'conn', kind: 'connection', action, detail: result.message }]);
  return appendAudit(replaceAgent(state, updated), auditEntry(meta, 'conn', {
    action, target: agent.name, detail: result.message
  }));
}

/**
 * Advances an agent one stage when its exit criteria are met (F2). Entering
 * the approval stage opens the governance review and, for Tier 1 services,
 * raises a Workflow Inbox item so approvers keep one queue (F7).
 *
 * @param {AmsStudioState} state
 * @param {{ agentId: string, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function advanceAgentStage(state, { agentId, meta }) {
  const agent = findAgent(state, agentId);
  if (!agent || !canAdvance(agent, lifecycleContextOf(state))) return state;

  const toStage = agent.stage + 1;
  if (toStage !== STAGE.APPROVAL) return moveToStage(state, agent, toStage, meta);

  const needsInboxItem = agent.serviceTier === INBOX_APPROVAL_TIER;
  const inboxItemId = nextInboxItemId(state);
  const submitted = {
    ...agent,
    governance: {
      ...agent.governance,
      status: GOVERNANCE_STATUS.PENDING,
      submittedAt: meta.at,
      decidedAt: null,
      decidedBy: null,
      comment: null,
      inboxItemId: needsInboxItem ? inboxItemId : null
    }
  };
  let next = moveToStage(state, submitted, toStage, meta);
  if (needsInboxItem) {
    const item = buildAgentApprovalInboxItem(findAgent(next, agentId), { id: inboxItemId, at: meta.at, actor: meta.actor });
    next = { ...next, inbox: [item, ...next.inbox] };
  }
  return next;
}

/**
 * Records a harness run (F3 → stage 5 exit criterion).
 *
 * @param {AmsStudioState} state
 * @param {{ agentId: string, passed: boolean, task: string, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function recordHarnessRun(state, { agentId, passed, task, meta }) {
  const agent = findAgent(state, agentId);
  if (!agent) return state;
  const action = passed ? 'Harness run passed' : 'Harness run failed';
  const updated = withHistory({
    ...agent,
    harness: {
      successfulRuns: (agent.harness?.successfulRuns ?? 0) + (passed ? 1 : 0),
      lastRunAt: meta.at,
      lastRunStatus: passed ? 'passed' : 'failed'
    }
  }, meta, [{ suffix: 'run', kind: 'harness', action, detail: task }]);
  return appendAudit(replaceAgent(state, updated), auditEntry(meta, 'run', { action, target: agent.name, detail: task }));
}

/**
 * Re-scores an agent (F6 "Run evaluation") and writes the result to its history.
 * Only agents that have reached harness testing can be evaluated.
 *
 * @param {AmsStudioState} state
 * @param {{ agentId: string, jitter: number[], meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function evaluateAgent(state, { agentId, jitter, meta }) {
  const agent = findAgent(state, agentId);
  if (!agent || agent.stage < STAGE.HARNESS) return state;

  const { scores, score } = computeEvaluationScores(agent, jitter);
  const evaluated = { ...agent, evaluation: { scores, score, evaluatedAt: meta.at } };
  const violations = getRuleViolations(evaluated, state.evaluationRules);
  const blocking = violations.filter((rule) => rule.blocking).length;
  const detail = `Score ${score} (pass mark ${state.settings.passMark}), `
    + (violations.length === 0
      ? 'no rule violations'
      : `${pluralize(blocking, 'blocking violation')}, ${pluralize(violations.length - blocking, 'non-blocking violation')}`);

  const updated = withHistory(evaluated, meta, [{ suffix: 'eval', kind: 'evaluation', action: 'Evaluation run', detail }]);
  return appendAudit(replaceAgent(state, updated), auditEntry(meta, 'eval', { action: 'Evaluation run', target: agent.name, detail }));
}

/**
 * Updates the inbox item linked to an agent's approval, if it is still open.
 *
 * @param {AmsStudioState} state
 * @param {string | null} itemId
 * @param {string} status  Resulting inbox status.
 * @param {string} note    Decision-history line.
 * @param {EventMeta} meta
 * @returns {AmsStudioState}
 */
function syncApprovalInboxItem(state, itemId, status, note, meta) {
  if (!itemId) return state;
  return {
    ...state,
    inbox: state.inbox.map((item) => (
      item.id === itemId && !Object.values(INBOX_DECISION_STATUS).includes(item.status)
        ? {
            ...item,
            status,
            decisionHistory: [{ timestamp: formatDateTime(meta.at), actor: meta.actor, action: note }, ...(item.decisionHistory || [])]
          }
        : item
    ))
  };
}

/**
 * Approves or rejects an agent pending governance review (F7). Approval moves
 * it to Publication; rejection returns it to Evaluation. Both write the audit
 * trail. Approval is refused while any policy check fails.
 *
 * @param {AmsStudioState} state
 * @param {{ agentId: string, decision: 'approve' | 'reject', comment: string, syncInbox?: boolean, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function decideGovernance(state, { agentId, decision, comment, syncInbox = true, meta }) {
  const agent = findAgent(state, agentId);
  if (!agent || agent.stage !== STAGE.APPROVAL || agent.governance?.status !== GOVERNANCE_STATUS.PENDING) return state;

  const approve = decision === GOVERNANCE_DECISION.APPROVE;
  if (approve && !isFullyCompliant(agent)) return state;
  if (!approve && !comment?.trim()) return state;

  const action = approve ? 'Approved for production' : 'Rejected';
  const decided = withHistory({
    ...agent,
    governance: {
      ...agent.governance,
      status: approve ? GOVERNANCE_STATUS.APPROVED : GOVERNANCE_STATUS.REJECTED,
      decidedAt: meta.at,
      decidedBy: meta.actor,
      comment: comment?.trim() || null
    }
  }, meta, [{ suffix: 'gov', kind: 'governance', action, detail: comment?.trim() || undefined }]);

  let next = appendAudit(replaceAgent(state, decided), auditEntry(meta, 'gov', {
    action, target: agent.name, detail: comment?.trim() || undefined
  }));
  next = moveToStage(next, decided, approve ? STAGE.PUBLICATION : STAGE.EVALUATION, meta);

  if (syncInbox) {
    const status = INBOX_DECISION_STATUS[approve ? INBOX_DECISION.APPROVE : INBOX_DECISION.REJECT];
    next = syncApprovalInboxItem(next, agent.governance.inboxItemId, status, `${status} in Governance Center: ${comment?.trim() || 'all policy checks pass'}`, meta);
  }
  return next;
}

/**
 * Publishes an approved agent to the catalogue (stage 8 exit criterion).
 *
 * @param {AmsStudioState} state
 * @param {{ agentId: string, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function publishAgent(state, { agentId, meta }) {
  const agent = findAgent(state, agentId);
  if (!agent || agent.stage !== STAGE.PUBLICATION || agent.publishedAt
    || agent.governance?.status !== GOVERNANCE_STATUS.APPROVED) return state;
  const updated = withHistory({ ...agent, publishedAt: meta.at }, meta, [
    { suffix: 'pub', kind: 'published', action: 'Published to catalogue', detail: `v${agent.version} listed as Active` }
  ]);
  return appendAudit(replaceAgent(state, updated), auditEntry(meta, 'pub', {
    action: 'Published to catalogue', target: agent.name, detail: `v${agent.version}`
  }));
}

/**
 * Re-runs the compliance scan for an agent (F7) and records the outcome.
 *
 * @param {AmsStudioState} state
 * @param {{ agentId: string, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function scanCompliance(state, { agentId, meta }) {
  const agent = findAgent(state, agentId);
  if (!agent) return state;
  const checklist = getComplianceChecklist(agent);
  const passing = checklist.filter((check) => check.passed).length;
  const detail = `${passing} of ${checklist.length} policy checks pass`;
  const updated = withHistory({ ...agent, governance: { ...agent.governance, lastScanAt: meta.at } }, meta, [
    { suffix: 'scan', kind: 'governance', action: 'Compliance scan', detail }
  ]);
  return appendAudit(replaceAgent(state, updated), auditEntry(meta, 'scan', { action: 'Compliance scan', target: agent.name, detail }));
}

/**
 * Changes the platform evaluation pass mark (F6).
 *
 * @param {AmsStudioState} state
 * @param {{ passMark: number, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function setPassMark(state, { passMark, meta }) {
  const value = Math.round(Math.min(Math.max(passMark, PASS_MARK_RANGE.min), PASS_MARK_RANGE.max));
  if (!Number.isFinite(value) || value === state.settings.passMark) return state;
  return appendAudit({ ...state, settings: { ...state.settings, passMark: value } }, auditEntry(meta, 'pass', {
    action: 'Pass mark changed', target: 'Evaluation platform', detail: `${state.settings.passMark} → ${value}`
  }));
}

/**
 * Adds rules from an uploaded rule pack; a rule with an existing id replaces it (F6).
 *
 * @param {AmsStudioState} state
 * @param {{ rules: import('../model/evaluationModel').EvaluationRule[], fileName: string, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function importRules(state, { rules, fileName, meta }) {
  if (rules.length === 0) return state;
  const incoming = new Map(rules.map((rule) => [rule.id, rule]));
  const kept = state.evaluationRules.filter((rule) => !incoming.has(rule.id));
  return appendAudit({ ...state, evaluationRules: [...kept, ...incoming.values()] }, auditEntry(meta, 'rules', {
    action: 'Rule pack imported', target: 'Evaluation platform', detail: `${pluralize(rules.length, 'rule')} from ${fileName}`
  }));
}
