import React, { useMemo } from 'react';
import { Background, Controls, MarkerType, MiniMap, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { KNOWLEDGE_LANES, KNOWLEDGE_LAYOUT, layoutKnowledgeGraph } from '../../../model/knowledgeGraph';
import { useDocumentTheme } from '../../../utils/useDocumentTheme';
import { KNOWLEDGE_NODE_TYPES } from './knowledgeNodeTypes';

/** Vertical offset of the lane headings above the first row. */
const LANE_HEADER_OFFSET = -90;

/**
 * Whether the selected agent uses a record's knowledge.
 *
 * @param {import('../../../model/knowledgeGraph').KnowledgeNode} record
 * @param {Object | null} agent
 * @returns {boolean}
 */
function isCoveredBy(record, agent) {
  if (!agent) return false;
  if (record.lane === 'agent') return record.recordId === agent.id;
  return Boolean(record.knowledgeSource) && (agent.knowledgeSources || []).includes(record.knowledgeSource);
}

/**
 * Read-only knowledge graph drawn as left-to-right lanes, so the chain from an
 * incident to the agents that can act on it reads as a flow (F8).
 *
 * Highlighting: in the explore view a chosen incident's chain stays bright and
 * the rest dims; choosing an agent dims every record whose source the agent is
 * not bound to and ticks those it is.
 *
 * @param {Object} props
 * @param {{ nodes: Object[], edges: Object[] }} props.graph   Graph to draw.
 * @param {string | null} props.highlightIncidentId          Incident whose chain stays bright.
 * @param {Object | null} props.agent                         Agent whose coverage to show.
 * @param {string | null} props.selectedNodeId
 * @param {(nodeId: string | null) => void} props.onSelectNode
 * @param {boolean} props.animatePath                         Animate the edges of the bright chain.
 * @returns {JSX.Element}
 */
export default function KnowledgeGraphCanvas({ graph, highlightIncidentId, agent, selectedNodeId, onSelectNode, animatePath }) {
  const theme = useDocumentTheme();

  const { nodes, edges } = useMemo(() => {
    const positions = layoutKnowledgeGraph(graph.nodes);
    const inPath = (incidentIds) => !highlightIncidentId || incidentIds.includes(highlightIncidentId);
    const dimmedIds = new Set();

    const recordNodes = graph.nodes.map((record) => {
      const covered = isCoveredBy(record, agent);
      const dimmed = !inPath(record.incidentIds) || (agent !== null && !covered && record.lane !== 'incident');
      if (dimmed) dimmedIds.add(record.id);
      return {
        id: record.id,
        type: 'record',
        position: positions[record.id],
        data: { record, dimmed, covered },
        selected: record.id === selectedNodeId,
        draggable: false,
        connectable: false
      };
    });

    const presentLanes = new Set(graph.nodes.map((record) => record.lane));
    const laneNodes = KNOWLEDGE_LANES
      .map((lane, index) => ({ lane, index }))
      .filter(({ lane }) => presentLanes.has(lane.id))
      .map(({ lane, index }) => ({
        id: `lane:${lane.id}`,
        type: 'lane',
        position: { x: index * KNOWLEDGE_LAYOUT.columnWidth, y: LANE_HEADER_OFFSET },
        data: { label: lane.label, system: lane.system, step: index + 1 },
        selectable: false,
        draggable: false,
        connectable: false
      }));

    const flowEdges = graph.edges.map((edge) => {
      const bright = inPath(edge.incidentIds) && !dimmedIds.has(edge.source) && !dimmedIds.has(edge.target);
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: animatePath && bright,
        className: bright ? 'ams-kg-edge' : 'ams-kg-edge is-dimmed',
        markerEnd: { type: MarkerType.ArrowClosed }
      };
    });

    return { nodes: [...laneNodes, ...recordNodes], edges: flowEdges };
  }, [graph, highlightIncidentId, agent, selectedNodeId, animatePath]);

  return (
    <div className="ams-canvas ams-kg-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={KNOWLEDGE_NODE_TYPES}
        onNodeClick={(_event, node) => node.type === 'record' && onSelectNode(node.id)}
        onPaneClick={() => onSelectNode(null)}
        nodesDraggable={false}
        nodesConnectable={false}
        colorMode={theme}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
      >
        <Background gap={24} />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable nodeStrokeWidth={3} />
      </ReactFlow>
    </div>
  );
}
