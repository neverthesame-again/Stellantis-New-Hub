import React, { useState } from 'react';
import { ExternalLink, Loader2, Zap } from 'lucide-react';
import { useAmsStudio } from '../../state/useAmsStudio';
import { useRunPlayback } from '../../runs/useRunPlayback';
import { useAmsNavigation } from '../../navigation/useAmsNavigation';
import { AMS_SUBPAGE } from '../../navigation/amsRoutes';
import { DEFAULT_TASK_BY_AREA } from '../../model/harnessPipeline';
import { RUN_STATUS } from '../../model/runModel';
import RunStatusBadge from '../../components/RunStatusBadge';

/**
 * Live activity bar (F11): pick an agent, type a task and press Execute — the
 * harness run (F3) plays here without leaving Ops Studio.
 *
 * @param {Object} props
 * @param {Object[]} props.agents Harness-eligible agents in scope.
 * @param {(message: string) => void} props.showToast
 * @returns {JSX.Element}
 */
export default function ExecuteBar({ agents, showToast }) {
  const { state } = useAmsStudio();
  const { isBusy, startHarnessRun, getRevealedCount } = useRunPlayback();
  const { goToSubPage } = useAmsNavigation();
  const [agentId, setAgentId] = useState(agents[0]?.id ?? '');
  const [task, setTask] = useState(DEFAULT_TASK_BY_AREA[agents[0]?.area] ?? '');
  const [runId, setRunId] = useState(null);

  const selected = agents.find((agent) => agent.id === agentId) ?? agents[0];
  const run = runId ? state.runs.find((candidate) => candidate.id === runId) : null;
  const revealed = run ? getRevealedCount(run.id) : null;
  const currentStep = run && revealed !== null ? run.steps[Math.min(revealed, run.steps.length - 1)] : null;

  const changeAgent = (id) => {
    setAgentId(id);
    const agent = agents.find((candidate) => candidate.id === id);
    setTask(DEFAULT_TASK_BY_AREA[agent?.area] ?? '');
  };

  const execute = (event) => {
    event.preventDefault();
    const id = selected ? startHarnessRun(selected.id, task) : null;
    if (id) setRunId(id);
    else showToast(isBusy ? 'Another run is in progress.' : 'Pick an agent and a task first.');
  };

  if (agents.length === 0) {
    return <p className="ams-muted-note">No onboarded agents in this programme yet — register one to run it here.</p>;
  }

  return (
    <form className="st-card ams-card ams-execute-bar" onSubmit={execute} aria-label="Run an agent">
      <div className="ams-execute-row">
        <Zap size={16} aria-hidden="true" className="ams-text-accent" />
        <select className="ams-input" value={selected?.id ?? ''} onChange={(event) => changeAgent(event.target.value)} aria-label="Agent">
          {agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
        </select>
        <input className="ams-input ams-execute-task" value={task} onChange={(event) => setTask(event.target.value)} aria-label="Task" placeholder="Describe the task" />
        <button type="submit" className="st-btn st-btn-primary" disabled={isBusy || !task.trim()}>
          {isBusy ? <Loader2 size={14} className="ams-spin" /> : <Zap size={14} />} Execute
        </button>
      </div>
      {run && (
        <div className="ams-execute-status" role="status">
          <RunStatusBadge status={revealed !== null ? RUN_STATUS.RUNNING : run.status} />
          <span className="ams-muted-note">
            {run.id} · {revealed !== null
              ? `Step ${Math.min(revealed + 1, run.steps.length)} of ${run.steps.length}: ${currentStep?.label}`
              : run.status === RUN_STATUS.AWAITING_APPROVAL ? 'Paused for approval in the Workflow Inbox' : 'Finished'}
          </span>
          <button type="button" className="ams-link-button" onClick={() => goToSubPage(AMS_SUBPAGE.HARNESS, { runId: run.id })}>
            Open in Harness <ExternalLink size={12} />
          </button>
        </div>
      )}
    </form>
  );
}
