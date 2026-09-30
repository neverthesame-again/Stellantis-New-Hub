/**
 * @file Demo incident responses for the live war room.
 *
 * Each open incident is placed at a different point of its response so the
 * war room shows every state: just detected, under investigation, a fix
 * waiting for a decision, and resolved.
 */

import { AMS_INCIDENTS } from '../../model/incidents';
import { FIX_DECISION_STEP, RCA_STATUS } from '../../model/incidentResponse';
import { createIncidentResponse, stepResponse } from '../incidentTransitions';

/** Response step each demo incident has reached. */
const SEED_STEP_BY_INCIDENT = Object.freeze({
  'INC-4471': 2,
  'INC-4472': 4,
  'INC-4473': 0,
  'INC-4474': 6
});

/** Incidents whose fix was already approved when the demo starts. */
const PRE_APPROVED = new Set(['INC-4474']);

const MINUTE_MS = 60_000;

/**
 * Builds the response state of every demo incident, relative to `now` so the
 * "time to resolve so far" tile starts at a realistic value.
 *
 * @param {Object[]} agents Studio agents (to name responders).
 * @param {number} now      Epoch milliseconds.
 * @returns {Record<string, Object>}
 */
export function buildSeedIncidentResponses(agents, now) {
  return Object.fromEntries(AMS_INCIDENTS.map((incident) => {
    const openedAtMs = now - incident.openedMinutesAgo * MINUTE_MS;
    const targetStep = SEED_STEP_BY_INCIDENT[incident.id] ?? 0;
    const spacing = (incident.openedMinutesAgo * MINUTE_MS) / (targetStep + 1);
    let response = createIncidentResponse(incident, agents, new Date(openedAtMs).toISOString());

    for (let step = 1; step <= targetStep; step += 1) {
      const at = new Date(openedAtMs + step * spacing).toISOString();
      if (response.step === FIX_DECISION_STEP && PRE_APPROVED.has(incident.id)) {
        response = {
          ...response,
          rca: { status: RCA_STATUS.ACCEPTED, inboxItemId: null, decidedBy: 'Tony / Head of AMS', decidedAt: at, via: 'war-room' },
          timeline: [{ id: `${incident.id}-seed-approval`, at, actor: 'Tony / Head of AMS', kind: 'human', text: 'Fix approved in the war room.' }, ...response.timeline]
        };
      }
      response = stepResponse(response, incident, agents, at) ?? response;
    }
    return [incident.id, response];
  }));
}
