import React from 'react';
import { Cpu, CircleCheck, ExternalLink, Hourglass } from 'lucide-react';
import { formatDateTime } from '../../agentStudioData';
import { useAgentStudio } from '../../useAgentStudio';
import { relativeTime } from './governanceUtils';

/**
 * HarnessApprovals — AI Harness runs parked at the Human Approval step.
 */
export default function HarnessApprovals({ notify }) {
  const { harnessRuns, getAgent, approveHarnessRun, navigate, currentUser } = useAgentStudio();
  const waiting = harnessRuns.filter((r) => r.status === 'awaiting_approval');

  const approve = (run) => {
    approveHarnessRun(run.id);
    notify(`Run ${run.id} approved by ${currentUser} — execution released.`);
  };

  return (
    <section className="ad-studio-card ad-gov-harness">
      <div className="ad-studio-card-title">
        <h3><Cpu size={13} /> Harness runs awaiting approval</h3>
        <span className={`ad-studio-badge ${waiting.length ? 'is-warning' : 'is-success'}`}>{waiting.length ? `${waiting.length} waiting` : 'None waiting'}</span>
      </div>

      {waiting.length === 0 ? (
        <div className="ad-studio-empty">No AI Harness runs are waiting for a human approval.</div>
      ) : (
        <div className="ad-gov-harness-list">
          {waiting.map((run) => {
            const agent = getAgent(run.agentId);
            const humanStep = run.steps?.find((s) => s.key === 'human');
            return (
              <article key={run.id} className="ad-gov-harness-item">
                <div className="ad-gov-harness-main">
                  <div className="ad-gov-harness-top">
                    <span className="ad-studio-badge is-mono">{run.id}</span>
                    <strong>{agent?.name || run.agentId}</strong>
                    {agent && <span className={`ad-studio-badge ad-studio-asil asil-${agent.asil}`}>ASIL {agent.asil}</span>}
                  </div>
                  <div className="ad-gov-harness-task">{run.task}</div>
                  <div className="ad-gov-harness-meta">
                    <span><Hourglass size={11} /> Requested {relativeTime(run.startedAt)} · {formatDateTime(run.startedAt)}</span>
                    <span>Confidence {run.confidence}%</span>
                    <span>Coverage {run.coverage}%</span>
                    {humanStep?.detail && <span>{humanStep.detail}</span>}
                  </div>
                </div>
                <div className="ad-gov-harness-actions">
                  <button type="button" className="ad-studio-btn is-good is-sm" onClick={() => approve(run)}><CircleCheck size={13} /> Approve run</button>
                  <button type="button" className="ad-studio-btn is-ghost is-sm" onClick={() => navigate({ tab: 'harness', agentId: run.agentId })}>
                    Open in AI Harness <ExternalLink size={12} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
