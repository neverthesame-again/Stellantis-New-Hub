/**
 * @file Demo data for Agent Studio, evaluation and governance.
 *
 * Ten AMS agents placed across the lifecycle so every stage — and every
 * "Blocked by" reason — can be shown: a draft with missing fields, a failed
 * runtime connection, missing knowledge, a pending harness run, a passing and
 * a failing evaluation, a Tier 1 agent awaiting approval (also in the Workflow
 * Inbox), an approved agent ready to publish and two operating in production.
 */

import {
  AMS_AGENT_AREAS,
  CONNECTION_STATUS,
  GOVERNANCE_STATUS,
  createEmptyRegistration
} from '../../model/agentOptions';
import { LIFECYCLE_STAGES } from '../../model/agentLifecycle';
import { buildAgentApprovalInboxItem } from '../../model/agentRecords';
import { WORKFLOW_NODE_TYPE, createWorkflowNode } from '../../model/workflowModel';

/**
 * Builds an ISO timestamp in September 2026.
 *
 * @param {number} day
 * @param {string} time "HH:MM"
 * @returns {string}
 */
const at = (day, time) => `2026-09-${String(day).padStart(2, '0')}T${time}:00.000Z`;

/** Certified skills that agents can reuse (F1). */
export const SEED_SKILLS = Object.freeze([
  { id: 'SKL-01', name: 'Incident enrichment from CMDB', description: 'Adds CI, owner group and service tier to a ticket.', sourceAgent: 'Incident Triage Classifier', baseReuseCount: 6 },
  { id: 'SKL-02', name: 'Resolver-group routing', description: 'Predicts the right assignment group from ticket text.', sourceAgent: 'Incident Triage Classifier', baseReuseCount: 4 },
  { id: 'SKL-03', name: 'Log pattern clustering', description: 'Groups error signatures across Splunk and Datadog.', sourceAgent: 'Log Anomaly Sentinel', baseReuseCount: 7 },
  { id: 'SKL-04', name: 'Change-to-incident correlation', description: 'Links an incident to recent change records.', sourceAgent: 'RCA Evidence Correlator', baseReuseCount: 5 },
  { id: 'SKL-05', name: 'Known-error lookup', description: 'Searches the known-error database for matching articles.', sourceAgent: 'Known-Error Matcher', baseReuseCount: 3 },
  { id: 'SKL-06', name: 'Runbook step executor', description: 'Runs approved Ansible / Rundeck runbook steps with dry-run.', sourceAgent: 'Disk Cleanup Runbook Agent', baseReuseCount: 2 },
  { id: 'SKL-07', name: 'Post-incident summary writer', description: 'Drafts the post-incident review from the timeline.', sourceAgent: 'RCA & Post-Mortem Synthesizer', baseReuseCount: 8 },
  { id: 'SKL-08', name: 'Change risk scoring', description: 'Scores a change request against past failures.', sourceAgent: 'Change Risk Scorer', baseReuseCount: 1 }
]);

/**
 * Builds a ready-made workflow from compact node and edge specs, laid out left
 * to right.
 *
 * @param {string} id
 * @param {string} name
 * @param {string} description
 * @param {Array<[string, string, number, number, Object?]>} nodes [id, type, column, row, data]
 * @param {Array<[string, string]>} edges [source, target]
 * @returns {Object}
 */
function readyMadeFlow(id, name, description, nodes, edges) {
  return {
    id,
    name,
    description,
    source: 'Ready-made',
    nodes: nodes.map(([nodeId, type, column, row, data]) => (
      createWorkflowNode(type, { x: 40 + column * 230, y: 60 + row * 120 }, nodeId, data)
    )),
    edges: edges.map(([source, target]) => ({ id: `${source}->${target}`, source, target })),
    createdAt: at(1, '08:00'),
    updatedAt: at(1, '08:00')
  };
}

const { START, END, AGENT, APPROVAL, POLICY, FORK, JOIN } = WORKFLOW_NODE_TYPE;

/** Ready-made AMS incident workflows (F9); agents map to them in onboarding (F1). */
export const SEED_WORKFLOWS = Object.freeze([
  readyMadeFlow('WF-TPL-01', 'Incident triage → RCA → runbook', 'Classify, find the root cause and run the matching runbook.', [
    ['start', START, 0, 1],
    ['triage', AGENT, 1, 1, { agentId: 'AMS-AGT-201' }],
    ['rca', AGENT, 2, 1, { agentId: 'AMS-AGT-203' }],
    ['approve', APPROVAL, 3, 1, { approver: 'Tony / Head of AMS' }],
    ['runbook', AGENT, 4, 1, { agentId: 'AMS-AGT-209' }],
    ['end', END, 5, 1]
  ], [['start', 'triage'], ['triage', 'rca'], ['rca', 'approve'], ['approve', 'runbook'], ['runbook', 'end']]),
  readyMadeFlow('WF-TPL-02', 'Recurring cluster → problem record', 'Detect a recurring cluster, investigate in parallel and raise a problem record.', [
    ['start', START, 0, 1],
    ['detect', AGENT, 1, 1, { agentId: 'AMS-AGT-207' }],
    ['fork', FORK, 2, 1],
    ['rca', AGENT, 3, 0, { agentId: 'AMS-AGT-203' }],
    ['kedb', AGENT, 3, 2, { agentId: 'AMS-AGT-204', onFailure: 'continue' }],
    ['join', JOIN, 4, 1],
    ['itil', POLICY, 5, 1, { policyId: 'change-management' }],
    ['end', END, 6, 1]
  ], [['start', 'detect'], ['detect', 'fork'], ['fork', 'rca'], ['fork', 'kedb'], ['rca', 'join'], ['kedb', 'join'], ['join', 'itil'], ['itil', 'end']]),
  readyMadeFlow('WF-TPL-03', 'High-risk remediation with approval', 'Remediate in production only after policy checks and human approval.', [
    ['start', START, 0, 1],
    ['triage', AGENT, 1, 1, { agentId: 'AMS-AGT-201' }],
    ['safety', POLICY, 2, 1, { policyId: 'human-approval' }],
    ['approve', APPROVAL, 3, 1, { approver: 'AMS Governance Board' }],
    ['remediate', AGENT, 4, 1, { agentId: 'AMS-AGT-209' }],
    ['end', END, 5, 1]
  ], [['start', 'triage'], ['triage', 'safety'], ['safety', 'approve'], ['approve', 'remediate'], ['remediate', 'end']]),
  readyMadeFlow('WF-TPL-04', 'Change risk review', 'Score a change request and hold risky deployments for approval.', [
    ['start', START, 0, 1],
    ['score', AGENT, 1, 1, { agentId: 'AMS-AGT-205' }],
    ['approve', APPROVAL, 2, 1, { approver: 'Tony / Head of AMS' }],
    ['end', END, 3, 1]
  ], [['start', 'score'], ['score', 'approve'], ['approve', 'end']])
]);

/**
 * Builds a plausible lifecycle history: registration followed by one stage
 * change per completed stage, a few hours apart, newest first.
 *
 * @param {string} agentId
 * @param {number} stage       Current stage.
 * @param {number} startDay    Day of registration.
 * @param {string} actor
 * @param {Object[]} [extra]   Additional entries (evaluation, approval…), any order.
 * @returns {Object[]}
 */
function buildHistory(agentId, stage, startDay, actor, extra = []) {
  const entries = [{
    id: `${agentId}-H0`,
    at: at(startDay, '08:00'),
    actor,
    kind: 'registration',
    action: 'Registered',
    detail: 'Draft registration saved'
  }];
  for (let to = 2; to <= stage; to += 1) {
    entries.push({
      id: `${agentId}-H${to}`,
      at: at(startDay + to - 1, '09:30'),
      actor,
      kind: 'stage',
      action: 'Stage changed',
      from: LIFECYCLE_STAGES[to - 2].label,
      to: LIFECYCLE_STAGES[to - 1].label,
      detail: `${LIFECYCLE_STAGES[to - 2].label} → ${LIFECYCLE_STAGES[to - 1].label}`
    });
  }
  return [...entries, ...extra].sort((a, b) => b.at.localeCompare(a.at));
}

/**
 * Creates a seed agent from registration defaults plus overrides.
 *
 * @param {Object} overrides
 * @returns {Object}
 */
function seedAgent(overrides) {
  const base = createEmptyRegistration();
  return {
    ...base,
    stage: 1,
    harness: { successfulRuns: 0, lastRunAt: null, lastRunStatus: null },
    evaluation: null,
    governance: { status: GOVERNANCE_STATUS.NOT_SUBMITTED, submittedAt: null, decidedAt: null, decidedBy: null, comment: null, inboxItemId: null, lastScanAt: null },
    publishedAt: null,
    ...overrides,
    runtime: { ...base.runtime, ...overrides.runtime }
  };
}

const connected = (type, baseUrl, agentId, latencyMs, checkedAt) => ({
  type, baseUrl, agentId, latencyMs, checkedAt, connectionStatus: CONNECTION_STATUS.CONNECTED
});

const [TRIAGE, RCA, CHANGE, OBSERVABILITY, RUNBOOK] = AMS_AGENT_AREAS.map((area) => area.id);

const triageClassifier = seedAgent({
  id: 'AMS-AGT-201',
  name: 'Incident Triage Classifier',
  family: 'Triage & classification',
  area: TRIAGE,
  service: 'Connected Vehicle Telematics',
  team: 'AMS L2 Telematics',
  owner: 'Priya Nair',
  version: '2.1.0',
  purpose: 'Classifies incoming P1–P3 incidents, enriches them with CMDB context and routes them to the right resolver group.',
  serviceTier: 'Tier 1',
  runtime: connected('internal', 'https://agents.ams.internal/triage', 'triage-classifier', 84, at(3, '10:10')),
  skillIds: ['SKL-01', 'SKL-02'],
  knowledgeSources: ['ServiceNow ITSM', 'CMDB', 'PagerDuty history'],
  connectedTools: ['ServiceNow', 'PagerDuty'],
  workflowIds: ['WF-TPL-01'],
  approver: 'Tony / Head of AMS',
  stage: 7,
  harness: { successfulRuns: 3, lastRunAt: at(8, '14:20'), lastRunStatus: 'passed' },
  evaluation: {
    scores: { incidentAccuracy: 94, rcaQuality: 88, knowledgeQuality: 90, groundedness: 93, hallucination: 91, security: 95, cost: 86, latency: 95 },
    score: 92,
    evaluatedAt: at(9, '11:00')
  },
  createdAt: at(2, '08:00'),
  updatedAt: at(9, '11:30'),
  history: buildHistory('AMS-AGT-201', 7, 2, 'Priya Nair', [
    { id: 'AMS-AGT-201-E1', at: at(9, '11:00'), actor: 'Priya Nair', kind: 'evaluation', action: 'Evaluation run', detail: 'Score 92 (pass mark 85), no blocking violations' }
  ])
});
triageClassifier.governance = {
  ...triageClassifier.governance,
  status: GOVERNANCE_STATUS.PENDING,
  submittedAt: at(8, '09:30'),
  inboxItemId: 'WF-INB-201'
};

const bridgeCoordinator = seedAgent({
  id: 'AMS-AGT-202',
  name: 'P1 Bridge Coordinator',
  family: 'Triage & classification',
  area: TRIAGE,
  service: 'Dealer Management Platform',
  team: 'AMS Major Incident Management',
  owner: 'Marco Bianchi',
  version: '0.9.0',
  purpose: 'Opens the P1 bridge, pages the right on-call engineers and keeps the incident timeline up to date.',
  serviceTier: 'Tier 1',
  runtime: connected('aws-bedrock', 'https://bedrock-agents.eu-central-1.stellantis.internal', 'p1-bridge-coord', 132, at(12, '15:00')),
  stage: 3,
  createdAt: at(11, '08:00'),
  updatedAt: at(12, '15:00'),
  history: buildHistory('AMS-AGT-202', 3, 11, 'Marco Bianchi')
});

const rcaCorrelator = seedAgent({
  id: 'AMS-AGT-203',
  name: 'RCA Evidence Correlator',
  family: 'Diagnosis & RCA',
  area: RCA,
  service: 'Enterprise Core Application Management',
  team: 'AMS Problem Management',
  owner: 'Lena Fischer',
  version: '1.4.0',
  purpose: 'Correlates logs, APM traces, recent changes and known errors to propose a root cause with cited evidence.',
  humanApprovalRequired: false, // read-only, advisory agent
  serviceTier: 'Tier 2',
  runtime: connected('azure-foundry', 'https://foundry-eu.stellantis.internal/agents', 'rca-correlator', 168, at(5, '13:00')),
  skillIds: ['SKL-03', 'SKL-04', 'SKL-07'],
  knowledgeSources: ['Log platform (Splunk / Datadog)', 'APM (Dynatrace)', 'Known-error database', 'Kubernetes events'],
  connectedTools: ['Datadog', 'Dynatrace', 'ServiceNow'],
  workflowIds: ['WF-TPL-01', 'WF-TPL-02'],
  approver: 'AMS Governance Board',
  stage: 6,
  harness: { successfulRuns: 2, lastRunAt: at(10, '16:00'), lastRunStatus: 'passed' },
  evaluation: {
    scores: { incidentAccuracy: 90, rcaQuality: 91, knowledgeQuality: 89, groundedness: 90, hallucination: 88, security: 93, cost: 84, latency: 79 },
    score: 88,
    evaluatedAt: at(11, '10:00')
  },
  createdAt: at(4, '08:00'),
  updatedAt: at(11, '10:00'),
  history: buildHistory('AMS-AGT-203', 6, 4, 'Lena Fischer', [
    { id: 'AMS-AGT-203-E1', at: at(11, '10:00'), actor: 'Lena Fischer', kind: 'evaluation', action: 'Evaluation run', detail: 'Score 88 (pass mark 85), 1 non-blocking violation' }
  ])
});

const knownErrorMatcher = seedAgent({
  id: 'AMS-AGT-204',
  name: 'Known-Error Matcher',
  family: 'Diagnosis & RCA',
  area: RCA,
  service: 'Supplier Collaboration Portal',
  team: 'AMS Problem Management',
  owner: 'Lena Fischer',
  version: '1.0.2',
  purpose: 'Matches new incidents to known-error articles and proposes the documented workaround.',
  humanApprovalRequired: false, // read-only, advisory agent
  serviceTier: 'Tier 2',
  runtime: connected('internal', 'https://agents.ams.internal/kedb', 'known-error-matcher', 71, at(6, '09:00')),
  skillIds: ['SKL-05'],
  knowledgeSources: ['Known-error database'],
  connectedTools: ['ServiceNow'],
  workflowIds: ['WF-TPL-02'],
  approver: 'AMS Governance Board',
  stage: 6,
  harness: { successfulRuns: 1, lastRunAt: at(12, '11:00'), lastRunStatus: 'passed' },
  evaluation: {
    scores: { incidentAccuracy: 80, rcaQuality: 76, knowledgeQuality: 72, groundedness: 78, hallucination: 76, security: 93, cost: 88, latency: 88 },
    score: 81,
    evaluatedAt: at(13, '09:15')
  },
  createdAt: at(5, '08:00'),
  updatedAt: at(13, '09:15'),
  history: buildHistory('AMS-AGT-204', 6, 5, 'Lena Fischer', [
    { id: 'AMS-AGT-204-E1', at: at(13, '09:15'), actor: 'Lena Fischer', kind: 'evaluation', action: 'Evaluation run', detail: 'Score 81 (pass mark 85), 2 blocking violations' }
  ])
});

const changeRiskScorer = seedAgent({
  id: 'AMS-AGT-205',
  name: 'Change Risk Scorer',
  family: 'Change intelligence',
  area: CHANGE,
  service: 'Order-to-Delivery Platform',
  team: 'AMS Change & Release',
  owner: 'David Okafor',
  version: '1.1.0',
  purpose: 'Scores each change request against past failures and flags risky deployments before the CAB.',
  serviceTier: 'Tier 1',
  runtime: connected('internal', 'https://agents.ams.internal/change-risk', 'change-risk-scorer', 96, at(9, '12:00')),
  skillIds: ['SKL-08', 'SKL-04'],
  knowledgeSources: ['ServiceNow ITSM', 'CMDB', 'Jira'],
  connectedTools: ['ServiceNow', 'Jenkins', 'Jira'],
  workflowIds: ['WF-TPL-04'],
  approver: 'Tony / Head of AMS',
  stage: 5,
  createdAt: at(7, '08:00'),
  updatedAt: at(11, '09:30'),
  history: buildHistory('AMS-AGT-205', 5, 7, 'David Okafor')
});

const releaseWatcher = seedAgent({
  id: 'AMS-AGT-206',
  name: 'Release Health Watcher',
  family: 'Monitoring & detection',
  area: CHANGE,
  service: 'Supplier Collaboration Portal',
  version: '0.1.0',
  stage: 1,
  createdAt: at(14, '08:00'),
  updatedAt: at(14, '08:00'),
  history: buildHistory('AMS-AGT-206', 1, 14, 'David Okafor')
});

const logSentinel = seedAgent({
  id: 'AMS-AGT-207',
  name: 'Log Anomaly Sentinel',
  family: 'Monitoring & detection',
  area: OBSERVABILITY,
  service: 'Connected Vehicle Telematics',
  team: 'AMS Observability',
  owner: 'Sofia Martins',
  version: '3.0.1',
  purpose: 'Watches log and APM streams for new error signatures and opens enriched incidents before users notice.',
  humanApprovalRequired: false, // read-only, advisory agent
  serviceTier: 'Tier 2',
  runtime: { ...connected('external', 'https://sentinel.observability.stellantis.internal', 'log-anomaly-sentinel', 58, at(1, '11:00')), healthCheckUrl: '/healthz' },
  skillIds: ['SKL-03'],
  knowledgeSources: ['Log platform (Splunk / Datadog)', 'APM (Dynatrace)', 'Kubernetes events'],
  connectedTools: ['Datadog', 'Splunk', 'PagerDuty', 'ServiceNow'],
  workflowIds: ['WF-TPL-01'],
  approver: 'AMS Governance Board',
  stage: 9,
  harness: { successfulRuns: 6, lastRunAt: at(5, '10:00'), lastRunStatus: 'passed' },
  evaluation: {
    scores: { incidentAccuracy: 89, rcaQuality: 86, knowledgeQuality: 88, groundedness: 90, hallucination: 89, security: 94, cost: 90, latency: 95 },
    score: 90,
    evaluatedAt: at(6, '09:00')
  },
  publishedAt: at(8, '12:00'),
  createdAt: at(1, '08:00'),
  updatedAt: at(9, '09:30'),
  history: buildHistory('AMS-AGT-207', 9, 1, 'Sofia Martins', [
    { id: 'AMS-AGT-207-G1', at: at(7, '16:00'), actor: 'AMS Governance Board', kind: 'governance', action: 'Approved for production', detail: 'All policy checks pass' }
  ])
});
logSentinel.governance = {
  ...logSentinel.governance,
  status: GOVERNANCE_STATUS.APPROVED,
  submittedAt: at(7, '09:30'),
  decidedAt: at(7, '16:00'),
  decidedBy: 'AMS Governance Board',
  comment: 'All policy checks pass'
};

const runbookExecutor = seedAgent({
  id: 'AMS-AGT-208',
  name: 'Runbook Auto-Executor',
  family: 'Remediation & runbooks',
  area: RUNBOOK,
  service: 'Manufacturing Execution System',
  team: 'AMS Automation',
  owner: 'Hannah Schmidt',
  version: '0.8.0',
  purpose: 'Executes approved remediation runbooks for known failure patterns and reports the outcome to the ticket.',
  serviceTier: 'Tier 1',
  runtime: {
    type: 'external',
    baseUrl: 'https://runbooks-unreachable.automation.stellantis.internal',
    agentId: 'runbook-auto-executor',
    connectionStatus: CONNECTION_STATUS.FAILED,
    latencyMs: null,
    checkedAt: at(13, '14:00')
  },
  stage: 2,
  createdAt: at(12, '08:00'),
  updatedAt: at(13, '14:00'),
  history: buildHistory('AMS-AGT-208', 2, 12, 'Hannah Schmidt', [
    { id: 'AMS-AGT-208-C1', at: at(13, '14:00'), actor: 'Hannah Schmidt', kind: 'connection', action: 'Connection failed', detail: 'No response from /health (timed out after 5 s).' }
  ])
});

const diskCleanup = seedAgent({
  id: 'AMS-AGT-209',
  name: 'Disk Cleanup Runbook Agent',
  family: 'Remediation & runbooks',
  area: RUNBOOK,
  service: 'Enterprise Core Application Management',
  team: 'AMS Automation',
  owner: 'Hannah Schmidt',
  version: '1.2.0',
  purpose: 'Frees disk space on application servers by rotating logs and clearing temp files within guardrails.',
  serviceTier: 'Tier 3',
  runtime: connected('internal', 'https://agents.ams.internal/disk-cleanup', 'disk-cleanup-runbook', 63, at(4, '10:00')),
  skillIds: ['SKL-06'],
  knowledgeSources: ['Runbook library', 'CMDB'],
  connectedTools: ['Ansible / Rundeck', 'ServiceNow'],
  workflowIds: ['WF-TPL-03'],
  approver: 'Tony / Head of AMS',
  stage: 8,
  harness: { successfulRuns: 4, lastRunAt: at(9, '15:00'), lastRunStatus: 'passed' },
  evaluation: {
    scores: { incidentAccuracy: 88, rcaQuality: 85, knowledgeQuality: 86, groundedness: 91, hallucination: 90, security: 94, cost: 93, latency: 95 },
    score: 90,
    evaluatedAt: at(10, '10:00')
  },
  createdAt: at(3, '08:00'),
  updatedAt: at(12, '11:00'),
  history: buildHistory('AMS-AGT-209', 8, 3, 'Hannah Schmidt', [
    { id: 'AMS-AGT-209-G1', at: at(10, '15:00'), actor: 'Tony / Head of AMS', kind: 'governance', action: 'Approved for production', detail: 'Low-risk Tier 3 runbook within guardrails' }
  ])
});
diskCleanup.governance = {
  ...diskCleanup.governance,
  status: GOVERNANCE_STATUS.APPROVED,
  submittedAt: at(9, '09:30'),
  decidedAt: at(10, '15:00'),
  decidedBy: 'Tony / Head of AMS',
  comment: 'Low-risk Tier 3 runbook within guardrails'
};

const reviewWriter = seedAgent({
  id: 'AMS-AGT-210',
  name: 'Post-Incident Review Writer',
  family: 'Diagnosis & RCA',
  area: RCA,
  service: 'Enterprise Core Application Management',
  team: 'AMS Problem Management',
  owner: 'Lena Fischer',
  version: '2.0.3',
  purpose: 'Drafts the post-incident review from the incident timeline, RCA evidence and decisions, ready for the problem manager.',
  humanApprovalRequired: false, // writes documents only
  serviceTier: 'Tier 3',
  runtime: connected('internal', 'https://agents.ams.internal/pir-writer', 'post-incident-review-writer', 77, at(2, '09:00')),
  skillIds: ['SKL-07', 'SKL-04'],
  knowledgeSources: ['ServiceNow ITSM', 'Known-error database', 'Jira'],
  connectedTools: ['ServiceNow', 'Jira'],
  workflowIds: ['WF-TPL-02'],
  approver: 'AMS Governance Board',
  stage: 9,
  harness: { successfulRuns: 5, lastRunAt: at(4, '11:00'), lastRunStatus: 'passed' },
  evaluation: {
    scores: { incidentAccuracy: 88, rcaQuality: 92, knowledgeQuality: 87, groundedness: 94, hallucination: 92, security: 95, cost: 93, latency: 92 },
    score: 92,
    evaluatedAt: at(5, '10:00')
  },
  publishedAt: at(7, '12:00'),
  createdAt: at(1, '08:00'),
  updatedAt: at(8, '09:30'),
  history: buildHistory('AMS-AGT-210', 9, 1, 'Lena Fischer', [
    { id: 'AMS-AGT-210-G1', at: at(6, '16:00'), actor: 'AMS Governance Board', kind: 'governance', action: 'Approved for production', detail: 'Document-only agent; all checks pass' }
  ])
});
reviewWriter.governance = {
  ...reviewWriter.governance,
  status: GOVERNANCE_STATUS.APPROVED,
  submittedAt: at(6, '09:30'),
  decidedAt: at(6, '16:00'),
  decidedBy: 'AMS Governance Board',
  comment: 'Document-only agent; all checks pass'
};

/** Studio agents in seed order. */
export const SEED_STUDIO_AGENTS = Object.freeze([
  triageClassifier,
  bridgeCoordinator,
  rcaCorrelator,
  knownErrorMatcher,
  changeRiskScorer,
  releaseWatcher,
  logSentinel,
  runbookExecutor,
  diskCleanup,
  reviewWriter
]);

/** The Tier 1 approval already waiting in the Workflow Inbox. */
export const SEED_APPROVAL_INBOX_ITEMS = Object.freeze([
  buildAgentApprovalInboxItem(triageClassifier, {
    id: triageClassifier.governance.inboxItemId,
    at: triageClassifier.governance.submittedAt,
    actor: triageClassifier.owner
  })
]);

/**
 * Audit trail derived from the seed agents' histories, newest first.
 *
 * @returns {import('../seedState').AmsAuditEntry[]}
 */
export function buildSeedAuditLog() {
  return SEED_STUDIO_AGENTS
    .flatMap((agent) => agent.history.map((entry) => ({
      id: `AUD-${entry.id}`,
      at: entry.at,
      actor: entry.actor,
      action: entry.action,
      target: agent.name,
      detail: entry.detail,
      from: entry.from,
      to: entry.to
    })))
    .sort((a, b) => b.at.localeCompare(a.at));
}
