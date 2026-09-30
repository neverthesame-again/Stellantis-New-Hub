/**
 * @file Pure state transitions for the live war room (F4) and RCA hand-off (F5).
 *
 * Response state per incident:
 * `{ incidentId, step, openedAt, resolvedAt, timeline[], rca: { status, inboxItemId, decidedBy, decidedAt, via } }`.
 * The timeline is stored newest first.
 */

import { buildRcaInboxItem } from '../model/agentRecords';
import { getIncident } from '../model/incidents';
import {
  RCA_STATUS,
  RESOLVED_STEP,
  RESPONSE_STEPS,
  ROOT_CAUSE_STEP,
  canAdvanceResponse,
  responderFor
} from '../model/incidentResponse';
import { formatDateTime } from '../utils/formatters';
import { nextSequentialId } from '../utils/ids';
import { appendAudit, auditEntry } from './auditLog';
import { INBOX_DECISION_STATUS, INBOX_DECISION } from './constants';

/**
 * @typedef {import('./seedState').AmsStudioState} AmsStudioState
 * @typedef {import('./auditLog').EventMeta} EventMeta
 */

/**
 * Creates the response of a newly detected incident (step 0 with its first timeline line).
 *
 * @param {import('../model/incidents').AmsIncident} incident
 * @param {Object[]} agents Studio agents (to name the responder).
 * @param {string} openedAt ISO timestamp.
 * @returns {Object}
 */
export function createIncidentResponse(incident, agents, openedAt) {
  const step = RESPONSE_STEPS[0];
  return {
    incidentId: incident.id,
    step: 0,
    openedAt,
    resolvedAt: null,
    timeline: [{ id: `${incident.id}-T0`, at: openedAt, actor: responderFor(step.area, agents), kind: 'agent', text: step.describe(incident) }],
    rca: { status: RCA_STATUS.NONE, inboxItemId: null, decidedBy: null, decidedAt: null, via: null }
  };
}

/**
 * Moves a response to its next step, adding the step's timeline line.
 * Pure helper shared by the reducer and the seed builder.
 *
 * @param {Object} response
 * @param {import('../model/incidents').AmsIncident} incident
 * @param {Object[]} agents
 * @param {string} at        ISO timestamp.
 * @returns {Object | null}  The next response, or null when it may not advance.
 */
export function stepResponse(response, incident, agents, at) {
  if (!canAdvanceResponse(response).allowed) return null;
  const nextIndex = response.step + 1;
  const step = RESPONSE_STEPS[nextIndex];
  return {
    ...response,
    step: nextIndex,
    resolvedAt: nextIndex === RESOLVED_STEP ? at : null,
    timeline: [
      { id: `${incident.id}-T${nextIndex}-${response.timeline.length}`, at, actor: responderFor(step.area, agents), kind: 'agent', text: step.describe(incident) },
      ...response.timeline
    ]
  };
}

/**
 * Adds a human line (decision, hand-off) to a response's timeline.
 *
 * @param {Object} response
 * @param {string} text
 * @param {EventMeta} meta
 * @returns {Object}
 */
function withHumanEntry(response, text, meta) {
  return {
    ...response,
    timeline: [{ id: `${meta.eventId}-human`, at: meta.at, actor: meta.actor, kind: 'human', text }, ...response.timeline]
  };
}

const replaceResponse = (state, response) => ({
  ...state,
  incidentResponses: { ...state.incidentResponses, [response.incidentId]: response }
});

/**
 * "Advance response" (F4): runs the next response step.
 *
 * @param {AmsStudioState} state
 * @param {{ incidentId: string, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function advanceIncidentResponse(state, { incidentId, meta }) {
  const incident = getIncident(incidentId);
  const response = state.incidentResponses[incidentId];
  if (!incident || !response) return state;
  const next = stepResponse(response, incident, state.studioAgents, meta.at);
  if (!next) return state;
  return appendAudit(replaceResponse(state, next), auditEntry(meta, 'resp', {
    action: 'Incident response advanced',
    target: incidentId,
    detail: `${RESPONSE_STEPS[response.step].status} → ${RESPONSE_STEPS[next.step].status}`
  }));
}

/**
 * Whether the fix of an incident can still be decided.
 *
 * @param {Object | undefined} response
 * @returns {boolean}
 */
function isRcaOpen(response) {
  return Boolean(response)
    && response.step >= ROOT_CAUSE_STEP
    && (response.rca.status === RCA_STATUS.NONE || response.rca.status === RCA_STATUS.SENT);
}

/**
 * Whether an inbox decision on an incident's RCA item can be applied.
 *
 * @param {AmsStudioState} state
 * @param {string} incidentId
 * @returns {boolean}
 */
export function isRcaAwaitingDecision(state, incidentId) {
  return state.incidentResponses[incidentId]?.rca.status === RCA_STATUS.SENT;
}

/**
 * "Send to Workflow Inbox" (F5): raises a high-risk remediation item carrying
 * the incident, cause, evidence and fix.
 *
 * @param {AmsStudioState} state
 * @param {{ incidentId: string, confidence: number, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function sendRcaToInbox(state, { incidentId, confidence, meta }) {
  const incident = getIncident(incidentId);
  const response = state.incidentResponses[incidentId];
  if (!incident || !response || response.step < ROOT_CAUSE_STEP || response.rca.status !== RCA_STATUS.NONE) return state;

  const inboxItemId = nextSequentialId(state.inbox.map((item) => item.id), 'WF-INB', 100);
  const item = buildRcaInboxItem(incident, { id: inboxItemId, at: meta.at, actor: meta.actor, confidence });
  const updated = withHumanEntry(
    { ...response, rca: { ...response.rca, status: RCA_STATUS.SENT, inboxItemId } },
    `Sent the recommended fix to the Workflow Inbox (${inboxItemId}).`,
    meta
  );
  return appendAudit({ ...replaceResponse(state, updated), inbox: [item, ...state.inbox] }, auditEntry(meta, 'rca-send', {
    action: 'Fix sent for approval', target: incidentId, detail: inboxItemId
  }));
}

/**
 * Accepts or rejects an incident's recommended fix, from the war room or the
 * Workflow Inbox. A decision in the war room also closes the open inbox item,
 * and a decision in the inbox is shown back on the war room.
 *
 * @param {AmsStudioState} state
 * @param {{ incidentId: string, accept: boolean, via: 'war-room' | 'inbox', meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function decideRca(state, { incidentId, accept, via, meta }) {
  const response = state.incidentResponses[incidentId];
  if (!isRcaOpen(response)) return state;

  const decision = accept ? RCA_STATUS.ACCEPTED : RCA_STATUS.REJECTED;
  const where = via === 'inbox' ? `in the Workflow Inbox (${response.rca.inboxItemId})` : 'in the war room';
  const updated = withHumanEntry(
    { ...response, rca: { ...response.rca, status: decision, decidedBy: meta.actor, decidedAt: meta.at, via } },
    `Fix ${accept ? 'approved' : 'rejected'} ${where}.`,
    meta
  );
  let next = replaceResponse(state, updated);

  const itemId = response.rca.inboxItemId;
  if (via === 'war-room' && itemId) {
    const status = INBOX_DECISION_STATUS[accept ? INBOX_DECISION.APPROVE : INBOX_DECISION.REJECT];
    next = {
      ...next,
      inbox: next.inbox.map((item) => (
        item.id === itemId && !Object.values(INBOX_DECISION_STATUS).includes(item.status)
          ? { ...item, status, decisionHistory: [{ timestamp: formatDateTime(meta.at), actor: meta.actor, action: `${status} in the live war room` }, ...item.decisionHistory] }
          : item
      ))
    };
  }
  return appendAudit(next, auditEntry(meta, 'rca', {
    action: accept ? 'Fix approved' : 'Fix rejected', target: incidentId, detail: `Decided ${where}`
  }));
}

/**
 * Re-opens a rejected fix so it can be reconsidered or sent again.
 *
 * @param {AmsStudioState} state
 * @param {{ incidentId: string, meta: EventMeta }} payload
 * @returns {AmsStudioState}
 */
export function reopenRca(state, { incidentId, meta }) {
  const response = state.incidentResponses[incidentId];
  if (!response || response.rca.status !== RCA_STATUS.REJECTED) return state;
  const updated = withHumanEntry(
    { ...response, rca: { status: RCA_STATUS.NONE, inboxItemId: null, decidedBy: null, decidedAt: null, via: null } },
    'Re-opened the recommended fix for review.',
    meta
  );
  return appendAudit(replaceResponse(state, updated), auditEntry(meta, 'rca-reopen', {
    action: 'Fix re-opened', target: incidentId
  }));
}
