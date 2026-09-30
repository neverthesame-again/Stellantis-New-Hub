import React, { useRef } from 'react';
import { FileUp, Plus, Workflow } from 'lucide-react';
import { useAmsStudio } from '../../../state/useAmsStudio';
import { RUN_KIND } from '../../../model/runModel';
import { WORKFLOW_NODE_TYPE, parseWorkflowJson } from '../../../model/workflowModel';
import { formatDateTime } from '../../../utils/formatters';
import RunStatusBadge from '../../../components/RunStatusBadge';

/**
 * Workflow catalogue: ready-made AMS flows and saved custom flows, with
 * "Create workflow" and "Import JSON" (F9).
 *
 * @param {Object} props
 * @param {(workflowId: string) => void} props.onOpen
 * @param {() => void} props.onCreate
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function WorkflowList({ onOpen, onCreate, showToast }) {
  const { state, actions } = useAmsStudio();
  const fileInputRef = useRef(null);

  const importFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const { workflow, error } = parseWorkflowJson(await file.text());
    if (error) {
      showToast(`Import failed: ${error}`);
      return;
    }
    const id = actions.saveWorkflow(workflow);
    showToast(`Imported "${workflow.name}".`);
    onOpen(id);
  };

  return (
    <div className="ams-page">
      <div className="ams-toolbar">
        <p className="ams-card-subtitle">
          Chain agents into one flow so a repeat incident is handled the same way every time.
        </p>
        <div className="ams-page-actions">
          <input ref={fileInputRef} type="file" accept=".json,application/json" className="ams-visually-hidden" onChange={importFile} aria-label="Import workflow JSON" />
          <button type="button" className="st-btn st-btn-outline" onClick={() => fileInputRef.current?.click()}>
            <FileUp size={14} /> Import JSON
          </button>
          <button type="button" className="st-btn st-btn-primary" onClick={onCreate}>
            <Plus size={14} /> Create workflow
          </button>
        </div>
      </div>

      <div className="ams-grid">
        {state.workflows.map((workflow) => {
          const agentCount = (workflow.nodes || []).filter((node) => node.type === WORKFLOW_NODE_TYPE.AGENT).length;
          const lastRun = state.runs.find((run) => run.kind === RUN_KIND.WORKFLOW && run.workflowId === workflow.id);
          return (
            <article key={workflow.id} className="st-card ams-card">
              <div className="ams-card-head">
                <span className="ams-card-id">{workflow.id}</span>
                <span className={`st-badge ${workflow.source === 'Ready-made' ? 'badge-purple' : 'badge-info'}`}>{workflow.source}</span>
              </div>
              <div>
                <h3 className="ams-card-title">{workflow.name}</h3>
                <p className="ams-card-subtitle">{agentCount} agents · {(workflow.nodes || []).length} nodes · updated {formatDateTime(workflow.updatedAt)}</p>
              </div>
              <p className="ams-card-text">{workflow.description || 'No description.'}</p>
              <div className="ams-badge-row">
                <span className="ams-muted-note">Last run:</span>
                {lastRun ? <RunStatusBadge status={lastRun.status} /> : <span className="ams-muted-note">never</span>}
              </div>
              <div className="ams-card-actions">
                <button type="button" className="st-btn st-btn-primary is-grow" onClick={() => onOpen(workflow.id)}>
                  <Workflow size={14} /> Open in playground
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
