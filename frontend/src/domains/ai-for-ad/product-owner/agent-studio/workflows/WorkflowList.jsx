import React, { useRef } from 'react';
import { FileUp, Plus, Workflow } from 'lucide-react';
import { useAgentStudio } from '../useAgentStudio';
import { parseWorkflowJson } from './adWorkflowModel';
import { RunStatusBadge } from './WorkflowRunPanel';

const fmtDate = (iso) => new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const SOURCE_BADGE = { 'Ready-made': 'badge-purple', Imported: 'badge-high', Custom: 'badge-info' };

export default function WorkflowList({ onOpen, onCreate, showToast }) {
  const { workflows, workflowRuns, saveWorkflow } = useAgentStudio();
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
    const id = saveWorkflow(workflow);
    showToast(`Imported "${workflow.name}".`);
    onOpen(id);
  };

  return (
    <div className="ad-wf-page">
      <div className="ad-wf-toolbar">
        <p className="ad-wf-subtitle">Chain AD agents into one flow so a requirement, defect or release check is handled the same way every time.</p>
        <div className="ad-wf-inline">
          <input ref={fileInputRef} type="file" accept=".json,application/json" className="ad-wf-hidden" onChange={importFile} aria-label="Import workflow JSON" />
          <button type="button" className="st-btn st-btn-outline" onClick={() => fileInputRef.current?.click()}>
            <FileUp size={14} /> Import JSON
          </button>
          <button type="button" className="st-btn st-btn-primary" onClick={onCreate}>
            <Plus size={14} /> Create workflow
          </button>
        </div>
      </div>

      <div className="ad-wf-grid">
        {workflows.map((wf) => {
          const agentCount = (wf.nodes || []).filter((n) => n.type === 'agent').length;
          const lastRun = workflowRuns.find((r) => r.workflowId === wf.id);
          return (
            <article key={wf.id} className="ad-wf-card">
              <div className="ad-wf-card-head">
                <span className="ad-wf-card-id">{wf.id}</span>
                <span className={`st-badge ${SOURCE_BADGE[wf.source] || 'badge-info'}`}>{wf.source}</span>
              </div>
              <div>
                <h3 className="ad-wf-card-title">{wf.name}</h3>
                <p className="ad-wf-subtitle">{agentCount} agents · {(wf.nodes || []).length} nodes · updated {fmtDate(wf.updatedAt)}</p>
              </div>
              <p className="ad-wf-text">{wf.description || 'No description.'}</p>
              <div className="ad-wf-badge-row">
                <span className="ad-wf-muted">Last run:</span>
                {lastRun ? <RunStatusBadge status={lastRun.status} /> : <span className="ad-wf-muted">never</span>}
              </div>
              <div className="ad-wf-card-actions">
                <button type="button" className="st-btn st-btn-primary ad-wf-grow" onClick={() => onOpen(wf.id)}>
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
