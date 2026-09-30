/**
 * Agent Studio — Shared Mock Data & Pure Helpers (AI for AD · Product Owner)
 *
 * Single source of truth for F1–F5:
 *  - F1/F2 Onboarding Studio + Lifecycle (inside Agent & Workflow Catalogue)
 *  - F3 AI Harness, F4 Governance Center, F5 Evaluation Center (Experience Zone tabs)
 *
 * All helpers here are pure (no React). State lives in AgentStudioContext.jsx.
 */

// ---------------------------------------------------------------------------
// Lifecycle (F2) — an agent's `stage` is the last stage it has COMPLETED (1..9)
// ---------------------------------------------------------------------------
export const LIFECYCLE_STAGES = [
  { id: 1, key: 'registered', label: 'Registered', home: 'Onboarding Studio', exit: 'Identity fields, owner, purpose and ASIL level captured' },
  { id: 2, key: 'runtime', label: 'Runtime Connected', home: 'Onboarding Studio', exit: 'Runtime endpoint verified (health check passed)' },
  { id: 3, key: 'skills', label: 'Skills & Knowledge', home: 'Onboarding Studio', exit: 'At least 1 certified skill and 1 knowledge source bound' },
  { id: 4, key: 'tools', label: 'Tools Connected', home: 'Onboarding Studio', exit: 'At least 1 engineering tool connected' },
  { id: 5, key: 'workflow', label: 'Workflow Mapped', home: 'Onboarding Studio', exit: 'Mapped to at least 1 agentic workflow' },
  { id: 6, key: 'evaluated', label: 'Evaluated', home: 'Evaluation Center', exit: 'Score ≥ pass threshold and no blocking rule violation' },
  { id: 7, key: 'approved', label: 'Governance Approved', home: 'Governance Center', exit: 'All mandatory guardrails pass and approver decision recorded' },
  { id: 8, key: 'certified', label: 'Certified', home: 'Governance Center', exit: 'Version frozen and certificate ID issued' },
  { id: 9, key: 'published', label: 'Published', home: 'Agent Runtime', exit: 'Visible in catalogue and AD runtime' }
];

export const getStage = (stageId) => LIFECYCLE_STAGES.find((s) => s.id === stageId) || LIFECYCLE_STAGES[0];

/** Progress %: Registered = 0 %, Published = 100 %. */
export const stageProgress = (stageId) => Math.round(((Math.max(1, stageId) - 1) / 8) * 100);

// ---------------------------------------------------------------------------
// Reference lists
// ---------------------------------------------------------------------------
export const AD_SUBDOMAINS = [
  'Perception',
  'Planning & Control',
  'Requirements & Safety',
  'Validation & HIL',
  'Release & Operations'
];

export const ASIL_LEVELS = ['QM', 'A', 'B', 'C', 'D'];

export const PROGRAMS = ['Release 4.2 Program', 'Release 4.3 Program', 'STLA Medium L2+ Platform', 'STLA Large Highway Pilot'];

export const TEAMS = [
  'Sensor Fusion Platform Team',
  'Autonomous Driving Controls Squad',
  'Simulation & Emulation Engineering Group',
  'AI for AD Product Operations',
  'Functional Safety Office',
  'Release Operations & Program Management',
  'Engineering Tools & DevOps Squad'
];

export const APPROVERS = [
  { id: 'kmueller', name: 'Dr. Katrin Müller', role: 'Functional Safety Manager (ISO 26262)' },
  { id: 'cweber', name: 'Carl Weber', role: 'Product Owner — AI for AD' },
  { id: 'mrossi', name: 'Marco Rossi', role: 'Cybersecurity Officer (UNECE R155)' },
  { id: 'ebianchi', name: 'Elena Bianchi', role: 'ASPICE Quality Lead' }
];

export const RUNTIMES = [
  {
    id: 'SEL',
    label: 'SEL',
    tag: 'Recommended',
    description: 'Software Engineering Layer — build, test and API-driven AD agents with native SEL Nexus orchestration.',
    scope: 'Requirements · Software Factory · Validation',
    defaultBaseUrl: 'https://sel-nexus.com/api/automation-agents',
    idLabel: 'SEL Agent ID'
  },
  {
    id: 'BEDROCK',
    label: 'AWS Bedrock',
    tag: 'Supported',
    description: 'Managed foundation-model agents in the EU-Frankfurt sovereign region with Bedrock Guardrails.',
    scope: 'Perception analytics · Knowledge agents',
    defaultBaseUrl: 'https://bedrock-agent-runtime.eu-central-1.amazonaws.com',
    idLabel: 'Bedrock Agent ID'
  },
  {
    id: 'FOUNDRY',
    label: 'Azure AI Foundry',
    tag: 'Supported',
    description: 'Azure AI Foundry agent service with TCS tenant isolation and content safety filters.',
    scope: 'Documentation · Requirements copilots',
    defaultBaseUrl: 'https://tcs-ad.services.ai.azure.com/agents',
    idLabel: 'Foundry Agent ID'
  },
  {
    id: 'EXTERNAL',
    label: 'External',
    tag: 'Custom',
    description: 'Python services, Kubernetes workloads or any REST endpoint — onboard without a platform hook.',
    scope: 'Any',
    defaultBaseUrl: 'https://',
    idLabel: 'Service / Deployment ID'
  }
];

export const SKILL_LIBRARY = [
  { id: 'sk_fusion_arb', name: 'Sensor Fusion Arbitration', category: 'Perception', sourceAgent: 'Fusion Confidence Scorer Agent', reuse: 6 },
  { id: 'sk_kalman', name: 'Kalman Track Management', category: 'Perception', sourceAgent: 'Fusion Confidence Scorer Agent', reuse: 4 },
  { id: 'sk_hara', name: 'ISO 26262 Hazard Classification', category: 'Safety', sourceAgent: 'HARA Hazard Analysis Copilot', reuse: 3 },
  { id: 'sk_invest', name: 'Requirement INVEST Scoring', category: 'Requirements', sourceAgent: 'Requirements Engine (AI)', reuse: 9 },
  { id: 'sk_trace', name: 'Traceability Link Recovery', category: 'Requirements', sourceAgent: 'Requirements Engine (AI)', reuse: 7 },
  { id: 'sk_openscenario', name: 'OpenSCENARIO Authoring', category: 'Validation', sourceAgent: 'Trajectory Planner Edge-Case Sentinel', reuse: 5 },
  { id: 'sk_hil_gap', name: 'HIL Coverage Gap Analysis', category: 'Validation', sourceAgent: 'Synthetic Emulator Mitigation Agent', reuse: 4 },
  { id: 'sk_misra', name: 'MISRA C:2012 Static Analysis', category: 'Software Factory', sourceAgent: 'Static PR Quality Gate Bot', reuse: 11 },
  { id: 'sk_autosar', name: 'AUTOSAR Interface Mapping', category: 'Software Factory', sourceAgent: 'Legacy Diagnostic Bot', reuse: 2 },
  { id: 'sk_release', name: 'Release Readiness Scoring', category: 'Release', sourceAgent: 'Release Readiness Monitor', reuse: 5 },
  { id: 'sk_supplier', name: 'Supplier Risk Scoring', category: 'Release', sourceAgent: 'Vendor Risk Scoring Agent', reuse: 3 },
  { id: 'sk_can_anomaly', name: 'CAN Log Anomaly Detection', category: 'Perception', sourceAgent: 'Legacy Diagnostic Bot', reuse: 2 }
];

export const KNOWLEDGE_SOURCES = [
  { id: 'ks_polarion', name: 'Polarion Requirements (AD-1xx)', system: 'Polarion ALM', records: 18420, category: 'Requirements' },
  { id: 'ks_doors', name: 'System Requirements Baseline', system: 'IBM DOORS NG', records: 9310, category: 'Requirements' },
  { id: 'ks_arxml', name: 'AUTOSAR ARXML Repository', system: 'GitHub Enterprise', records: 2280, category: 'Architecture' },
  { id: 'ks_simulink', name: 'Simulink Model Library', system: 'MathWorks PLM', records: 640, category: 'Architecture' },
  { id: 'ks_scenarios', name: 'OpenSCENARIO Scenario Library', system: 'Scenario DB', records: 12750, category: 'Validation' },
  { id: 'ks_hil', name: 'HIL / SIL Test Results', system: 'dSPACE SCALEXIO', records: 48200, category: 'Validation' },
  { id: 'ks_safety', name: 'Safety Case (HARA · FMEA · FTA)', system: 'Medini Analyze', records: 1130, category: 'Safety' },
  { id: 'ks_misra', name: 'MISRA C:2012 & AUTOSAR C++14 Rules', system: 'Coding Standards Wiki', records: 420, category: 'Standards' },
  { id: 'ks_balocco', name: 'Balocco Proving Ground Telemetry', system: 'Fleet Data Lake', records: 892000, category: 'Telemetry' },
  { id: 'ks_ncap', name: 'Euro NCAP 2026 Protocols', system: 'Regulatory Library', records: 86, category: 'Standards' }
];

export const TOOLS = [
  { id: 'tl_sel', name: 'SEL Nexus', category: 'Orchestration' },
  { id: 'tl_github', name: 'GitHub Enterprise', category: 'Source Control' },
  { id: 'tl_jira', name: 'Jira', category: 'Backlog' },
  { id: 'tl_polarion', name: 'Polarion', category: 'Requirements' },
  { id: 'tl_jenkins', name: 'Jenkins', category: 'CI/CD' },
  { id: 'tl_sonar', name: 'SonarQube', category: 'Code Quality' },
  { id: 'tl_polyspace', name: 'Polyspace', category: 'Static Analysis' },
  { id: 'tl_coverity', name: 'Coverity', category: 'Static Analysis' },
  { id: 'tl_dspace', name: 'dSPACE SCALEXIO', category: 'HIL' },
  { id: 'tl_canoe', name: 'Vector CANoe', category: 'Vehicle Network' },
  { id: 'tl_mlflow', name: 'MLflow Registry', category: 'Model Ops' },
  { id: 'tl_confluence', name: 'Confluence', category: 'Documentation' }
];

export const WORKFLOWS = [
  { id: 'wf_req_test', name: 'Requirement → Test-Case Generation' },
  { id: 'wf_radar_triage', name: 'Radar Fusion Defect Triage' },
  { id: 'wf_release_42', name: 'Release 4.2 Readiness Check' },
  { id: 'wf_supplier', name: 'Supplier SDK Delay Mitigation' },
  { id: 'wf_asil_review', name: 'ASIL-D Exception Review' },
  { id: 'wf_hil_closure', name: 'HIL Coverage Closure' }
];

// ---------------------------------------------------------------------------
// Evaluation (F5)
// ---------------------------------------------------------------------------
export const DEFAULT_PASS_THRESHOLD = 85;

export const EVAL_DIMENSIONS = [
  { key: 'reqAccuracy', label: 'Requirement Accuracy', short: 'Accuracy', description: 'Share of generated artefacts that match the linked requirement intent.' },
  { key: 'groundedness', label: 'Groundedness', short: 'Grounded', description: 'Claims backed by bound knowledge sources (Polarion, ARXML, HIL results).' },
  { key: 'hallucination', label: 'Hallucination Resistance', short: 'Halluc.', description: '100 minus the rate of unsupported or invented statements.' },
  { key: 'safety', label: 'Safety Compliance', short: 'Safety', description: 'ISO 26262 / SOTIF rule conformance of outputs.' },
  { key: 'scenarioCoverage', label: 'Scenario Coverage', short: 'Coverage', description: 'OpenSCENARIO and Euro NCAP edge cases exercised.' },
  { key: 'traceability', label: 'Traceability', short: 'Trace', description: 'ASPICE bidirectional links from requirement to test.' },
  { key: 'cost', label: 'Cost Efficiency', short: 'Cost', description: 'Token and compute cost versus budget per task.' },
  { key: 'latency', label: 'Latency', short: 'Latency', description: 'Response time against the real-time budget for the sub-domain.' }
];

/**
 * Rules: `dimension: 'overall'` uses the overall score and the live threshold.
 * `asil` limits the rule to those ASIL levels; `subDomain` limits by sub-domain.
 */
export const EVAL_RULES = [
  { id: 'r_threshold', name: 'Platform Pass Threshold', dimension: 'overall', min: null, blocking: true, enabled: true, description: 'Overall score must meet the pass threshold.' },
  { id: 'r_grounded', name: 'Groundedness Minimum', dimension: 'groundedness', min: 85, blocking: true, enabled: true, description: 'Outputs must be grounded in bound knowledge sources.' },
  { id: 'r_halluc', name: 'Hallucination Cap', dimension: 'hallucination', min: 90, blocking: true, enabled: true, description: 'Hallucination resistance ≥ 90 for any production agent.' },
  { id: 'r_safety_cd', name: 'ASIL C/D Safety Gate', dimension: 'safety', min: 92, asil: ['C', 'D'], blocking: true, enabled: true, description: 'Safety compliance ≥ 92 for ASIL C and D agents.' },
  { id: 'r_trace', name: 'ASPICE Traceability Gate', dimension: 'traceability', min: 88, asil: ['A', 'B', 'C', 'D'], blocking: true, enabled: true, description: 'Bidirectional traceability ≥ 88 for all safety-relevant agents.' },
  { id: 'r_latency', name: 'Perception Real-Time Budget', dimension: 'latency', min: 85, subDomain: ['Perception'], blocking: true, enabled: true, description: 'Perception agents must stay inside the 15 ms inference budget.' },
  { id: 'r_cost', name: 'Cost Efficiency Advisory', dimension: 'cost', min: 75, blocking: false, enabled: true, description: 'Advisory: flags agents for FinOps review below 75.' }
];

const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

// Typical offset of each dimension from an agent's overall quality profile
const DIMENSION_BIAS = { reqAccuracy: 1, groundedness: 1, hallucination: 5, safety: 3, scenarioCoverage: 0, traceability: 1, cost: -2, latency: 0 };

/** Deterministic pseudo-random evaluation for an agent's Nth run (mock). */
export function computeEvaluation(agent, runIndex = 0) {
  const base = agent.evalProfile || 88;
  const dims = {};
  EVAL_DIMENSIONS.forEach((d) => {
    const jitter = (hash(`${agent.id}:${d.key}:${runIndex}`) % 11) - 4; // -4..+6
    dims[d.key] = Math.max(55, Math.min(99, base + jitter + DIMENSION_BIAS[d.key] + Math.min(runIndex, 3)));
  });
  const score = Math.round(EVAL_DIMENSIONS.reduce((sum, d) => sum + dims[d.key], 0) / EVAL_DIMENSIONS.length);
  return { score, dims };
}

/** Returns rule outcomes for an agent evaluation. */
export function applyRules(agent, evaluation, rules, threshold) {
  if (!evaluation) return [];
  return rules
    .filter((r) => r.enabled)
    .filter((r) => !r.asil || r.asil.includes(agent.asil))
    .filter((r) => !r.subDomain || r.subDomain.includes(agent.subDomain))
    .map((r) => {
      const min = r.dimension === 'overall' ? threshold : r.min;
      const actual = r.dimension === 'overall' ? evaluation.score : evaluation.dims[r.dimension];
      return { rule: r, min, actual, pass: actual >= min };
    });
}

export function isEvaluationPassing(agent, evaluation, rules, threshold) {
  return applyRules(agent, evaluation, rules, threshold).every((o) => o.pass || !o.rule.blocking);
}

// ---------------------------------------------------------------------------
// Governance (F4)
// ---------------------------------------------------------------------------
export const GOVERNANCE_POLICIES = [
  { id: 'p_rai', name: 'Responsible AI', standard: 'TCS AI Charter', mandatory: true, description: 'Purpose, owner and human-oversight path documented.' },
  { id: 'p_fusa', name: 'Functional Safety', standard: 'ISO 26262-8 §11', mandatory: true, description: 'Tool confidence level (TCL) assessed; safety score meets ASIL gate.' },
  { id: 'p_sotif', name: 'SOTIF', standard: 'ISO 21448', mandatory: true, description: 'Triggering-condition scenarios covered for perception and planning agents.' },
  { id: 'p_cyber', name: 'Cybersecurity', standard: 'ISO/SAE 21434 · UNECE R155', mandatory: true, description: 'Verified runtime, least-privilege tools, threat analysis on file.' },
  { id: 'p_sums', name: 'Software Update', standard: 'UNECE R156', mandatory: false, description: 'Semantic version and rollback plan for OTA-relevant outputs.' },
  { id: 'p_aspice', name: 'ASPICE Traceability', standard: 'ASPICE 3.1 SWE.1–SWE.6', mandatory: true, description: 'Traceability dimension meets the gate.' },
  { id: 'p_gdpr', name: 'Data Protection', standard: 'GDPR · Fleet Data Policy', mandatory: true, description: 'Knowledge sources limited to anonymised or engineering data.' },
  { id: 'p_human', name: 'Human Approval', standard: 'AI Safety Board', mandatory: true, description: 'Named approver assigned for gated decisions.' },
  { id: 'p_version', name: 'Version Control', standard: 'SemVer', mandatory: true, description: 'Semantic version recorded for the agent artefact.' },
  { id: 'p_audit', name: 'Audit Trail', standard: 'ISO 26262-2 §6', mandatory: true, description: 'Lifecycle transitions recorded with actor and timestamp.' }
];

/** Evidence-based policy checks for one agent. Returns { [policyId]: { pass, evidence } }. */
export function evaluatePolicies(agent, audit = []) {
  const ev = agent.evaluation;
  const safetyMin = ['C', 'D'].includes(agent.asil) ? 92 : 85;
  const needsSotif = ['Perception', 'Planning & Control'].includes(agent.subDomain);
  const hasFleetTelemetry = agent.knowledge.includes('ks_balocco');
  const auditCount = audit.filter((a) => a.agentId === agent.id).length;
  return {
    p_rai: { pass: Boolean(agent.purpose && agent.owner && agent.approver), evidence: agent.purpose ? `Owner ${agent.owner || '—'} · approver ${agent.approver ? 'assigned' : 'missing'}` : 'Purpose missing' },
    p_fusa: { pass: Boolean(ev) && ev.dims.safety >= safetyMin, evidence: ev ? `Safety ${ev.dims.safety} (gate ${safetyMin} for ASIL ${agent.asil})` : 'Not evaluated' },
    p_sotif: { pass: !needsSotif || (Boolean(ev) && ev.dims.scenarioCoverage >= 85), evidence: needsSotif ? (ev ? `Scenario coverage ${ev.dims.scenarioCoverage}` : 'Not evaluated') : 'Not applicable to sub-domain' },
    p_cyber: { pass: agent.runtime.status === 'connected' && agent.tools.length <= 6, evidence: `Runtime ${agent.runtime.status} · ${agent.tools.length} tool grants` },
    p_sums: { pass: /^\d+\.\d+\.\d+$/.test(agent.version || ''), evidence: `Version ${agent.version || 'missing'}` },
    p_aspice: { pass: Boolean(ev) && ev.dims.traceability >= 88, evidence: ev ? `Traceability ${ev.dims.traceability}` : 'Not evaluated' },
    p_gdpr: { pass: !hasFleetTelemetry || agent.asil !== 'QM', evidence: hasFleetTelemetry ? 'Fleet telemetry bound — anonymisation attested' : 'No personal data sources bound' },
    p_human: { pass: Boolean(agent.approver), evidence: agent.approver ? `Approver: ${agent.approver}` : 'No approver assigned' },
    p_version: { pass: /^\d+\.\d+\.\d+$/.test(agent.version || ''), evidence: `SemVer ${agent.version || '—'}` },
    p_audit: { pass: auditCount > 0 || agent.stage >= 2, evidence: `${auditCount} audit entries recorded` }
  };
}

// ---------------------------------------------------------------------------
// Lifecycle exit criteria (F2) — what blocks the next stage
// ---------------------------------------------------------------------------
export function getStageBlockers(agent, { rules = EVAL_RULES, threshold = DEFAULT_PASS_THRESHOLD, audit = [] } = {}) {
  const b = [];
  switch (agent.stage) {
    case 1:
      if (agent.runtime.status !== 'connected') b.push('Verify the runtime connection');
      break;
    case 2:
      if (agent.skills.length < 1) b.push('Attach at least 1 certified skill');
      if (agent.knowledge.length < 1) b.push('Bind at least 1 knowledge source');
      break;
    case 3:
      if (agent.tools.length < 1) b.push('Connect at least 1 engineering tool');
      break;
    case 4:
      if (agent.workflows.length < 1) b.push('Map the agent to at least 1 workflow');
      break;
    case 5:
      if (!agent.evaluation) b.push('Run an evaluation in the Evaluation Center');
      else if (!isEvaluationPassing(agent, agent.evaluation, rules, threshold)) b.push('Evaluation below threshold or blocking rule violated');
      break;
    case 6: {
      const checks = evaluatePolicies(agent, audit);
      const failing = GOVERNANCE_POLICIES.filter((p) => p.mandatory && !checks[p.id].pass);
      if (failing.length) b.push(`${failing.length} mandatory guardrail(s) failing`);
      if (agent.governance.status !== 'approved') b.push('Approval decision pending in Governance Center');
      break;
    }
    case 7:
      if (!agent.certificateId) b.push('Issue the certificate in Governance Center');
      break;
    case 8:
      b.push('Publish the certified agent to AD runtime');
      break;
    default:
      break;
  }
  return b;
}

// Stage identity checks for Registration (stage 0 → 1)
export const REQUIRED_REGISTRATION_FIELDS = ['name', 'program', 'team', 'owner', 'purpose', 'asil', 'subDomain'];

// ---------------------------------------------------------------------------
// Harness (F3)
// ---------------------------------------------------------------------------
export const HARNESS_STEPS = [
  { key: 'context', label: 'Context Assembly', baseMs: 520, description: 'Collect program context from bound knowledge sources (Polarion, ARXML, HIL results).', success: 'Knowledge sources collected' },
  { key: 'prompt', label: 'Prompt Assembly', baseMs: 280, description: 'Assemble the execution prompt from purpose, certified skills and ASIL constraints.', success: 'Prompt assembled with certified skills' },
  { key: 'memory', label: 'Memory Retrieval', baseMs: 410, description: 'Retrieve prior decisions, similar defects and past harness runs.', success: 'Memory chunks retrieved' },
  { key: 'tools', label: 'Tool Routing', baseMs: 640, description: 'Route calls to connected tools (SEL Nexus, Jira, Polarion, dSPACE).', success: 'Tools invoked successfully' },
  { key: 'workflow', label: 'Workflow Routing', baseMs: 180, description: 'Place the agent inside its mapped agentic workflow graph.', success: 'Agent positioned in workflow' },
  { key: 'collab', label: 'Agent Collaboration', baseMs: 250, description: 'Coordinate hand-offs with peer agents and reused skills.', success: 'Peer hand-offs completed' },
  { key: 'eval', label: 'Evaluation Gate', baseMs: 320, description: 'Score output against evaluation dimensions and the pass threshold.', success: 'Quality gate: PASS' },
  { key: 'policy', label: 'Policy Enforcement', baseMs: 160, description: 'Enforce ISO 26262, MISRA, R155 cybersecurity and data policies.', success: 'All policies enforced' },
  { key: 'observe', label: 'Observability', baseMs: 90, description: 'Emit traces, telemetry and audit records to the AD observability bus.', success: 'Telemetry exported' },
  { key: 'human', label: 'Human Approval', baseMs: 100, description: 'Route to a named approver when ASIL or policy requires it.', success: 'Approved by approver' }
];

export const HARNESS_TASK_SUGGESTIONS = [
  'Generate edge-case scenarios for AD-108 Radar-Vision Fusion timeout',
  'Draft acceptance criteria for AD-115 Lane Keep Enhancement',
  'Triage HIL failures from Test Bench #4 nightly run',
  'Assess LiDAR SDK v3.2 delay impact on Sprint 43 epics',
  'Recover missing traceability links for Release 4.2 SW requirements'
];

// ---------------------------------------------------------------------------
// Seed agents (ids of catalogue agents are reused via `catalogueId`)
// ---------------------------------------------------------------------------
const now = Date.parse('2026-09-29T09:00:00Z');
const daysAgo = (d, h = 0) => new Date(now - d * 86400000 - h * 3600000).toISOString();

const baseEval = (score, dims) => ({ score, dims, lastRun: daysAgo(2), runs: 3 });

export const SEED_AGENTS = [
  {
    id: 'scorer', catalogueId: 'scorer', name: 'Fusion Confidence Scorer Agent', family: 'Perception QA',
    program: 'Release 4.2 Program', team: 'Sensor Fusion Platform Team', owner: 'Lukas Schneider', version: '2.4.1',
    purpose: 'Scores fused radar + camera detections for statistical confidence before trajectory planning ingests them.',
    subDomain: 'Perception', asil: 'C', stage: 9, operationalState: 'Active', evalProfile: 93,
    runtime: { type: 'SEL', baseUrl: 'https://sel-nexus.com/api/automation-agents', agentId: 'sel-ad-scorer-07', healthUrl: '/health', status: 'connected', latencyMs: 42 },
    skills: ['sk_fusion_arb', 'sk_kalman'], knowledge: ['ks_hil', 'ks_balocco', 'ks_scenarios'], tools: ['tl_sel', 'tl_mlflow', 'tl_dspace'], workflows: ['wf_radar_triage'],
    approver: 'Dr. Katrin Müller', governance: { status: 'approved', decidedBy: 'Dr. Katrin Müller', decidedAt: daysAgo(40), comment: 'TCL2 confirmed; Balocco rain campaign attached.' },
    certificateId: 'AD-CERT-2026-0142', evaluation: baseEval(93, { reqAccuracy: 94, groundedness: 93, hallucination: 96, safety: 94, scenarioCoverage: 91, traceability: 92, cost: 88, latency: 93 }),
    reuseCount: 9, createdAt: daysAgo(120), updatedAt: daysAgo(2)
  },
  {
    id: 'req_engine', catalogueId: 'req_engine', name: 'Requirements Engine (AI)', family: 'Requirements Copilot',
    program: 'Release 4.2 Program', team: 'AI for AD Product Operations', owner: 'Carl Weber', version: '3.1.0',
    purpose: 'Drafts, scores and links system requirements in Polarion using INVEST and ASPICE SWE.1 rules.',
    subDomain: 'Requirements & Safety', asil: 'QM', stage: 9, operationalState: 'Active', evalProfile: 91,
    runtime: { type: 'SEL', baseUrl: 'https://sel-nexus.com/api/automation-agents', agentId: 'sel-ad-req-02', healthUrl: '/health', status: 'connected', latencyMs: 58 },
    skills: ['sk_invest', 'sk_trace'], knowledge: ['ks_polarion', 'ks_doors', 'ks_ncap'], tools: ['tl_sel', 'tl_polarion', 'tl_jira', 'tl_confluence'], workflows: ['wf_req_test', 'wf_release_42'],
    approver: 'Carl Weber', governance: { status: 'approved', decidedBy: 'Carl Weber', decidedAt: daysAgo(60), comment: 'Approved for QM scope only.' },
    certificateId: 'AD-CERT-2026-0097', evaluation: baseEval(91, { reqAccuracy: 93, groundedness: 92, hallucination: 94, safety: 90, scenarioCoverage: 86, traceability: 95, cost: 90, latency: 88 }),
    reuseCount: 14, createdAt: daysAgo(160), updatedAt: daysAgo(3)
  },
  {
    id: 'emulator', catalogueId: 'emulator', name: 'Synthetic Emulator Mitigation Agent', family: 'Simulation',
    program: 'Release 4.2 Program', team: 'Simulation & Emulation Engineering Group', owner: 'Giulia Conti', version: '0.9.3',
    purpose: 'Streams synthetic LiDAR frames to unblock perception epics while the supplier SDK v3.2 is delayed.',
    subDomain: 'Validation & HIL', asil: 'B', stage: 6, operationalState: 'Experimental', evalProfile: 89,
    runtime: { type: 'SEL', baseUrl: 'https://sel-nexus.com/api/automation-agents', agentId: 'sel-ad-emu-11', healthUrl: '/health', status: 'connected', latencyMs: 71 },
    skills: ['sk_hil_gap', 'sk_openscenario'], knowledge: ['ks_hil', 'ks_scenarios'], tools: ['tl_sel', 'tl_dspace', 'tl_jenkins'], workflows: ['wf_supplier', 'wf_hil_closure'],
    approver: 'Dr. Katrin Müller', governance: { status: 'pending', decidedBy: null, decidedAt: null, comment: '' },
    certificateId: null, evaluation: baseEval(89, { reqAccuracy: 90, groundedness: 89, hallucination: 92, safety: 88, scenarioCoverage: 91, traceability: 89, cost: 84, latency: 86 }),
    reuseCount: 4, createdAt: daysAgo(21), updatedAt: daysAgo(1)
  },
  {
    id: 'trajectory_sentinel', catalogueId: 'trajectory_sentinel', name: 'Trajectory Planner Edge-Case Sentinel', family: 'Planning QA',
    program: 'Release 4.2 Program', team: 'Autonomous Driving Controls Squad', owner: 'Matteo Ferri', version: '0.6.0',
    purpose: 'Hunts rare trajectory-planner failures by generating adversarial OpenSCENARIO variants.',
    subDomain: 'Planning & Control', asil: 'D', stage: 5, operationalState: 'Experimental', evalProfile: 90,
    runtime: { type: 'BEDROCK', baseUrl: 'https://bedrock-agent-runtime.eu-central-1.amazonaws.com', agentId: 'bdr-traj-sentinel', healthUrl: '/health', status: 'connected', latencyMs: 96 },
    skills: ['sk_openscenario'], knowledge: ['ks_scenarios', 'ks_safety', 'ks_ncap'], tools: ['tl_sel', 'tl_dspace'], workflows: ['wf_asil_review'],
    approver: 'Dr. Katrin Müller', governance: { status: 'not_submitted', decidedBy: null, decidedAt: null, comment: '' },
    certificateId: null, evaluation: null, reuseCount: 5, createdAt: daysAgo(14), updatedAt: daysAgo(1)
  },
  {
    id: 'hara_copilot', catalogueId: null, name: 'HARA Hazard Analysis Copilot', family: 'Safety Copilot',
    program: 'STLA Medium L2+ Platform', team: 'Functional Safety Office', owner: 'Dr. Katrin Müller', version: '1.0.0',
    purpose: 'Proposes hazardous events, ASIL ratings and safety goals from item definitions for review by FuSa engineers.',
    subDomain: 'Requirements & Safety', asil: 'D', stage: 6, operationalState: 'Onboarding', evalProfile: 94,
    runtime: { type: 'FOUNDRY', baseUrl: 'https://tcs-ad.services.ai.azure.com/agents', agentId: 'fdy-hara-01', healthUrl: '/health', status: 'connected', latencyMs: 83 },
    skills: ['sk_hara', 'sk_trace'], knowledge: ['ks_safety', 'ks_doors', 'ks_polarion'], tools: ['tl_polarion', 'tl_confluence'], workflows: ['wf_asil_review'],
    approver: 'Marco Rossi', governance: { status: 'pending', decidedBy: null, decidedAt: null, comment: '' },
    certificateId: null, evaluation: baseEval(94, { reqAccuracy: 95, groundedness: 94, hallucination: 96, safety: 95, scenarioCoverage: 90, traceability: 94, cost: 89, latency: 91 }),
    reuseCount: 3, createdAt: daysAgo(9), updatedAt: daysAgo(0, 5)
  },
  {
    id: 'scenario_gen', catalogueId: null, name: 'OpenSCENARIO Edge-Case Generator', family: 'Scenario Synthesis',
    program: 'Release 4.3 Program', team: 'Simulation & Emulation Engineering Group', owner: 'Anna Keller', version: '0.3.2',
    purpose: 'Generates Euro NCAP 2026 and cut-in edge-case scenarios for SIL regression.',
    subDomain: 'Validation & HIL', asil: 'C', stage: 3, operationalState: 'Onboarding', evalProfile: 82,
    runtime: { type: 'EXTERNAL', baseUrl: 'https://scenario-gen.ad-k8s.tcs.internal', agentId: 'deploy/scenario-gen', healthUrl: '/healthz', status: 'connected', latencyMs: 124 },
    skills: ['sk_openscenario'], knowledge: ['ks_scenarios', 'ks_ncap'], tools: ['tl_jenkins'], workflows: [],
    approver: '', governance: { status: 'not_submitted', decidedBy: null, decidedAt: null, comment: '' },
    certificateId: null, evaluation: { score: 81, dims: { reqAccuracy: 84, groundedness: 80, hallucination: 86, safety: 83, scenarioCoverage: 88, traceability: 76, cost: 79, latency: 72 }, lastRun: daysAgo(1), runs: 1, failed: true },
    reuseCount: 0, createdAt: daysAgo(6), updatedAt: daysAgo(1)
  },
  {
    id: 'lidar_sync', catalogueId: null, name: 'LiDAR-Vision Synchronizer Agent', family: 'Perception Ops',
    program: 'Release 4.3 Program', team: 'Sensor Fusion Platform Team', owner: 'Jonas Weber', version: '0.1.0',
    purpose: 'Detects timestamp drift between LiDAR and camera streams and proposes calibration corrections.',
    subDomain: 'Perception', asil: 'B', stage: 1, operationalState: 'Onboarding', evalProfile: 87,
    runtime: { type: 'SEL', baseUrl: 'https://sel-nexus.com/api/automation-agents', agentId: '', healthUrl: '/health', status: 'unverified', latencyMs: null },
    skills: [], knowledge: [], tools: [], workflows: [],
    approver: '', governance: { status: 'not_submitted', decidedBy: null, decidedAt: null, comment: '' },
    certificateId: null, evaluation: null, reuseCount: 0, createdAt: daysAgo(1), updatedAt: daysAgo(1)
  },
  {
    id: 'release_mon', catalogueId: 'release_mon', name: 'Release Readiness Monitor', family: 'Release Ops',
    program: 'Release 4.2 Program', team: 'Release Operations & Program Management', owner: 'Sofia Marino', version: '1.8.2',
    purpose: 'Aggregates HIL coverage, open defects and compliance items into a release readiness score.',
    subDomain: 'Release & Operations', asil: 'B', stage: 9, operationalState: 'Suspended', evalProfile: 86,
    runtime: { type: 'SEL', baseUrl: 'https://sel-nexus.com/api/automation-agents', agentId: 'sel-ad-rel-04', healthUrl: '/health', status: 'connected', latencyMs: 64 },
    skills: ['sk_release'], knowledge: ['ks_hil', 'ks_polarion'], tools: ['tl_sel', 'tl_jira', 'tl_jenkins'], workflows: ['wf_release_42'],
    approver: 'Carl Weber', governance: { status: 'approved', decidedBy: 'Carl Weber', decidedAt: daysAgo(90), comment: 'Suspended after data-feed drift; re-evaluation required.' },
    certificateId: 'AD-CERT-2026-0063', evaluation: baseEval(86, { reqAccuracy: 87, groundedness: 85, hallucination: 91, safety: 88, scenarioCoverage: 82, traceability: 89, cost: 86, latency: 84 }),
    reuseCount: 5, createdAt: daysAgo(200), updatedAt: daysAgo(12)
  },
  {
    id: 'vendor_risk', catalogueId: 'vendor_risk', name: 'Vendor Risk Scoring Agent', family: 'Supplier Intelligence',
    program: 'Release 4.2 Program', team: 'AI for AD Product Operations', owner: 'Paolo Greco', version: '1.2.0',
    purpose: 'Scores supplier delivery risk from contract milestones, SDK release notes and quality escapes.',
    subDomain: 'Release & Operations', asil: 'QM', stage: 9, operationalState: 'Suspended', evalProfile: 85,
    runtime: { type: 'FOUNDRY', baseUrl: 'https://tcs-ad.services.ai.azure.com/agents', agentId: 'fdy-vendor-03', healthUrl: '/health', status: 'connected', latencyMs: 77 },
    skills: ['sk_supplier'], knowledge: ['ks_polarion'], tools: ['tl_jira', 'tl_confluence'], workflows: ['wf_supplier'],
    approver: 'Carl Weber', governance: { status: 'approved', decidedBy: 'Carl Weber', decidedAt: daysAgo(150), comment: '' },
    certificateId: 'AD-CERT-2026-0041', evaluation: baseEval(85, { reqAccuracy: 86, groundedness: 85, hallucination: 90, safety: 86, scenarioCoverage: 80, traceability: 86, cost: 88, latency: 85 }),
    reuseCount: 3, createdAt: daysAgo(240), updatedAt: daysAgo(30)
  }
];

// ---------------------------------------------------------------------------
// Seed harness runs & audit trail
// ---------------------------------------------------------------------------
const seedSteps = (overrides = {}) => HARNESS_STEPS.map((s) => ({
  key: s.key,
  status: overrides[s.key]?.status || 'passed',
  ms: overrides[s.key]?.ms || s.baseMs,
  detail: overrides[s.key]?.detail || s.success
}));

export const SEED_HARNESS_RUNS = [
  {
    id: 'run-71031', agentId: 'scorer', task: 'Re-score Balocco rain campaign detections (Sensor Rig 3)', status: 'completed',
    startedAt: daysAgo(0, 3), durationMs: 2950, confidence: 91, reuse: 100, coverage: 83, approver: 'Dr. Katrin Müller',
    steps: seedSteps({ human: { detail: 'Approved by Dr. Katrin Müller' } }),
    log: [
      { t: daysAgo(0, 3), level: 'INFO', msg: 'Harness run initialised for Fusion Confidence Scorer Agent' },
      { t: daysAgo(0, 3), level: 'INFO', msg: 'Context: 3 knowledge sources, 1,240 frames in scope' },
      { t: daysAgo(0, 3), level: 'INFO', msg: 'Quality gate PASS (93/100)' },
      { t: daysAgo(0, 3), level: 'INFO', msg: 'Harness execution completed successfully' }
    ]
  },
  {
    id: 'run-71029', agentId: 'emulator', task: 'Stream synthetic LiDAR frames for Sprint 43 perception epics', status: 'awaiting_approval',
    startedAt: daysAgo(0, 6), durationMs: 2860, confidence: 86, reuse: 80, coverage: 67, approver: 'Dr. Katrin Müller',
    steps: seedSteps({ human: { status: 'waiting', detail: 'Awaiting Dr. Katrin Müller (ASIL B, synthetic data)' } }),
    log: [
      { t: daysAgo(0, 6), level: 'INFO', msg: 'Harness run initialised for Synthetic Emulator Mitigation Agent' },
      { t: daysAgo(0, 6), level: 'WARN', msg: 'Synthetic data fidelity 91.4 % — below 95 % advisory level' },
      { t: daysAgo(0, 6), level: 'INFO', msg: 'Routed to human approval (policy: synthetic data in safety scope)' }
    ]
  },
  {
    id: 'run-71022', agentId: 'scenario_gen', task: 'Generate Euro NCAP 2026 cut-in scenarios for SIL regression', status: 'failed',
    startedAt: daysAgo(1, 2), durationMs: 1840, confidence: 72, reuse: 40, coverage: 50, approver: '',
    steps: seedSteps({
      eval: { status: 'failed', detail: 'Quality gate: FAIL (81/100, traceability 76)' },
      policy: { status: 'skipped', detail: 'Skipped after failed gate' },
      observe: { status: 'passed', detail: 'Failure telemetry exported' },
      human: { status: 'skipped', detail: 'Not reached' }
    }),
    log: [
      { t: daysAgo(1, 2), level: 'INFO', msg: 'Harness run initialised for OpenSCENARIO Edge-Case Generator' },
      { t: daysAgo(1, 2), level: 'ERROR', msg: 'Rule "ASPICE Traceability Gate" violated: 76 < 88' },
      { t: daysAgo(1, 2), level: 'ERROR', msg: 'Harness stopped at Evaluation Gate' }
    ]
  },
  {
    id: 'run-71017', agentId: 'req_engine', task: 'Draft acceptance criteria for AD-115 Lane Keep Enhancement', status: 'completed',
    startedAt: daysAgo(1, 7), durationMs: 2710, confidence: 94, reuse: 100, coverage: 100, approver: 'Carl Weber',
    steps: seedSteps({ human: { detail: 'Approved by Carl Weber' } }),
    log: [
      { t: daysAgo(1, 7), level: 'INFO', msg: 'Harness run initialised for Requirements Engine (AI)' },
      { t: daysAgo(1, 7), level: 'INFO', msg: 'INVEST score 91/100 on 6 drafted criteria' },
      { t: daysAgo(1, 7), level: 'INFO', msg: 'Harness execution completed successfully' }
    ]
  }
];

export const SEED_AUDIT = [
  { id: 'au-9', ts: daysAgo(0, 5), actor: 'System', action: 'Governance submitted', agentId: 'hara_copilot', detail: 'Evaluation passed (94/100); routed to Marco Rossi', type: 'governance' },
  { id: 'au-8', ts: daysAgo(0, 6), actor: 'AI Harness', action: 'Approval requested', agentId: 'emulator', detail: 'Run run-71029 awaiting human approval', type: 'harness' },
  { id: 'au-7', ts: daysAgo(1, 1), actor: 'Evaluation Center', action: 'Evaluation failed', agentId: 'scenario_gen', detail: 'Score 81 · ASPICE Traceability Gate violated · moved back to Skills & Knowledge', type: 'evaluation' },
  { id: 'au-6', ts: daysAgo(1, 3), actor: 'Jonas Weber', action: 'Agent registered', agentId: 'lidar_sync', detail: 'Registered on SEL for Release 4.3 Program (ASIL B)', type: 'lifecycle' },
  { id: 'au-5', ts: daysAgo(1, 9), actor: 'Giulia Conti', action: 'Stage advanced', agentId: 'emulator', detail: 'Workflow Mapped → Evaluated', type: 'lifecycle' },
  { id: 'au-4', ts: daysAgo(2), actor: 'Evaluation Center', action: 'Evaluation passed', agentId: 'scorer', detail: 'Score 93/100 · all 7 rules satisfied', type: 'evaluation' },
  { id: 'au-3', ts: daysAgo(12), actor: 'Carl Weber', action: 'Agent suspended', agentId: 'release_mon', detail: 'Data-feed drift detected; re-evaluation required', type: 'governance' },
  { id: 'au-2', ts: daysAgo(40), actor: 'Dr. Katrin Müller', action: 'Approval granted', agentId: 'scorer', detail: 'TCL2 confirmed; certificate AD-CERT-2026-0142 issued', type: 'governance' },
  { id: 'au-1', ts: daysAgo(60), actor: 'Carl Weber', action: 'Approval granted', agentId: 'req_engine', detail: 'Approved for QM scope only', type: 'governance' }
];

/** Empty draft used by the Onboarding Studio registration form. */
export const EMPTY_AGENT_DRAFT = {
  name: '', family: '', program: 'Release 4.2 Program', team: '', owner: '', version: '1.0.0', purpose: '',
  subDomain: 'Perception', asil: 'B',
  runtime: { type: 'SEL', baseUrl: 'https://sel-nexus.com/api/automation-agents', agentId: '', healthUrl: '/health', status: 'unverified', latencyMs: null },
  skills: [], knowledge: [], tools: [], workflows: [], approver: ''
};

export const formatDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};
