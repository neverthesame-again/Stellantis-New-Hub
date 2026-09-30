/**
 * @file Client for the AMS mock backend (`backend/src/domains/ai-for-ams/routes.js`).
 *
 * For the PoC the browser store (`state/AmsStudioContext.jsx`) is the source of
 * truth. Write calls here are *mirrors*: they keep the backend's request log
 * and in-memory state meaningful, but a failed call never blocks the UI.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const AMS_API_ROOT = `${API_BASE_URL}/api/ams`;

/**
 * Performs a JSON request against the AMS API.
 *
 * @param {string} path      Path below `/api/ams`, starting with a slash.
 * @param {RequestInit} [options] Fetch options; a JSON body is sent when `body` is an object.
 * @returns {Promise<Object>} The parsed response envelope (`{ success, data, ... }`).
 * @throws {Error} On network failure, non-2xx status or `success: false`.
 */
async function request(path, options = {}) {
  const { body, ...rest } = options;
  const response = await fetch(`${AMS_API_ROOT}${path}`, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...(rest.headers || {}) },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`AMS API ${path} responded with HTTP ${response.status}`);
  }

  const envelope = await response.json();
  if (!envelope.success) {
    throw new Error(envelope.message || `AMS API ${path} reported a failure`);
  }
  return envelope;
}

/**
 * Sends a best-effort mirror call and logs (rather than throws) on failure.
 *
 * @param {() => Promise<unknown>} call The request to run.
 * @param {string} description Human-readable action name for the log line.
 */
function mirror(call, description) {
  call().catch((error) => {
    console.info(`[AMS] Backend mirror skipped for "${description}": ${error.message}`);
  });
}

export const amsApi = {
  /**
   * Mirrors an inbox decision to the backend.
   *
   * @param {string} itemId   Workflow inbox item id.
   * @param {'approve' | 'reject' | 'escalate'} decision
   * @param {string} comments Decision notes.
   */
  mirrorWorkflowDecision(itemId, decision, comments) {
    mirror(
      () => request(`/workflows/${encodeURIComponent(itemId)}/action`, {
        method: 'POST',
        body: { action: decision, comments }
      }),
      `workflow ${itemId} ${decision}`
    );
  },

  /**
   * Mirrors a model subscription toggle to the backend.
   *
   * @param {string} modelId Model catalogue id.
   */
  mirrorModelSubscription(modelId) {
    mirror(
      () => request(`/experience/models/${encodeURIComponent(modelId)}/subscription`, { method: 'POST' }),
      `model ${modelId} subscription`
    );
  },

  /**
   * Requests a sandbox simulation run.
   *
   * @param {string} scenario Scenario name to simulate.
   * @returns {Promise<{ steps: Array<string | Object>, outcome: string }>} The simulation script.
   * @throws {Error} When the backend is unreachable; callers fall back to a local script.
   */
  async runSimulation(scenario) {
    const envelope = await request('/experience/simulate', { method: 'POST', body: { scenario } });
    return envelope.simulation || envelope.data;
  }
};
