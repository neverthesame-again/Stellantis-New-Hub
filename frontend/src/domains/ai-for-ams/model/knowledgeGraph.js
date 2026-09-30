/**
 * @file AMS knowledge fabric (F8).
 *
 * Builds the knowledge graph from the incident catalogue: for every incident,
 * incident → affected service (CMDB) → change record → logs & monitoring →
 * known-error article → similar past incident → runbook → bound agents. Nodes
 * that describe the same record (for example a shared service) merge, so the
 * explore view shows how incidents share knowledge. Also derives the memory
 * counters and the technical-debt profile.
 */

import { amsDashboardData } from '../mockData.js';
import { HARNESS_MIN_STAGE } from './agentLifecycle';
import { AMS_INCIDENTS } from './incidents';

/**
 * @typedef {Object} KnowledgeLane
 * @property {string} id
 * @property {string} label
 * @property {string} system Where the records live.
 */

/** Lanes in flow order, left to right. */
export const KNOWLEDGE_LANES = Object.freeze([
  { id: 'incident', label: 'Incident', system: 'ServiceNow ITSM' },
  { id: 'service', label: 'Affected service', system: 'CMDB' },
  { id: 'change', label: 'Change record', system: 'ServiceNow Change' },
  { id: 'telemetry', label: 'Logs & monitoring', system: 'Splunk · Datadog · Dynatrace · Kubernetes' },
  { id: 'known-error', label: 'Known error', system: 'Known-error database' },
  { id: 'similar', label: 'Similar incident', system: 'PagerDuty history' },
  { id: 'runbook', label: 'Runbook', system: 'Runbook library' },
  { id: 'agent', label: 'Bound agents', system: 'Agent Studio' }
]);

/** Horizontal and vertical spacing of the layout, in canvas pixels. */
export const KNOWLEDGE_LAYOUT = Object.freeze({ columnWidth: 240, rowHeight: 104 });

/** Maximum agents bound to one incident in the graph. */
const MAX_BOUND_AGENTS = 3;

/**
 * @typedef {Object} KnowledgeNode
 * @property {string} id
 * @property {string} lane             One of {@link KNOWLEDGE_LANES} ids.
 * @property {string} label
 * @property {string} recordId
 * @property {string} system
 * @property {string | null} knowledgeSource KNOWLEDGE_SOURCES entry, for agent coverage.
 * @property {string} count            Size of the record set.
 * @property {string} detail           What the record says.
 * @property {string[]} incidentIds    Incidents this node belongs to.
 */

/**
 * @typedef {Object} KnowledgeEdge
 * @property {string} id
 * @property {string} source
 * @property {string} target
 * @property {string[]} incidentIds
 */

/**
 * Agents bound to an incident's knowledge: onboarded agents sharing the most
 * knowledge sources with the incident's records.
 *
 * @param {Object[]} agents
 * @param {Set<string>} sources Knowledge sources used by the incident's records.
 * @returns {Object[]}
 */
function boundAgentsFor(agents, sources) {
  return agents
    .filter((agent) => agent.stage >= HARNESS_MIN_STAGE)
    .map((agent) => ({ agent, overlap: (agent.knowledgeSources || []).filter((source) => sources.has(source)).length }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || b.agent.stage - a.agent.stage)
    .slice(0, MAX_BOUND_AGENTS)
    .map(({ agent }) => agent);
}

/**
 * Builds the knowledge graph for all open incidents.
 *
 * @param {Object[]} agents Studio agents.
 * @returns {{ nodes: KnowledgeNode[], edges: KnowledgeEdge[] }}
 */
export function buildKnowledgeGraph(agents) {
  const nodes = new Map();
  const edges = new Map();

  const addNode = (node, incidentId) => {
    const existing = nodes.get(node.id);
    if (existing) {
      if (!existing.incidentIds.includes(incidentId)) existing.incidentIds.push(incidentId);
    } else {
      nodes.set(node.id, { ...node, incidentIds: [incidentId] });
    }
    return node.id;
  };
  const link = (sources, targets, incidentId) => {
    sources.forEach((source) => targets.forEach((target) => {
      const id = `${source}->${target}`;
      const existing = edges.get(id);
      if (existing) {
        if (!existing.incidentIds.includes(incidentId)) existing.incidentIds.push(incidentId);
      } else {
        edges.set(id, { id, source, target, incidentIds: [incidentId] });
      }
    }));
  };
  const recordNode = (lane, record) => ({
    id: `${lane}:${record.recordId}`,
    lane,
    label: record.label,
    recordId: record.recordId,
    system: record.system,
    knowledgeSource: record.knowledgeSource,
    count: record.count,
    detail: record.excerpt
  });

  AMS_INCIDENTS.forEach((incident) => {
    const { knowledge } = incident;
    const incidentNode = addNode({
      id: `incident:${incident.id}`,
      lane: 'incident',
      label: incident.title,
      recordId: incident.id,
      system: 'ServiceNow ITSM',
      knowledgeSource: 'ServiceNow ITSM',
      count: `${incident.severity} · ${incident.usersAffected.toLocaleString('en-GB')} users`,
      detail: `${incident.service} — problem record ${incident.problemRecordId}`
    }, incident.id);
    const service = addNode(recordNode('service', knowledge.service), incident.id);
    const change = addNode(recordNode('change', knowledge.change), incident.id);
    const telemetry = knowledge.telemetry.map((record) => addNode(recordNode('telemetry', record), incident.id));
    const knownError = addNode(recordNode('known-error', knowledge.knownError), incident.id);
    const similar = knowledge.similar.map((past) => addNode({
      id: `similar:${past.id}`,
      lane: 'similar',
      label: past.title,
      recordId: past.id,
      system: 'PagerDuty history',
      knowledgeSource: 'PagerDuty history',
      count: `${past.match}% match · resolved in ${past.resolvedIn}`,
      detail: past.resolution
    }, incident.id));
    const runbook = addNode(recordNode('runbook', knowledge.runbook), incident.id);

    const sources = new Set([
      'ServiceNow ITSM',
      knowledge.service.knowledgeSource,
      knowledge.change.knowledgeSource,
      ...knowledge.telemetry.map((record) => record.knowledgeSource),
      knowledge.knownError.knowledgeSource,
      'PagerDuty history',
      knowledge.runbook.knowledgeSource
    ]);
    const agentNodes = boundAgentsFor(agents, sources).map((agent) => addNode({
      id: `agent:${agent.id}`,
      lane: 'agent',
      label: agent.name,
      recordId: agent.id,
      system: 'Agent Studio',
      knowledgeSource: null,
      count: `${(agent.knowledgeSources || []).length} sources bound`,
      detail: agent.purpose
    }, incident.id));

    link([incidentNode], [service], incident.id);
    link([service], [change], incident.id);
    link([change], telemetry, incident.id);
    link(telemetry, [knownError], incident.id);
    link([knownError], similar, incident.id);
    link(similar, [runbook], incident.id);
    link([runbook], agentNodes, incident.id);
  });

  return { nodes: [...nodes.values()], edges: [...edges.values()] };
}

/**
 * Restricts the graph to one incident's chain.
 *
 * @param {{ nodes: KnowledgeNode[], edges: KnowledgeEdge[] }} graph
 * @param {string} incidentId
 * @returns {{ nodes: KnowledgeNode[], edges: KnowledgeEdge[] }}
 */
export function filterGraphToIncident(graph, incidentId) {
  return {
    nodes: graph.nodes.filter((node) => node.incidentIds.includes(incidentId)),
    edges: graph.edges.filter((edge) => edge.incidentIds.includes(incidentId))
  };
}

/**
 * Lays nodes out in lanes (columns), vertically centred per lane.
 *
 * @param {KnowledgeNode[]} nodes
 * @returns {Record<string, { x: number, y: number }>} Position per node id.
 */
export function layoutKnowledgeGraph(nodes) {
  const byLane = KNOWLEDGE_LANES.map((lane) => nodes.filter((node) => node.lane === lane.id));
  const tallest = Math.max(1, ...byLane.map((laneNodes) => laneNodes.length));
  const positions = {};
  byLane.forEach((laneNodes, laneIndex) => {
    const offset = ((tallest - laneNodes.length) * KNOWLEDGE_LAYOUT.rowHeight) / 2;
    laneNodes.forEach((node, row) => {
      positions[node.id] = { x: laneIndex * KNOWLEDGE_LAYOUT.columnWidth, y: offset + row * KNOWLEDGE_LAYOUT.rowHeight };
    });
  });
  return positions;
}

/**
 * Memory counters shown above the graph. Enterprise memory is the reference
 * knowledge the platform indexes; the other counters grow with use of the
 * studio (runs, decisions, workflows).
 *
 * @param {import('../state/seedState').AmsStudioState} state
 * @param {{ nodes: KnowledgeNode[] }} graph
 * @returns {Array<{ id: string, label: string, value: number, hint: string }>}
 */
export function getMemoryCounters(state, graph) {
  const timelineEntries = Object.values(state.incidentResponses).reduce((sum, response) => sum + response.timeline.length, 0);
  const decidedItems = state.inbox.filter((item) => ['Approved', 'Rejected', 'Escalated'].includes(item.status)).length;
  const runbooks = graph.nodes.filter((node) => node.lane === 'runbook').length;
  return [
    { id: 'enterprise', label: 'Enterprise memory', value: 12480 + graph.nodes.length, hint: 'CMDB items, known errors and articles indexed' },
    { id: 'operational', label: 'Operational memory', value: 3120 + state.runs.length + timelineEntries, hint: 'Incident timelines and agent runs' },
    { id: 'decision', label: 'Decision memory', value: 640 + decidedItems + state.auditLog.length, hint: 'Approvals, rejections and audit events' },
    { id: 'project', label: 'Project memory', value: 210 + state.workflows.length + state.studioAgents.length, hint: 'Programmes, agents and workflows' },
    { id: 'artifacts', label: 'Reusable artifacts', value: state.skills.length + state.workflows.length + runbooks, hint: 'Skills, workflows and runbooks ready to reuse' }
  ];
}

const PRIORITY_WEIGHT = { High: 3, Medium: 2, Low: 1 };

/** Debt fixed by shipping code or configuration goes through a change; the rest is operational. */
const CHANGE_DEBT_PATTERN = /refactor|upgrade|replica|lock|migrat|patch/i;

/**
 * AMS area whose agents are best placed to remediate a debt item.
 *
 * @param {{ title: string }} item
 * @returns {'change-release' | 'runbook-automation'}
 */
function remediationAreaFor(item) {
  return CHANGE_DEBT_PATTERN.test(item.title) ? 'change-release' : 'runbook-automation';
}

/**
 * Technical-debt profile: a 0–100 debt index and each backlog item with the
 * incident it causes and the agent best placed to remediate it (reuses the
 * dashboard's technical-debt backlog). Code and configuration debt goes to a
 * Change & Release agent, operational debt to a Runbook Automation agent.
 *
 * @param {Object[]} agents Studio agents.
 * @returns {{ index: number, costOfInaction: string, items: Array<Object> }}
 */
export function getDebtProfile(agents) {
  const backlog = amsDashboardData.technicalDebtBacklog;
  const remediators = agents.filter((agent) => agent.stage >= HARNESS_MIN_STAGE
    && (agent.area === 'runbook-automation' || agent.area === 'change-release'));

  const items = backlog.items.map((item) => {
    const incident = AMS_INCIDENTS.find((candidate) => candidate.knowledge.change.recordId === item.crLinked);
    const sources = new Set(incident ? [incident.knowledge.runbook.knowledgeSource, incident.knowledge.service.knowledgeSource, incident.knowledge.change.knowledgeSource] : []);
    const preferredArea = remediationAreaFor(item);
    const overlap = (candidate) => (candidate.knowledgeSources || []).filter((source) => sources.has(source)).length;
    // Prefer the right kind of agent, then the one that knows the incident best, then the most mature.
    const agent = [...remediators].sort((a, b) => (
      Number(b.area === preferredArea) - Number(a.area === preferredArea)
      || overlap(b) - overlap(a)
      || b.stage - a.stage
    ))[0] ?? null;
    const weight = item.storyPoints * (PRIORITY_WEIGHT[item.priority] ?? 1) * Math.log2(1 + item.recurringIncidents);
    return { ...item, incidentId: incident?.id ?? null, remediatingAgent: agent, weight: Math.round(weight) };
  });

  const index = Math.min(100, Math.round(items.reduce((sum, item) => sum + item.weight, 0) / 2));
  return { index, costOfInaction: backlog.estCostOfInaction, items: items.sort((a, b) => b.weight - a.weight) };
}
