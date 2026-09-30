/**
 * @file AMS programmes (F12).
 *
 * A programme groups agents by service portfolio so work can be reported by
 * service. The active programme filters the Ops Studio scorecard, agents and
 * runs, and the runtime monitor.
 */

import { getProgressPercent, STAGE } from './agentLifecycle';

/** Programme statuses. */
export const PROGRAMME_STATUS = Object.freeze({
  PLANNING: 'Planning',
  ON_TRACK: 'On track',
  AT_RISK: 'At risk',
  COMPLETED: 'Completed'
});

/**
 * Fields of a new programme (the setup wizard's starting point).
 *
 * @returns {Object}
 */
export function createEmptyProgramme() {
  return { name: '', portfolio: '', description: '', objective: '', stakeholders: '', targetDate: '', agentIds: [] };
}

/**
 * Agents linked to a programme that still exist.
 *
 * @param {Object} programme
 * @param {Object[]} agents
 * @returns {Object[]}
 */
export function getProgrammeAgents(programme, agents) {
  return agents.filter((agent) => programme.agentIds.includes(agent.id));
}

/**
 * Programme progress: the average lifecycle progress of its agents.
 *
 * @param {Object} programme
 * @param {Object[]} agents
 * @returns {number} 0–100.
 */
export function getProgrammeProgress(programme, agents) {
  const linked = getProgrammeAgents(programme, agents);
  if (linked.length === 0) return 0;
  return Math.round(linked.reduce((sum, agent) => sum + getProgressPercent(agent), 0) / linked.length);
}

/**
 * Programme status from its agents and target date.
 *
 * @param {Object} programme
 * @param {Object[]} agents
 * @param {number} now Epoch milliseconds.
 * @returns {string} One of {@link PROGRAMME_STATUS}.
 */
export function getProgrammeStatus(programme, agents, now) {
  const linked = getProgrammeAgents(programme, agents);
  if (linked.length === 0) return PROGRAMME_STATUS.PLANNING;
  if (linked.every((agent) => agent.stage === STAGE.OPERATING)) return PROGRAMME_STATUS.COMPLETED;
  const overdue = programme.targetDate && new Date(programme.targetDate).getTime() < now;
  const progress = getProgrammeProgress(programme, agents);
  return overdue || progress < 40 ? PROGRAMME_STATUS.AT_RISK : PROGRAMME_STATUS.ON_TRACK;
}
