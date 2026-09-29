/**
 * Onboarding Studio (F1/F2) — pure helpers shared by the page and its sections.
 * No React here; everything derives from agentStudioData.js.
 */
import {
  RUNTIMES,
  EMPTY_AGENT_DRAFT,
  REQUIRED_REGISTRATION_FIELDS,
  getStage
} from '../../agentStudioData';

export const SEMVER = /^\d+\.\d+\.\d+$/;

export const FIELD_LABELS = {
  name: 'Agent name',
  family: 'Agent family',
  program: 'Vehicle program',
  team: 'Owning team',
  owner: 'Accountable owner',
  version: 'Version',
  purpose: 'Purpose',
  asil: 'ASIL level',
  subDomain: 'AD sub-domain',
  runtime: 'Runtime connection',
  skills: 'Skills',
  knowledge: 'Knowledge sources',
  tools: 'Connected tools',
  workflows: 'Workflow mapping',
  approver: 'Approver'
};

export const ASIL_HINTS = {
  QM: 'Quality managed — no ISO 26262 safety requirement allocated. Standard ASPICE quality gates apply.',
  A: 'Lowest safety integrity. ASPICE traceability gate (≥ 88) applies to all ASIL-rated agents.',
  B: 'Moderate integrity. Typical for driver-assist perception tooling and HIL automation.',
  C: 'High integrity. Safety compliance must reach ≥ 92 in the Evaluation Center.',
  D: 'Highest integrity. Safety ≥ 92, Functional Safety Manager sign-off strongly recommended.'
};

export const getRuntime = (type) => RUNTIMES.find((r) => r.id === type) || RUNTIMES[RUNTIMES.length - 1];

export const defaultHealthUrl = (type) => (type === 'EXTERNAL' ? '/healthz' : '/health');

/** Editable projection of an agent — what the registration form edits. */
export function draftFromAgent(agent) {
  return {
    name: agent.name || '',
    family: agent.family || '',
    program: agent.program || '',
    team: agent.team || '',
    owner: agent.owner || '',
    version: agent.version || '',
    purpose: agent.purpose || '',
    subDomain: agent.subDomain || '',
    asil: agent.asil || '',
    runtime: {
      type: agent.runtime?.type || 'SEL',
      baseUrl: agent.runtime?.baseUrl || '',
      agentId: agent.runtime?.agentId || '',
      healthUrl: agent.runtime?.healthUrl || ''
    },
    skills: [...(agent.skills || [])],
    knowledge: [...(agent.knowledge || [])],
    tools: [...(agent.tools || [])],
    workflows: [...(agent.workflows || [])],
    approver: agent.approver || ''
  };
}

export const newRegistrationDraft = () => draftFromAgent(EMPTY_AGENT_DRAFT);

export const sameDraft = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export const sameRuntimeConfig = (a, b) => (
  a.type === b.type && a.baseUrl === b.baseUrl && a.agentId === b.agentId && a.healthUrl === b.healthUrl
);

/** Fields that differ between two drafts (labels, for the audit trail). */
export function changedFields(before, after) {
  return Object.keys(after)
    .filter((k) => JSON.stringify(before[k]) !== JSON.stringify(after[k]))
    .map((k) => FIELD_LABELS[k] || k);
}

/** Returns { field: message } for invalid fields. */
export function validateDraft(draft, agents = [], selfId = null) {
  const errors = {};
  REQUIRED_REGISTRATION_FIELDS.forEach((f) => {
    if (!String(draft[f] ?? '').trim()) errors[f] = `${FIELD_LABELS[f] || f} is required`;
  });
  const name = draft.name.trim().toLowerCase();
  if (!errors.name && agents.some((a) => a.id !== selfId && a.name.trim().toLowerCase() === name)) {
    errors.name = 'An agent with this name is already registered in the studio';
  }
  if (!errors.purpose && draft.purpose.trim().length < 20) {
    errors.purpose = 'Describe the purpose in at least 20 characters (used by the Responsible AI guardrail)';
  }
  if (!draft.version.trim()) errors.version = 'Version is required (SemVer, e.g. 1.0.0)';
  else if (!SEMVER.test(draft.version.trim())) errors.version = 'Use semantic versioning MAJOR.MINOR.PATCH, e.g. 1.0.0';
  return errors;
}

/** Normalised copy (trimmed strings) ready to persist. */
export function normaliseDraft(draft) {
  const trim = (v) => (typeof v === 'string' ? v.trim() : v);
  return {
    ...draft,
    name: trim(draft.name),
    family: trim(draft.family),
    program: trim(draft.program),
    team: trim(draft.team),
    owner: trim(draft.owner),
    version: trim(draft.version),
    purpose: trim(draft.purpose),
    runtime: {
      ...draft.runtime,
      baseUrl: trim(draft.runtime.baseUrl),
      agentId: trim(draft.runtime.agentId),
      healthUrl: trim(draft.runtime.healthUrl)
    }
  };
}

/** Client-side pre-flight checks mirroring the mock health check rules. */
export function runtimePreflight(runtime) {
  return [
    { key: 'https', label: 'Base URL uses https://', pass: /^https:\/\/.+/.test(runtime.baseUrl || '') },
    { key: 'id', label: `${getRuntime(runtime.type).idLabel} provided`, pass: Boolean((runtime.agentId || '').trim()) },
    { key: 'health', label: 'Health-check path set', pass: Boolean((runtime.healthUrl || '').trim()) }
  ];
}

export function endpointPreview(runtime) {
  const base = (runtime.baseUrl || '').replace(/\/+$/, '');
  const id = (runtime.agentId || '').trim() || '{agent-id}';
  const health = (runtime.healthUrl || '').trim();
  const healthPath = health ? (health.startsWith('/') ? health : `/${health}`) : '';
  return `${base || 'https://…'}/${id}${healthPath}`;
}

export const RUNTIME_STATUS = {
  connected: { label: 'Connected', tone: 'is-success', dot: 'is-good' },
  failed: { label: 'Failed', tone: 'is-critical', dot: 'is-bad' },
  verifying: { label: 'Verifying…', tone: 'is-info', dot: 'is-busy' },
  unverified: { label: 'Not verified', tone: '', dot: 'is-idle' }
};

export const runtimeStatusMeta = (status) => RUNTIME_STATUS[status] || RUNTIME_STATUS.unverified;

export const GOVERNANCE_STATUS = {
  not_submitted: { label: 'Not submitted', tone: '' },
  pending: { label: 'Pending approval', tone: 'is-warning' },
  approved: { label: 'Approved', tone: 'is-success' },
  rejected: { label: 'Rejected', tone: 'is-critical' }
};

export const governanceStatusMeta = (status) => GOVERNANCE_STATUS[status] || GOVERNANCE_STATUS.not_submitted;

export const LIST_FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'onboarding', label: 'Onboarding', test: (a) => a.stage < 6 && a.operationalState !== 'Suspended' },
  { id: 'awaiting', label: 'Awaiting approval', test: (a) => a.governance?.status === 'pending' },
  { id: 'published', label: 'Published', test: (a) => a.stage >= 9 },
  { id: 'suspended', label: 'Suspended', test: (a) => a.operationalState === 'Suspended' }
];

export const nextStageOf = (agent) => (agent && agent.stage < 9 ? getStage(agent.stage + 1) : null);

export const isLocked = (agent) => Boolean(agent && agent.stage >= 8);

export function formatCount(n) {
  if (n == null) return '—';
  if (n >= 100000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/**
 * Exit criteria per completed stage — used to render a ✓ / ✗ checklist.
 * `match` identifies the blocker string emitted by getStageBlockers().
 */
export function exitChecklist(stage, threshold) {
  switch (stage) {
    case 1:
      return [{ label: 'Runtime endpoint verified (health check passed)', match: /runtime/i, jump: 'runtime' }];
    case 2:
      return [
        { label: 'At least 1 certified skill attached', match: /skill/i, jump: 'skills' },
        { label: 'At least 1 knowledge source bound', match: /knowledge/i, jump: 'knowledge' }
      ];
    case 3:
      return [{ label: 'At least 1 engineering tool connected', match: /tool/i, jump: 'tools' }];
    case 4:
      return [{ label: 'Mapped to at least 1 agentic workflow', match: /workflow/i, jump: 'workflows' }];
    case 5:
      return [
        { label: 'Evaluation executed in the Evaluation Center', match: /run an evaluation/i, nav: 'evaluation' },
        { label: `Score ≥ pass threshold (${threshold}) and no blocking rule violated`, match: /below threshold|run an evaluation/i, nav: 'evaluation' }
      ];
    case 6:
      return [
        { label: 'All mandatory guardrails pass', match: /guardrail/i, nav: 'governance' },
        { label: 'Approver decision recorded', match: /approval decision/i, nav: 'governance' }
      ];
    case 7:
      return [{ label: 'Version frozen and certificate ID issued', match: /certificate/i, nav: 'governance' }];
    case 8:
      return [{ label: 'Published to the AD runtime and catalogue', match: /publish/i }];
    default:
      return [];
  }
}

export const sectionDomId = (key) => `ad-onb-sec-${key}`;

export function scrollToSection(key) {
  const el = typeof document !== 'undefined' ? document.getElementById(sectionDomId(key)) : null;
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
