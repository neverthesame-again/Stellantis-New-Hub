import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { useAgentStudio } from '../useAgentStudio';
import {
  AD_WORK_ITEMS,
  RUN_STATUS,
  buildWorkflowRun,
  createWorkflowNode,
  getStepStatus,
  serializeWorkflow,
  validateWorkflow
} from './adWorkflowModel';
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
const PLAYBACK_SPEED = 0.6;

let nodeSeq = 0;
let runSeq = 0;

const cleanNodes = (nodes) => nodes.map(({ id, type, position, data }) => ({
  id, type, position: { x: Math.round(position.x), y: Math.round(position.y) }, data
}));
const cleanEdges = (edges) => edges.map(({ id, source, target }) => ({ id, source, target }));
const snapshotOf = (meta, nodes, edges) => JSON.stringify({
  name: meta.name, description: meta.description, nodes: cleanNodes(nodes), edges: cleanEdges(edges)
});

function downloadJson(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function useDocumentTheme() {
  const read = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  const [theme, setTheme] = useState(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/** Reveals steps [from, to] one at a time; revealed is null when idle. */
function usePlayback() {
  const [playback, setPlayback] = useState(null);
  useEffect(() => {
    if (!playback) return undefined;
    const timer = setTimeout(() => {
      setPlayback((p) => (p && p.revealed + 1 <= p.to ? { ...p, revealed: p.revealed + 1 } : null));
    }, Math.max(250, playback.durations[playback.revealed] * PLAYBACK_SPEED));
    return () => clearTimeout(timer);
  }, [playback]);
  const start = (run, from, to) => setPlayback({ runId: run.id, revealed: from, to, durations: run.steps.map((s) => s.durationMs) });
  return { playback, start };
}

function PlaygroundCanvas({ workflow, onBack, onSaved, onOpenCopy, showToast }) {
  const { agents, audit, workflowRuns, saveWorkflow, recordWorkflowRun, decideWorkflowApproval } = useAgentStudio();
  const { screenToFlowPosition, fitView } = useReactFlow();
  const theme = useDocumentTheme();
  const canvasRef = useRef(null);
  const { playback, start } = usePlayback();

  const [meta, setMeta] = useState(() => ({
    id: workflow.id, name: workflow.name, description: workflow.description ?? '', source: workflow.source, createdAt: workflow.createdAt
  }));
  const [nodes, setNodes] = useState(workflow.nodes);
  const [edges, setEdges] = useState(workflow.edges);
  const [savedSnapshot, setSavedSnapshot] = useState(() => (workflow.id ? snapshotOf(workflow, workflow.nodes, workflow.edges) : null));
  const [showValidation, setShowValidation] = useState(false);
  const [confirmingLeave, setConfirmingLeave] = useState(false);

  const agentsById = useMemo(() => Object.fromEntries(agents.map((a) => [a.id, a])), [agents]);
  const definition = useMemo(() => ({ ...meta, nodes: cleanNodes(nodes), edges: cleanEdges(edges) }), [meta, nodes, edges]);
  const validation = useMemo(() => validateWorkflow(definition, agentsById), [definition, agentsById]);
  const dirty = savedSnapshot !== snapshotOf(meta, nodes, edges);
  const selectedNode = nodes.find((n) => n.selected) ?? null;

  const latestRun = meta.id ? workflowRuns.find((r) => r.workflowId === meta.id) ?? null : null;
  const revealedCount = latestRun && playback?.runId === latestRun.id ? playback.revealed : null;

  const contextValue = useMemo(() => ({
    agentsById,
    statusByNodeId: latestRun
      ? Object.fromEntries(latestRun.steps.map((step, i) => [step.nodeId, getStepStatus(latestRun, i, revealedCount)]))
      : {},
    issueNodeIds: showValidation ? new Set(validation.issues.flatMap((i) => i.nodeIds)) : EMPTY_SET
  }), [agentsById, latestRun, revealedCount, showValidation, validation]);

  const onNodesChange = useCallback((changes) => setNodes((cur) => applyNodeChanges(changes, cur)), []);
  const onEdgesChange = useCallback((changes) => setEdges((cur) => applyEdgeChanges(changes, cur)), []);
  const onConnect = useCallback((c) => setEdges((cur) => addEdge({ ...c, id: `${c.source}->${c.target}` }, cur)), []);
  const isValidConnection = useCallback((c) => c.source !== c.target, []);

  const addNode = useCallback((item, position) => {
    nodeSeq += 1;
    const node = { ...createWorkflowNode(item.type, position, `node-${Date.now().toString(36)}-${nodeSeq}`, item.data), selected: true };
    setNodes((cur) => [...cur.map((n) => ({ ...n, selected: false })), node]);
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

  const addAtCenter = (item) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const jitter = (nodes.length % 5) * 18;
    addNode(item, screenToFlowPosition({ x: rect.left + rect.width / 2 - 80 + jitter, y: rect.top + rect.height / 2 - 30 + jitter }));
  };

  const updateNodeData = (nodeId, patch) => {
    setNodes((cur) => cur.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n)));
  };

  const deleteNode = (nodeId) => {
    setNodes((cur) => cur.filter((n) => n.id !== nodeId));
    setEdges((cur) => cur.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  const focusNodes = (ids) => {
    setNodes((cur) => cur.map((n) => ({ ...n, selected: ids.includes(n.id) })));
    fitView({ nodes: ids.map((id) => ({ id })), padding: 0.6, duration: 300 });
  };

  const save = () => {
    const name = meta.name.trim();
    if (!name) {
      showToast('Give the workflow a name before saving.');
      return;
    }
    const id = saveWorkflow({ ...definition, name });
    setMeta((cur) => ({ ...cur, id, name }));
    setSavedSnapshot(snapshotOf({ ...meta, name }, nodes, edges));
    if (!meta.id) onSaved(id);
    showToast(validation.isValid ? `Saved "${name}".` : `Saved "${name}" — it still has validation errors.`);
  };

  const saveCopy = () => {
    const id = saveWorkflow({ ...definition, id: null, createdAt: undefined, source: 'Custom', name: `${meta.name.trim() || 'Workflow'} (copy)` });
    showToast('Copy saved.');
    onOpenCopy(id);
  };

  const exportJson = () => {
    const stem = (meta.name || 'workflow').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'workflow';
    downloadJson(`${stem}.json`, serializeWorkflow(definition));
    showToast('Workflow exported as JSON.');
  };

  const run = (itemId) => {
    if (!validation.isValid) {
      setShowValidation(true);
      return;
    }
    runSeq += 1;
    const item = AD_WORK_ITEMS.find((i) => i.id === itemId);
    const created = buildWorkflowRun({
      id: `WFR-${String(4100 + workflowRuns.length + runSeq)}`,
      workflow: definition,
      item,
      agentsById,
      seed: Date.now() % 100000,
      startedAt: new Date().toISOString(),
      audit
    });
    recordWorkflowRun(created);
    start(created, 0, created.stopIndex);
  };

  const decide = (approve) => {
    if (!latestRun) return;
    const next = decideWorkflowApproval(latestRun.id, approve);
    if (!next) return;
    if (approve) start(next, latestRun.pendingApprovalIndex + 1, next.stopIndex);
    showToast(approve ? 'Gate approved — workflow resumed.' : 'Gate rejected — workflow stopped.');
  };

  const runDisabledReason = !meta.id
    ? 'Save the workflow before running it.'
    : dirty
      ? 'Save your changes before running.'
      : !validation.isValid
        ? 'Fix the validation errors first (Validate shows them).'
        : latestRun?.status === RUN_STATUS.AWAITING_APPROVAL && revealedCount === null
          ? 'Decide the pending approval before starting a new run.'
          : null;

  const errorCount = validation.issues.filter((i) => i.severity === 'error').length;

  return (
    <PlaygroundContext.Provider value={contextValue}>
      <div className="ad-wf-playground">
        <div className="ad-wf-playground-toolbar">
          <button type="button" className="st-btn st-btn-outline" onClick={() => (dirty ? setConfirmingLeave(true) : onBack())}>
            <ArrowLeft size={14} /> All workflows
          </button>
          <input
            className="ad-wf-input ad-wf-playground-name"
            value={meta.name}
            onChange={(e) => setMeta((cur) => ({ ...cur, name: e.target.value }))}
            aria-label="Workflow name"
          />
          {dirty && <span className="st-badge badge-high">Unsaved changes</span>}
          <span className="ad-wf-grow" />
          <button type="button" className="st-btn st-btn-outline" onClick={() => setShowValidation(true)}>
            <ListChecks size={14} /> Validate
            <span className={`ad-wf-count ${errorCount ? 'is-error' : ''}`}>{errorCount}</span>
          </button>
          <button type="button" className="st-btn st-btn-primary" onClick={save}><Save size={14} /> Save</button>
          <button type="button" className="st-btn st-btn-outline" onClick={saveCopy}><Copy size={14} /> Save copy</button>
          <button type="button" className="st-btn st-btn-outline" onClick={exportJson}><Download size={14} /> Export JSON</button>
        </div>

        {showValidation && (
          <ValidationPanel issues={validation.issues} onFocusNodes={focusNodes} onClose={() => setShowValidation(false)} />
        )}

        <div className="ad-wf-playground-body">
          <NodePalette agents={agents} onAdd={addAtCenter} />
          <div ref={canvasRef} className="ad-wf-canvas" onDragOver={onDragOver} onDrop={onDrop}>
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
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={20} />
              <Controls />
              <MiniMap pannable zoomable nodeStrokeWidth={3} />
            </ReactFlow>
          </div>
          <NodeInspector
            node={selectedNode}
            agents={agents}
            onChangeData={updateNodeData}
            onDelete={deleteNode}
            description={meta.description}
            onDescriptionChange={(description) => setMeta((cur) => ({ ...cur, description }))}
            stats={{ nodes: nodes.length, edges: edges.length, agents: nodes.filter((n) => n.type === 'agent').length }}
          />
        </div>

        <WorkflowRunPanel
          run={latestRun}
          revealedCount={revealedCount}
          disabledReason={runDisabledReason}
          onRun={run}
          onDecide={decide}
        />
      </div>

      {confirmingLeave && (
        <div className="ad-wf-modal-backdrop" role="presentation" onClick={() => setConfirmingLeave(false)}>
          <div className="ad-wf-modal" role="dialog" aria-modal="true" aria-labelledby="ad-wf-leave-title" onClick={(e) => e.stopPropagation()}>
            <h3 id="ad-wf-leave-title" className="ad-wf-card-title">Leave without saving?</h3>
            <p className="ad-wf-text">Your changes to “{meta.name}” have not been saved.</p>
            <div className="ad-wf-modal-actions">
              <button type="button" className="st-btn st-btn-outline" onClick={() => setConfirmingLeave(false)}>Keep editing</button>
              <button type="button" className="st-btn st-btn-primary ad-wf-btn-danger-solid" onClick={onBack}>Discard changes</button>
            </div>
          </div>
        </div>
      )}
    </PlaygroundContext.Provider>
  );
}

export default function WorkflowPlayground(props) {
  return (
    <ReactFlowProvider>
      <PlaygroundCanvas {...props} />
    </ReactFlowProvider>
  );
}
