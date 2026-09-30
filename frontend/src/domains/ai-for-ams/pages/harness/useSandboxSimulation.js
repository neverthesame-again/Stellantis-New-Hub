/**
 * @file Runner for the sandbox (digital-twin) remediation simulation.
 *
 * Fetches the simulation script from the AMS backend and reveals it one step at
 * a time. When the backend is unreachable, a built-in script is used so the
 * demo always works.
 */

import { useCallback, useRef, useState } from 'react';
import { amsApi } from '../../api/amsApi';

/** Scenario name sent to the backend. */
export const SIMULATION_SCENARIO = 'Kafka Partition Storm & Auto-Scale';

/** Delay between revealed steps. */
const STEP_DELAY_MS = 650;

/** Script used when the backend cannot be reached. */
const FALLBACK_SCRIPT = Object.freeze({
  steps: [
    'Telemetry Ingestion Anomaly Detected: Dynatrace Davis AI flagged partition 4 consumer lag',
    'RCA Synthesizer Correlated Logs: Isolated consumer group thread stall; root cause matched Pattern #881',
    'Safety & Governance Guardrail Verified: Policy #GOV-901 checked: Non-destructive scale pre-approved',
    'Kubernetes Operator Executed Pod Scale: Consumer pods scaled from 6 to 12. Partition rebalanced',
    'Post-Remediation Verification Passed: Lag reduced to 1,240 messages (< 10k threshold). SLA preserved'
  ],
  outcome: 'Incident prevented before customer impact. MTTD: 0.4s | MTTR: 4.8s'
});

/** Lifecycle of one simulation run. */
export const SIMULATION_STATUS = Object.freeze({
  IDLE: 'idle',
  RUNNING: 'running',
  COMPLETED: 'completed'
});

const wait = (ms) => new Promise((resolve) => { window.setTimeout(resolve, ms); });

/**
 * Converts a backend step (string or `{ title, detail }`) into a display line.
 *
 * @param {string | { title?: string, detail?: string }} step
 * @returns {string}
 */
function toStepText(step) {
  if (typeof step === 'string') return step;
  return step?.title ? `${step.title}: ${step.detail || ''}`.trim() : JSON.stringify(step);
}

/**
 * Loads the simulation script, falling back to the built-in one.
 *
 * @returns {Promise<{ steps: string[], outcome: string }>}
 */
async function loadScript() {
  try {
    const simulation = await amsApi.runSimulation(SIMULATION_SCENARIO);
    if (Array.isArray(simulation?.steps) && simulation.steps.length > 0) {
      return { steps: simulation.steps.map(toStepText), outcome: simulation.outcome || FALLBACK_SCRIPT.outcome };
    }
  } catch (error) {
    console.info('[AMS] Simulation backend unavailable; using the built-in script.', error.message);
  }
  return { steps: [...FALLBACK_SCRIPT.steps], outcome: FALLBACK_SCRIPT.outcome };
}

/**
 * Drives the sandbox simulation.
 *
 * Starting a new run (or clearing) supersedes any run in progress. Runs are not
 * cancelled on unmount: late state updates on an unmounted component are
 * no-ops, and cancelling on unmount would break runs started from a navigation
 * request under React StrictMode's simulated unmount.
 *
 * @returns {{
 *   status: string,
 *   steps: string[],
 *   totalSteps: number,
 *   outcome: string | null,
 *   run: () => Promise<boolean>,   // resolves true when the run completed, false when superseded
 *   clear: () => void
 * }}
 */
export function useSandboxSimulation() {
  const [status, setStatus] = useState(SIMULATION_STATUS.IDLE);
  const [script, setScript] = useState(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const activeRunId = useRef(0);

  const run = useCallback(async () => {
    const runId = ++activeRunId.current;
    setStatus(SIMULATION_STATUS.RUNNING);
    setScript(null);
    setRevealedCount(0);

    const loaded = await loadScript();
    if (runId !== activeRunId.current) return false;
    setScript(loaded);

    for (let index = 0; index < loaded.steps.length; index += 1) {
      await wait(STEP_DELAY_MS);
      if (runId !== activeRunId.current) return false;
      setRevealedCount(index + 1);
    }
    setStatus(SIMULATION_STATUS.COMPLETED);
    return true;
  }, []);

  const clear = useCallback(() => {
    activeRunId.current += 1;
    setStatus(SIMULATION_STATUS.IDLE);
    setScript(null);
    setRevealedCount(0);
  }, []);

  return {
    status,
    steps: script ? script.steps.slice(0, revealedCount) : [],
    totalSteps: script ? script.steps.length : FALLBACK_SCRIPT.steps.length,
    outcome: status === SIMULATION_STATUS.COMPLETED ? script?.outcome ?? null : null,
    run,
    clear
  };
}
