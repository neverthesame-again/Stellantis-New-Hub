/**
 * @file React context object for the AMS studio store.
 *
 * Kept in its own module so the provider file exports only a component (which
 * keeps React Fast Refresh working) and the hook file only the hook.
 */

import { createContext } from 'react';

/**
 * @typedef {Object} AmsStudioActions
 * @property {(modelId: string) => void} toggleModelSubscription
 * @property {(itemId: string, decision: 'approve' | 'reject' | 'escalate', notes?: string) => void} recordInboxDecision
 * @property {(registration: Object) => string} registerAgent                  Returns the new agent id.
 * @property {(agentId: string, registration: Object) => void} updateAgent
 * @property {(agentId: string, runtime: Object) => Promise<import('../model/runtimeVerification').ConnectionResult>} verifyAgentConnection
 * @property {(agentId: string) => void} advanceAgentStage
 * @property {(agentId: string, run: { passed: boolean, task: string }) => void} recordHarnessRun
 * @property {(agentId: string) => void} evaluateAgent
 * @property {(agentId: string, decision: 'approve' | 'reject', comment?: string) => void} decideAgentApproval
 * @property {(agentId: string) => void} publishAgent
 * @property {(agentId: string) => void} scanCompliance
 * @property {(passMark: number) => void} setPassMark
 * @property {(rules: Object[], fileName: string) => void} importEvaluationRules
 * @property {(run: import('../model/runModel').AmsRun) => void} startRun         Stores a run that playback is about to animate.
 * @property {(runId: string) => void} completeRunPlayback                       Playback reached the run's first stop.
 * @property {(workflow: Object) => string} saveWorkflow                          Returns the workflow id (assigned when new).
 * @property {() => string} nextRunId                                             Id for the next run.
 * @property {(incidentId: string) => void} advanceIncidentResponse                 War room "Advance response".
 * @property {(incidentId: string, confidence: number) => void} sendRcaToInbox      Hand the fix to an approver.
 * @property {(incidentId: string, accept: boolean) => void} decideRca              Accept / reject the fix in the war room.
 * @property {(incidentId: string) => void} reopenRca                               Reconsider a rejected fix.
 * @property {(programme: Object) => string} createProgramme                       Returns the new programme id; it becomes active.
 * @property {(programmeId: string | null) => void} activateProgramme              null shows all programmes.
 * @property {(agentId: string) => void} toggleAgentRuntime                         Pause / resume a published agent.
 * @property {(rule: Object) => void} savePromptRule                                Add or update a FinOps prompt rule.
 * @property {() => void} resetDemoData
 */

/**
 * @typedef {Object} AmsStudioValue
 * @property {import('./seedState').AmsStudioState} state
 * @property {AmsStudioActions} actions
 * @property {string} actor Display name used in audit trails.
 */

/** @type {import('react').Context<AmsStudioValue | null>} */
export const AmsStudioContext = createContext(null);
