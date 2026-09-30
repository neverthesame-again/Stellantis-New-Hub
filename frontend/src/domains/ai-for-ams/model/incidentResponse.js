/**
 * @file Live incident response model (F4, F5).
 *
 * An incident is worked through seven response steps. Each step is carried
 * out by an AMS agent from the matching area, adds a line to the agent
 * collaboration timeline and moves the live tiles (confidence up, users
 * affected and business impact down). The root cause is revealed at "Root
 * cause found"; the response cannot move past "Fix proposed" until the fix is
 * accepted — in the war room or in the Workflow Inbox.
 *
 * The PoC has no live incident feed: "Advance response" steps through this
 * script (mocked, as the requirement allows).
 */

import { HARNESS_MIN_STAGE } from './agentLifecycle';
import { getAreaLabel } from './agentOptions';

/** RCA decision states (F5). */
export const RCA_STATUS = Object.freeze({
  NONE: 'none',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
});

/**
 * @typedef {Object} ResponseStep
 * @property {string} id
 * @property {string} status          Incident status once the step is reached.
 * @property {string} area            AMS area of the agent doing the step.
 * @property {number} confidence      Response confidence %, once reached.
 * @property {number} remainingShare  Share of users / impact still affected, 0–1.
 * @property {(incident: import('./incidents').AmsIncident) => string} describe Timeline text.
 */

/** @type {ReadonlyArray<ResponseStep>} */
export const RESPONSE_STEPS = Object.freeze([
  {
    id: 'detected',
    status: 'Detected',
    area: 'observability',
    confidence: 41,
    remainingShare: 1,
    describe: (incident) => `Flagged ${incident.knowledge.telemetry[0].label.toLowerCase()} on ${incident.service} (${incident.knowledge.telemetry[0].count}).`
  },
  {
    id: 'triaged',
    status: 'Triaged',
    area: 'incident-triage',
    confidence: 56,
    remainingShare: 1,
    describe: (incident) => `Classified as ${incident.severity}, routed to ${incident.team} and linked problem record ${incident.problemRecordId}.`
  },
  {
    id: 'investigating',
    status: 'Investigating',
    area: 'problem-rca',
    confidence: 68,
    remainingShare: 0.97,
    describe: (incident) => `Correlating ${incident.knowledge.telemetry.length} telemetry sources with change ${incident.knowledge.change.recordId} and known error ${incident.knowledge.knownError.recordId}.`
  },
  {
    id: 'root-cause',
    status: 'Root cause found',
    area: 'problem-rca',
    confidence: 86,
    remainingShare: 0.92,
    describe: (incident) => `Root cause identified: ${incident.rootCause}`
  },
  {
    id: 'fix-proposed',
    status: 'Fix proposed',
    area: 'change-release',
    confidence: 89,
    remainingShare: 0.9,
    describe: (incident) => `Recommended fix: ${incident.fix}`
  },
  {
    id: 'remediating',
    status: 'Remediating',
    area: 'runbook-automation',
    confidence: 94,
    remainingShare: 0.35,
    describe: (incident) => `Executing runbook ${incident.knowledge.runbook.recordId} — ${incident.knowledge.runbook.label}.`
  },
  {
    id: 'resolved',
    status: 'Resolved',
    area: 'observability',
    confidence: 98,
    remainingShare: 0,
    describe: (incident) => `${incident.service} has recovered; watching for recurrence of ${incident.knowledge.knownError.recordId}.`
  }
]);

/** Step index at which the root cause becomes visible. */
export const ROOT_CAUSE_STEP = RESPONSE_STEPS.findIndex((step) => step.id === 'root-cause');

/** Step the response cannot leave until the fix is accepted. */
export const FIX_DECISION_STEP = RESPONSE_STEPS.findIndex((step) => step.id === 'fix-proposed');

/** Final step. */
export const RESOLVED_STEP = RESPONSE_STEPS.length - 1;

/**
 * Name of the agent doing a step: the most advanced onboarded studio agent of
 * the step's AMS area, or a generic area agent when none is onboarded.
 *
 * @param {string} area
 * @param {Object[]} agents Studio agents.
 * @returns {string}
 */
export function responderFor(area, agents) {
  const candidate = agents
    .filter((agent) => agent.area === area && agent.stage >= HARNESS_MIN_STAGE)
    .sort((a, b) => b.stage - a.stage)[0];
  return candidate?.name ?? `${getAreaLabel(area)} agent`;
}

/**
 * Whether the response may move to its next step.
 *
 * @param {{ step: number, rca: { status: string } }} response
 * @returns {{ allowed: boolean, reason: string | null }}
 */
export function canAdvanceResponse(response) {
  if (response.step >= RESOLVED_STEP) return { allowed: false, reason: 'The incident is resolved.' };
  if (response.step === FIX_DECISION_STEP && response.rca.status !== RCA_STATUS.ACCEPTED) {
    return {
      allowed: false,
      reason: response.rca.status === RCA_STATUS.SENT
        ? 'Waiting for the fix to be decided in the Workflow Inbox.'
        : 'Accept the recommended fix (or send it to the Workflow Inbox) before remediating.'
    };
  }
  return { allowed: true, reason: null };
}

/**
 * Live tile values for the response's current step.
 *
 * @param {import('./incidents').AmsIncident} incident
 * @param {{ step: number }} response
 * @returns {{ confidence: number, usersAffected: number, impactPerHourK: number, status: string }}
 */
export function getResponseTiles(incident, response) {
  const step = RESPONSE_STEPS[response.step];
  return {
    confidence: step.confidence,
    usersAffected: Math.round(incident.usersAffected * step.remainingShare),
    impactPerHourK: Math.round(incident.impactPerHourK * step.remainingShare * 10) / 10,
    status: step.status
  };
}
