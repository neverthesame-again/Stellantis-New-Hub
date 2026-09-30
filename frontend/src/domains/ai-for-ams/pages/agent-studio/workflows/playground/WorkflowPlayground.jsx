/**
 * @file Workflow Playground (F9) — drag AMS agents onto a canvas, connect them
 * into an incident flow, validate, save, export/import and run it.
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Copy, Download, ListChecks, Save } from 'lucide-react';
import { useAmsStudio } from '../../../../state/useAmsStudio';
import { useRunPlayback } from '../../../../runs/useRunPlayback';
import { RUN_KIND, getStepStatus } from '../../../../model/runModel';
import {
  WORKFLOW_NODE_TYPE,
  createWorkflowNode,
  serializeWorkflow,
  validateWorkflow
} from '../../../../model/workflowModel';
import { downloadTextFile, toFileStem } from '../../../../utils/download';
import { createId } from '../../../../utils/ids';
import { useDocumentTheme } from '../../../../utils/useDocumentTheme';
import Modal from '../../../../components/Modal';
import NodeInspector from './NodeInspector';
import NodePalette from './NodePalette';
import ValidationPanel from './ValidationPanel';
import WorkflowRunPanel from './WorkflowRunPanel';
import { NODE_TYPES } from './nodeTypes';
import { PALETTE_DRAG_TYPE, PlaygroundContext } from './playgroundContext';

const DEFAULT_EDGE_OPTIONS = Object.freeze({ markerEnd: { type: MarkerType.ArrowClosed } });
const SNAP_GRID = [10, 10];
const DELETE_KEYS = ['Backspace', 'Delete'];
const EMPTY_SET = new Set();

/**
 * Strips React Flow runtime fields so only the workflow definition is saved.
 *
 * @param {Object[]} nodes
 * @returns {Object[]}
 */
const cleanNodes = (nodes) => nodes.map(({ id, type, position, data }) => ({
  id, type, position: { x: Math.round(position.x), y: Math.round(position.y) }, data
}));

/**
 * @param {Object[]} edges
 * @returns {Object[]}
 */
const cleanEdges = (edges) => edges.map(({ id, source, target }) => ({ id, source, target }));

/**
 * Comparable snapshot of the saved parts of a workflow, for dirty tracking.
 *
 * @param {{ name: string, description: string }} meta
 * @param {Object[]} nodes
 * @param {Object[]} edges
 * @returns {string}
 */
const snapshotOf = (meta, nodes, edges) => JSON.stringify({
  name: meta.name, description: meta.description, nodes: cleanNodes(nodes), edges: cleanEdges(edges)
});

/**
 * Playground body; must render inside a ReactFlowProvider.
 *
 * @param {Object} props
 * @param {Object} props.workflow                         Workflow to edit (id null when new).
 * @param {() => void} props.onBack                       Return to the list.
 * @param {(workflowId: string) => void} props.onSaved    A new workflow received its id.
 * @param {(workflowId: string) => void} props.onOpenCopy Open another workflow (after Save copy).
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
function PlaygroundCanvas({ workflow, onBack, onSaved, onOpenCopy, showToast }) {
  const { state, actions } = useAmsStudio();
  const { isBusy, startWorkflowRun, getRevealedCount } = useRunPlayback();
  const { screenToFlowPosition, fitView } = useReactFlow();
  const theme = useDocumentTheme();
  const canvasRef = useRef(null);

  const [meta, setMeta] = useState(() => ({
    id: workflow.id,
    name: workflow.name,
    description: workflow.description ?? '',
    source: workflow.source,
    createdAt: workflow.createdAt
  }));
  const [nodes, setNodes] = useState(workflow.nodes);
  const [edges, setEdges] = useState(workflow.edges);
  const [savedSnapshot, setSavedSnapshot] = useState(() => (workflow.id ? snapshotOf(workflow, workflow.nodes, workflow.edges) : null));
  const [showValidation, setShowValidation] = useState(false);
  const [confirmingLeave, setConfirmingLeave] = useState(false);

  const agentsById = useMemo(() => Object.fromEntries(state.studioAgents.map((agent) => [agent.id, agent])), [state.studioAgents]);
  const definition = useMemo(() => ({ ...meta, nodes: cleanNodes(nodes), edges: cleanEdges(edges) }), [meta, nodes, edges]);
  const validation = useMemo(() => validateWorkflow(definition, agentsById), [definition, agentsById]);
  const dirty = savedSnapshot !== snapshotOf(meta, nodes, edges);
  const selectedNode = nodes.find((node) => node.selected) ?? null;

  const latestRun = meta.id
    ? state.runs.find((run) => run.kind === RUN_KIND.WORKFLOW && run.workflowId === meta.id) ?? null
    : null;
  const revealedCount = latestRun ? getRevealedCount(latestRun.id) : null;

  const contextValue = useMemo(() => ({
    agentsById,
    statusByNodeId: latestRun
      ? Object.fromEntries(latestRun.steps.map((step, index) => [step.nodeId, getStepStatus(latestRun, index, revealedCount)]))
      : {},
    issueNodeIds: showValidation ? new Set(validation.issues.flatMap((issue) => issue.nodeIds)) : EMPTY_SET
  }), [agentsById, latestRun, revealedCount, showValidation, validation]);

  const onNodesChange = useCallback((changes) => setNodes((current) => applyNodeChanges(changes, current)), []);
  const onEdgesChange = useCallback((changes) => setEdges((current) => applyEdgeChanges(changes, current)), []);
  const onConnect = useCallback((connection) => {
    setEdges((current) => addEdge({ ...connection, id: `${connection.source}->${connection.target}` }, current));
  }, []);
  const isValidConnection = useCallback((connection) => connection.source !== connection.target, []);

  /**
   * Adds a palette item as a new, selected node.
   *
   * @param {{ type: string, data?: Object }} item
   * @param {{ x: number, y: number }} position Flow coordinates.
   */
  const addNode = useCallback((item, position) => {
    const node = { ...createWorkflowNode(item.type, position, createId('node'), item.data), selected: true };
    setNodes((current) => [...current.map((candidate) => ({ ...candidate, selected: false })), node]);
  }, []);

  const onDragOver = useCallback((event) => {
    if (!event.dataTransfer.types.includes(PALETTE_DRAG_TYPE)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    const payload = event.dataTransfer.getData(PALETTE_DRAG_TYPE);
    if (!payload) return;
    event.preventDefault();
    addNode(JSON.parse(payload), screenToFlowPosition({ x: event.clientX, y: event.clientY }));
  }, [addNode, screenToFlowPosition]);

  /** Click / keyboard fallback: add in the middle of the visible canvas. */
  const addAtCenter = (item) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const jitter = (nodes.length % 5) * 18;
    addNode(item, screenToFlowPosition({ x: rect.left + rect.width / 2 - 80 + jitter, y: rect.top + rect.height / 2 - 30 + jitter }));
  };

  const updateNodeData = (nodeId, patch) => {
    setNodes((current) => current.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...patch } } : node)));
  };

  const deleteNode = (nodeId) => {
    setNodes((current) => current.filter((node) => node.id !== nodeId));
    setEdges((current) => current.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const focusNodes = (nodeIds) => {
    setNodes((current) => current.map((node) => ({ ...node, selected: nodeIds.includes(node.id) })));
    fitView({ nodes: nodeIds.map((id) => ({ id })), padding: 0.6, duration: 300 });
  };

  const save = () => {
    const name = meta.name.trim();
    if (!name) {
      showToast('Give the workflow a name before saving.');
      return;
    }
    const id = actions.saveWorkflow({ ...definition, name });
    setMeta((current) => ({ ...current, id, name }));
    setSavedSnapshot(snapshotOf({ ...meta, name }, nodes, edges));
    if (!meta.id) onSaved(id);
    showToast(validation.isValid ? `Saved "${name}".` : `Saved "${name}" — it still has validation errors.`);
  };

  const saveCopy = () => {
    const id = actions.saveWorkflow({ ...definition, id: null, createdAt: undefined, source: 'Custom', name: `${meta.name.trim() || 'Workflow'} (copy)` });
    showToast('Copy saved.');
    onOpenCopy(id);
  };

  const exportJson = () => {
    downloadTextFile(`${toFileStem(meta.name)}.json`, serializeWorkflow(definition));
    showToast('Workflow exported as JSON.');
  };

  const run = (incidentId) => {
    if (!validation.isValid) {
      setShowValidation(true);
      return;
    }
    if (!startWorkflowRun(meta.id, incidentId)) showToast('The workflow could not start — another run may be in progress.');
  };

  const runDisabledReason = !meta.id
    ? 'Save the workflow before running it.'
    : dirty
      ? 'Save your changes before running.'
      : !validation.isValid
        ? 'Fix the validation errors first (Validate shows them).'
        : null;

  const errorCount = validation.issues.filter((issue) => issue.severity === 'error').length;

  return (
    <PlaygroundContext.Provider value={contextValue}>
      <div className="ams-playground">
        <div className="ams-playground-toolbar">
          <button type="button" className="st-btn st-btn-outline" onClick={() => (dirty ? setConfirmingLeave(true) : onBack())}>
            <ArrowLeft size={14} /> All workflows
          </button>
          <input
            className="ams-input ams-playground-name"
            value={meta.name}
            onChange={(event) => setMeta((current) => ({ ...current, name: event.target.value }))}
            aria-label="Workflow name"
          />
          {dirty && <span className="st-badge badge-high">Unsaved changes</span>}
          <span className="ams-toolbar-spacer" />
          <button type="button" className="st-btn st-btn-outline" onClick={() => setShowValidation(true)}>
            <ListChecks size={14} /> Validate
            <span className={`ams-count ${errorCount ? 'is-error' : ''}`}>{errorCount}</span>
          </button>
          <button type="button" className="st-btn st-btn-primary" onClick={save}><Save size={14} /> Save</button>
          <button type="button" className="st-btn st-btn-outline" onClick={saveCopy}><Copy size={14} /> Save copy</button>
          <button type="button" className="st-btn st-btn-outline" onClick={exportJson}><Download size={14} /> Export JSON</button>
        </div>

        {showValidation && (
          <ValidationPanel issues={validation.issues} onFocusNodes={focusNodes} onClose={() => setShowValidation(false)} />
        )}

        <div className="ams-playground-body">
          <NodePalette agents={state.studioAgents} onAdd={addAtCenter} />
          <div ref={canvasRef} className="ams-canvas" onDragOver={onDragOver} onDrop={onDrop}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={NODE_TYPES}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              isValidConnection={isValidConnection}
              defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
              deleteKeyCode={DELETE_KEYS}
              snapToGrid
              snapGrid={SNAP_GRID}
              colorMode={theme}
              fitView
              fitViewOptions={{ padding: 0.2 }}
            >
              <Background gap={20} />
              <Controls />
              <MiniMap pannable zoomable nodeStrokeWidth={3} />
            </ReactFlow>
          </div>
          <NodeInspector
            node={selectedNode}
            agents={state.studioAgents}
            onChangeData={updateNodeData}
            onDelete={deleteNode}
            description={meta.description}
            onDescriptionChange={(description) => setMeta((current) => ({ ...current, description }))}
            stats={{
              nodes: nodes.length,
              edges: edges.length,
              agents: nodes.filter((node) => node.type === WORKFLOW_NODE_TYPE.AGENT).length
            }}
          />
        </div>

        <WorkflowRunPanel
          run={latestRun}
          revealedCount={revealedCount}
          disabledReason={runDisabledReason}
          busy={isBusy}
          onRun={run}
        />
      </div>

      {confirmingLeave && (
        <Modal
          title="Leave without saving?"
          onClose={() => setConfirmingLeave(false)}
          maxWidth={440}
          footer={(
            <>
              <button type="button" className="st-btn st-btn-outline" onClick={() => setConfirmingLeave(false)}>Keep editing</button>
              <button type="button" className="st-btn st-btn-primary ams-btn-danger" onClick={onBack}>Discard changes</button>
            </>
          )}
        >
          <p className="ams-card-text">Your changes to “{meta.name}” have not been saved.</p>
        </Modal>
      )}
    </PlaygroundContext.Provider>
  );
}

/**
 * Workflow Playground with its React Flow provider.
 *
 * @param {Object} props See {@link PlaygroundCanvas}.
 * @returns {JSX.Element}
 */
export default function WorkflowPlayground(props) {
  return (
    <ReactFlowProvider>
      <PlaygroundCanvas {...props} />
    </ReactFlowProvider>
  );
}
