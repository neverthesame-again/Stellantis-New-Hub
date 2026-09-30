import React from 'react';
import { Trash2 } from 'lucide-react';
import { APPROVERS } from '../agentStudioData';
import { ON_FAILURE, WORKFLOW_NODE_DEFINITIONS, WORKFLOW_POLICIES, isAgentRunnable } from './adWorkflowModel';

export default function NodeInspector({ node, agents, onChangeData, onDelete, description, onDescriptionChange, stats }) {
  if (!node) {
    return (
      <aside className="ad-wf-side" aria-label="Workflow details">
        <p className="ad-wf-section-title">Workflow</p>
        <label className="ad-wf-field">
          <span className="ad-wf-field-label">Description</span>
          <textarea className="ad-wf-input" rows={3} value={description} onChange={(e) => onDescriptionChange(e.target.value)} />
        </label>
        <p className="ad-wf-muted">{stats.nodes} nodes · {stats.agents} agents · {stats.edges} connections</p>
        <ul className="ad-wf-help">
          <li>Drag agents and controls from the palette onto the canvas (or click them).</li>
          <li>Connect a node&apos;s right handle to the next node&apos;s left handle.</li>
          <li>Select a node or connection and press Backspace to delete it.</li>
          <li>ASIL C and D agents need a Human approval node on their path.</li>
        </ul>
      </aside>
    );
  }

  const definition = WORKFLOW_NODE_DEFINITIONS[node.type];
  const change = (patch) => onChangeData(node.id, patch);
  const agent = agents.find((a) => a.id === node.data.agentId);
  const policy = WORKFLOW_POLICIES.find((p) => p.id === node.data.policyId);

  return (
    <aside className="ad-wf-side" aria-label={`${definition.label} settings`}>
      <p className="ad-wf-section-title">{definition.label}</p>
      <p className="ad-wf-muted">{definition.description}</p>

      {node.type === 'agent' && (
        <>
          <label className="ad-wf-field">
            <span className="ad-wf-field-label">Agent</span>
            <select className="ad-wf-input" value={node.data.agentId ?? ''} onChange={(e) => change({ agentId: e.target.value || null })}>
              <option value="">Choose an agent…</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id} disabled={!isAgentRunnable(a)}>
                  {a.name}{isAgentRunnable(a) ? '' : ' (not runnable)'}
                </option>
              ))}
            </select>
          </label>
          {agent && (
            <p className="ad-wf-muted">
              {agent.subDomain} · ASIL {agent.asil} · stage {agent.stage}/9
              {agent.evaluation ? ` · evaluation ${agent.evaluation.score}` : ''}
            </p>
          )}
          <label className="ad-wf-field">
            <span className="ad-wf-field-label">If this step fails</span>
            <select className="ad-wf-input" value={node.data.onFailure ?? ON_FAILURE.STOP} onChange={(e) => change({ onFailure: e.target.value })}>
              <option value={ON_FAILURE.STOP}>Stop the workflow</option>
              <option value={ON_FAILURE.CONTINUE}>Continue with a warning</option>
            </select>
          </label>
        </>
      )}

      {node.type === 'approval' && (
        <label className="ad-wf-field">
          <span className="ad-wf-field-label">Approver</span>
          <select className="ad-wf-input" value={node.data.approver} onChange={(e) => change({ approver: e.target.value })}>
            {APPROVERS.map((a) => <option key={a.id} value={a.name}>{a.name} — {a.role}</option>)}
          </select>
        </label>
      )}

      {node.type === 'policy' && (
        <>
          <label className="ad-wf-field">
            <span className="ad-wf-field-label">Policy</span>
            <select className="ad-wf-input" value={node.data.policyId} onChange={(e) => change({ policyId: e.target.value })}>
              {WORKFLOW_POLICIES.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.standard}</option>)}
            </select>
          </label>
          <p className="ad-wf-muted">{policy?.description} Checked against every agent in the flow.</p>
        </>
      )}

      <button type="button" className="st-btn st-btn-outline ad-wf-btn-danger" onClick={() => onDelete(node.id)}>
        <Trash2 size={14} /> Delete node
      </button>
    </aside>
  );
}
