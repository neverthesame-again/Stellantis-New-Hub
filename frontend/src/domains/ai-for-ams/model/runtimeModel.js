/**
 * @file Agent runtime monitor (F12).
 *
 * Readiness, reuse, last run and live runtime metrics for published agents.
 * The PoC has no runtime telemetry feed, so CPU, memory, throughput and error
 * rate are simulated per agent (stable per agent, gently varying per tick).
 */

import { getKnowledgeCoverage } from './agentOptions';
import { STAGE, getProgressPercent } from './agentLifecycle';
import { RUN_KIND } from './runModel';
import { WORKFLOW_NODE_TYPE } from './workflowModel';
import { createRandom } from '../utils/random';

/**
 * Stable 32-bit hash of a string (FNV-1a).
 *
 * @param {string} text
 * @returns {number}
 */
function hashOf(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Whether the agent is published (listed in the catalogue and running).
 *
 * @param {Object} agent
 * @returns {boolean}
 */
export function isPublished(agent) {
  return Boolean(agent.publishedAt);
}

/**
 * How many workflows use the agent.
 *
 * @param {Object} agent
 * @param {Object[]} workflows
 * @returns {number}
 */
export function getAgentReuseCount(agent, workflows) {
  return workflows.filter((workflow) => (workflow.nodes || []).some((node) => (
    node.type === WORKFLOW_NODE_TYPE.AGENT && node.data.agentId === agent.id
  ))).length;
}

/**
 * Production readiness: the average of lifecycle progress, evaluation score
 * and knowledge coverage.
 *
 * @param {Object} agent
 * @returns {number} 0–100.
 */
export function getAgentReadiness(agent) {
  const parts = [getProgressPercent(agent), agent.evaluation?.score ?? 0, getKnowledgeCoverage(agent).percent];
  return Math.round(parts.reduce((sum, value) => sum + value, 0) / parts.length);
}

/**
 * The agent's most recent run: a harness run of the agent, or a workflow run
 * of a workflow that contains it.
 *
 * @param {Object} agent
 * @param {Object[]} runs     Newest first.
 * @param {Object[]} workflows
 * @returns {Object | null}
 */
export function getLastRun(agent, runs, workflows) {
  const workflowIds = new Set(workflows
    .filter((workflow) => (workflow.nodes || []).some((node) => node.data?.agentId === agent.id))
    .map((workflow) => workflow.id));
  return runs.find((run) => (run.kind === RUN_KIND.HARNESS ? run.agentId === agent.id : workflowIds.has(run.workflowId))) ?? null;
}

/**
 * @typedef {Object} RuntimeMetrics
 * @property {number} cpu              %.
 * @property {number} memoryGb
 * @property {number} throughputPerMin Requests per minute.
 * @property {number} errorRate        %.
 */

/**
 * Simulated live runtime metrics of one agent.
 *
 * @param {Object} agent
 * @param {number} tick   Changes every refresh, to make the numbers move.
 * @param {boolean} paused Paused agents use no resources.
 * @returns {RuntimeMetrics}
 */
export function getAgentRuntimeMetrics(agent, tick, paused) {
  if (paused) return { cpu: 0, memoryGb: 0, throughputPerMin: 0, errorRate: 0 };
  const seed = hashOf(agent.id);
  const stable = createRandom(seed);
  const live = createRandom(seed + tick);
  const load = agent.stage === STAGE.OPERATING ? 1 : 0.55;
  const jitter = () => 0.92 + live.next() * 0.16;
  return {
    cpu: Math.round((18 + stable.next() * 37) * load * jitter()),
    memoryGb: Math.round((0.6 + stable.next() * 1.8) * jitter() * 10) / 10,
    throughputPerMin: Math.round((40 + stable.next() * 180) * load * jitter()),
    errorRate: Math.round((0.1 + stable.next() * 1.1) * jitter() * 100) / 100
  };
}

/**
 * Fleet totals: average CPU, total memory and throughput, throughput-weighted error rate.
 *
 * @param {RuntimeMetrics[]} metrics
 * @returns {RuntimeMetrics}
 */
export function aggregateRuntime(metrics) {
  const running = metrics.filter((entry) => entry.throughputPerMin > 0);
  const throughput = running.reduce((sum, entry) => sum + entry.throughputPerMin, 0);
  return {
    cpu: running.length ? Math.round(running.reduce((sum, entry) => sum + entry.cpu, 0) / running.length) : 0,
    memoryGb: Math.round(running.reduce((sum, entry) => sum + entry.memoryGb, 0) * 10) / 10,
    throughputPerMin: throughput,
    errorRate: throughput ? Math.round((running.reduce((sum, entry) => sum + entry.errorRate * entry.throughputPerMin, 0) / throughput) * 100) / 100 : 0
  };
}
