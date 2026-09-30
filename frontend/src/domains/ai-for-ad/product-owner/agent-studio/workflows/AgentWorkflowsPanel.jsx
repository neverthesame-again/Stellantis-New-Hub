import React from 'react';
import { Plus, Workflow, ArrowRight } from 'lucide-react';
import { useAgentStudio } from '../useAgentStudio';
import { agentBlockedReason, isAgentRunnable, needsApproval } from './adWorkflowModel';
import { RunStatusBadge } from './WorkflowRunPanel';
import './adWorkflows.css';

/** Agent Studio: the playground workflows this agent runs in, plus a shortcut to build one. */
export default function AgentWorkflowsPanel({ agent }) {
  const { workflows, workflowRuns, openWorkflow } = useAgentStudio();
  const using = workflows.filter((wf) => wf.nodes.some((n) => n.type === 'agent' && n.data.agentId === agent.id));
  const runnable = isAgentRunnable(agent);

  return (
    <section className="ad-wf-card ad-wf-agent-panel" aria-labelledby="ad-wf-agent-panel-title">
      <div className="ad-wf-toolbar">
        <div>
          <h3 id="ad-wf-agent-panel-title" className="ad-wf-card-title"><Workflow size={16} /> Workflows in AI Studio</h3>
          <p className="ad-wf-subtitle">
            Multi-agent flows in the playground that run {agent.name}.
            {needsApproval(agent) && ` ASIL ${agent.asil}: every path through it needs a human approval gate.`}
          </p>
        </div>
        <button
          type="button"
          className="st-btn st-btn-primary"
          onClick={() => openWorkflow({ withAgentId: agent.id })}
          disabled={!runnable}
          title={runnable ? 'Open a new workflow in the playground with this agent' : agentBlockedReason(agent)}
        >
          <Plus size={14} /> Build workflow with this agent
        </button>
      </div>
      {!runnable && <p className="ad-wf-muted">Not runnable in a workflow yet — {agentBlockedReason(agent)}.</p>}

      {using.length ? (
        <ul className="ad-wf-agent-list">
          {using.map((wf) => {
            const lastRun = workflowRuns.find((r) => r.workflowId === wf.id);
            const agentsInFlow = wf.nodes.filter((n) => n.type === 'agent').length;
            return (
              <li key={wf.id}>
                <button type="button" className="ad-wf-agent-row" onClick={() => openWorkflow({ workflowId: wf.id })}>
                  <span className="ad-wf-card-id">{wf.id}</span>
                  <span className="ad-wf-agent-row-name">{wf.name}</span>
                  <span className="ad-wf-muted">{agentsInFlow} agents · {wf.source}</span>
                  {lastRun ? <RunStatusBadge status={lastRun.status} /> : <span className="ad-wf-muted">never run</span>}
                  <ArrowRight size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="ad-wf-muted">This agent is not used in any workflow yet.</p>
      )}
    </section>
  );
}
