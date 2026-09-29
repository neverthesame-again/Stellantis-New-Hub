import React, { useMemo, useState } from 'react';
import {
  Play, Lock, Info, Server, Brain, Database, Wrench, TriangleAlert, ShieldCheck, Hand, ThumbsUp, ThumbsDown,
  FlaskConical, ArrowRight, ListChecks, History, Gauge, RotateCcw
} from 'lucide-react';
import { HARNESS_STEPS, HARNESS_TASK_SUGGESTIONS, formatDateTime } from '../../agentStudioData';

const EST_SECONDS = ((HARNESS_STEPS.reduce((s, x) => s + x.baseMs, 0) * 1.6) / 1000).toFixed(1);
import LifecycleStepper from '../LifecycleStepper';
import RingGauge from './RingGauge';
import PipelineTimeline from './PipelineTimeline';
import RunConsole from './RunConsole';
import RunArtefacts from './RunArtefacts';
import {
  RUN_STATUS_META, approvalForced, computeGauges, executionPlaneNote, formatDuration, harnessReadiness, runtimeLabel
} from './harnessUtils';

/**
 * Right column of the Single Agent Harness. Remounted (keyed) per agent/preset
 * so task text and toggles reset; the runner lives in the page.
 */
export default function HarnessExecutePanel({
  agent, initialTask, run, lastRun, runner, onNavigate, onOpenRun, onToast
}) {
  const forced = approvalForced(agent);
  const [task, setTask] = useState(initialTask || '');
  const [requireApproval, setRequireApproval] = useState(forced);
  const [dryRun, setDryRun] = useState(false);
  const [touched, setTouched] = useState(false);

  const readiness = harnessReadiness(agent);
  const gauges = useMemo(() => computeGauges(agent), [agent]);
  const approvalOn = forced || requireApproval;
  const busy = runner.running;
  const isThisRunning = busy && run?.status === 'running';
  const taskError = touched && task.trim().length < 8;

  const launch = () => {
    setTouched(true);
    if (task.trim().length < 8) return;
    const id = runner.start({ agent, task, requireApproval: approvalOn, dryRun });
    if (id) onToast(`Harness run ${id} started for ${agent.name}`);
  };

  const status = run ? RUN_STATUS_META[run.status] : null;

  return (
    <div className="ad-hrn-exec">
      {/* Agent summary */}
      <div className="ad-studio-card ad-hrn-summary">
        <div className="ad-hrn-summary-head">
          <div className="ad-hrn-summary-name">
            <span className="ad-studio-eyebrow">{agent.family} · {agent.program}</span>
            <h3>{agent.name} <span className="ad-studio-badge is-mono">v{agent.version}</span></h3>
          </div>
          <div className="ad-studio-agent-item-tags">
            <span className="ad-studio-badge is-mono is-info"><Server size={10} /> {runtimeLabel(agent.runtime.type)}</span>
            <span className={`ad-studio-badge ad-studio-asil asil-${agent.asil}`}>ASIL {agent.asil}</span>
            <span className="ad-studio-badge">{agent.subDomain}</span>
            <span className={`ad-studio-badge ${agent.operationalState === 'Suspended' ? 'is-critical' : agent.operationalState === 'Active' ? 'is-success' : ''}`}>
              {agent.operationalState}
            </span>
          </div>
        </div>
        <p className="ad-hrn-purpose">{agent.purpose}</p>
        <div className="ad-hrn-summary-grid">
          <div className="ad-hrn-summary-stage">
            <span className="ad-studio-label">Lifecycle · stage {agent.stage}/9</span>
            <LifecycleStepper stage={agent.stage} compact />
          </div>
          <div className="ad-hrn-counts">
            <span><Brain size={13} /> <strong>{agent.skills.length}</strong> skills</span>
            <span><Database size={13} /> <strong>{agent.knowledge.length}</strong> knowledge</span>
            <span><Wrench size={13} /> <strong>{agent.tools.length}</strong> tools</span>
            <span><Gauge size={13} /> <strong>{agent.evaluation ? agent.evaluation.score : '—'}</strong> eval</span>
          </div>
        </div>
        <div className="ad-hrn-plane"><Info size={13} /> {executionPlaneNote(agent)}{agent.runtime.latencyMs ? ` · ${agent.runtime.latencyMs} ms health latency` : ''}</div>
        {!readiness.ready && (
          <div className="ad-hrn-warn-banner">
            <TriangleAlert size={14} />
            <div>
              <strong>Not harness-ready — {readiness.reason}.</strong> You can still run a diagnostic; Policy Enforcement will block execution.
              <button type="button" className="ad-studio-btn is-ghost is-sm" onClick={() => onNavigate({ tab: 'agents', view: 'onboarding', agentId: agent.id })}>
                Fix in Onboarding Studio <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}
        {lastRun && lastRun.id !== run?.id && (
          <div className="ad-hrn-lastrun">
            <History size={12} /> Last run <span className="ad-hrn-mono">{lastRun.id}</span> ·
            <span className={`ad-studio-badge ${RUN_STATUS_META[lastRun.status]?.cls || ''}`}>{RUN_STATUS_META[lastRun.status]?.label || lastRun.status}</span>
            · {formatDateTime(lastRun.startedAt)}
            <button type="button" className="ad-studio-btn is-ghost is-sm" onClick={() => onOpenRun(lastRun.id)}>View</button>
          </div>
        )}
      </div>

      {/* Task + gauges */}
      <div className="ad-hrn-exec-grid">
        <div className="ad-studio-card">
          <div className="ad-studio-card-title">
            <h3><ListChecks size={14} /> Task</h3>
            <span className="ad-studio-muted">{task.trim().length} chars</span>
          </div>
          <textarea
            className={`ad-studio-textarea ${taskError ? 'is-invalid' : ''}`}
            rows={3}
            value={task}
            placeholder="Describe the engineering task, e.g. Generate edge-case scenarios for AD-108…"
            onChange={(e) => setTask(e.target.value)}
            disabled={busy}
          />
          {taskError && <div className="ad-hrn-field-error">Enter a task of at least 8 characters.</div>}
          <div className="ad-hrn-suggestions">
            <span className="ad-studio-label">Suggestions</span>
            <div className="ad-hrn-chip-row">
              {HARNESS_TASK_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`ad-studio-chip ${task === s ? 'is-selected' : ''}`}
                  onClick={() => setTask(s)}
                  disabled={busy}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="ad-hrn-toggles">
            <label className={`ad-hrn-toggle ${forced ? 'is-locked' : ''}`}>
              <input
                type="checkbox"
                checked={approvalOn}
                disabled={forced || busy}
                onChange={(e) => setRequireApproval(e.target.checked)}
              />
              <span className="ad-hrn-switch" aria-hidden="true" />
              <span className="ad-hrn-toggle-text">
                <strong>{forced && <Lock size={11} />} Require human approval</strong>
                <small>
                  {forced
                    ? `Forced for ASIL ${agent.asil}: ISO 26262 AI Safety Board policy requires a named approver (${agent.approver || 'unassigned'}) before outputs are released.`
                    : `Pause at step 10 for ${agent.approver || 'the Product Owner'} before outputs are released.`}
                </small>
              </span>
            </label>
            <label className="ad-hrn-toggle">
              <input type="checkbox" checked={dryRun} disabled={busy} onChange={(e) => setDryRun(e.target.checked)} />
              <span className="ad-hrn-switch" aria-hidden="true" />
              <span className="ad-hrn-toggle-text">
                <strong><FlaskConical size={11} /> Dry run — no tool writes</strong>
                <small>Tool calls are simulated; no Jira tickets, Polarion links or commits are created.</small>
              </span>
            </label>
          </div>
          <div className="ad-hrn-run-row">
            <button type="button" className={`ad-studio-btn ${readiness.ready ? 'is-primary' : 'is-danger'}`} onClick={launch} disabled={busy}>
              {run && !busy ? <RotateCcw size={14} /> : <Play size={14} />}
              {busy ? 'Pipeline running…' : readiness.ready ? (run ? 'Run again' : 'Run Harness Pipeline') : 'Run diagnostic pipeline'}
            </button>
            <span className="ad-studio-muted">10 steps · ≈ {EST_SECONDS} s · {approvalOn ? 'pauses for approval' : 'auto-release'}</span>
          </div>
        </div>

        <div className="ad-studio-card">
          <div className="ad-studio-card-title">
            <h3><Gauge size={14} /> Pre-flight readiness</h3>
          </div>
          <div className="ad-hrn-gauges">
            <RingGauge value={gauges.confidence} label="Context confidence" hint={gauges.hints.confidence} />
            <RingGauge value={gauges.reuse} label="Reuse readiness" hint={gauges.hints.reuse} />
            <RingGauge value={gauges.coverage} label="Knowledge coverage" hint={gauges.hints.coverage} />
          </div>
          {gauges.missingCategories.length > 0 && (
            <div className="ad-hrn-gauge-note">
              <Info size={12} /> Missing knowledge categories: {gauges.missingCategories.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Pipeline + console */}
      <div className="ad-hrn-exec-grid">
        <div className="ad-studio-card">
          <div className="ad-studio-card-title">
            <h3><ShieldCheck size={14} /> Harness pipeline</h3>
            {status ? (
              <span className={`ad-studio-badge ${status.cls}`}>{status.label}{run.durationMs ? ` · ${formatDuration(run.durationMs)}` : ''}</span>
            ) : (
              <span className="ad-studio-badge">Preview</span>
            )}
          </div>
          <PipelineTimeline steps={run?.steps} />
        </div>
        <div className="ad-hrn-console-col">
          <RunConsole log={run?.log || []} runId={run?.id} running={isThisRunning} maxHeight={430} />
          {run?.status === 'awaiting_approval' && (
            <div className="ad-hrn-approval">
              <div className="ad-hrn-approval-text">
                <Hand size={16} />
                <div>
                  <strong>Human approval required</strong>
                  <span>Run {run.id} is paused at step 10 for {run.approver || 'the approver'}. Review the log and artefacts before release.</span>
                </div>
              </div>
              <div className="ad-hrn-approval-actions">
                <button type="button" className="ad-studio-btn is-good" onClick={() => { runner.approve(run.id); onToast(`Run ${run.id} approved and released`); }}>
                  <ThumbsUp size={13} /> Approve run
                </button>
                <button type="button" className="ad-studio-btn is-danger" onClick={() => { runner.reject(run.id); onToast(`Run ${run.id} rejected`, 'error'); }}>
                  <ThumbsDown size={13} /> Reject
                </button>
              </div>
            </div>
          )}
          {run?.status === 'failed' && (
            <div className="ad-hrn-fail">
              <TriangleAlert size={15} />
              <span>
                Run stopped: {run.steps.find((s) => s.status === 'failed')?.detail || 'failed'}.
              </span>
            </div>
          )}
        </div>
      </div>

      <RunArtefacts run={run} agent={agent} />

      {run && run.status !== 'running' && (
        <div className="ad-hrn-next">
          <span className="ad-studio-label">Next steps</span>
          <div className="ad-hrn-next-grid">
            <button type="button" className="ad-hrn-next-card" onClick={() => onNavigate({ tab: 'evaluation', agentId: agent.id })}>
              <Gauge size={18} />
              <span>
                <strong>Evaluation Center</strong>
                <small>{agent.evaluation ? `Re-score ${agent.name} (last ${agent.evaluation.score}/100)` : 'Certify this agent — the gate used a provisional score'}</small>
              </span>
              <ArrowRight size={14} />
            </button>
            <button type="button" className="ad-hrn-next-card" onClick={() => onNavigate({ tab: 'governance', agentId: agent.id })}>
              <ShieldCheck size={18} />
              <span>
                <strong>Governance Center</strong>
                <small>Attach run {run.id} as evidence for ISO 26262 / R155 approval</small>
              </span>
              <ArrowRight size={14} />
            </button>
            <button type="button" className="ad-hrn-next-card" onClick={() => onOpenRun(run.id)}>
              <History size={18} />
              <span>
                <strong>Run History</strong>
                <small>Open the full step timeline and log for {run.id}</small>
              </span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
