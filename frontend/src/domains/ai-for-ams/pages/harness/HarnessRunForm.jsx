import React, { forwardRef } from 'react';
import { Loader2, Play } from 'lucide-react';
import { HARNESS_MIN_STAGE, getCurrentStage } from '../../model/agentLifecycle';
import { requiresHumanApproval } from '../../model/harnessPipeline';

/**
 * Single-agent harness form: pick an onboarded agent (stage 2 or later), enter
 * a task and run the pipeline (F3).
 *
 * @param {Object} props
 * @param {Object[]} props.agents              All studio agents.
 * @param {string} props.agentId
 * @param {(agentId: string) => void} props.onAgentChange
 * @param {string} props.task
 * @param {(task: string) => void} props.onTaskChange
 * @param {() => void} props.onRun
 * @param {boolean} props.busy                 A run is already playing.
 * @param {import('react').Ref<HTMLFormElement>} ref Lets Quick Start focus the form.
 * @returns {JSX.Element}
 */
const HarnessRunForm = forwardRef(function HarnessRunForm(
  { agents, agentId, onAgentChange, task, onTaskChange, onRun, busy },
  ref
) {
  const eligible = agents.filter((agent) => agent.stage >= HARNESS_MIN_STAGE);
  const waiting = agents.length - eligible.length;
  const selected = eligible.find((agent) => agent.id === agentId);

  const submit = (event) => {
    event.preventDefault();
    if (!busy && selected && task.trim()) onRun();
  };

  return (
    <form ref={ref} className="st-card ams-card" onSubmit={submit} aria-labelledby="ams-harness-form-title" tabIndex={-1}>
      <div>
        <h3 id="ams-harness-form-title" className="ams-card-title">Run a single agent</h3>
        <p className="ams-card-subtitle">
          Agents from stage {HARNESS_MIN_STAGE} (Runtime) onwards can be run.
          {waiting > 0 && ` ${waiting} agent(s) still in registration are not listed.`}
        </p>
      </div>
      <div className="ams-form-grid">
        <label className="ams-field">
          <span className="ams-field-label">Agent</span>
          <select className="ams-input" value={agentId} onChange={(event) => onAgentChange(event.target.value)}>
            {eligible.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} — stage {agent.stage} · {getCurrentStage(agent).label}
              </option>
            ))}
          </select>
        </label>
        <label className="ams-field">
          <span className="ams-field-label">Task</span>
          <input
            className="ams-input"
            value={task}
            onChange={(event) => onTaskChange(event.target.value)}
            placeholder="e.g. Analyse INC-4471 Kafka consumer lag"
          />
        </label>
      </div>
      <div className="ams-toolbar">
        <p className="ams-muted-note">
          {selected && requiresHumanApproval(selected)
            ? `${selected.name} needs human approval before acting — the run pauses in the Workflow Inbox.`
            : 'No human approval needed for this agent.'}
        </p>
        <button type="submit" className="st-btn st-btn-primary" disabled={busy || !selected || !task.trim()}>
          {busy ? <Loader2 size={14} className="ams-spin" /> : <Play size={14} />}
          {busy ? 'A run is in progress…' : 'Run Harness Pipeline'}
        </button>
      </div>
    </form>
  );
});

export default HarnessRunForm;
