import React, { useEffect } from 'react';
import { X, ThumbsUp, ThumbsDown, RotateCcw, Hand, TriangleAlert, FlaskConical } from 'lucide-react';
import { formatDateTime } from '../../agentStudioData';
import PipelineTimeline from './PipelineTimeline';
import RunConsole from './RunConsole';
import RunArtefacts from './RunArtefacts';
import RingGauge from './RingGauge';
import { RUN_STATUS_META, formatDuration, runtimeLabel } from './harnessUtils';

/** Side drawer with the step timeline, gauges, artefacts and full log of one run. */
export default function RunDetailDrawer({ run, agent, onClose, onApprove, onReject, onRerun }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!run) return null;
  const meta = RUN_STATUS_META[run.status] || { label: run.status, cls: '' };
  const failedStep = run.steps.find((s) => s.status === 'failed');

  return (
    <div className="ad-hrn-drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="ad-hrn-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Harness run ${run.id}`}
      >
        <header className="ad-hrn-drawer-head">
          <div>
            <span className="ad-studio-eyebrow">Harness run</span>
            <h3>
              <span className="ad-hrn-mono">{run.id}</span>
              <span className={`ad-studio-badge ${meta.cls}`}>{meta.label}</span>
              {run.dryRun && <span className="ad-studio-badge is-info"><FlaskConical size={10} /> Dry run</span>}
            </h3>
            <p>{agent ? agent.name : run.agentId}{agent ? ` · ${runtimeLabel(agent.runtime.type)} · ASIL ${agent.asil}` : ''}</p>
          </div>
          <button type="button" className="ad-studio-btn is-ghost is-sm" onClick={onClose} aria-label="Close run detail">
            <X size={16} />
          </button>
        </header>

        <div className="ad-hrn-drawer-body">
          <div className="ad-hrn-drawer-task">“{run.task}”</div>
          <dl className="ad-hrn-drawer-facts">
            <div><dt>Started</dt><dd>{formatDateTime(run.startedAt)}</dd></div>
            <div><dt>Duration</dt><dd>{formatDuration(run.durationMs)}</dd></div>
            <div><dt>Approver</dt><dd>{run.approver || '—'}</dd></div>
            <div><dt>Log lines</dt><dd>{run.log.length}</dd></div>
          </dl>

          {run.status === 'awaiting_approval' && (
            <div className="ad-hrn-approval">
              <div className="ad-hrn-approval-text">
                <Hand size={16} />
                <div>
                  <strong>Pending human approval</strong>
                  <span>Paused at step 10 for {run.approver || 'the approver'}.</span>
                </div>
              </div>
              <div className="ad-hrn-approval-actions">
                <button type="button" className="ad-studio-btn is-good" onClick={() => onApprove(run.id)}><ThumbsUp size={13} /> Approve run</button>
                <button type="button" className="ad-studio-btn is-danger" onClick={() => onReject(run.id)}><ThumbsDown size={13} /> Reject</button>
              </div>
            </div>
          )}
          {failedStep && (
            <div className="ad-hrn-fail"><TriangleAlert size={15} /> <span>Stopped: {failedStep.detail}</span></div>
          )}

          <div className="ad-hrn-gauges is-small">
            <RingGauge value={run.confidence || 0} label="Context confidence" size={76} stroke={7} />
            <RingGauge value={run.reuse || 0} label="Reuse readiness" size={76} stroke={7} />
            <RingGauge value={run.coverage || 0} label="Knowledge coverage" size={76} stroke={7} />
          </div>

          <section>
            <span className="ad-studio-label">Step timeline</span>
            <PipelineTimeline steps={run.steps} compact />
          </section>

          {agent && (
            <section>
              <span className="ad-studio-label">Output artefacts</span>
              <RunArtefacts run={run} agent={agent} bare />
              {!['completed', 'awaiting_approval'].includes(run.status) && <div className="ad-studio-muted">No artefacts — the run did not complete.</div>}
            </section>
          )}

          <section>
            <span className="ad-studio-label">Full log</span>
            <RunConsole log={run.log} runId={run.id} running={run.status === 'running'} maxHeight={300} />
          </section>
        </div>

        <footer className="ad-hrn-drawer-foot">
          <button type="button" className="ad-studio-btn" onClick={onClose}>Close</button>
          {agent && (
            <button type="button" className="ad-studio-btn is-primary" onClick={() => onRerun(run)} disabled={run.status === 'running'}>
              <RotateCcw size={13} /> Re-run in harness
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}
