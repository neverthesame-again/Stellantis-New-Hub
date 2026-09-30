/**
 * @file AI Harness single-agent pipeline (F3).
 *
 * Builds the ten-step pipeline script for running one agent on one task. The
 * PoC has no live agent runtimes, so each step's result is generated from the
 * agent's configuration (knowledge, tools, skills, workflows, tier, evaluation)
 * with seeded variation. Steps are flagged `simulated` when the agent's runtime
 * connection is not verified, as the requirement asks.
 */

import { CONNECTION_STATUS, INBOX_APPROVAL_TIER, ITSM_TOOL, getKnowledgeCoverage, getRuntimeOption } from './agentOptions';
import { createRandom } from '../utils/random';
import { LOG_LEVEL, RUN_KIND, RUN_STATUS, STEP_OUTCOME, skipStepsAfterFailure, stepLogs } from './runModel';

/** The ten pipeline steps, in order. */
export const HARNESS_STEPS = Object.freeze([
  { id: 'context', label: 'Context assembly' },
  { id: 'prompt', label: 'Prompt assembly' },
  { id: 'memory', label: 'Memory retrieval' },
  { id: 'tools', label: 'Tool routing' },
  { id: 'workflow', label: 'Workflow routing' },
  { id: 'collaboration', label: 'Agent collaboration' },
  { id: 'quality', label: 'Evaluation (quality gate)' },
  { id: 'policy', label: 'Policy enforcement' },
  { id: 'observability', label: 'Observability' },
  { id: 'approval', label: 'Human approval' }
]);

/** Minimum quality-gate score for a run to continue. */
export const HARNESS_QUALITY_GATE = 80;

/** A realistic default task per AMS area, pre-filled in the run form. */
export const DEFAULT_TASK_BY_AREA = Object.freeze({
  'incident-triage': 'Triage INC-4471: Kafka consumer lag on vehicle.telemetry',
  'problem-rca': 'Find the root cause of recurring INC-4472 connection-pool exhaustion',
  'change-release': 'Assess the risk of CHG-8921 (connection-pool fix, release 2.4.2)',
  observability: 'Explain the error spike on the Fleet Edge Telemetry Pipeline since 09:00',
  'runbook-automation': 'Free disk space on app-srv-17 (disk 92% full)'
});

/**
 * Whether a run of this agent must stop for human approval before it acts.
 *
 * @param {Object} agent
 * @returns {boolean}
 */
export function requiresHumanApproval(agent) {
  return agent.serviceTier === INBOX_APPROVAL_TIER || agent.humanApprovalRequired === true;
}

const clamp = (value, min = 0, max = 99) => Math.max(min, Math.min(max, Math.round(value)));

/**
 * Builds a complete harness run script.
 *
 * @param {Object} params
 * @param {string} params.id              Run id.
 * @param {Object} params.agent           Studio agent (stage 2 or later).
 * @param {string} params.task            What the agent is asked to do.
 * @param {Object[]} params.skills        Skill library.
 * @param {Object[]} params.workflows     Workflow catalogue.
 * @param {Object[]} params.peerAgents    Other studio agents (for collaboration).
 * @param {number} params.seed
 * @param {string} params.startedAt       ISO timestamp.
 * @returns {import('./runModel').AmsRun}
 */
export function buildHarnessRun({ id, agent, task, skills, workflows, peerAgents, seed, startedAt }) {
  const random = createRandom(seed);
  const connected = agent.runtime?.connectionStatus === CONNECTION_STATUS.CONNECTED;
  const runtimeLabel = getRuntimeOption(agent.runtime?.type)?.shortLabel ?? 'runtime';
  const knowledge = agent.knowledgeSources || [];
  const tools = agent.connectedTools || [];
  const agentSkills = (agent.skillIds || []).map((skillId) => skills.find((skill) => skill.id === skillId)).filter(Boolean);
  const agentWorkflows = (agent.workflowIds || []).map((workflowId) => workflows.find((workflow) => workflow.id === workflowId)).filter(Boolean);
  const peers = peerAgents.filter((peer) => peer.id !== agent.id && peer.area === agent.area).slice(0, 2);
  const coverage = getKnowledgeCoverage(agent);

  const quality = clamp((agent.evaluation?.score ?? 72 + knowledge.length * 3 + agentSkills.length * 2) + random.int(-3, 3), 0, 100);
  const tokens = random.int(1800, 6400);
  const needsApproval = requiresHumanApproval(agent);
  const unsafeProduction = agent.serviceTier === INBOX_APPROVAL_TIER && !agent.humanApprovalRequired;

  const policyWarnings = [];
  if (!tools.includes(ITSM_TOOL)) policyWarnings.push(`no ${ITSM_TOOL} change record — output is advisory only`);
  if (!agent.piiMaskingEnabled) policyWarnings.push(`${random.int(1, 4)} PII tokens redacted from log excerpts by the platform filter`);

  /** @type {Array<{ outcome: string, detail: string, logs: Array<[string, string]> }>} */
  const results = [
    knowledge.length
      ? { outcome: STEP_OUTCOME.PASSED, detail: `Assembled ${random.int(6, 14)} context blocks from ${knowledge.length} sources`, logs: [[LOG_LEVEL.INFO, `Context from ${knowledge.join(', ')}`]] }
      : { outcome: STEP_OUTCOME.WARNING, detail: 'No knowledge sources bound — context from the ticket only', logs: [[LOG_LEVEL.WARN, 'Context limited to ticket text; bind knowledge sources in Agent Studio']] },
    { outcome: STEP_OUTCOME.PASSED, detail: `System prompt v${agent.version} + ${agentSkills.length} skill instructions (${tokens} tokens)`, logs: [[LOG_LEVEL.INFO, `Prompt assembled for task "${task}"`]] },
    { outcome: STEP_OUTCOME.PASSED, detail: `Retrieved ${random.int(2, 6)} similar incidents (top match ${random.int(78, 96)}%)`, logs: [[LOG_LEVEL.INFO, 'Operational memory and past decisions retrieved']] },
    tools.length
      ? { outcome: STEP_OUTCOME.PASSED, detail: `Routed to ${tools.slice(0, 3).join(', ')}`, logs: [[LOG_LEVEL.INFO, `Tool calls planned: ${tools.join(', ')}`]] }
      : { outcome: STEP_OUTCOME.WARNING, detail: 'No tools connected — agent can only advise', logs: [[LOG_LEVEL.WARN, 'No connected tools; actions will not be executed']] },
    agentWorkflows.length
      ? { outcome: STEP_OUTCOME.PASSED, detail: `Following "${agentWorkflows[0].name}"`, logs: [[LOG_LEVEL.INFO, `Workflow ${agentWorkflows[0].id} selected`]] }
      : { outcome: STEP_OUTCOME.PASSED, detail: 'No workflow mapped — ran as a single step', logs: [[LOG_LEVEL.INFO, 'Single-step execution']] },
    peers.length
      ? { outcome: STEP_OUTCOME.PASSED, detail: `Consulted ${peers.map((peer) => peer.name).join(' and ')}`, logs: [[LOG_LEVEL.INFO, `Collaboration round with ${peers.length} agent(s)`]] }
      : { outcome: STEP_OUTCOME.PASSED, detail: 'No collaborating agents in this area', logs: [[LOG_LEVEL.INFO, 'Solo run']] },
    quality >= HARNESS_QUALITY_GATE
      ? { outcome: STEP_OUTCOME.PASSED, detail: `Quality gate ${quality}/100 (threshold ${HARNESS_QUALITY_GATE})`, logs: [[LOG_LEVEL.INFO, `Groundedness and accuracy checks passed (${quality})`]] }
      : { outcome: STEP_OUTCOME.FAILED, detail: `Quality gate ${quality}/100 — below threshold ${HARNESS_QUALITY_GATE}`, logs: [[LOG_LEVEL.ERROR, `Quality gate failed (${quality} < ${HARNESS_QUALITY_GATE}); run stopped`]] },
    unsafeProduction
      ? { outcome: STEP_OUTCOME.FAILED, detail: 'Production safety: Tier 1 action without a human approval gate', logs: [[LOG_LEVEL.ERROR, 'Blocked by production-safety policy']] }
      : policyWarnings.length
        ? { outcome: STEP_OUTCOME.WARNING, detail: `Change policy, PII and production safety checked — ${policyWarnings.length} warning(s)`, logs: policyWarnings.map((warning) => [LOG_LEVEL.WARN, warning]) }
        : { outcome: STEP_OUTCOME.PASSED, detail: 'Change policy, PII in logs and production safety: all clear', logs: [[LOG_LEVEL.INFO, 'All policy checks passed']] },
    { outcome: STEP_OUTCOME.PASSED, detail: `Trace ${seed.toString(16).slice(0, 8)} exported · ${tokens} tokens · p95 ${agent.runtime?.latencyMs ?? random.int(120, 260)} ms`, logs: [[LOG_LEVEL.INFO, 'Spans and metrics exported to observability']] },
    needsApproval
      ? { outcome: STEP_OUTCOME.APPROVAL, detail: `Waiting for ${agent.approver} in the Workflow Inbox`, logs: [[LOG_LEVEL.WARN, 'Human approval required before acting in production — run paused']] }
      : { outcome: STEP_OUTCOME.PASSED, detail: `Not required for ${agent.serviceTier || 'this'} service`, logs: [[LOG_LEVEL.INFO, 'Run complete']] }
  ];

  let offset = 0;
  const steps = [];
  const logs = [];
  HARNESS_STEPS.forEach((definition, index) => {
    const durationMs = random.int(350, 1400);
    const result = results[index];
    logs.push(...stepLogs(id, index, offset, [
      [LOG_LEVEL.INFO, `${definition.label} started${connected ? ` on ${runtimeLabel}` : ' (simulated)'}`],
      ...result.logs
    ]));
    offset += durationMs;
    steps.push({ id: definition.id, label: definition.label, detail: result.detail, durationMs, outcome: result.outcome, simulated: !connected });
  });

  return {
    id,
    kind: RUN_KIND.HARNESS,
    title: task,
    agentId: agent.id,
    workflowId: null,
    incidentId: null,
    seed,
    status: RUN_STATUS.RUNNING,
    startedAt,
    finishedAt: null,
    steps: skipStepsAfterFailure(steps),
    logs,
    gauges: {
      contextConfidence: clamp(55 + knowledge.length * 8 + agentSkills.length * 2 + random.int(-3, 3)),
      reuseReadiness: clamp(40 + agentSkills.length * 12 + (agent.publishedAt ? 10 : 0) + (agentWorkflows.length ? 8 : 0) + random.int(-3, 3)),
      knowledgeCoverage: coverage.percent
    },
    pendingApprovalIndex: null,
    approvedStepIndexes: [],
    approvalInboxItemId: null
  };
}
