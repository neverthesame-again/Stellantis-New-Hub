/**
 * @file AMS operating policies and compliance checks (F7).
 *
 * Each policy checks one agent and returns pass/fail with the evidence behind
 * it (for example "security score 95" or "version 2.1.0"). The checklist,
 * the policy matrix coverage and the approval gate all derive from these
 * checks, so they can never disagree.
 */

import { CONNECTION_STATUS, INBOX_APPROVAL_TIER, ITSM_TOOL, getRegionLabel } from './agentOptions';
import { STAGE } from './agentLifecycle';

const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;

/**
 * @typedef {Object} PolicyResult
 * @property {boolean} passed
 * @property {string} evidence Short, human-readable reason.
 */

/**
 * @typedef {Object} GovernancePolicy
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {(agent: Object) => PolicyResult} check
 */

/** @type {ReadonlyArray<GovernancePolicy>} */
export const GOVERNANCE_POLICIES = Object.freeze([
  {
    id: 'responsible-ai',
    label: 'Responsible AI',
    description: 'Answers are grounded and unsupported claims are rare.',
    check: (agent) => {
      const scores = agent.evaluation?.scores;
      if (!scores) return { passed: false, evidence: 'Not evaluated yet' };
      return {
        passed: scores.groundedness >= 85 && scores.hallucination >= 85,
        evidence: `groundedness ${scores.groundedness}, hallucination control ${scores.hallucination}`
      };
    }
  },
  {
    id: 'pii-protection',
    label: 'PII protection in incident data',
    description: 'Personal data in tickets and logs is masked before the agent sees it.',
    check: (agent) => ({
      passed: agent.piiMaskingEnabled === true,
      evidence: agent.piiMaskingEnabled ? 'PII masking enabled for incident data' : 'PII masking not enabled'
    })
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Security evaluation score of at least 90.',
    check: (agent) => {
      const score = agent.evaluation?.scores?.security;
      if (score === undefined) return { passed: false, evidence: 'No security score yet' };
      return { passed: score >= 90, evidence: `security score ${score}` };
    }
  },
  {
    id: 'human-approval',
    label: 'Human approval for production actions',
    description: `${INBOX_APPROVAL_TIER} agents need a human approval gate before acting in production.`,
    check: (agent) => {
      if (agent.serviceTier !== INBOX_APPROVAL_TIER) {
        return { passed: true, evidence: `not mandatory for ${agent.serviceTier || 'untiered'} services` };
      }
      return agent.humanApprovalRequired
        ? { passed: true, evidence: 'human approval gate on production actions' }
        : { passed: false, evidence: `${INBOX_APPROVAL_TIER} agent without a human approval gate` };
    }
  },
  {
    id: 'change-management',
    label: 'Change management (ITIL)',
    description: `Production changes are raised as change records in ${ITSM_TOOL}.`,
    check: (agent) => {
      const connected = (agent.connectedTools || []).includes(ITSM_TOOL);
      return {
        passed: connected,
        evidence: connected ? `changes raised through ${ITSM_TOOL}` : 'no ITSM tool connected for change records'
      };
    }
  },
  {
    id: 'data-residency',
    label: 'Data residency',
    description: 'Incident data stays in the EU.',
    check: (agent) => {
      const region = agent.runtime?.region;
      return { passed: region === 'eu', evidence: `hosted in ${getRegionLabel(region ?? 'unknown')}` };
    }
  },
  {
    id: 'version-control',
    label: 'Version control',
    description: 'Every agent release has a semantic version.',
    check: (agent) => (SEMVER_PATTERN.test(agent.version || '')
      ? { passed: true, evidence: `version ${agent.version}` }
      : { passed: false, evidence: 'no semantic version set' })
  },
  {
    id: 'audit-trail',
    label: 'Audit trail',
    description: 'Runtime is connected and lifecycle events are recorded.',
    check: (agent) => {
      const events = (agent.history || []).length;
      const connected = agent.runtime?.connectionStatus === CONNECTION_STATUS.CONNECTED;
      return connected
        ? { passed: true, evidence: `${events} lifecycle events recorded` }
        : { passed: false, evidence: 'runtime not connected — actions cannot be traced' };
    }
  }
]);

/**
 * Runs every policy against one agent.
 *
 * @param {Object} agent
 * @returns {Array<GovernancePolicy & PolicyResult>}
 */
export function getComplianceChecklist(agent) {
  return GOVERNANCE_POLICIES.map((policy) => ({ ...policy, ...policy.check(agent) }));
}

/**
 * Whether the agent passes every policy.
 *
 * @param {Object} agent
 * @returns {boolean}
 */
export function isFullyCompliant(agent) {
  return GOVERNANCE_POLICIES.every((policy) => policy.check(agent).passed);
}

/**
 * Agents in scope for the policy matrix: those that have reached evaluation or
 * beyond. Drafts are left out so coverage reflects the governed fleet.
 *
 * @param {Object[]} agents
 * @returns {Object[]}
 */
export function selectGovernedAgents(agents) {
  return agents.filter((agent) => agent.stage >= STAGE.EVALUATION);
}

/**
 * Coverage of each policy across the governed agents.
 *
 * @param {Object[]} agents All studio agents.
 * @returns {Array<{ policy: GovernancePolicy, coverage: number | null, passing: number, total: number, failingAgents: Object[] }>}
 */
export function getPolicyCoverage(agents) {
  const governed = selectGovernedAgents(agents);
  return GOVERNANCE_POLICIES.map((policy) => {
    const failingAgents = governed.filter((agent) => !policy.check(agent).passed);
    const passing = governed.length - failingAgents.length;
    return {
      policy,
      coverage: governed.length === 0 ? null : Math.round((passing / governed.length) * 100),
      passing,
      total: governed.length,
      failingAgents
    };
  });
}
