/**
 * @file Runtime connection check for onboarded agents (F1).
 *
 * The PoC does not call real agent runtimes. This module simulates a health
 * check with realistic validation, delay and latency so the onboarding flow
 * behaves like the real one; every result is flagged `simulated: true`.
 * Replace {@link verifyRuntimeConnection} with a real call when runtimes are
 * reachable — callers only depend on its result shape.
 */

import { CONNECTION_STATUS, DEFAULT_HEALTH_CHECK_PATH } from './agentOptions';

const URL_PATTERN = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

/**
 * @typedef {Object} ConnectionResult
 * @property {'connected' | 'failed'} status
 * @property {number | null} latencyMs Round-trip time of the health check.
 * @property {string} message         What happened, for the UI.
 * @property {string} checkedAt       ISO timestamp.
 * @property {boolean} simulated      Always true in the PoC.
 */

const wait = (ms) => new Promise((resolve) => { window.setTimeout(resolve, ms); });

/**
 * Validates runtime settings without contacting anything.
 *
 * @param {{ baseUrl?: string, agentId?: string }} runtime
 * @returns {string | null} A problem description, or null when the settings look valid.
 */
export function validateRuntimeSettings(runtime) {
  if (!runtime?.baseUrl?.trim()) return 'Base URL is required.';
  if (!URL_PATTERN.test(runtime.baseUrl.trim())) return 'Base URL must start with http:// or https://.';
  if (!runtime?.agentId?.trim()) return 'Agent ID is required.';
  return null;
}

/**
 * Checks that the agent runtime answers its health endpoint (simulated).
 *
 * Hosts containing "invalid" or "unreachable" fail, so the failure path can
 * be demonstrated.
 *
 * @param {{ type: string, baseUrl: string, agentId: string, healthCheckUrl?: string }} runtime
 * @returns {Promise<ConnectionResult>}
 */
export async function verifyRuntimeConnection(runtime) {
  const checkedAt = () => new Date().toISOString();
  const problem = validateRuntimeSettings(runtime);
  if (problem) {
    return { status: CONNECTION_STATUS.FAILED, latencyMs: null, message: problem, checkedAt: checkedAt(), simulated: true };
  }

  await wait(700 + Math.random() * 500);
  const healthPath = runtime.healthCheckUrl?.trim() || DEFAULT_HEALTH_CHECK_PATH;

  if (/invalid|unreachable/i.test(runtime.baseUrl)) {
    return {
      status: CONNECTION_STATUS.FAILED,
      latencyMs: null,
      message: `No response from ${healthPath} (timed out after 5 s).`,
      checkedAt: checkedAt(),
      simulated: true
    };
  }

  const latencyMs = Math.round(40 + Math.random() * 180);
  return {
    status: CONNECTION_STATUS.CONNECTED,
    latencyMs,
    message: `${healthPath} answered 200 OK in ${latencyMs} ms.`,
    checkedAt: checkedAt(),
    simulated: true
  };
}
