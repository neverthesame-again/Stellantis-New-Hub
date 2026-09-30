/**
 * @file Reference options for registering an AMS agent (F1).
 *
 * The vocabulary shared by the onboarding form, the lifecycle rules, the
 * evaluation and governance models and the seed data.
 */

/** AMS areas agents are grouped by in Agent Studio. */
export const AMS_AGENT_AREAS = Object.freeze([
  { id: 'incident-triage', label: 'Incident & Triage' },
  { id: 'problem-rca', label: 'Problem & RCA' },
  { id: 'change-release', label: 'Change & Release Ops' },
  { id: 'observability', label: 'Observability' },
  { id: 'runbook-automation', label: 'Runbook Automation' }
]);

/** Agent families (the kind of work an agent does). */
export const AGENT_FAMILIES = Object.freeze([
  'Triage & classification',
  'Diagnosis & RCA',
  'Remediation & runbooks',
  'Change intelligence',
  'Monitoring & detection'
]);

/** Service tiers, most critical first. */
export const SERVICE_TIERS = Object.freeze(['Tier 1', 'Tier 2', 'Tier 3']);

/** Tier whose approvals must also appear in the Workflow Inbox (F7). */
export const INBOX_APPROVAL_TIER = 'Tier 1';

/** Runtimes an agent can be hosted on. */
export const RUNTIME_OPTIONS = Object.freeze([
  {
    id: 'internal',
    label: 'Internal AMS platform',
    shortLabel: 'Internal',
    recommended: true,
    description: 'Managed by the AMS platform team — fastest path to production.'
  },
  {
    id: 'aws-bedrock',
    label: 'AWS Bedrock',
    shortLabel: 'Bedrock',
    description: 'Bedrock Agents in the Stellantis AWS landing zone.'
  },
  {
    id: 'azure-foundry',
    label: 'Azure AI Foundry',
    shortLabel: 'AI Foundry',
    description: 'Agent Service in Azure AI Foundry.'
  },
  {
    id: 'external',
    label: 'External (API or Kubernetes)',
    shortLabel: 'External',
    description: 'Self-hosted agent reachable over HTTPS.'
  }
]);

/** Health-check path used when none is given. */
export const DEFAULT_HEALTH_CHECK_PATH = '/health';

/** Hosting regions, for the data-residency policy. */
export const HOSTING_REGIONS = Object.freeze([
  { id: 'eu', label: 'EU (Frankfurt / Turin)' },
  { id: 'us', label: 'United States' },
  { id: 'other', label: 'Other region' }
]);

/** Knowledge sources an agent can be bound to. */
export const KNOWLEDGE_SOURCES = Object.freeze([
  'ServiceNow ITSM',
  'CMDB',
  'Log platform (Splunk / Datadog)',
  'APM (Dynatrace)',
  'Runbook library',
  'Known-error database',
  'PagerDuty history',
  'Kubernetes events',
  'Jira'
]);

/**
 * Knowledge sources an agent in each AMS area should be bound to. Knowledge
 * coverage (F3 gauges, F8) is the share of these the agent actually uses.
 */
export const RECOMMENDED_KNOWLEDGE_BY_AREA = Object.freeze({
  'incident-triage': ['ServiceNow ITSM', 'CMDB', 'PagerDuty history', 'Known-error database'],
  'problem-rca': ['Log platform (Splunk / Datadog)', 'APM (Dynatrace)', 'Known-error database', 'ServiceNow ITSM'],
  'change-release': ['ServiceNow ITSM', 'CMDB', 'Jira', 'Log platform (Splunk / Datadog)'],
  observability: ['Log platform (Splunk / Datadog)', 'APM (Dynatrace)', 'Kubernetes events', 'PagerDuty history'],
  'runbook-automation': ['Runbook library', 'CMDB', 'Known-error database', 'Kubernetes events']
});

/**
 * Share of the area's recommended knowledge sources the agent is bound to.
 *
 * @param {Object} agent
 * @returns {{ percent: number, bound: string[], missing: string[] }}
 */
export function getKnowledgeCoverage(agent) {
  const recommended = RECOMMENDED_KNOWLEDGE_BY_AREA[agent.area] ?? [];
  const sources = new Set(agent.knowledgeSources || []);
  const bound = recommended.filter((source) => sources.has(source));
  return {
    percent: recommended.length === 0 ? 0 : Math.round((bound.length / recommended.length) * 100),
    bound,
    missing: recommended.filter((source) => !sources.has(source))
  };
}

/** Operational tools an agent can act through. */
export const CONNECTED_TOOLS = Object.freeze([
  'ServiceNow',
  'PagerDuty',
  'Datadog',
  'Dynatrace',
  'Splunk',
  'Kubernetes',
  'Jenkins',
  'Jira',
  'Ansible / Rundeck'
]);

/** Tool that records ITIL change records (change-management policy). */
export const ITSM_TOOL = 'ServiceNow';

/** People or boards who can approve an agent for production. */
export const APPROVERS = Object.freeze([
  'Tony / Head of AMS',
  'AMS Governance Board',
  'Chief AI Officer'
]);

/** Runtime connection states. */
export const CONNECTION_STATUS = Object.freeze({
  CONNECTED: 'connected',
  FAILED: 'failed',
  NOT_VERIFIED: 'not-verified'
});

/** Governance review states. */
export const GOVERNANCE_STATUS = Object.freeze({
  NOT_SUBMITTED: 'not-submitted',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
});

/**
 * @param {string} areaId
 * @returns {string} Display label, or the id when unknown.
 */
export function getAreaLabel(areaId) {
  return AMS_AGENT_AREAS.find((area) => area.id === areaId)?.label ?? areaId;
}

/**
 * @param {string} runtimeId
 * @returns {typeof RUNTIME_OPTIONS[number] | undefined}
 */
export function getRuntimeOption(runtimeId) {
  return RUNTIME_OPTIONS.find((option) => option.id === runtimeId);
}

/**
 * @param {string} regionId
 * @returns {string} Display label, or the id when unknown.
 */
export function getRegionLabel(regionId) {
  return HOSTING_REGIONS.find((region) => region.id === regionId)?.label ?? regionId;
}

/**
 * Registration fields of a new, empty agent. Identity and lifecycle fields
 * (id, stage, history…) are added by the store when the draft is saved.
 *
 * @returns {Object}
 */
export function createEmptyRegistration() {
  return {
    name: '',
    family: AGENT_FAMILIES[0],
    area: AMS_AGENT_AREAS[0].id,
    service: '',
    team: '',
    owner: '',
    version: '1.0.0',
    purpose: '',
    serviceTier: '',
    runtime: {
      type: RUNTIME_OPTIONS[0].id,
      baseUrl: '',
      agentId: '',
      healthCheckUrl: DEFAULT_HEALTH_CHECK_PATH,
      region: HOSTING_REGIONS[0].id,
      connectionStatus: CONNECTION_STATUS.NOT_VERIFIED,
      latencyMs: null,
      checkedAt: null
    },
    skillIds: [],
    knowledgeSources: [],
    connectedTools: [],
    workflowIds: [],
    approver: APPROVERS[0],
    piiMaskingEnabled: true,
    humanApprovalRequired: true
  };
}
