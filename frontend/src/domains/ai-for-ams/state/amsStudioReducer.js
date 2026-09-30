/**
 * @file Root reducer of the AMS studio store.
 *
 * The reducer never reads the clock, generates ids or performs I/O — those
 * values arrive in the action payload (`meta`) from the action creators in
 * `AmsStudioProvider.jsx`. That keeps every transition deterministic. Agent,
 * evaluation and governance transitions live in `agentTransitions.js`; runs
 * and workflows in `runTransitions.js`; the live war room and RCA hand-off in
 * `incidentTransitions.js`; programmes, runtime control and prompt rules in
 * `opsTransitions.js`.
 */

import { GOVERNANCE_STATUS } from '../model/agentOptions';
import { STAGE } from '../model/agentLifecycle';
import { INBOX_LINK_AGENT_APPROVAL, INBOX_LINK_RCA_REMEDIATION, INBOX_LINK_RUN_APPROVAL } from '../model/agentRecords';
import { isFullyCompliant } from '../model/governancePolicies';
import { formatDateTime } from '../utils/formatters';
import {
  advanceAgentStage,
  decideGovernance,
  evaluateAgent,
  importRules,
  publishAgent,
  recordConnectionCheck,
  recordHarnessRun,
  registerAgent,
  scanCompliance,
  setPassMark,
  updateAgent
} from './agentTransitions';
import { appendAudit, auditEntry } from './auditLog';
import {
  advanceIncidentResponse,
  decideRca,
  isRcaAwaitingDecision,
  reopenRca,
  sendRcaToInbox
} from './incidentTransitions';
import { activateProgramme, createProgramme, savePromptRule, toggleAgentRuntime } from './opsTransitions';
import {
  completeRunPlayback,
  decideRunApproval,
  isRunAwaitingApproval,
  saveWorkflow,
  startRun
} from './runTransitions';
import { AMS_ACTION, GOVERNANCE_DECISION, INBOX_DECISION, INBOX_DECISION_STATUS } from './constants';

/** Decision-history text used when the approver leaves no notes. */
const DEFAULT_DECISION_NOTE = 'Decision recorded via AMS Hub';

/**
 * Flips a model's subscription and keeps "My Subscriptions" in step.
 *
 * @param {import('./seedState').AmsStudioState} state
 * @param {{ modelId: string, subscriptionId: string, meta: import('./auditLog').EventMeta }} payload
 * @returns {import('./seedState').AmsStudioState}
 */
function toggleModelSubscription(state, { modelId, subscriptionId, meta }) {
  const model = state.models.find((candidate) => candidate.id === modelId);
  if (!model) return state;

  const subscribed = !model.subscribed;
  const models = state.models.map((candidate) => (
    candidate.id === modelId ? { ...candidate, subscribed } : candidate
  ));

  const isThisModel = (subscription) => subscription.type === 'Model' && subscription.entityName === model.name;
  let subscriptions = state.subscriptions;
  if (subscribed && !subscriptions.some(isThisModel)) {
    subscriptions = [...subscriptions, {
      id: subscriptionId,
      entityName: model.name,
      type: 'Model',
      level: 'Portfolio level',
      monthlyUsage: '0 tokens (new)',
      costAllocation: model.costTierPrice,
      grantedBy: `${meta.actor} (self-service)`,
      renewalDate: `${new Date(meta.at).getFullYear()}-12-31`,
      status: 'Active'
    }];
  } else if (!subscribed) {
    subscriptions = subscriptions.filter((subscription) => !isThisModel(subscription));
  }

  return appendAudit({ ...state, models, subscriptions }, auditEntry(meta, 'sub', {
    action: subscribed ? 'Subscribed' : 'Unsubscribed',
    target: model.name,
    detail: 'Model catalogue'
  }));
}

/**
 * Whether an inbox decision on an agent-approval item can be applied to the
 * linked agent. Approvals need a fully compliant agent; rejections need notes.
 *
 * @param {import('./seedState').AmsStudioState} state
 * @param {Object} item
 * @param {string} decision
 * @param {string} notes
 * @returns {boolean}
 */
export function canDecideLinkedApproval(state, item, decision, notes) {
  if (decision === INBOX_DECISION.ESCALATE) return true;
  if (item.link?.kind === INBOX_LINK_RUN_APPROVAL) return isRunAwaitingApproval(state, item.link.runId);
  if (item.link?.kind === INBOX_LINK_RCA_REMEDIATION) return isRcaAwaitingDecision(state, item.link.incidentId);
  if (item.link?.kind !== INBOX_LINK_AGENT_APPROVAL) return true;
  const agent = state.studioAgents.find((candidate) => candidate.id === item.link.agentId);
  if (!agent || agent.stage !== STAGE.APPROVAL || agent.governance?.status !== GOVERNANCE_STATUS.PENDING) return false;
  return decision === INBOX_DECISION.APPROVE ? isFullyCompliant(agent) : Boolean(notes?.trim());
}

/**
 * Records an approver's decision on an inbox item. Decisions on an agent's
 * approval item are applied to the agent's governance review as well.
 *
 * @param {import('./seedState').AmsStudioState} state
 * @param {{ itemId: string, decision: string, notes: string, meta: import('./auditLog').EventMeta }} payload
 * @returns {import('./seedState').AmsStudioState}
 */
function recordInboxDecision(state, { itemId, decision, notes, meta }) {
  const status = INBOX_DECISION_STATUS[decision];
  const item = state.inbox.find((candidate) => candidate.id === itemId);
  if (!status || !item || !canDecideLinkedApproval(state, item, decision, notes)) return state;

  const comment = notes?.trim() || DEFAULT_DECISION_NOTE;
  const historyEntry = { timestamp: formatDateTime(meta.at), actor: meta.actor, action: `${status}: ${comment}` };
  const inbox = state.inbox.map((candidate) => (
    candidate.id === itemId
      ? { ...candidate, status, decisionHistory: [historyEntry, ...(candidate.decisionHistory || [])] }
      : candidate
  ));

  let next = appendAudit({ ...state, inbox }, auditEntry(meta, 'inbox', {
    action: status, target: itemId, detail: comment
  }));

  if (item.link?.kind === INBOX_LINK_AGENT_APPROVAL && decision !== INBOX_DECISION.ESCALATE) {
    next = decideGovernance(next, {
      agentId: item.link.agentId,
      decision: decision === INBOX_DECISION.APPROVE ? GOVERNANCE_DECISION.APPROVE : GOVERNANCE_DECISION.REJECT,
      comment: `${comment} (decided in Workflow Inbox ${itemId})`,
      syncInbox: false,
      meta
    });
  }
  if (item.link?.kind === INBOX_LINK_RUN_APPROVAL && decision !== INBOX_DECISION.ESCALATE) {
    next = decideRunApproval(next, { runId: item.link.runId, approve: decision === INBOX_DECISION.APPROVE, meta });
  }
  if (item.link?.kind === INBOX_LINK_RCA_REMEDIATION && decision !== INBOX_DECISION.ESCALATE) {
    next = decideRca(next, { incidentId: item.link.incidentId, accept: decision === INBOX_DECISION.APPROVE, via: 'inbox', meta });
  }
  return next;
}

/** Handlers keyed by action type; each takes (state, payload) and returns the next state. */
const HANDLERS = Object.freeze({
  [AMS_ACTION.MODEL_SUBSCRIPTION_TOGGLED]: toggleModelSubscription,
  [AMS_ACTION.INBOX_DECISION_RECORDED]: recordInboxDecision,
  [AMS_ACTION.AGENT_REGISTERED]: registerAgent,
  [AMS_ACTION.AGENT_UPDATED]: updateAgent,
  [AMS_ACTION.AGENT_CONNECTION_CHECKED]: recordConnectionCheck,
  [AMS_ACTION.AGENT_STAGE_ADVANCED]: advanceAgentStage,
  [AMS_ACTION.AGENT_HARNESS_RUN_RECORDED]: recordHarnessRun,
  [AMS_ACTION.AGENT_EVALUATED]: evaluateAgent,
  [AMS_ACTION.AGENT_GOVERNANCE_DECIDED]: decideGovernance,
  [AMS_ACTION.AGENT_PUBLISHED]: publishAgent,
  [AMS_ACTION.AGENT_COMPLIANCE_SCANNED]: scanCompliance,
  [AMS_ACTION.PASS_MARK_CHANGED]: setPassMark,
  [AMS_ACTION.RULES_IMPORTED]: importRules,
  [AMS_ACTION.RUN_STARTED]: startRun,
  [AMS_ACTION.RUN_PLAYBACK_COMPLETED]: completeRunPlayback,
  [AMS_ACTION.WORKFLOW_SAVED]: saveWorkflow,
  [AMS_ACTION.INCIDENT_RESPONSE_ADVANCED]: advanceIncidentResponse,
  [AMS_ACTION.RCA_SENT_TO_INBOX]: sendRcaToInbox,
  [AMS_ACTION.RCA_DECIDED]: decideRca,
  [AMS_ACTION.RCA_REOPENED]: reopenRca,
  [AMS_ACTION.PROGRAMME_CREATED]: createProgramme,
  [AMS_ACTION.PROGRAMME_ACTIVATED]: activateProgramme,
  [AMS_ACTION.AGENT_RUNTIME_TOGGLED]: toggleAgentRuntime,
  [AMS_ACTION.PROMPT_RULE_SAVED]: savePromptRule,
  [AMS_ACTION.STATE_RESET]: (_state, payload) => payload.state
});

/**
 * Root reducer of the AMS studio store.
 *
 * @param {import('./seedState').AmsStudioState} state Current state.
 * @param {{ type: string, payload?: Object }} action One of {@link AMS_ACTION}.
 * @returns {import('./seedState').AmsStudioState} Next state (same reference when nothing changed).
 */
export function amsStudioReducer(state, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action.payload) : state;
}
