/**
 * @file React context object for run playback.
 */

import { createContext } from 'react';

/**
 * @typedef {Object} RunPlaybackValue
 * @property {{ runId: string, revealed: number } | null} playback  The run being animated, if any.
 * @property {boolean} isBusy                                         True while a run is animating.
 * @property {(agentId: string, task: string) => string | null} startHarnessRun
 *   Starts a single-agent harness run; returns the run id, or null when it cannot start.
 * @property {(workflowId: string, incidentId: string) => string | null} startWorkflowRun
 *   Starts a saved workflow on an incident; returns the run id, or null when it cannot start.
 * @property {(runId: string) => number | null} getRevealedCount
 *   Steps revealed so far for a run being animated; null when it is not animating.
 */

/** @type {import('react').Context<RunPlaybackValue | null>} */
export const RunPlaybackContext = createContext(null);
