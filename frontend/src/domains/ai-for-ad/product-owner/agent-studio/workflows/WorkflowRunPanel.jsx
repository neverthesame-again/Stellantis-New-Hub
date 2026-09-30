import React, { useState } from 'react';
import { CheckCircle2, Circle, CircleX, Hourglass, Loader2, MinusCircle, Play, TriangleAlert, XCircle } from 'lucide-react';
import { AD_WORK_ITEMS, RUN_STATUS, STEP_STATUS, getStepStatus, getVisibleLogs } from './adWorkflowModel';

const STEP_ICON = {
  [STEP_STATUS.PENDING]: Circle,
  [STEP_STATUS.RUNNING]: Loader2,
  [STEP_STATUS.PASSED]: CheckCircle2,
  [STEP_STATUS.WARNING]: TriangleAlert,
  [STEP_STATUS.FAILED]: CircleX,
  [STEP_STATUS.WAITING]: Hourglass,
  [STEP_STATUS.REJECTED]: XCircle,
  [STEP_STATUS.SKIPPED]: MinusCircle
};

const RUN_BADGE = {
  running: { cls: 'badge-info', label: 'Running' },
  [RUN_STATUS.PASSED]: { cls: 'badge-success', label: 'Passed' },
  [RUN_STATUS.FAILED]: { cls: 'badge-critical', label: 'Failed' },
  [RUN_STATUS.AWAITING_APPROVAL]: { cls: 'badge-high', label: 'Awaiting approval' },
  [RUN_STATUS.REJECTED]: { cls: 'badge-critical', label: 'Rejected' }
};

export function RunStatusBadge({ status }) {
  const badge = RUN_BADGE[status] ?? RUN_BADGE.running;
  return <span className={`st-badge ${badge.cls}`}>{badge.label}</span>;
}

const fmtOffset = (ms) => `+${(ms / 1000).toFixed(1)}s`;

export default function WorkflowRunPanel({ run, revealedCount, disabledReason, onRun, onDecide }) {
  const [itemId, setItemId] = useState(AD_WORK_ITEMS[0].id);
  const animating = revealedCount !== null;
  const status = animating ? 'running' : run?.status;
  const pendingStep = run && run.pendingApprovalIndex !== null ? run.steps[run.pendingApprovalIndex] : null;

  return (
    <section className="ad-wf-card" aria-labelledby="ad-wf-run-title">
      <div className="ad-wf-toolbar">
        <h3 id="ad-wf-run-title" className="ad-wf-card-title">Run on a work item</h3>
        <div className="ad-wf-inline">
          <select className="ad-wf-input" value={itemId} onChange={(e) => setItemId(e.target.value)} aria-label="Work item">
            {AD_WORK_ITEMS.map((item) => (
              <option key={item.id} value={item.id}>{item.id} · {item.asil} · {item.title}</option>
            ))}
          </select>
          <button
            type="button"
            className="st-btn st-btn-primary"
            onClick={() => onRun(itemId)}
            disabled={Boolean(disabledReason) || animating}
            title={disabledReason ?? undefined}
          >
            {animating ? <Loader2 size={14} className="ad-wf-spin" /> : <Play size={14} />} Run
          </button>
        </div>
      </div>
      {disabledReason && <p className="ad-wf-muted">{disabledReason}</p>}

      {run ? (
        <>
          <div className="ad-wf-badge-row">
            <RunStatusBadge status={status} />
            <span className="st-badge badge-info">{run.id}</span>
            <span className="ad-wf-muted">{run.title}</span>
          </div>

          {!animating && run.status === RUN_STATUS.AWAITING_APPROVAL && pendingStep && (
            <div className="ad-wf-callout is-warning" role="status">
              <Hourglass size={16} aria-hidden="true" />
              <span className="ad-wf-grow">{pendingStep.detail}. Record the decision to continue.</span>
              <button type="button" className="st-btn st-btn-outline ad-wf-btn-danger" onClick={() => onDecide(false)}>Reject</button>
              <button type="button" className="st-btn st-btn-primary" onClick={() => onDecide(true)}>Approve</button>
            </div>
          )}
          {!animating && run.status === RUN_STATUS.REJECTED && (
            <div className="ad-wf-callout is-danger" role="status">
              <XCircle size={16} aria-hidden="true" />
              <span>Rejected by {run.decidedBy}. The remaining steps were skipped.</span>
            </div>
          )}

          <div className="ad-wf-run-layout">
            <ol className="ad-wf-steps">
              {run.steps.map((step, index) => {
                const s = getStepStatus(run, index, revealedCount);
                const Icon = STEP_ICON[s];
                return (
                  <li key={step.id} className={`ad-wf-step st-${s}`}>
                    <Icon size={15} className={s === STEP_STATUS.RUNNING ? 'ad-wf-spin' : ''} aria-label={s} />
                    <div>
                      <div className="ad-wf-step-label">{step.label}{step.simulated && <span className="ad-wf-sim">simulated</span>}</div>
                      {s !== STEP_STATUS.PENDING && s !== STEP_STATUS.RUNNING && <div className="ad-wf-muted">{step.detail}</div>}
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="ad-wf-log" aria-label="Run log">
              {getVisibleLogs(run, revealedCount).map((line) => (
                <div key={line.id} className={`ad-wf-log-line lvl-${line.level}`}>
                  <span className="ad-wf-log-t">{fmtOffset(line.offsetMs)}</span>
                  <span className="ad-wf-log-lvl">{line.level}</span>
                  <span>{line.message}</span>
                </div>
              ))}
              {animating && <div className="ad-wf-log-line is-cursor">▍</div>}
            </div>
          </div>
        </>
      ) : (
        <p className="ad-wf-muted">This workflow has not been run yet.</p>
      )}
    </section>
  );
}
