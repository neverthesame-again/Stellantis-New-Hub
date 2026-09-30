import React from 'react';
import { Trash2 } from 'lucide-react';
import { APPROVERS, getAreaLabel } from '../../../../model/agentOptions';
import { HARNESS_MIN_STAGE } from '../../../../model/agentLifecycle';
import { GOVERNANCE_POLICIES } from '../../../../model/governancePolicies';
import { ON_FAILURE, WORKFLOW_NODE_DEFINITIONS, WORKFLOW_NODE_TYPE } from '../../../../model/workflowModel';

/**
 * Right-hand inspector: settings of the selected node, or the workflow's
 * description and canvas help when nothing is selected.
 *
 * @param {Object} props
 * @param {Object | null} props.node              Selected node.
 * @param {Object[]} props.agents                 Studio agents.
 * @param {(nodeId: string, patch: Object) => void} props.onChangeData
 * @param {(nodeId: string) => void} props.onDelete
 * @param {string} props.description
 * @param {(description: string) => void} props.onDescriptionChange
 * @param {{ nodes: number, agents: number, edges: number }} props.stats
 * @returns {JSX.Element}
 */
export default function NodeInspector({ node, agents, onChangeData, onDelete, description, onDescriptionChange, stats }) {
  if (!node) {
    return (
      <aside className="ams-inspector" aria-label="Workflow details">
        <p className="ams-section-title">Workflow</p>
        <label className="ams-field">
          <span className="ams-field-label">Description</span>
          <textarea className="ams-input" rows={3} value={description} onChange={(event) => onDescriptionChange(event.target.value)} />
        </label>
        <p className="ams-muted-note">{stats.nodes} nodes · {stats.agents} agents · {stats.edges} connections</p>
        <ul className="ams-help-list">
          <li>Drag agents and controls from the palette onto the canvas (or click them).</li>
          <li>Connect a node's right handle to the next node's left handle.</li>
          <li>Select a node or connection and press Backspace to delete it.</li>
          <li>Tier 1 agents need a Human approval node on their path.</li>
        </ul>
      </aside>
    );
  }

  const definition = WORKFLOW_NODE_DEFINITIONS[node.type];
  const change = (patch) => onChangeData(node.id, patch);
  const agent = agents.find((candidate) => candidate.id === node.data.agentId);

  return (
    <aside className="ams-inspector" aria-label={`${definition.label} settings`}>
      <p className="ams-section-title">{definition.label}</p>
      <p className="ams-muted-note">{definition.description}</p>

      {node.type === WORKFLOW_NODE_TYPE.AGENT && (
        <>
          <label className="ams-field">
            <span className="ams-field-label">Agent</span>
            <select className="ams-input" value={node.data.agentId ?? ''} onChange={(event) => change({ agentId: event.target.value || null })}>
              <option value="">Choose an agent…</option>
              {agents.map((candidate) => (
                <option key={candidate.id} value={candidate.id} disabled={candidate.stage < HARNESS_MIN_STAGE}>
                  {candidate.name}{candidate.stage < HARNESS_MIN_STAGE ? ' (in registration)' : ''}
                </option>
              ))}
            </select>
          </label>
          {agent && (
            <p className="ams-muted-note">
              {getAreaLabel(agent.area)} · {agent.serviceTier || 'untiered'} · stage {agent.stage}
              {agent.evaluation ? ` · evaluation ${agent.evaluation.score}` : ''}
            </p>
          )}
          <label className="ams-field">
            <span className="ams-field-label">If this step fails</span>
            <select className="ams-input" value={node.data.onFailure ?? ON_FAILURE.STOP} onChange={(event) => change({ onFailure: event.target.value })}>
              <option value={ON_FAILURE.STOP}>Stop the workflow</option>
              <option value={ON_FAILURE.CONTINUE}>Continue with a warning</option>
            </select>
          </label>
        </>
      )}

      {node.type === WORKFLOW_NODE_TYPE.APPROVAL && (
        <label className="ams-field">
          <span className="ams-field-label">Approver</span>
          <select className="ams-input" value={node.data.approver} onChange={(event) => change({ approver: event.target.value })}>
            {APPROVERS.map((approver) => <option key={approver}>{approver}</option>)}
          </select>
        </label>
      )}

      {node.type === WORKFLOW_NODE_TYPE.POLICY && (
        <>
          <label className="ams-field">
            <span className="ams-field-label">Policy</span>
            <select className="ams-input" value={node.data.policyId} onChange={(event) => change({ policyId: event.target.value })}>
              {GOVERNANCE_POLICIES.map((policy) => <option key={policy.id} value={policy.id}>{policy.label}</option>)}
            </select>
          </label>
          <p className="ams-muted-note">
            {GOVERNANCE_POLICIES.find((policy) => policy.id === node.data.policyId)?.description}
            {' '}Checked against every agent in the flow.
          </p>
        </>
      )}

      <button type="button" className="st-btn st-btn-outline ams-btn-danger" onClick={() => onDelete(node.id)}>
        <Trash2 size={14} /> Delete node
      </button>
    </aside>
  );
}
