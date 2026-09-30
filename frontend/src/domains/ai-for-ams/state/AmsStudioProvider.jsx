/**
 * @file AMS studio store provider — shared, persisted state for every AMS page.
 *
 * The AMS features feed each other (onboarding moves agents through stages,
 * approvals land in the Workflow Inbox, the overview counts everything), so
 * they share one store instead of each page keeping its own copy. The store is
 * mounted by the AMS domain router and survives navigation between AMS pages;
 * it is saved to the browser after every change (see `amsStorage.js`). Pages
 * read it with `useAmsStudio()`.
 *
 * Action creators here are the only place that reads the clock, generates ids,
 * produces randomness or talks to the backend; the reducer stays pure.
 */

import React, { useEffect, useLayoutEffect, useMemo, useReducer, useRef } from 'react';
import { amsApi } from '../api/amsApi';
import { EVALUATION_MEASURES } from '../model/evaluationModel';
import { verifyRuntimeConnection } from '../model/runtimeVerification';
import { createId } from '../utils/ids';
import { nextAgentId } from './agentTransitions';
import { interruptUnfinishedRuns, nextRunId as computeNextRunId, nextWorkflowId } from './runTransitions';
import { loadState, saveState } from './amsStorage';
import { nextProgrammeId } from './opsTransitions';
import { AmsStudioContext } from './amsStudioContext';
import { amsStudioReducer } from './amsStudioReducer';
import { AMS_ACTION } from './constants';
import { AMS_STUDIO_SCHEMA_VERSION, createSeedState } from './seedState';

/**
 * Lazily builds the initial state: saved state when valid, demo data otherwise.
 *
 * @param {string} storageKey
 * @returns {import('./seedState').AmsStudioState}
 */
function initialiseState(storageKey) {
  const saved = loadState(storageKey, AMS_STUDIO_SCHEMA_VERSION);
  // Playback does not survive a reload, so runs caught mid-way are closed as interrupted.
  return saved ? interruptUnfinishedRuns(saved) : createSeedState();
}

/**
 * Provides the AMS studio store.
 *
 * Mount it with `key={storageKey}` so switching users starts a fresh store.
 *
 * @param {Object} props
 * @param {string} props.storageKey Per-user key from `buildStorageKey`.
 * @param {string} props.actor      Display name used in audit trails, e.g. "Tony / Head of AMS".
 * @param {import('react').ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function AmsStudioProvider({ storageKey, actor, children }) {
  const [state, dispatch] = useReducer(amsStudioReducer, storageKey, initialiseState);

  // Latest committed state, for action creators that must return a derived id.
  const stateRef = useRef(state);
  useLayoutEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    saveState(storageKey, state);
  }, [storageKey, state]);

  /** @type {import('./amsStudioContext').AmsStudioActions} */
  const actions = useMemo(() => {
    /** @returns {import('./auditLog').EventMeta} */
    const createMeta = () => ({ eventId: createId('EVT'), actor, at: new Date().toISOString() });
    const send = (type, payload) => dispatch({ type, payload: { ...payload, meta: createMeta() } });

    return {
      toggleModelSubscription(modelId) {
        send(AMS_ACTION.MODEL_SUBSCRIPTION_TOGGLED, { modelId, subscriptionId: createId('SUB') });
        amsApi.mirrorModelSubscription(modelId);
      },

      recordInboxDecision(itemId, decision, notes = '') {
        send(AMS_ACTION.INBOX_DECISION_RECORDED, { itemId, decision, notes });
        amsApi.mirrorWorkflowDecision(itemId, decision, notes.trim() || 'Decision recorded via AMS Hub');
      },

      registerAgent(registration) {
        const agentId = nextAgentId(stateRef.current);
        send(AMS_ACTION.AGENT_REGISTERED, { agentId, registration });
        return agentId;
      },

      updateAgent(agentId, registration) {
        send(AMS_ACTION.AGENT_UPDATED, { agentId, registration });
      },

      async verifyAgentConnection(agentId, runtime) {
        const result = await verifyRuntimeConnection(runtime);
        send(AMS_ACTION.AGENT_CONNECTION_CHECKED, { agentId, result });
        return result;
      },

      advanceAgentStage(agentId) {
        send(AMS_ACTION.AGENT_STAGE_ADVANCED, { agentId });
      },

      recordHarnessRun(agentId, { passed, task }) {
        send(AMS_ACTION.AGENT_HARNESS_RUN_RECORDED, { agentId, passed, task });
      },

      evaluateAgent(agentId) {
        const jitter = EVALUATION_MEASURES.map(() => Math.random() * 2 - 1);
        send(AMS_ACTION.AGENT_EVALUATED, { agentId, jitter });
      },

      decideAgentApproval(agentId, decision, comment = '') {
        send(AMS_ACTION.AGENT_GOVERNANCE_DECIDED, { agentId, decision, comment });
      },

      publishAgent(agentId) {
        send(AMS_ACTION.AGENT_PUBLISHED, { agentId });
      },

      scanCompliance(agentId) {
        send(AMS_ACTION.AGENT_COMPLIANCE_SCANNED, { agentId });
      },

      setPassMark(passMark) {
        send(AMS_ACTION.PASS_MARK_CHANGED, { passMark });
      },

      importEvaluationRules(rules, fileName) {
        send(AMS_ACTION.RULES_IMPORTED, { rules, fileName });
      },

      startRun(run) {
        send(AMS_ACTION.RUN_STARTED, { run });
      },

      completeRunPlayback(runId) {
        send(AMS_ACTION.RUN_PLAYBACK_COMPLETED, { runId });
      },

      saveWorkflow(workflow) {
        const id = workflow.id ?? nextWorkflowId(stateRef.current);
        send(AMS_ACTION.WORKFLOW_SAVED, { workflow: { ...workflow, id } });
        return id;
      },

      nextRunId() {
        return computeNextRunId(stateRef.current);
      },

      advanceIncidentResponse(incidentId) {
        send(AMS_ACTION.INCIDENT_RESPONSE_ADVANCED, { incidentId });
      },

      sendRcaToInbox(incidentId, confidence) {
        send(AMS_ACTION.RCA_SENT_TO_INBOX, { incidentId, confidence });
      },

      decideRca(incidentId, accept) {
        send(AMS_ACTION.RCA_DECIDED, { incidentId, accept, via: 'war-room' });
      },

      reopenRca(incidentId) {
        send(AMS_ACTION.RCA_REOPENED, { incidentId });
      },

      createProgramme(programme) {
        const programmeId = nextProgrammeId(stateRef.current);
        send(AMS_ACTION.PROGRAMME_CREATED, { programmeId, programme });
        return programmeId;
      },

      activateProgramme(programmeId) {
        send(AMS_ACTION.PROGRAMME_ACTIVATED, { programmeId });
      },

      toggleAgentRuntime(agentId) {
        send(AMS_ACTION.AGENT_RUNTIME_TOGGLED, { agentId });
      },

      savePromptRule(rule) {
        send(AMS_ACTION.PROMPT_RULE_SAVED, { rule });
      },

      resetDemoData() {
        dispatch({ type: AMS_ACTION.STATE_RESET, payload: { state: createSeedState() } });
      }
    };
  }, [actor]);

  const value = useMemo(() => ({ state, actions, actor }), [state, actions, actor]);

  return <AmsStudioContext.Provider value={value}>{children}</AmsStudioContext.Provider>;
}
