/**
 * @file Multi-agent incident workflows (F9).
 *
 * A workflow is a directed graph of nodes and edges. Nodes are stored in the
 * shape React Flow renders directly (`{ id, type, position, data }`), so the
 * playground needs no conversion layer. This module owns node definitions,
 * validation, execution order, the simulated run script and JSON import/export.
 */

import { INBOX_APPROVAL_TIER, APPROVERS, CONNECTION_STATUS } from './agentOptions';
import { HARNESS_MIN_STAGE } from './agentLifecycle';
import { GOVERNANCE_POLICIES } from './governancePolicies';
import { createRandom } from '../utils/random';
import { LOG_LEVEL, RUN_KIND, RUN_STATUS, STEP_OUTCOME, skipStepsAfterFailure, stepLogs } from './runModel';

/** Node types available in the playground. */
export const WORKFLOW_NODE_TYPE = Object.freeze({
  START: 'start',
  END: 'end',
  AGENT: 'agent',
  APPROVAL: 'approval',
  POLICY: 'policy',
  FORK: 'fork',
  JOIN: 'join'
});

/**
 * @typedef {Object} NodeDefinition
 * @property {string} label
 * @property {string} description
 * @property {boolean} hasInput   Whether edges may end at the node.
 * @property {boolean} hasOutput  Whether edges may start at the node.
 */

/** @type {Readonly<Record<string, NodeDefinition>>} */
export const WORKFLOW_NODE_DEFINITIONS = Object.freeze({
  [WORKFLOW_NODE_TYPE.START]: { label: 'Start', description: 'Where the incident enters the flow.', hasInput: false, hasOutput: true },
  [WORKFLOW_NODE_TYPE.END]: { label: 'End', description: 'The flow is complete.', hasInput: true, hasOutput: false },
  [WORKFLOW_NODE_TYPE.AGENT]: { label: 'Agent', description: 'An onboarded AMS agent does its part.', hasInput: true, hasOutput: true },
  [WORKFLOW_NODE_TYPE.APPROVAL]: { label: 'Human approval', description: 'Pauses until someone approves in the Workflow Inbox.', hasInput: true, hasOutput: true },
  [WORKFLOW_NODE_TYPE.POLICY]: { label: 'Policy gate', description: 'Stops the flow if the agents break an operating policy.', hasInput: true, hasOutput: true },
  [WORKFLOW_NODE_TYPE.FORK]: { label: 'Parallel fork', description: 'Runs the following branches in parallel.', hasInput: true, hasOutput: true },
  [WORKFLOW_NODE_TYPE.JOIN]: { label: 'Join', description: 'Waits for parallel branches to finish.', hasInput: true, hasOutput: true }
});

/** Format marker written into exported workflow files. */
export const WORKFLOW_FILE_SCHEMA = 'ams-workflow/v1';

/** What an agent node does when its step fails. */
export const ON_FAILURE = Object.freeze({ STOP: 'stop', CONTINUE: 'continue' });

/** Minimum agent step quality for a workflow step to pass. */
const AGENT_STEP_PASS_SCORE = 75;

/** Cap on start-to-end paths inspected by validation (keeps big graphs fast). */
const MAX_PATHS = 200;

/**
 * Default `data` for a new node of a type.
 *
 * @param {string} type
 * @returns {Object}
 */
function defaultNodeData(type) {
  switch (type) {
    case WORKFLOW_NODE_TYPE.AGENT: return { agentId: null, onFailure: ON_FAILURE.STOP };
    case WORKFLOW_NODE_TYPE.APPROVAL: return { approver: APPROVERS[0] };
    case WORKFLOW_NODE_TYPE.POLICY: return { policyId: GOVERNANCE_POLICIES[0].id };
    default: return {};
  }
}

/**
 * Creates a workflow node.
 *
 * @param {string} type      One of {@link WORKFLOW_NODE_TYPE}.
 * @param {{ x: number, y: number }} position
 * @param {string} id
 * @param {Object} [data]    Overrides for the type's default data.
 * @returns {{ id: string, type: string, position: { x: number, y: number }, data: Object }}
 */
export function createWorkflowNode(type, position, id, data = {}) {
  return { id, type, position, data: { ...defaultNodeData(type), ...data } };
}

/**
 * A new, empty workflow with a Start and an End node.
 *
 * @param {string} name
 * @returns {Object} Workflow without id (assigned when saved).
 */
export function createEmptyWorkflow(name) {
  return {
    id: null,
    name,
    description: '',
    source: 'Custom',
    nodes: [
      createWorkflowNode(WORKFLOW_NODE_TYPE.START, { x: 40, y: 160 }, 'start'),
      createWorkflowNode(WORKFLOW_NODE_TYPE.END, { x: 720, y: 160 }, 'end')
    ],
    edges: []
  };
}

/**
 * Human-readable name of a node, for messages and run steps.
 *
 * @param {Object} node
 * @param {Record<string, Object>} agentsById
 * @returns {string}
 */
export function describeNode(node, agentsById) {
  if (node.type === WORKFLOW_NODE_TYPE.AGENT) return agentsById[node.data.agentId]?.name ?? 'Agent (not chosen)';
  if (node.type === WORKFLOW_NODE_TYPE.POLICY) {
    return `Policy: ${GOVERNANCE_POLICIES.find((policy) => policy.id === node.data.policyId)?.label ?? 'not chosen'}`;
  }
  if (node.type === WORKFLOW_NODE_TYPE.APPROVAL) return `Approval: ${node.data.approver}`;
  return WORKFLOW_NODE_DEFINITIONS[node.type]?.label ?? node.type;
}

/**
 * Adjacency lists of a workflow.
 *
 * @param {Object} workflow
 * @returns {{ outgoing: Map<string, string[]>, incoming: Map<string, string[]> }}
 */
function adjacency(workflow) {
  const outgoing = new Map(workflow.nodes.map((node) => [node.id, []]));
  const incoming = new Map(workflow.nodes.map((node) => [node.id, []]));
  workflow.edges.forEach((edge) => {
    if (outgoing.has(edge.source) && incoming.has(edge.target)) {
      outgoing.get(edge.source).push(edge.target);
      incoming.get(edge.target).push(edge.source);
    }
  });
  return { outgoing, incoming };
}

/**
 * Execution order of the nodes reachable from Start (Kahn's algorithm).
 *
 * @param {Object} workflow
 * @returns {{ order: string[], hasCycle: boolean, reachable: Set<string> }}
 */
export function getExecutionOrder(workflow) {
  const { outgoing } = adjacency(workflow);
  const start = workflow.nodes.find((node) => node.type === WORKFLOW_NODE_TYPE.START);
  const reachable = new Set();
  if (start) {
    const stack = [start.id];
    while (stack.length) {
      const nodeId = stack.pop();
      if (!reachable.has(nodeId)) {
        reachable.add(nodeId);
        stack.push(...outgoing.get(nodeId));
      }
    }
  }

  const inDegree = new Map([...reachable].map((nodeId) => [nodeId, 0]));
  reachable.forEach((nodeId) => outgoing.get(nodeId).forEach((target) => inDegree.set(target, inDegree.get(target) + 1)));
  const queue = [...reachable].filter((nodeId) => inDegree.get(nodeId) === 0);
  const order = [];
  while (queue.length) {
    const nodeId = queue.shift();
    order.push(nodeId);
    outgoing.get(nodeId).forEach((target) => {
      inDegree.set(target, inDegree.get(target) - 1);
      if (inDegree.get(target) === 0) queue.push(target);
    });
  }
  return { order, hasCycle: order.length < reachable.size, reachable };
}

/**
 * Enumerates Start → End paths (depth-first, capped at {@link MAX_PATHS}).
 *
 * @param {Object} workflow
 * @returns {string[][]} Paths as node-id lists.
 */
function startToEndPaths(workflow) {
  const { outgoing } = adjacency(workflow);
  const typeOf = new Map(workflow.nodes.map((node) => [node.id, node.type]));
  const start = workflow.nodes.find((node) => node.type === WORKFLOW_NODE_TYPE.START);
  const paths = [];
  const walk = (nodeId, path) => {
    if (paths.length >= MAX_PATHS || path.includes(nodeId)) return;
    const next = [...path, nodeId];
    if (typeOf.get(nodeId) === WORKFLOW_NODE_TYPE.END) {
      paths.push(next);
      return;
    }
    outgoing.get(nodeId).forEach((target) => walk(target, next));
  };
  if (start) walk(start.id, []);
  return paths;
}

/**
 * @typedef {Object} ValidationIssue
 * @property {'error' | 'warning'} severity
 * @property {string} message
 * @property {string[]} nodeIds Nodes to highlight.
 */

/**
 * Validates a workflow: exactly one Start, at least one End, no unconnected
 * nodes, no loops, every agent chosen and onboarded, and a human approval gate
 * on every path that runs a Tier 1 agent.
 *
 * @param {Object} workflow
 * @param {Record<string, Object>} agentsById Studio agents by id.
 * @returns {{ issues: ValidationIssue[], isValid: boolean }}
 */
export function validateWorkflow(workflow, agentsById) {
  const issues = [];
  const add = (severity, message, nodeIds = []) => issues.push({ severity, message, nodeIds });
  const { incoming, outgoing } = adjacency(workflow);
  const starts = workflow.nodes.filter((node) => node.type === WORKFLOW_NODE_TYPE.START);
  const ends = workflow.nodes.filter((node) => node.type === WORKFLOW_NODE_TYPE.END);

  if (starts.length === 0) add('error', 'Add a Start node.');
  if (starts.length > 1) add('error', 'A workflow can have only one Start node.', starts.map((node) => node.id));
  if (ends.length === 0) add('error', 'Add an End node.');

  workflow.nodes.forEach((node) => {
    const definition = WORKFLOW_NODE_DEFINITIONS[node.type];
    const name = describeNode(node, agentsById);
    const missingIn = definition.hasInput && incoming.get(node.id).length === 0;
    const missingOut = definition.hasOutput && outgoing.get(node.id).length === 0;
    if (missingIn && missingOut) add('error', `${name} is not connected.`, [node.id]);
    else if (missingIn) add('error', `${name} has no incoming connection.`, [node.id]);
    else if (missingOut) add('error', `${name} has no outgoing connection.`, [node.id]);

    if (node.type === WORKFLOW_NODE_TYPE.AGENT) {
      const agent = agentsById[node.data.agentId];
      if (!node.data.agentId) add('error', 'An agent node has no agent chosen.', [node.id]);
      else if (!agent) add('error', 'An agent node refers to an agent that no longer exists.', [node.id]);
      else if (agent.stage < HARNESS_MIN_STAGE) add('error', `${agent.name} is still in registration and cannot run yet.`, [node.id]);
    }
    if (node.type === WORKFLOW_NODE_TYPE.FORK && outgoing.get(node.id).length === 1) {
      add('warning', 'A parallel fork with a single branch does nothing.', [node.id]);
    }
    if (node.type === WORKFLOW_NODE_TYPE.JOIN && incoming.get(node.id).length === 1) {
      add('warning', 'A join with a single incoming branch does nothing.', [node.id]);
    }
  });

  const { hasCycle, reachable } = getExecutionOrder(workflow);
  if (hasCycle) add('error', 'The workflow contains a loop; flows must run from Start to End without cycles.');
  const unreachable = workflow.nodes.filter((node) => starts.length && !reachable.has(node.id) && incoming.get(node.id).length > 0);
  if (unreachable.length) add('warning', `${unreachable.length} node(s) cannot be reached from Start.`, unreachable.map((node) => node.id));

  if (!hasCycle) {
    const byId = new Map(workflow.nodes.map((node) => [node.id, node]));
    const reported = new Set();
    startToEndPaths(workflow).forEach((path) => {
      const nodes = path.map((nodeId) => byId.get(nodeId));
      if (nodes.some((node) => node.type === WORKFLOW_NODE_TYPE.APPROVAL)) return;
      nodes
        .filter((node) => node.type === WORKFLOW_NODE_TYPE.AGENT && agentsById[node.data.agentId]?.serviceTier === INBOX_APPROVAL_TIER)
        .forEach((node) => {
          if (reported.has(node.id)) return;
          reported.add(node.id);
          add('error', `${agentsById[node.data.agentId].name} is ${INBOX_APPROVAL_TIER} but a path through it has no human approval gate.`, [node.id]);
        });
    });
  }

  return { issues, isValid: issues.every((issue) => issue.severity !== 'error') };
}

/** Result line templates for an agent step, per AMS area. */
const AGENT_RESULT_BY_AREA = {
  'incident-triage': (incident, agent) => `Classified as ${incident.severity}, routed to ${agent.team || 'the resolver group'}`,
  'problem-rca': (incident, _agent, random) => `Probable root cause found for ${incident.clusterId} (confidence ${random.int(78, 94)}%)`,
  'change-release': (_incident, _agent, random) => `Linked changes scored — highest risk ${(random.int(18, 64) / 100).toFixed(2)}`,
  observability: (incident, _agent, random) => `Correlated ${random.int(3, 9)} alerts on ${incident.service}`,
  'runbook-automation': (_incident, _agent, random) => `Runbook dry-run passed — ${random.int(2, 6)} steps ready to execute`
};

/**
 * Builds the run script of a workflow on an incident. Steps follow the
 * execution order; the first failure skips everything after it.
 *
 * @param {Object} params
 * @param {string} params.id
 * @param {Object} params.workflow
 * @param {import('./incidents').AmsIncident} params.incident
 * @param {Record<string, Object>} params.agentsById
 * @param {number} params.seed
 * @param {string} params.startedAt
 * @returns {import('./runModel').AmsRun}
 */
export function buildWorkflowRun({ id, workflow, incident, agentsById, seed, startedAt }) {
  const random = createRandom(seed);
  const { order } = getExecutionOrder(workflow);
  const { incoming, outgoing } = adjacency(workflow);
  const byId = new Map(workflow.nodes.map((node) => [node.id, node]));
  const flowAgents = workflow.nodes
    .filter((node) => node.type === WORKFLOW_NODE_TYPE.AGENT)
    .map((node) => agentsById[node.data.agentId])
    .filter(Boolean);

  let offset = 0;
  const steps = [];
  const logs = [];
  order.forEach((nodeId, index) => {
    const node = byId.get(nodeId);
    const label = describeNode(node, agentsById);
    let outcome = STEP_OUTCOME.PASSED;
    let detail;
    let simulated = false;
    let level = LOG_LEVEL.INFO;

    switch (node.type) {
      case WORKFLOW_NODE_TYPE.START:
        detail = `${incident.id} received — ${incident.title}`;
        break;
      case WORKFLOW_NODE_TYPE.END:
        detail = `Workflow complete for ${incident.id}`;
        break;
      case WORKFLOW_NODE_TYPE.FORK:
        detail = `Split into ${outgoing.get(nodeId).length} parallel branches`;
        break;
      case WORKFLOW_NODE_TYPE.JOIN:
        detail = `Joined ${incoming.get(nodeId).length} branches`;
        break;
      case WORKFLOW_NODE_TYPE.APPROVAL:
        outcome = STEP_OUTCOME.APPROVAL;
        detail = `Waiting for ${node.data.approver} in the Workflow Inbox`;
        level = LOG_LEVEL.WARN;
        break;
      case WORKFLOW_NODE_TYPE.POLICY: {
        const policy = GOVERNANCE_POLICIES.find((candidate) => candidate.id === node.data.policyId);
        const failing = policy ? flowAgents.filter((agent) => !policy.check(agent).passed) : [];
        outcome = failing.length ? STEP_OUTCOME.FAILED : STEP_OUTCOME.PASSED;
        detail = failing.length
          ? `${policy.label} failed for ${failing.map((agent) => agent.name).join(', ')}`
          : `${policy?.label ?? 'Policy'} passed for all ${flowAgents.length} agents`;
        level = failing.length ? LOG_LEVEL.ERROR : LOG_LEVEL.INFO;
        break;
      }
      default: {
        const agent = agentsById[node.data.agentId];
        const score = Math.round((agent?.evaluation?.score ?? 80) + random.int(-6, 4));
        simulated = agent?.runtime?.connectionStatus !== CONNECTION_STATUS.CONNECTED;
        if (!agent || score < AGENT_STEP_PASS_SCORE) {
          outcome = node.data.onFailure === ON_FAILURE.CONTINUE ? STEP_OUTCOME.WARNING : STEP_OUTCOME.FAILED;
          detail = agent ? `Output below quality bar (${score}/100)${outcome === STEP_OUTCOME.WARNING ? ' — continuing' : ''}` : 'Agent unavailable';
          level = outcome === STEP_OUTCOME.FAILED ? LOG_LEVEL.ERROR : LOG_LEVEL.WARN;
        } else {
          detail = (AGENT_RESULT_BY_AREA[agent.area] ?? (() => 'Step completed'))(incident, agent, random);
        }
      }
    }

    const durationMs = node.type === WORKFLOW_NODE_TYPE.AGENT ? random.int(700, 1600) : random.int(250, 600);
    logs.push(...stepLogs(id, index, offset, [[level, `${label}: ${detail}`]]));
    offset += durationMs;
    steps.push({ id: `${nodeId}-step`, nodeId, label, detail, durationMs, outcome, simulated });
  });

  return {
    id,
    kind: RUN_KIND.WORKFLOW,
    title: `${workflow.name} · ${incident.id}`,
    agentId: null,
    workflowId: workflow.id,
    incidentId: incident.id,
    seed,
    status: RUN_STATUS.RUNNING,
    startedAt,
    finishedAt: null,
    steps: skipStepsAfterFailure(steps),
    logs,
    gauges: null,
    pendingApprovalIndex: null,
    approvedStepIndexes: [],
    approvalInboxItemId: null
  };
}

/**
 * Serialises a workflow for export.
 *
 * @param {Object} workflow
 * @returns {string} Pretty-printed JSON.
 */
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

/**
 * Parses and checks an imported workflow file.
 *
 * @param {string} text File contents.
 * @returns {{ workflow: Object | null, error: string | null }}
 */
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
  const badNode = parsed.nodes.find((node) => !node?.id || !types.has(node.type)
    || typeof node.position?.x !== 'number' || typeof node.position?.y !== 'number');
  if (badNode) return { workflow: null, error: `Node "${badNode?.id ?? '?'}" is invalid or has an unknown type.` };

  const nodeIds = new Set(parsed.nodes.map((node) => node.id));
  const badEdge = parsed.edges.find((edge) => !nodeIds.has(edge?.source) || !nodeIds.has(edge?.target));
  if (badEdge) return { workflow: null, error: 'An edge connects nodes that are not in the file.' };

  return {
    workflow: {
      id: null,
      name: String(parsed.name || 'Imported workflow'),
      description: String(parsed.description || ''),
      source: 'Imported',
      nodes: parsed.nodes.map(({ id, type, position, data }) => createWorkflowNode(type, position, id, data || {})),
      edges: parsed.edges.map(({ id, source, target }, index) => ({ id: id || `e-${index}`, source, target }))
    },
    error: null
  };
}
