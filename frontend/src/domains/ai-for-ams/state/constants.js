/**
 * @file Store vocabulary shared by the reducer, selectors and pages.
 *
 * Kept separate from the reducer so selectors and pages can import it without
 * creating circular imports.
 */

/** Action types understood by the AMS studio reducer. */
export const AMS_ACTION = Object.freeze({
  MODEL_SUBSCRIPTION_TOGGLED: 'models/subscriptionToggled',
  INBOX_DECISION_RECORDED: 'inbox/decisionRecorded',
  AGENT_REGISTERED: 'agents/registered',
  AGENT_UPDATED: 'agents/updated',
  AGENT_CONNECTION_CHECKED: 'agents/connectionChecked',
  AGENT_STAGE_ADVANCED: 'agents/stageAdvanced',
  AGENT_HARNESS_RUN_RECORDED: 'agents/harnessRunRecorded',
  AGENT_EVALUATED: 'agents/evaluated',
  AGENT_GOVERNANCE_DECIDED: 'agents/governanceDecided',
  AGENT_PUBLISHED: 'agents/published',
  AGENT_COMPLIANCE_SCANNED: 'agents/complianceScanned',
  PASS_MARK_CHANGED: 'evaluation/passMarkChanged',
  RULES_IMPORTED: 'evaluation/rulesImported',
  RUN_STARTED: 'runs/started',
  RUN_PLAYBACK_COMPLETED: 'runs/playbackCompleted',
  WORKFLOW_SAVED: 'workflows/saved',
  INCIDENT_RESPONSE_ADVANCED: 'incidents/responseAdvanced',
  RCA_SENT_TO_INBOX: 'incidents/rcaSentToInbox',
  RCA_DECIDED: 'incidents/rcaDecided',
  RCA_REOPENED: 'incidents/rcaReopened',
  PROGRAMME_CREATED: 'programmes/created',
  PROGRAMME_ACTIVATED: 'programmes/activated',
  AGENT_RUNTIME_TOGGLED: 'runtime/agentToggled',
  PROMPT_RULE_SAVED: 'finops/promptRuleSaved',
  STATE_RESET: 'studio/reset'
});

/** Decisions an approver can take on a Workflow Inbox item. */
export const INBOX_DECISION = Object.freeze({
  APPROVE: 'approve',
  REJECT: 'reject',
  ESCALATE: 'escalate'
});

/** Inbox item status that results from each decision. */
export const INBOX_DECISION_STATUS = Object.freeze({
  [INBOX_DECISION.APPROVE]: 'Approved',
  [INBOX_DECISION.REJECT]: 'Rejected',
  [INBOX_DECISION.ESCALATE]: 'Escalated'
});

/** Governance decisions on an agent (F7). */
export const GOVERNANCE_DECISION = Object.freeze({
  APPROVE: 'approve',
  REJECT: 'reject'
});
