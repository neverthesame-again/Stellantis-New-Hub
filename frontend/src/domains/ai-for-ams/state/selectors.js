/**
 * @file Derived views over the AMS studio state.
 */

import { toCatalogueAgent } from '../model/agentRecords';
import { lifecycleContextOf } from './agentTransitions';
import { INBOX_DECISION_STATUS } from './constants';

const DECIDED_STATUSES = new Set(Object.values(INBOX_DECISION_STATUS));

/**
 * Whether an inbox item still needs a decision.
 *
 * @param {Object} item Workflow Inbox item.
 * @returns {boolean}
 */
export function isInboxItemPending(item) {
  return !DECIDED_STATUSES.has(item.status);
}

/**
 * Inbox items still waiting for a decision.
 *
 * @param {import('./seedState').AmsStudioState} state
 * @returns {Object[]}
 */
export function selectPendingInboxItems(state) {
  return state.inbox.filter(isInboxItemPending);
}

/**
 * Lifecycle context (pass mark and active rules).
 *
 * @param {import('./seedState').AmsStudioState} state
 * @returns {import('../model/agentLifecycle').LifecycleContext}
 */
export const selectLifecycleContext = lifecycleContextOf;

/**
 * One studio agent by id.
 *
 * @param {import('./seedState').AmsStudioState} state
 * @param {string | null} agentId
 * @returns {Object | undefined}
 */
export function selectStudioAgent(state, agentId) {
  return state.studioAgents.find((agent) => agent.id === agentId);
}

/**
 * The Published catalogue: legacy catalogue agents plus every studio agent
 * that has been published.
 *
 * @param {import('./seedState').AmsStudioState} state
 * @returns {Object[]}
 */
export function selectCatalogueAgents(state) {
  const published = state.studioAgents.filter((agent) => agent.publishedAt).map(toCatalogueAgent);
  return [...published, ...state.agents];
}

/**
 * How many agents reuse a skill: its reuse outside the studio plus the studio
 * agents that attach it.
 *
 * @param {import('./seedState').AmsStudioState} state
 * @param {Object} skill
 * @returns {number}
 */
export function selectSkillReuseCount(state, skill) {
  return skill.baseReuseCount + state.studioAgents.filter((agent) => (agent.skillIds || []).includes(skill.id)).length;
}
