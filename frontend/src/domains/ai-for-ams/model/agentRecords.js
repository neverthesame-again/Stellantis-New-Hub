/**
 * @file Records one AMS feature raises for another: catalogue cards and Workflow Inbox items.
 *
 * - {@link toCatalogueAgent}: the Published catalogue card (F1: "a published
 *   agent appears in the Agent & Workflow Catalogue with status Active").
 * - {@link buildAgentApprovalInboxItem}: the Workflow Inbox item raised when a
 *   Tier 1 agent reaches governance approval (F7: "approvers keep one queue").
 */

import { formatDateTime } from '../utils/formatters';
import { INBOX_APPROVAL_TIER, getAreaLabel, getRuntimeOption } from './agentOptions';
import { getComplianceChecklist } from './governancePolicies';
import { RUN_KIND, STEP_OUTCOME } from './runModel';
import { getIncidentEvidence } from './incidents';

/** Inbox category used for agent production approvals. */
export const AGENT_APPROVAL_INBOX_TYPE = 'Automation approvals';

/** Marker on inbox items that belong to an agent's governance approval. */
export const INBOX_LINK_AGENT_APPROVAL = 'agent-approval';

/** Marker on inbox items that pause a harness or workflow run for approval. */
export const INBOX_LINK_RUN_APPROVAL = 'run-approval';

/** Marker on inbox items that hand an incident's recommended fix to an approver (F5). */
export const INBOX_LINK_RCA_REMEDIATION = 'rca-remediation';

const RISK_BY_TIER = { 'Tier 1': 'High', 'Tier 2': 'Medium', 'Tier 3': 'Low' };
const AUTONOMY_BY_TIER = {
  'Tier 1': 'L3 Collaborative (human approval)',
  'Tier 2': 'L3 Collaborative',
  'Tier 3': 'L4 Autonomous with Guardrails'
};

/**
 * Maps a published studio agent to the shape of the Published catalogue.
 *
 * @param {Object} agent Studio agent with `publishedAt` set.
 * @returns {Object} Catalogue agent.
 */
export function toCatalogueAgent(agent) {
  const tools = agent.connectedTools || [];
  return {
    id: agent.id,
    studioAgentId: agent.id,
    name: agent.name,
    owner: agent.owner,
    autonomyLevel: AUTONOMY_BY_TIER[agent.serviceTier] ?? 'L3 Collaborative',
    lifecycleStage: 'Production Active',
    status: 'Active',
    riskRating: RISK_BY_TIER[agent.serviceTier] ?? 'Medium',
    domain: getAreaLabel(agent.area),
    technology: getRuntimeOption(agent.runtime?.type)?.label ?? 'Unknown runtime',
    purpose: agent.purpose,
    inputs: (agent.knowledgeSources || []).join(', ') || '—',
    outputs: tools.length ? `Actions through ${tools.join(', ')}` : '—',
    modelDependencies: getRuntimeOption(agent.runtime?.type)?.label ?? '—',
    project: agent.service,
    metrics: agent.evaluation?.score !== undefined
      ? `Evaluation score ${agent.evaluation.score} • v${agent.version}`
      : `v${agent.version}`,
    permissions: tools.map((tool) => `${tool.toLowerCase().replace(/[^a-z]+/g, '.')}.use`)
  };
}

/**
 * Builds the Workflow Inbox item for a Tier 1 agent awaiting production approval.
 *
 * @param {Object} agent Studio agent entering the approval stage.
 * @param {{ id: string, at: string, actor: string }} meta Item id, timestamp and requesting actor.
 * @returns {Object} Workflow Inbox item linked back to the agent.
 */
export function buildAgentApprovalInboxItem(agent, { id, at, actor }) {
  const checklist = getComplianceChecklist(agent);
  const failing = checklist.filter((check) => !check.passed);
  const score = agent.evaluation?.score;

  return {
    id,
    link: { kind: INBOX_LINK_AGENT_APPROVAL, agentId: agent.id },
    title: `Approve agent for production: ${agent.name} v${agent.version}`,
    type: AGENT_APPROVAL_INBOX_TYPE,
    priority: 'P2',
    riskLevel: 'High',
    requestor: agent.owner || actor,
    originatingSystem: 'AMS Agent Studio',
    project: agent.service,
    portfolio: `${getAreaLabel(agent.area)} • ${agent.serviceTier}`,
    requiredDecision: `Approve ${agent.name} to act on ${agent.serviceTier} production services`,
    dueDate: 'Within 2 business days',
    status: 'Pending Review',
    confidence: score !== undefined ? `${score}%` : 'n/a',
    supportingEvidence: {
      metrics: score !== undefined
        ? `Evaluation score ${score}. ${checklist.length - failing.length} of ${checklist.length} policy checks pass.`
        : 'Not evaluated.',
      impact: `Agent will act on ${agent.service} (${agent.serviceTier}). Purpose: ${agent.purpose}`,
      rollbackPlan: `Pause the agent from Monitor & FinOps; roll back to the previous version if one exists. Approver on record: ${agent.approver}.`
    },
    aiRecommendation: failing.length === 0
      ? 'APPROVE. All operating policy checks pass and the evaluation meets the pass mark.'
      : `REVIEW. Failing checks: ${failing.map((check) => check.label).join(', ')}.`,
    decisionHistory: [
      { timestamp: formatDateTime(at), actor, action: 'Submitted for production approval from Agent Studio' }
    ],
    auditTrail: `Lifecycle: stage 7 (Approval) • Agent ${agent.id} • Governance approver: ${agent.approver}`
  };
}

/**
 * Builds the Workflow Inbox item that pauses a harness or workflow run at a
 * human-approval step (F3, F9). Approving resumes the run; rejecting ends it.
 *
 * @param {import('./runModel').AmsRun} run
 * @param {number} stepIndex Approval step the run is waiting on.
 * @param {{ id: string, at: string, actor: string, agent?: Object, workflowName?: string }} meta
 * @returns {Object} Workflow Inbox item linked back to the run.
 */
export function buildRunApprovalInboxItem(run, stepIndex, { id, at, actor, agent, workflowName }) {
  const completed = run.steps.slice(0, stepIndex).filter((step) => step.outcome !== STEP_OUTCOME.SKIPPED);
  const warnings = completed.filter((step) => step.outcome === STEP_OUTCOME.WARNING);
  const isHarness = run.kind === RUN_KIND.HARNESS;
  const subject = isHarness ? agent?.name ?? 'Agent' : workflowName ?? 'Workflow';

  return {
    id,
    link: { kind: INBOX_LINK_RUN_APPROVAL, runId: run.id },
    title: `${isHarness ? 'Harness run' : 'Workflow run'} awaiting approval: ${subject}`,
    type: 'High-risk remediation actions',
    priority: isHarness && agent?.serviceTier !== INBOX_APPROVAL_TIER ? 'P3' : 'P2',
    riskLevel: 'High',
    requestor: actor,
    originatingSystem: isHarness ? 'AMS AI Harness' : 'AMS Workflow Playground',
    project: isHarness ? agent?.service ?? '—' : run.incidentId ?? '—',
    portfolio: isHarness && agent ? `${getAreaLabel(agent.area)} • ${agent.serviceTier}` : 'AMS workflows',
    requiredDecision: `Allow "${run.title}" to continue past "${run.steps[stepIndex].label}"`,
    dueDate: 'Immediate (run paused)',
    status: 'Pending Action',
    confidence: warnings.length === 0 ? '90%' : `${Math.max(60, 90 - warnings.length * 10)}%`,
    supportingEvidence: {
      metrics: `${completed.length} of ${run.steps.length} steps completed; ${warnings.length} warning(s).`,
      impact: completed.map((step) => `${step.label}: ${step.detail}`).slice(-3).join(' • '),
      rollbackPlan: 'Rejecting stops the run before any production action is taken.'
    },
    aiRecommendation: warnings.length === 0
      ? 'APPROVE. All steps before the approval gate passed.'
      : `REVIEW. Warnings in: ${warnings.map((step) => step.label).join(', ')}.`,
    decisionHistory: [
      { timestamp: formatDateTime(at), actor, action: `Run ${run.id} paused at "${run.steps[stepIndex].label}"` }
    ],
    auditTrail: `Run ${run.id} • ${run.kind} • started ${formatDateTime(run.startedAt)}`
  };
}

/**
 * Builds the Workflow Inbox item that hands an incident's recommended fix to
 * an approver (F5). It carries the incident, root cause, evidence and fix.
 *
 * @param {import('./incidents').AmsIncident} incident
 * @param {{ id: string, at: string, actor: string, confidence: number }} meta
 * @returns {Object} Workflow Inbox item linked back to the incident.
 */
export function buildRcaInboxItem(incident, { id, at, actor, confidence }) {
  const evidence = getIncidentEvidence(incident);
  const bestMatch = incident.knowledge.similar[0];
  return {
    id,
    link: { kind: INBOX_LINK_RCA_REMEDIATION, incidentId: incident.id },
    title: `Remediate ${incident.id}: ${incident.fix}`,
    type: 'High-risk remediation actions',
    priority: incident.severity,
    riskLevel: incident.severity === 'P1' ? 'Critical' : 'High',
    requestor: `${actor} (live war room)`,
    originatingSystem: 'AMS Live War Room',
    project: incident.service,
    portfolio: incident.portfolio,
    requiredDecision: `Approve the fix for ${incident.id}: ${incident.fix}`,
    dueDate: incident.severity === 'P1' ? 'Immediate (P1 in progress)' : 'Within 1 hour',
    status: 'Pending Action',
    confidence: `${confidence}%`,
    supportingEvidence: {
      metrics: `Root cause: ${incident.rootCause}`,
      impact: evidence.map((record) => `${record.system} ${record.recordId}: ${record.excerpt}`).join(' • '),
      rollbackPlan: bestMatch
        ? `Closest past incident ${bestMatch.id} (${bestMatch.match}% match) was resolved by: ${bestMatch.resolution}.`
        : 'No similar past incident on record.'
    },
    aiRecommendation: `APPROVE. ${incident.fix}`,
    decisionHistory: [
      { timestamp: formatDateTime(at), actor, action: `Recommended fix for ${incident.id} sent from the live war room` }
    ],
    auditTrail: `Incident ${incident.id} • problem ${incident.problemRecordId} • change ${incident.knowledge.change.recordId}`
  };
}