/**
 * AI for AD multi-agent workflows. Nodes are stored in the shape React Flow
 * renders directly ({ id, type, position, data }). Runs are precomputed step
 * scripts; playback only animates them.
 */
import { APPROVERS, GOVERNANCE_POLICIES, evaluatePolicies } from '../agentStudioData';
import { approvalForced, harnessReadiness } from '../components/harness/harnessUtils';

export const WORKFLOW_NODE_TYPE = Object.freeze({
  START: 'start',
  END: 'end',
  AGENT: 'agent',
  APPROVAL: 'approval',
  POLICY: 'policy',
  FORK: 'fork',
  JOIN: 'join'
});

export const WORKFLOW_NODE_DEFINITIONS = Object.freeze({
  start: { label: 'Start', description: 'Where the work item enters the flow.', hasInput: false, hasOutput: true },
  end: { label: 'End', description: 'The flow is complete.', hasInput: true, hasOutput: false },
  agent: { label: 'Agent', description: 'An onboarded AD agent does its part.', hasInput: true, hasOutput: true },
  approval: { label: 'Human approval', description: 'Pauses until the named approver signs off.', hasInput: true, hasOutput: true },
  policy: { label: 'Policy gate', description: 'Stops the flow if an agent breaks a governance guardrail.', hasInput: true, hasOutput: true },
  fork: { label: 'Parallel fork', description: 'Runs the following branches in parallel.', hasInput: true, hasOutput: true },
  join: { label: 'Join', description: 'Waits for parallel branches to finish.', hasInput: true, hasOutput: true }
});

export const WORKFLOW_FILE_SCHEMA = 'ad-workflow/v1';
export const ON_FAILURE = Object.freeze({ STOP: 'stop', CONTINUE: 'continue' });
export const WORKFLOW_POLICIES = GOVERNANCE_POLICIES;

const AGENT_STEP_PASS_SCORE = 75;
const MAX_PATHS = 200;

/** Work items a workflow can be run on — ids match the Knowledge Fabric trace. */
export const AD_WORK_ITEMS = [
  { id: 'REQ-AD-142', title: 'Highway pilot truck cut-in response', asil: 'ASIL D', release: 'Release 4.2' },
  { id: 'REQ-AD-187', title: 'Occluded pedestrian AEB (Euro NCAP 2026)', asil: 'ASIL C', release: 'Release 4.2' },
  { id: 'AD-108', title: 'Radar-vision fusion timeout in heavy rain', asil: 'ASIL C', release: 'Release 4.2' },
  { id: 'AD-115', title: 'Lane keep enhancement acceptance criteria', asil: 'ASIL B', release: 'Release 4.3' },
  { id: 'HIL-TB4-NIGHTLY', title: 'Test Bench #4 nightly HIL failures', asil: 'QM', release: 'Release 4.2' }
];

export const RUN_STATUS = Object.freeze({
  PASSED: 'passed',
  FAILED: 'failed',
  AWAITING_APPROVAL: 'awaiting-approval',
  REJECTED: 'rejected'
});

export const STEP_OUTCOME = Object.freeze({
  PASSED: 'passed', WARNING: 'warning', FAILED: 'failed', APPROVAL: 'approval', SKIPPED: 'skipped'
});

export const STEP_STATUS = Object.freeze({
  PENDING: 'pending', RUNNING: 'running', PASSED: 'passed', WARNING: 'warning',
  FAILED: 'failed', WAITING: 'waiting', REJECTED: 'rejected', SKIPPED: 'skipped'
});

function defaultNodeData(type) {
  switch (type) {
    case WORKFLOW_NODE_TYPE.AGENT: return { agentId: null, onFailure: ON_FAILURE.STOP };
    case WORKFLOW_NODE_TYPE.APPROVAL: return { approver: APPROVERS[0].name };
    case WORKFLOW_NODE_TYPE.POLICY: return { policyId: 'p_fusa' };
    default: return {};
  }
}

export function createWorkflowNode(type, position, id, data = {}) {
  return { id, type, position, data: { ...defaultNodeData(type), ...data } };
}

export function createEmptyWorkflow(name) {
  return {
    id: null,
    name,
    description: '',
    source: 'Custom',
    nodes: [
      createWorkflowNode('start', { x: 40, y: 160 }, 'start'),
      createWorkflowNode('end', { x: 720, y: 160 }, 'end')
    ],
    edges: []
  };
}

/** Start → agent → (approval if ASIL C/D) → End, ready to extend in the playground. */
export function createWorkflowForAgent(agent) {
  const base = createEmptyWorkflow(`${agent.name} flow`);
  const gated = approvalForced(agent);
  const agentNode = createWorkflowNode('agent', { x: 260, y: 150 }, 'agent-1', { agentId: agent.id });
  const approvalNode = gated ? createWorkflowNode('approval', { x: 500, y: 150 }, 'approval-1', { approver: agent.approver || APPROVERS[0].name }) : null;
  const end = { ...base.nodes[1], position: { x: gated ? 740 : 520, y: 160 } };
  const ids = ['start', 'agent-1', ...(gated ? ['approval-1'] : []), 'end'];
  return {
    ...base,
    description: `Built from the Agent Studio around ${agent.name}.`,
    nodes: [base.nodes[0], agentNode, ...(approvalNode ? [approvalNode] : []), end],
    edges: ids.slice(1).map((target, i) => ({ id: `${ids[i]}->${target}`, source: ids[i], target }))
  };
}

export const isAgentRunnable =(agent) => harnessReadiness(agent).ready;
export const agentBlockedReason = (agent) => harnessReadiness(agent).reason;
export const needsApproval = (agent) => approvalForced(agent);

export function describeNode(node, agentsById) {
  if (node.type === 'agent') return agentsById[node.data.agentId]?.name ?? 'Agent (not chosen)';
  if (node.type === 'policy') return `Policy: ${WORKFLOW_POLICIES.find((p) => p.id === node.data.policyId)?.name ?? 'not chosen'}`;
  if (node.type === 'approval') return `Approval: ${node.data.approver}`;
  return WORKFLOW_NODE_DEFINITIONS[node.type]?.label ?? node.type;
}

function adjacency(workflow) {
  const outgoing = new Map(workflow.nodes.map((n) => [n.id, []]));
  const incoming = new Map(workflow.nodes.map((n) => [n.id, []]));
  workflow.edges.forEach((e) => {
    if (outgoing.has(e.source) && incoming.has(e.target)) {
      outgoing.get(e.source).push(e.target);
      incoming.get(e.target).push(e.source);
    }
  });
  return { outgoing, incoming };
}

export function getExecutionOrder(workflow) {
  const { outgoing } = adjacency(workflow);
  const start = workflow.nodes.find((n) => n.type === 'start');
  const reachable = new Set();
  if (start) {
    const stack = [start.id];
    while (stack.length) {
      const id = stack.pop();
      if (!reachable.has(id)) {
        reachable.add(id);
        stack.push(...outgoing.get(id));
      }
    }
  }
  const inDegree = new Map([...reachable].map((id) => [id, 0]));
  reachable.forEach((id) => outgoing.get(id).forEach((t) => inDegree.set(t, inDegree.get(t) + 1)));
  const queue = [...reachable].filter((id) => inDegree.get(id) === 0);
  const order = [];
  while (queue.length) {
    const id = queue.shift();
    order.push(id);
    outgoing.get(id).forEach((t) => {
      inDegree.set(t, inDegree.get(t) - 1);
      if (inDegree.get(t) === 0) queue.push(t);
    });
  }
  return { order, hasCycle: order.length < reachable.size, reachable };
}

function startToEndPaths(workflow) {
  const { outgoing } = adjacency(workflow);
  const typeOf = new Map(workflow.nodes.map((n) => [n.id, n.type]));
  const start = workflow.nodes.find((n) => n.type === 'start');
  const paths = [];
  const walk = (id, path) => {
    if (paths.length >= MAX_PATHS || path.includes(id)) return;
    const next = [...path, id];
    if (typeOf.get(id) === 'end') {
      paths.push(next);
      return;
    }
    outgoing.get(id).forEach((t) => walk(t, next));
  };
  if (start) walk(start.id, []);
  return paths;
}

/**
 * One Start, at least one End, everything connected, no loops, every agent
 * chosen and runnable, and a human approval gate on every path through an
 * ASIL C/D agent.
 */
export function validateWorkflow(workflow, agentsById) {
  const issues = [];
  const add = (severity, message, nodeIds = []) => issues.push({ severity, message, nodeIds });
  const { incoming, outgoing } = adjacency(workflow);
  const starts = workflow.nodes.filter((n) => n.type === 'start');
  const ends = workflow.nodes.filter((n) => n.type === 'end');

  if (starts.length === 0) add('error', 'Add a Start node.');
  if (starts.length > 1) add('error', 'A workflow can have only one Start node.', starts.map((n) => n.id));
  if (ends.length === 0) add('error', 'Add an End node.');

  workflow.nodes.forEach((node) => {
    const def = WORKFLOW_NODE_DEFINITIONS[node.type];
    const name = describeNode(node, agentsById);
    const missingIn = def.hasInput && incoming.get(node.id).length === 0;
    const missingOut = def.hasOutput && outgoing.get(node.id).length === 0;
    if (missingIn && missingOut) add('error', `${name} is not connected.`, [node.id]);
    else if (missingIn) add('error', `${name} has no incoming connection.`, [node.id]);
    else if (missingOut) add('error', `${name} has no outgoing connection.`, [node.id]);

    if (node.type === 'agent') {
      const agent = agentsById[node.data.agentId];
      if (!node.data.agentId) add('error', 'An agent node has no agent chosen.', [node.id]);
      else if (!agent) add('error', 'An agent node refers to an agent that no longer exists.', [node.id]);
      else if (!isAgentRunnable(agent)) add('error', `${agent.name} cannot run yet (${agentBlockedReason(agent)}).`, [node.id]);
    }
    if (node.type === 'fork' && outgoing.get(node.id).length === 1) add('warning', 'A parallel fork with a single branch does nothing.', [node.id]);
    if (node.type === 'join' && incoming.get(node.id).length === 1) add('warning', 'A join with a single incoming branch does nothing.', [node.id]);
  });

  const { hasCycle, reachable } = getExecutionOrder(workflow);
  if (hasCycle) add('error', 'The workflow contains a loop; flows must run from Start to End without cycles.');
  const unreachable = workflow.nodes.filter((n) => starts.length && !reachable.has(n.id) && incoming.get(n.id).length > 0);
  if (unreachable.length) add('warning', `${unreachable.length} node(s) cannot be reached from Start.`, unreachable.map((n) => n.id));

  if (!hasCycle) {
    const byId = new Map(workflow.nodes.map((n) => [n.id, n]));
    const reported = new Set();
    startToEndPaths(workflow).forEach((path) => {
      const nodes = path.map((id) => byId.get(id));
      if (nodes.some((n) => n.type === 'approval')) return;
      nodes
        .filter((n) => n.type === 'agent' && needsApproval(agentsById[n.data.agentId]))
        .forEach((n) => {
          if (reported.has(n.id)) return;
          reported.add(n.id);
          const agent = agentsById[n.data.agentId];
          add('error', `${agent.name} is ASIL ${agent.asil} but a path through it has no human approval gate.`, [n.id]);
        });
    });
  }

  return { issues, isValid: issues.every((i) => i.severity !== 'error') };
}

function createRandom(seed) {
  let s = seed >>> 0 || 1;
  const next = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  return { int: (min, max) => Math.floor(min + next() * (max - min + 1)) };
}

const AGENT_RESULT_BY_SUBDOMAIN = {
  'Requirements & Safety': (item, _a, r) => `Drafted ${r.int(4, 9)} acceptance criteria and recovered ${r.int(6, 18)} trace links for ${item.id}`,
  Perception: (item, _a, r) => `Fusion confidence ${(r.int(90, 97) / 100).toFixed(2)} over ${r.int(800, 2400)} frames for ${item.id}`,
  'Validation & HIL': (_i, _a, r) => `Generated ${r.int(40, 180)} OpenSCENARIO variants — ${r.int(6, 24)} HIL runs queued on SCALEXIO`,
  'Planning & Control': (_i, _a, r) => `${r.int(200, 900)} adversarial trajectories checked — ${r.int(1, 6)} edge cases flagged`,
  'Release & Operations': (item, _a, r) => `${item.release} readiness scored at ${r.int(78, 94)}%`
};

export function buildWorkflowRun({ id, workflow, item, agentsById, seed, startedAt, audit = [] }) {
  const random = createRandom(seed);
  const { order } = getExecutionOrder(workflow);
  const { incoming, outgoing } = adjacency(workflow);
  const byId = new Map(workflow.nodes.map((n) => [n.id, n]));
  const flowAgents = workflow.nodes.filter((n) => n.type === 'agent').map((n) => agentsById[n.data.agentId]).filter(Boolean);

  let offset = 0;
  const steps = [];
  const logs = [];
  order.forEach((nodeId, index) => {
    const node = byId.get(nodeId);
    const label = describeNode(node, agentsById);
    let outcome = STEP_OUTCOME.PASSED;
    let level = 'INFO';
    let detail;
    let simulated = false;

    switch (node.type) {
      case 'start': detail = `${item.id} received — ${item.title}`; break;
      case 'end': detail = `Workflow complete for ${item.id}`; break;
      case 'fork': detail = `Split into ${outgoing.get(nodeId).length} parallel branches`; break;
      case 'join': detail = `Joined ${incoming.get(nodeId).length} branches`; break;
      case 'approval':
        outcome = STEP_OUTCOME.APPROVAL;
        level = 'WARN';
        detail = `Waiting for ${node.data.approver} to sign off`;
        break;
      case 'policy': {
        const policy = WORKFLOW_POLICIES.find((p) => p.id === node.data.policyId);
        const failing = policy ? flowAgents.filter((a) => !evaluatePolicies(a, audit)[policy.id].pass) : [];
        outcome = failing.length ? STEP_OUTCOME.FAILED : STEP_OUTCOME.PASSED;
        level = failing.length ? 'ERROR' : 'INFO';
        detail = failing.length
          ? `failed (${policy.standard}) for ${failing.map((a) => a.name).join(', ')}`
          : `passed (${policy?.standard ?? 'policy'}) for all ${flowAgents.length} agents`;
        break;
      }
      default: {
        const agent = agentsById[node.data.agentId];
        const score = Math.round((agent?.evaluation?.score ?? 80) + random.int(-6, 4));
        simulated = agent?.runtime?.status !== 'connected';
        if (!agent || score < AGENT_STEP_PASS_SCORE) {
          outcome = node.data.onFailure === ON_FAILURE.CONTINUE ? STEP_OUTCOME.WARNING : STEP_OUTCOME.FAILED;
          level = outcome === STEP_OUTCOME.FAILED ? 'ERROR' : 'WARN';
          detail = agent ? `Output below quality bar (${score}/100)${outcome === STEP_OUTCOME.WARNING ? ' — continuing' : ''}` : 'Agent unavailable';
        } else {
          detail = (AGENT_RESULT_BY_SUBDOMAIN[agent.subDomain] ?? (() => 'Step completed'))(item, agent, random);
        }
      }
    }

    const durationMs = node.type === 'agent' ? random.int(700, 1600) : random.int(250, 600);
    logs.push({ id: `${id}-L${index}`, offsetMs: offset, level, message: `${label}: ${detail}`, stepIndex: index });
    offset += durationMs;
    steps.push({ id: `${nodeId}-step`, nodeId, label, detail, durationMs, outcome, simulated });
  });

  const failedAt = steps.findIndex((s) => s.outcome === STEP_OUTCOME.FAILED);
  const scripted = failedAt === -1 ? steps : steps.map((s, i) => (i > failedAt ? { ...s, outcome: STEP_OUTCOME.SKIPPED } : s));

  const run = {
    id,
    title: `${workflow.name} · ${item.id}`,
    workflowId: workflow.id,
    itemId: item.id,
    startedAt,
    steps: scripted,
    logs,
    pendingApprovalIndex: null,
    approvedStepIndexes: [],
    decidedBy: null
  };
  return settleRun(run, 0);
}

/** Where playback from `fromIndex` stops, and the resulting run status. */
export function settleRun(run, fromIndex) {
  for (let i = fromIndex; i < run.steps.length; i += 1) {
    const { outcome } = run.steps[i];
    if (outcome === STEP_OUTCOME.FAILED) return { ...run, status: RUN_STATUS.FAILED, stopIndex: i, pendingApprovalIndex: null };
    if (outcome === STEP_OUTCOME.APPROVAL && !run.approvedStepIndexes.includes(i)) {
      return { ...run, status: RUN_STATUS.AWAITING_APPROVAL, stopIndex: i, pendingApprovalIndex: i };
    }
  }
  return { ...run, status: RUN_STATUS.PASSED, stopIndex: run.steps.length - 1, pendingApprovalIndex: null };
}

function settledStepStatus(run, index) {
  const step = run.steps[index];
  const pending = run.pendingApprovalIndex;
  if (run.status === RUN_STATUS.AWAITING_APPROVAL && pending !== null) {
    if (index === pending) return STEP_STATUS.WAITING;
    if (index > pending) return STEP_STATUS.PENDING;
  }
  if (run.status === RUN_STATUS.REJECTED && pending !== null) {
    if (index === pending) return STEP_STATUS.REJECTED;
    if (index > pending) return STEP_STATUS.SKIPPED;
  }
  if (step.outcome === STEP_OUTCOME.APPROVAL) return run.approvedStepIndexes.includes(index) ? STEP_STATUS.PASSED : STEP_STATUS.PENDING;
  if (step.outcome === STEP_OUTCOME.WARNING) return STEP_STATUS.WARNING;
  if (step.outcome === STEP_OUTCOME.FAILED) return STEP_STATUS.FAILED;
  if (step.outcome === STEP_OUTCOME.SKIPPED) return STEP_STATUS.SKIPPED;
  return STEP_STATUS.PASSED;
}

/** `revealedCount` is the number of steps shown so far while animating; null once settled. */
export function getStepStatus(run, index, revealedCount) {
  if (revealedCount === null) return settledStepStatus(run, index);
  if (index === revealedCount) return STEP_STATUS.RUNNING;
  if (index > revealedCount) return STEP_STATUS.PENDING;
  const { outcome } = run.steps[index];
  if (outcome === STEP_OUTCOME.APPROVAL) return run.approvedStepIndexes.includes(index) ? STEP_STATUS.PASSED : STEP_STATUS.WAITING;
  if (outcome === STEP_OUTCOME.WARNING) return STEP_STATUS.WARNING;
  if (outcome === STEP_OUTCOME.FAILED) return STEP_STATUS.FAILED;
  return STEP_STATUS.PASSED;
}

export function getVisibleLogs(run, revealedCount) {
  if (revealedCount !== null) return run.logs.filter((l) => l.stepIndex < revealedCount);
  const last = run.status === RUN_STATUS.AWAITING_APPROVAL || run.status === RUN_STATUS.REJECTED ? run.pendingApprovalIndex : run.stopIndex;
  return run.logs.filter((l) => l.stepIndex <= last);
}

export function serializeWorkflow(workflow) {
  const { name, description, nodes, edges } = workflow;
  return JSON.stringify({
    schema: WORKFLOW_FILE_SCHEMA,
    name,
    description,
    nodes: nodes.map(({ id, type, position, data }) => ({ id, type, position, data })),
    edges: edges.map(({ id, source, target }) => ({ id, source, target }))
  }, null, 2);
}

export function parseWorkflowJson(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    return { workflow: null, error: `Not valid JSON: ${error.message}` };
  }
  if (parsed?.schema !== WORKFLOW_FILE_SCHEMA) return { workflow: null, error: `Expected a "${WORKFLOW_FILE_SCHEMA}" workflow file.` };
  if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return { workflow: null, error: 'The file has no nodes or edges.' };

  const types = new Set(Object.values(WORKFLOW_NODE_TYPE));
  const badNode = parsed.nodes.find((n) => !n?.id || !types.has(n.type) || typeof n.position?.x !== 'number' || typeof n.position?.y !== 'number');
  if (badNode) return { workflow: null, error: `Node "${badNode?.id ?? '?'}" is invalid or has an unknown type.` };

  const ids = new Set(parsed.nodes.map((n) => n.id));
  if (parsed.edges.some((e) => !ids.has(e?.source) || !ids.has(e?.target))) return { workflow: null, error: 'An edge connects nodes that are not in the file.' };

  return {
    workflow: {
      id: null,
      name: String(parsed.name || 'Imported workflow'),
      description: String(parsed.description || ''),
      source: 'Imported',
      nodes: parsed.nodes.map(({ id, type, position, data }) => createWorkflowNode(type, position, id, data || {})),
      edges: parsed.edges.map(({ id, source, target }, i) => ({ id: id || `e-${i}`, source, target }))
    },
    error: null
  };
}

// ---------------------------------------------------------------------------
// Ready-made templates
// ---------------------------------------------------------------------------
const node = (id, type, x, y, data) => createWorkflowNode(type, { x, y }, id, data);
const chain = (...ids) => ids.slice(1).map((target, i) => ({ id: `${ids[i]}->${target}`, source: ids[i], target }));
const TEMPLATE_UPDATED = '2026-09-01T13:30:00Z';

export const SEED_WORKFLOWS = [
  {
    id: 'WF-TPL-01',
    name: 'Requirement → scenarios → safety sign-off',
    description: 'Draft acceptance criteria, generate edge-case scenarios and route them to the FuSa manager.',
    source: 'Ready-made',
    createdAt: TEMPLATE_UPDATED,
    updatedAt: TEMPLATE_UPDATED,
    nodes: [
      node('start', 'start', 0, 120),
      node('req', 'agent', 200, 110, { agentId: 'req_engine' }),
      node('scn', 'agent', 440, 110, { agentId: 'scenario_gen' }),
      node('appr', 'approval', 680, 110, { approver: 'Dr. Katrin Müller' }),
      node('end', 'end', 920, 120)
    ],
    edges: chain('start', 'req', 'scn', 'appr', 'end')
  },
  {
    id: 'WF-TPL-02',
    name: 'Radar fusion defect triage',
    description: 'Score fused detections and replay synthetic frames in parallel, then gate on functional safety.',
    source: 'Ready-made',
    createdAt: TEMPLATE_UPDATED,
    updatedAt: TEMPLATE_UPDATED,
    nodes: [
      node('start', 'start', 0, 150),
      node('fork', 'fork', 180, 150),
      node('fus', 'agent', 380, 40, { agentId: 'scorer' }),
      node('emu', 'agent', 380, 260, { agentId: 'emulator' }),
      node('join', 'join', 620, 150),
      node('pol', 'policy', 800, 140, { policyId: 'p_fusa' }),
      node('appr', 'approval', 1020, 140, { approver: 'Dr. Katrin Müller' }),
      node('end', 'end', 1240, 150)
    ],
    edges: [
      ...chain('start', 'fork'),
      ...chain('fork', 'fus', 'join'),
      ...chain('fork', 'emu', 'join'),
      ...chain('join', 'pol', 'appr', 'end')
    ]
  },
  {
    id: 'WF-TPL-03',
    name: 'ASIL-D hazard review with approval',
    description: 'Propose hazards and safety goals, hunt planner edge cases, then require a named approver.',
    source: 'Ready-made',
    createdAt: TEMPLATE_UPDATED,
    updatedAt: TEMPLATE_UPDATED,
    nodes: [
      node('start', 'start', 0, 120),
      node('hara', 'agent', 200, 110, { agentId: 'hara_copilot' }),
      node('traj', 'agent', 440, 110, { agentId: 'trajectory_sentinel' }),
      node('pol', 'policy', 680, 110, { policyId: 'p_human' }),
      node('appr', 'approval', 900, 110, { approver: 'Dr. Katrin Müller' }),
      node('end', 'end', 1120, 120)
    ],
    edges: chain('start', 'hara', 'traj', 'pol', 'appr', 'end')
  },
  {
    id: 'WF-TPL-04',
    name: 'Release readiness trace check',
    description: 'Check requirement coverage and HIL gaps, then enforce ASPICE traceability before the gate.',
    source: 'Ready-made',
    createdAt: TEMPLATE_UPDATED,
    updatedAt: TEMPLATE_UPDATED,
    nodes: [
      node('start', 'start', 0, 120),
      node('req', 'agent', 200, 110, { agentId: 'req_engine' }),
      node('emu', 'agent', 440, 110, { agentId: 'emulator', onFailure: ON_FAILURE.CONTINUE }),
      node('pol', 'policy', 680, 110, { policyId: 'p_aspice' }),
      node('end', 'end', 900, 120)
    ],
    edges: chain('start', 'req', 'emu', 'pol', 'end')
  }
];
