import React, { useMemo, useEffect, useState } from 'react';
import { Background, Controls, MarkerType, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  AD_KNOWLEDGE_LANES,
  AD_KNOWLEDGE_LAYOUT,
  layoutAdKnowledgeGraph
} from '../model/adKnowledgeGraph';
import { AD_KNOWLEDGE_NODE_TYPES } from './adKnowledgeNodeTypes';

const LANE_HEADER_OFFSET = -76;

function isCoveredBy(record, agent) {
  if (!agent) return false;
  if (record.lane === 'agent') return record.recordId === agent.id;
  return Boolean(record.knowledgeSource) && (agent.knowledge || []).includes(record.knowledgeSource);
}

export default function AdKnowledgeGraphCanvas({
  graph,
  highlightScenarioId,
  agent,
  selectedNodeId,
  onSelectNode,
  animatePath
}) {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const { nodes, edges } = useMemo(() => {
    const positions = layoutAdKnowledgeGraph(graph.nodes);
    const inPath = (scenarioIds) => !highlightScenarioId || scenarioIds.includes(highlightScenarioId);
    const dimmedIds = new Set();

    const recordNodes = graph.nodes.map((record) => {
      const covered = isCoveredBy(record, agent);
      const dimmed = !inPath(record.scenarioIds) || (agent !== null && !covered);
      if (dimmed) dimmedIds.add(record.id);

      return {
        id: record.id,
        type: 'record',
        position: positions[record.id] || { x: 0, y: 0 },
        data: { record, dimmed, covered },
        selected: record.id === selectedNodeId,
        draggable: false,
        connectable: false
      };
    });

    const presentLanes = new Set(graph.nodes.map((r) => r.lane));
    const laneNodes = AD_KNOWLEDGE_LANES
      .map((lane, index) => ({ lane, index }))
      .filter(({ lane }) => presentLanes.has(lane.id))
      .map(({ lane, index }) => ({
        id: `lane:${lane.id}`,
        type: 'lane',
        position: { x: index * AD_KNOWLEDGE_LAYOUT.columnWidth, y: LANE_HEADER_OFFSET },
        data: { label: lane.label, system: lane.system, process: lane.process, lane: lane.id, step: index + 1 },
        selectable: false,
        draggable: false,
        connectable: false
      }));

    const flowEdges = graph.edges.map((edge) => {
      const bright = inPath(edge.scenarioIds) && !dimmedIds.has(edge.source) && !dimmedIds.has(edge.target);
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: animatePath && bright,
        className: bright ? 'ad-kg-edge' : 'ad-kg-edge is-dimmed',
        markerEnd: { type: MarkerType.ArrowClosed }
      };
    });

    return { nodes: [...laneNodes, ...recordNodes], edges: flowEdges };
  }, [graph, highlightScenarioId, agent, selectedNodeId, animatePath]);

  return (
    <div className="ad-kg-canvas-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={AD_KNOWLEDGE_NODE_TYPES}
        onNodeClick={(_event, node) => node.type === 'record' && onSelectNode(node.id)}
        onPaneClick={() => onSelectNode(null)}
        fitView
        fitViewOptions={{ padding: 0.05, maxZoom: 1 }}
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        colorMode={theme === 'dark' ? 'dark' : 'light'}
      >
        <Background gap={18} size={1} color={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
        <Controls showInteractive={false} position="bottom-left" />
      </ReactFlow>
    </div>
  );
}
