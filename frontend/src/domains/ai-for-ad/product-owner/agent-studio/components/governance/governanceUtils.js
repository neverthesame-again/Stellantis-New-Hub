/**
 * Governance Center (F4) — pure helpers shared by the governance sub-components.
 */

/** An agent is "governed" once it has entered the approval flow. */
export const isGoverned = (agent) => agent.governance.status !== 'not_submitted' || agent.stage >= 6;

/** ASIL C / D agents are treated as critical in the approval queue. */
export const isCritical = (agent) => agent.asil === 'C' || agent.asil === 'D';

export const STATUS_META = {
  pending: { label: 'Pending approval', tone: 'is-warning' },
  approved: { label: 'Approved', tone: 'is-success' },
  rejected: { label: 'Rejected', tone: 'is-critical' },
  not_submitted: { label: 'Not submitted', tone: '' }
};

export const QUEUE_FILTERS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All' }
];

/** Colour bucket for a coverage percentage. */
export const coverageTone = (pct) => {
  if (pct == null) return 'is-none';
  if (pct >= 90) return 'is-good';
  if (pct >= 70) return 'is-warn';
  return 'is-bad';
};

/** Coverage of one policy across a set of agents. */
export function policyCoverage(policyId, agents, checksById) {
  const failing = agents.filter((a) => !checksById[a.id]?.[policyId]?.pass);
  const total = agents.length;
  const passed = total - failing.length;
  return { passed, total, pct: total ? Math.round((passed / total) * 100) : null, failing };
}

/** Coverage of several policies across a set of agents (every agent × policy pair counts once). */
export function coverageForPolicies(policyIds, agents, checksById) {
  let passed = 0;
  let total = 0;
  agents.forEach((a) => {
    policyIds.forEach((pid) => {
      total += 1;
      if (checksById[a.id]?.[pid]?.pass) passed += 1;
    });
  });
  return { passed, total, pct: total ? Math.round((passed / total) * 100) : null };
}

export function relativeTime(iso) {
  if (!iso) return '—';
  const diff = Date.now() - Date.parse(iso);
  if (Number.isNaN(diff)) return '—';
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;
  const months = Math.round(days / 30);
  return `${months} mo ago`;
}

/** When the agent entered its current governance state (audit is newest-first). */
export function waitingSince(agent, audit) {
  if (agent.governance.status === 'pending') {
    const entry = audit.find((e) => e.agentId === agent.id
      && (e.action === 'Governance submitted' || (e.action === 'Stage advanced' && /→ Evaluated$/.test(e.detail || ''))));
    return entry?.ts || agent.updatedAt;
  }
  return agent.governance.decidedAt || agent.updatedAt;
}

export const lastComplianceScan = (agentId, audit) => audit.find((e) => e.agentId === agentId && e.action === 'Compliance scan') || null;

const STATUS_ORDER = { pending: 0, rejected: 1, approved: 2, not_submitted: 3 };

/** Pending first (critical, then longest-waiting), then rejected, then approved (most recent first). */
export function sortQueue(agents, audit) {
  return [...agents].sort((a, b) => {
    const so = STATUS_ORDER[a.governance.status] - STATUS_ORDER[b.governance.status];
    if (so) return so;
    if (a.governance.status === 'pending') {
      const crit = Number(isCritical(b)) - Number(isCritical(a));
      if (crit) return crit;
      return Date.parse(waitingSince(a, audit)) - Date.parse(waitingSince(b, audit));
    }
    return Date.parse(waitingSince(b, audit)) - Date.parse(waitingSince(a, audit));
  });
}

/** Regulation map — which guardrail policies enforce each automotive regulation. */
export const REGULATIONS = [
  {
    id: 'iso26262',
    code: 'ISO 26262',
    title: 'Functional Safety',
    owner: 'Dr. Katrin Müller · Functional Safety Manager',
    summary: 'Road-vehicle functional safety. AI agents used in the safety lifecycle are treated as software tools and must be qualified.',
    clauses: [
      'Part 8 §11 — tool impact (TI) × tool error detection (TD) → TCL1–TCL3',
      'ASIL gate: safety score ≥ 92 for ASIL C/D, ≥ 85 otherwise',
      'Part 2 §6 — confirmation measures and lifecycle audit trail'
    ],
    policies: ['p_fusa', 'p_audit', 'p_human']
  },
  {
    id: 'sotif',
    code: 'ISO 21448',
    title: 'SOTIF — Safety of the Intended Functionality',
    owner: 'Dr. Katrin Müller · Functional Safety Manager',
    summary: 'Hazards from functional insufficiencies and triggering conditions without a system fault — key for perception and planning.',
    clauses: [
      'Triggering-condition scenarios (rain, glare, cut-ins) exercised',
      'Scenario coverage ≥ 85 for Perception and Planning & Control agents',
      'Known-unsafe / unknown-unsafe area reduction evidence'
    ],
    policies: ['p_sotif']
  },
  {
    id: 'cyber',
    code: 'ISO/SAE 21434 · UNECE R155',
    title: 'Cybersecurity (CSMS)',
    owner: 'Marco Rossi · Cybersecurity Officer',
    summary: 'Cybersecurity management system for vehicle types — agents touching engineering systems must be least-privilege.',
    clauses: [
      'TARA (threat analysis & risk assessment) on file',
      'Verified runtime endpoint — health check passed',
      'Least privilege: ≤ 6 engineering tool grants per agent'
    ],
    policies: ['p_cyber']
  },
  {
    id: 'r156',
    code: 'UNECE R156',
    title: 'Software Update Management (SUMS)',
    owner: 'Sofia Marino · Release Operations',
    summary: 'OTA-relevant outputs require traceable software versions (RXSWIN) and a rollback path.',
    clauses: [
      'Semantic version recorded for every agent artefact',
      'Rollback plan for outputs feeding OTA release packages',
      'RXSWIN impact assessment before publication'
    ],
    policies: ['p_sums', 'p_version']
  },
  {
    id: 'aspice',
    code: 'ASPICE 3.1',
    title: 'Automotive SPICE — SWE Traceability',
    owner: 'Elena Bianchi · ASPICE Quality Lead',
    summary: 'Bidirectional traceability from system requirement to software test across SWE.1–SWE.6.',
    clauses: [
      'SWE.1–SWE.6 bidirectional links (traceability ≥ 88)',
      'Consistency between requirements, architecture and tests',
      'Work products under configuration management'
    ],
    policies: ['p_aspice', 'p_version', 'p_audit']
  },
  {
    id: 'gdpr',
    code: 'GDPR · Fleet Data Policy',
    title: 'Data Protection & Responsible AI',
    owner: 'TCS Data Protection Office',
    summary: 'Fleet and proving-ground telemetry may contain personal data — only anonymised or engineering data may be bound.',
    clauses: [
      'Fleet telemetry bound only with anonymisation attestation',
      'Purpose limitation — documented purpose and owner (AI Charter)',
      'Human-oversight path for gated decisions'
    ],
    policies: ['p_gdpr', 'p_rai']
  }
];
